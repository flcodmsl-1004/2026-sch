// 판매현황 대시보드 집계 API
// 구글시트의 원본을 읽어 "집계 숫자만" 대시보드로 보냅니다. 학교별 행은 응답에 포함되지 않습니다.

// ▼ 여기만 직접 바꾸세요. 비밀번호를 정해 따옴표 안에 입력합니다.
const PASSWORD = '여기에-비밀번호-입력';

const REPORT_YEAR = 2026;      // 이 연도의 결제 건만 집계합니다
const NEW_TAB = '시트1';        // 앞으로 구매 건을 입력하는 탭
const BASE_TAB = '기존데이터';   // 11/2까지의 구매 건
const LEAD_TAB = '선도학교';     // 2026 선도·AI중점 명단
const INSIGHT_TAB = '인사이트';  // 대시보드 하단 인사이트 문구
const NOTE_TAB = '만료관리';     // 후속 상태·메모 (연락처 칸은 대시보드로 보내지 않습니다)
const CACHE_SECONDS = 60;
const MAX_FAILS = 10;          // 비밀번호를 5분 안에 이만큼 틀리면 5분간 차단

const REGIONS = ['전북', '경기', '세종', '울산', '제주', '경북', '부산', '전남', '충남', '충북', '서울', '강원', '광주', '대전', '인천', '경남', '대구'];
const LEAD_REGIONS = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const CHANNELS = ['테크빌', '학교장터', '본사계좌'];
const LEVELS = ['초등', '중등', '고등', '기타'];
const SOL_KEYS = { '매쓰홀릭스쿨': 'M', '글잼스쿨': 'G' };

function doGet() {
  return json_({ status: 'ok', message: '판매현황 집계 API가 동작 중입니다.' });
}

function doPost(e) {
  try {
    const cache = CacheService.getScriptCache();
    const fails = Number(cache.get('fails') || 0);
    if (fails >= MAX_FAILS) return json_({ status: 'locked' });
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (PASSWORD === '여기에-비밀번호-입력') return json_({ status: 'setup' });
    if (body.password !== PASSWORD) {
      cache.put('fails', String(fails + 1), 300);
      return json_({ status: 'denied' });
    }
    const cached = cache.get('result');
    if (cached) return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);
    const text = JSON.stringify(Object.assign({ status: 'ok' }, buildResult_()));
    try { cache.put('result', text, CACHE_SECONDS); } catch (tooLarge) {} // 100KB를 넘으면 캐시 없이 응답
    return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return json_({ status: 'error', message: String(err.message || err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function buildResult_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tz = ss.getSpreadsheetTimeZone();
  const read = (name, required) => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) {
      if (required) throw new Error('"' + name + '" 탭을 찾을 수 없습니다.');
      return [];
    }
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return [];
    const head = values[0].map(h => String(h).trim());
    return values.slice(1).map((row, i) => {
      const o = { __row: i + 2, __tab: name };
      head.forEach((h, j) => {
        const v = row[j];
        o[h] = v instanceof Date ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : v;
      });
      return o;
    });
  };
  const rows = read(BASE_TAB, true).concat(read(NEW_TAB, true));
  const result = aggregate(rows, read(LEAD_TAB, true), read(NOTE_TAB, false));
  result.insights = read(INSIGHT_TAB, false).filter(r => r['제목']).map(r => [r['우선순위'], r['구분'], r['제목'], r['근거'], r['제안']]);
  result.updatedAt = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm');
  return result;
}

// ---- 이하 순수 계산 함수 (시트 기능을 쓰지 않음) ----

function parseNum_(v) {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v === null || v === undefined ? '' : v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? null : n;
}

function parseDate_(v) {
  const m = String(v === null || v === undefined ? '' : v).trim().match(/^(\d{4})[-.\/]\s*(\d{1,2})[-.\/]\s*(\d{1,2})\.?$/);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCMonth() !== +m[2] - 1) return null;
  return { y: +m[1], m: +m[2], d: +m[3], dow: d.getUTCDay() };
}

function str_(v) {
  return String(v === null || v === undefined ? '' : v).trim();
}

// 띄어쓰기가 달라도 같은 학교로 셉니다
function schoolName_(v) {
  return str_(v).replace(/\s+/g, '');
}

// 명단 대조용 키: 학교명 앞의 지역명이 있어도 없어도 같은 학교로 봅니다
function leadKey_(school, region) {
  const name = schoolName_(school);
  return (name.indexOf(region) === 0 ? name.slice(region.length) : name) + '|' + region;
}

function emptyAgg_() {
  const obj = {
    tot: { n: 0, p: 0, amt: 0, st: 0, tv: 0, sch: 0 },
    months: [],
    regionMap: {},
    channelMap: {},
    levelMap: {},
    startMap: {},
    days: new Array(31).fill(0),
    dows: new Array(7).fill(0),
    periods: [[0, 0], [0, 0], [0, 0], [0, 0]],
    sizes: [[0, 0], [0, 0], [0, 0], [0, 0]],
    nostart: 0,
    schools: {},
  };
  for (let m = 1; m <= 12; m++) obj.months.push([m, 0, 0, 0, 0, 0]);
  REGIONS.forEach(k => { obj.regionMap[k] = { v: [k, 0, 0, 0, 0, 0, 0], sch: {} }; });
  CHANNELS.forEach(k => { obj.channelMap[k] = [k, 0, 0, 0, 0]; });
  LEVELS.forEach(k => { obj.levelMap[k] = [k, 0, 0]; });
  return obj;
}

function startKey_(s) {
  return s.y === REPORT_YEAR ? s.m + '월' : String(s.y).slice(2) + '.' + s.m;
}

function addRow_(A, r) {
  const key = r.school + '|' + r.region;
  A.tot.n++; A.tot.p += r.people; A.tot.amt += r.amt; A.tot.st += r.st; A.tot.tv += r.tv;
  A.schools[key] = true;
  const mon = A.months[r.month - 1];
  mon[1]++; mon[2] += r.people; mon[3] += r.amt; mon[4] += r.st; mon[5] += r.tv;
  if (!A.regionMap[r.region]) A.regionMap[r.region] = { v: [r.region, 0, 0, 0, 0, 0, 0], sch: {} };
  const reg = A.regionMap[r.region];
  reg.v[1]++; reg.v[2] += r.people; reg.v[3] += r.amt; reg.v[4] += r.st; reg.v[5] += r.tv; reg.sch[key] = true;
  if (!A.channelMap[r.channel]) A.channelMap[r.channel] = [r.channel, 0, 0, 0, 0];
  const ch = A.channelMap[r.channel];
  ch[1]++; ch[2] += r.amt; ch[3] += r.st; ch[4] += r.tv;
  const lv = A.levelMap[r.level] || A.levelMap['기타'];
  lv[1]++; lv[2] += r.amt;
  if (r.start) {
    const sk = startKey_(r.start);
    A.startMap[sk] = (A.startMap[sk] || 0) + 1;
    A.days[r.start.d - 1]++;
    A.dows[r.start.dow]++;
  } else {
    A.nostart++;
  }
  if (r.period > 0) { // 기간 미기재 건은 기간 분포에서 제외
    const months = Math.round(r.period);
    const pi = months <= 3 ? 0 : months <= 7 ? 1 : months <= 10 ? 2 : 3;
    A.periods[pi][0]++; A.periods[pi][1] += r.amt;
  }
  const si = r.people < 30 ? 0 : r.people < 100 ? 1 : r.people < 200 ? 2 : 3;
  A.sizes[si][0]++; A.sizes[si][1] += r.amt;
}

function normalizeRow_(raw) {
  const problems = [];
  const status = str_(raw['상태']);
  if (!str_(raw['학교명']) && !status && !str_(raw['판매금액'])) return { skip: true };
  if (status !== '구매완료') return status ? { skip: true } : { problem: '상태 없음' };
  const date = parseDate_(raw['날짜']);
  if (!date) problems.push('날짜 형식');
  else if (date.y !== REPORT_YEAR) problems.push(REPORT_YEAR + '년 외 날짜');
  const sol = SOL_KEYS[str_(raw['솔루션'])];
  if (!sol) problems.push('솔루션 이름');
  const school = schoolName_(raw['학교명']);
  if (!school) problems.push('학교명 없음');
  const region = str_(raw['지역']);
  if (!region) problems.push('지역 없음');
  const amt = parseNum_(raw['판매금액']);
  if (amt === null) problems.push('판매금액');
  const channel = str_(raw['구매처']) === '매홀(계좌)' ? '본사계좌' : str_(raw['구매처']);
  if (!channel) problems.push('구매처 없음');
  let st = parseNum_(raw['정산금액']);
  if (st === null) {
    if (channel !== '테크빌' && amt !== null) st = amt; // 직접 채널은 전액 정산
    else problems.push('정산금액 없음');
  }
  if (problems.length) return { problem: problems.join(', ') };
  const tv = parseNum_(raw['테크빌배분']);
  return {
    row: {
      sol, school, region, channel, amt, st,
      tv: tv === null ? amt - st : tv,
      month: date.m,
      people: parseNum_(raw['인원']) || 0,
      period: parseNum_(raw['기간']) || 0,
      start: parseDate_(raw['시작일']),
      level: str_(raw['학교급']),
      end: parseDate_(raw['만료일']),
      endRaw: str_(raw['만료일']),
      recv: parseDate_(raw['접수일']) || date, // 접수일이 없으면 날짜로 주차를 계산
    },
  };
}

function ymd_(y, m, d) {
  return y + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
}

// 그 주의 월요일 (주차는 월요일~일요일)
function mondayOf_(d) {
  const dt = new Date(Date.UTC(d.y, d.m - 1, d.d));
  dt.setUTCDate(dt.getUTCDate() - (dt.getUTCDay() + 6) % 7);
  return ymd_(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

// 접수일 기준 주차별·시도별 합계. 학교별 행은 포함하지 않습니다.
function weeklyData_(rows) {
  const out = { year: REPORT_YEAR, weekly: {}, monthSchools: {}, regions: {} };
  const round = v => Math.round(v);
  ['all', 'M', 'G'].forEach(key => {
    const picked = key === 'all' ? rows : rows.filter(r => r.sol === key);
    const weeks = {}, monthSch = {}, regions = {};
    REGIONS.forEach(k => { regions[k] = { m: Array.from({ length: 12 }, () => [0, 0]), w: {}, first: '' }; });
    picked.forEach(r => {
      const monday = mondayOf_(r.recv);
      const school = r.school + '|' + r.region;
      if (!weeks[monday]) weeks[monday] = { n: 0, sch: {}, amt: 0, st: 0 };
      const w = weeks[monday];
      w.n++; w.sch[school] = true; w.amt += r.amt; w.st += r.st;
      const ym = monday.slice(0, 7);
      if (!monthSch[ym]) monthSch[ym] = {};
      monthSch[ym][school] = true;
      if (!regions[r.region]) regions[r.region] = { m: Array.from({ length: 12 }, () => [0, 0]), w: {}, first: '' };
      const reg = regions[r.region];
      if (r.recv.y === REPORT_YEAR) { reg.m[r.recv.m - 1][0]++; reg.m[r.recv.m - 1][1] += r.amt; }
      if (!reg.w[monday]) reg.w[monday] = [0, 0];
      reg.w[monday][0]++; reg.w[monday][1] += r.amt;
      const day = ymd_(r.recv.y, r.recv.m, r.recv.d);
      if (!reg.first || day < reg.first) reg.first = day;
    });
    out.weekly[key] = Object.keys(weeks).sort().map(k => [k, weeks[k].n, Object.keys(weeks[k].sch).length, round(weeks[k].amt), round(weeks[k].st)]);
    out.monthSchools[key] = {};
    Object.keys(monthSch).forEach(k => { out.monthSchools[key][k] = Object.keys(monthSch[k]).length; });
    Object.keys(regions).forEach(k => {
      regions[k].m.forEach(x => { x[1] = round(x[1]); });
      Object.keys(regions[k].w).forEach(w => { regions[k].w[w][1] = round(regions[k].w[w][1]); });
    });
    out.regions[key] = regions;
  });
  return out;
}

// 시작일 + 기간(개월) - 1일로 만료일을 추정합니다
function estimateEnd_(r) {
  if (!r.start || !(r.period > 0)) return '';
  const d = new Date(Date.UTC(r.start.y, r.start.m - 1 + Math.round(r.period), r.start.d - 1));
  return ymd_(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

// 학교·솔루션별 1줄: [학교, 지역, 솔루션, 만료일, 구분('', 'est', 'check'), 인원, 판매금액, 구매처, 후속 상태, 메모, 구매 건수]
function expiryList_(rows, noteRows) {
  const notes = {};
  (noteRows || []).forEach(n => {
    const key = schoolName_(n['학교명']) + '|' + str_(n['지역']) + '|' + (SOL_KEYS[str_(n['솔루션'])] || '');
    notes[key] = { status: str_(n['후속상태']), memo: str_(n['메모']) };
  });
  const groups = {};
  rows.forEach(r => {
    const key = r.school + '|' + r.region + '|' + r.sol;
    if (!groups[key]) groups[key] = [];
    let date = '', flag = 'check';
    if (r.end) { date = ymd_(r.end.y, r.end.m, r.end.d); flag = ''; }
    else if (!r.endRaw && estimateEnd_(r)) { date = estimateEnd_(r); flag = 'est'; }
    groups[key].push({ r, date, flag });
  });
  return Object.keys(groups).map(key => {
    const list = groups[key];
    const dated = list.filter(x => x.date);
    const latest = dated.length ? dated.map(x => x.date).sort().pop() : '';
    const picked = latest ? dated.filter(x => x.date === latest) : list;
    const first = picked[0];
    const shown = latest || first.r.endRaw.replace('확인필요', '').trim();
    const note = notes[key] || notes[first.r.school + '|' + first.r.region + '|'] || { status: '', memo: '' };
    return [
      first.r.school, first.r.region, first.r.sol, shown, latest ? first.flag : 'check',
      picked.reduce((s, x) => s + x.r.people, 0), Math.round(picked.reduce((s, x) => s + x.r.amt, 0)),
      first.r.channel, note.status, note.memo, list.length,
    ];
  });
}

function finishAgg_(A, startKeys) {
  const round = v => Math.round(v);
  const roundRow = (x, from) => x.map((v, i) => i >= from ? round(v) : v);
  A.tot.sch = Object.keys(A.schools).length;
  ['p', 'amt', 'st', 'tv'].forEach(k => { A.tot[k] = round(A.tot[k]); });
  return {
    tot: A.tot,
    months: A.months.map(x => roundRow(x, 1)),
    regions: Object.keys(A.regionMap).map(k => {
      const reg = A.regionMap[k];
      const v = roundRow(reg.v, 1);
      v[6] = Object.keys(reg.sch).length;
      return v;
    }),
    channels: Object.keys(A.channelMap).map(k => roundRow(A.channelMap[k], 1)),
    levels: LEVELS.map(k => roundRow(A.levelMap[k], 1)),
    starts: startKeys.map(k => [k, A.startMap[k] || 0]),
    days: A.days,
    dows: A.dows,
    periods: A.periods.map(x => roundRow(x, 0)),
    sizes: A.sizes.map(x => roundRow(x, 0)),
    nostart: A.nostart,
  };
}

function aggregate(rawRows, leadRows, noteRows) {
  const groups = { all: emptyAgg_(), M: emptyAgg_(), G: emptyAgg_() };
  const warnings = [];
  const accepted = [];
  rawRows.forEach(raw => {
    const res = normalizeRow_(raw);
    if (res.skip) return;
    if (res.problem) {
      warnings.push({ tab: raw.__tab, row: raw.__row, problem: res.problem });
      return;
    }
    accepted.push(res.row);
    addRow_(groups.all, res.row);
    addRow_(groups[res.row.sol], res.row);
  });

  // 월 라벨 앞에 과거 연도, 뒤에 이후 연도가 오도록 정렬
  const seen = {};
  accepted.forEach(r => { if (r.start) seen[r.start.y * 100 + r.start.m] = startKey_(r.start); });
  for (let m = 1; m <= 12; m++) seen[REPORT_YEAR * 100 + m] = m + '월';
  const startKeys = Object.keys(seen).map(Number).sort((a, b) => a - b).map(k => seen[k]);

  const both = Object.keys(groups.M.schools).filter(k => groups.G.schools[k]).length;

  // 선도·AI중점 침투율
  const lead = {};
  (leadRows || []).forEach(r => {
    const region = str_(r['지역']);
    const school = schoolName_(r['학교명']);
    if (!region || !school) return;
    const type = str_(r['구분']);
    const key = leadKey_(school, region);
    if (!lead[key]) lead[key] = { region, lead: false, ai: false };
    if (type === '선도' || type === '양쪽') lead[key].lead = true;
    if (type === '중점' || type === '양쪽') lead[key].ai = true;
  });
  const schoolAmt = {};
  accepted.forEach(r => {
    const key = leadKey_(r.school, r.region);
    schoolAmt[key] = (schoolAmt[key] || 0) + r.amt;
  });
  const leadMap = {};
  LEAD_REGIONS.forEach(k => { leadMap[k] = [k, 0, 0, 0, 0, 0, 0]; });
  let hitAmt = 0, hitAll = 0, hitLead = 0, hitAi = 0, cntLead = 0, cntAi = 0, cntBoth = 0;
  Object.keys(lead).forEach(key => {
    const s = lead[key];
    if (!leadMap[s.region]) leadMap[s.region] = [s.region, 0, 0, 0, 0, 0, 0];
    const x = leadMap[s.region];
    x[1]++;
    if (s.lead) { x[2]++; cntLead++; }
    if (s.ai) { x[3]++; cntAi++; }
    if (s.lead && s.ai) cntBoth++;
    if (schoolAmt[key] !== undefined) {
      x[4]++; hitAll++; hitAmt += schoolAmt[key];
      if (s.lead) { x[5]++; hitLead++; }
      if (s.ai) { x[6]++; hitAi++; }
    }
  });

  const all = finishAgg_(groups.all, startKeys);
  return {
    ...weeklyData_(accepted),
    agg: { all, M: finishAgg_(groups.M, startKeys), G: finishAgg_(groups.G, startKeys) },
    lead: LEAD_REGIONS.map(k => leadMap[k]),
    leadSummary: {
      total: Object.keys(lead).length, cntLead, cntAi, cntBoth,
      hitAll, hitLead, hitAi, hitAmt: Math.round(hitAmt),
    },
    both,
    expiry: expiryList_(accepted, noteRows),
    counts: { M: groups.M.tot.n, G: groups.G.tot.n },
    warnings: warnings.slice(0, 20),
    warningCount: warnings.length,
  };
}
