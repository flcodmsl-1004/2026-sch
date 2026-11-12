// 판매현황 대시보드 집계 API + 구매현황RAW 자동 칸 계산
// 구글시트의 원본을 읽어 집계 숫자를 대시보드로 보냅니다. 연락처·메모·특이사항은 응답에 포함되지 않습니다.
// 비밀번호 없이 공개됩니다. 대시보드 주소를 아는 사람은 누구나 응답을 볼 수 있습니다.

const REPORT_YEAR = 2026;        // 이 연도의 정산월(없으면 주문월) 건만 집계합니다
const RAW_TAB = '구매현황RAW';    // 모든 구매 건. 회색 머리글 칸은 자동으로 채워집니다
const RATE_TAB = '배분비율';      // 리셀업체별 배분비율과 적용 시작 정산월
const REPORT_TAB = '주차보고';    // 분기별 주차 표 (새로고침 때마다 다시 씀)
const LEAD_TAB = '선도학교';      // 2026 선도·AI중점 명단
const INSIGHT_TAB = '인사이트';   // 대시보드 인사이트 문구
const NOTE_TAB = '만료관리';      // 후속 상태·메모 (연락처 칸은 대시보드로 보내지 않습니다)
const OLD_TABS = ['시트1', '기존데이터']; // 구매현황RAW로 옮긴 예전 탭 (설치 때 숨김)
const CACHE_SECONDS = 60;

const REGIONS = ['전북', '경기', '세종', '울산', '제주', '경북', '부산', '전남', '충남', '충북', '서울', '강원', '광주', '대전', '인천', '경남', '대구'];
const LEAD_REGIONS = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const BASE_CHANNELS = ['테크빌', '학교장터', '본사계좌'];
const LEVELS = ['초등', '중등', '고등', '기타'];
const SOL_KEYS = { '매쓰홀릭스쿨': 'M', '글잼스쿨': 'G' };
const STATUSES = ['문의', '견적서발송', '결제대기', '구매완료', '취소'];
const PLAN_STATUSES = ['견적', '견적서발송', '결제대기']; // 주차보고의 '예정'으로 셉니다
// 담당자 연락처: 구매현황RAW 학교명 바로 오른쪽 칸. 스크립트가 읽을 때 이 칸들은 건너뛰므로 대시보드로 나가지 않습니다
const CONTACT_HEAD = ['담당자', '직위', '전화', '이메일'];
const OLD_CONTACT_TAB = '연락처'; // 예전에 만든 별도 탭 (비어 있을 때만 설치 때 지움)
// 구매 전 소통 기록. 선생님 연락처가 있으므로 스크립트는 이 탭을 읽지 않습니다 (대시보드로 나가지 않음)
const INQUIRY_TAB = '문의사항';
const INQUIRY_HEAD = ['문의일', '담당자', '학교명', '선생님명', '연락처', '이메일', '유입경로', '솔루션명', '구분', '소통내용', '완료', '구매여부'];
const INQUIRY_LISTS = {
  '담당자': ['이성혜', '서형동', '이채은', '기타'],
  '유입경로': ['법인폰', '홈페이지', '만족팀', '기타'],
  '솔루션명': ['매쓰홀릭스쿨', '글잼스쿨', '기타'],
  '구분': ['가격문의', '견적서', '구매이후', '문의', '연수문의'],
};
const CHANNEL1 = ['본사계좌', '학교장터', '리셀업체'];
const STEPS = ['계정등록메일', '사이트개설', '계정등록', '문자안내'];
const TEACHERMALL = '티처몰출고';  // 테크빌 건만 해당
const TEACHERMALL_VENDOR = '테크빌';

// 구매현황RAW 열 순서 (왼쪽부터). 입력 칸(파랑) 다음에 자동 칸(회색)이 옵니다
const INPUT_HEAD = ['주문일', '정산월', '상태', '솔루션', '지역', '학교명'].concat(CONTACT_HEAD, ['구매처1', '구매처2', '인원', '기간', '단가', '판매금액', '입금확인', '특이사항',
  '시작일', '만료일', '개설소통일', '계정등록메일', '사이트개설', '계정등록', '문자안내', '티처몰출고', '비고',
  '정산주차', '실제정산일', '예외 리셀비율', '가격구분', '예상구매일']);
// 학교급은 학교명에서, 주문월·주문주차는 주문일에서 자동 (주문일이 없는 예전 건은 주문월·주차 값을 그대로 둠)
const ORDER_AUTO = ['학교급', '주문월', '주문주차'];
const AUTO_HEAD = ['정산지연', '적용 리셀비율', '리셀배분액', '정산금액', '선도구분', '신규/재구매', '진행률'];
// 선도구분(자동)은 선도학교인지 바로 보이도록 지역 앞에 둡니다
const FRONT_AUTO = { '선도구분': '지역' };
const RAW_LAYOUT = (() => {
  const l = INPUT_HEAD.concat(ORDER_AUTO, AUTO_HEAD.filter(h => !FRONT_AUTO[h]));
  Object.keys(FRONT_AUTO).forEach(h => l.splice(l.indexOf(FRONT_AUTO[h]), 0, h));
  return l;
})();
// 단가 = 판매금액 ÷ 인원 ÷ 기간 (행마다 수식. 직접 적은 다른 값은 그 행만 그대로 둠)
const PRICE_FORMULA_KEY = 'PRICE_FORMULA';
const DROPPED_HEAD = ['시트기재일']; // 열 정리 때 지우는 칸
const MERGED_HEAD = { '소통일': '개설소통일' }; // 예전 이름 칸 → 새 이름 칸 (새 칸이 비어 있을 때만 값을 옮기고 예전 칸은 지움)
// 달력에서 고르는 날짜 칸 (날짜가 아닌 글자는 입력되지 않음)
const DATE_HEAD = ['주문일', '시작일', '만료일', '개설소통일', '실제정산일', '예상구매일'];
// [+]/[−]로 접는 묶음. collapsed = 설치 직후 접힌 상태
const FOLD_GROUPS = [
  { from: '개설소통일', to: '티처몰출고', collapsed: false },
  { from: '정산주차', to: '예상구매일', collapsed: true },
];
// 칸 값별 배경색 (구분용)
const TINTS = {
  '구매처1': { '본사계좌': '#DDEFFF', '학교장터': '#E2F5DD' },
  '구매처2': { '테크빌': '#EDEDED' },
  '솔루션': { '매쓰홀릭스쿨': '#FFE9D6', '글잼스쿨': '#EEE4FF' },
};
const RENAMED ={ '디스픽토': '디스픽트' }; // 잘못 적힌 구매처2 이름 고치기
const RATE_HEAD = ['구매처2', '적용 시작 정산월', '리셀업체 비율', '매쓰홀릭 비율', '메모'];

// ---- 웹앱 ----

function doGet() {
  return json_({ status: 'ok', message: '판매현황 집계 API가 동작 중입니다.' });
}

function doPost(e) {
  try {
    const cache = CacheService.getScriptCache();
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

function readTab_(ss, name, required) {
  if (name === OLD_CONTACT_TAB || name === INQUIRY_TAB) throw new Error('"' + name + '" 탭은 읽지 않습니다.'); // 개인정보가 웹앱 응답에 섞이지 않도록
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    if (required) throw new Error('"' + name + '" 탭을 찾을 수 없습니다.');
    return [];
  }
  const tz = ss.getSpreadsheetTimeZone();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const head = values[0].map(h => String(h).trim());
  return values.slice(1).map((row, i) => {
    const o = { __row: i + 2, __tab: name };
    head.forEach((h, j) => {
      if (CONTACT_HEAD.indexOf(h) >= 0) return; // 연락처 칸은 아예 읽지 않음
      const v = row[j];
      o[h] = v instanceof Date ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : v;
    });
    return o;
  });
}

function buildResult_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const res = compute_(readTab_(ss, RAW_TAB, true), readTab_(ss, RATE_TAB, true), readTab_(ss, LEAD_TAB, true), readTab_(ss, NOTE_TAB, false));
  const result = res.result;
  result.insights = readTab_(ss, INSIGHT_TAB, false).filter(r => r['제목']).map(r => [r['우선순위'], r['구분'], r['제목'], r['근거'], r['제안']]);
  result.updatedAt = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd HH:mm');
  return result;
}

// ---- 시트 메뉴와 자동 새로고침 ----

function onOpen() {
  SpreadsheetApp.getUi().createMenu('판매현황')
    .addItem('자동 칸·주차보고 새로고침', 'refreshAll')
    .addSeparator()
    .addItem('구매현황RAW 열 정리·서식 설치', 'setupRaw')
    .addItem('문의사항 탭 만들기', 'setupInquiry')
    .addToUi();
}

// 구매현황RAW·배분비율·선도학교 탭을 고치면 자동 칸과 주차보고를 다시 계산합니다
function onEdit(e) {
  const name = e && e.range ? e.range.getSheet().getName() : '';
  if ([RAW_TAB, RATE_TAB, LEAD_TAB].indexOf(name) >= 0) refreshAll();
}

function refreshAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RAW_TAB);
  if (!sheet) throw new Error('"' + RAW_TAB + '" 탭을 찾을 수 없습니다.');
  const raw = readTab_(ss, RAW_TAB, true);
  const res = compute_(raw, readTab_(ss, RATE_TAB, false), readTab_(ss, LEAD_TAB, false), []);
  writeAuto_(sheet, raw, res.derived);
  writeReport_(ss, res.result.report.all);
  CacheService.getScriptCache().remove('result');
}

function writeAuto_(sheet, raw, derived) {
  if (!raw.length) return;
  const head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const put = (name, values) => {
    const c = head.indexOf(name);
    if (c >= 0) sheet.getRange(2, c + 1, values.length, 1).setValues(values.map(v => [v]));
  };
  // 주문일이 있는 행만 주문월·주차를 다시 계산하고, 나머지는 원래 값을 그대로 둡니다
  put('학교급', derived.map(d => d.level));
  put('주문월', derived.map((d, i) => d.fromDate ? d.orderYm : raw[i]['주문월']));
  put('주문주차', derived.map((d, i) => d.fromDate ? d.orderWeek : raw[i]['주문주차']));
  AUTO_HEAD.forEach((name, k) => put(name, derived.map(d => d.auto[k])));
}

function writeReport_(ss, rep) {
  let sheet = ss.getSheetByName(REPORT_TAB);
  if (!sheet) sheet = ss.insertSheet(REPORT_TAB);
  const table = reportTable_(rep, Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd HH:mm'));
  sheet.clear();
  sheet.getRange(1, 1, table.values.length, table.values[0].length).setValues(table.values);
  sheet.getRange(1, 3, table.values.length, table.values[0].length - 2).setNumberFormat('#,##0').setHorizontalAlignment('right');
  sheet.getRange(1, 1, 1, table.values[0].length).setFontWeight('bold').setFontSize(13);
  const a1 = rows => rows.map(r => 'A' + r + ':' + columnLetter_(table.values[0].length) + r);
  if (table.sectionRows.length) sheet.getRangeList(a1(table.sectionRows)).setFontWeight('bold').setBackground('#1F3864').setFontColor('#FFFFFF');
  if (table.quarterRows.length) sheet.getRangeList(a1(table.quarterRows)).setFontWeight('bold').setBackground('#FFF2CC');
  if (table.headRows.length) sheet.getRangeList(a1(table.headRows)).setFontWeight('bold').setBackground('#D9E1F2');
  if (table.amountRows.length) sheet.getRangeList(a1(table.amountRows)).setBackground('#FFFBEA');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 90);
  sheet.setColumnWidth(2, 130);
  for (let c = 3; c <= table.values[0].length; c++) sheet.setColumnWidth(c, 110);
}

// ---- 구매현황RAW 열 정리·서식·드롭다운·자동 새로고침 설치 (다시 실행해도 됩니다) ----

// 열 순서를 RAW_LAYOUT으로 바꿉니다. 모르는 열은 맨 오른쪽에 남기고 DROPPED_HEAD만 지웁니다 (시트 없이 시험할 수 있는 순수 함수)
function rearrange_(values, layout, dropped, merged) {
  merged = merged || {};
  const head = values[0].map(h => String(h).trim());
  const gone = dropped.concat(Object.keys(merged));
  const extra = head.filter(h => h && layout.indexOf(h) < 0 && gone.indexOf(h) < 0);
  const out = layout.concat(extra);
  // 칸마다 값을 가져올 원래 열들 (새 이름 칸 먼저, 그다음 예전 이름 칸)
  const srcs = out.map(h => [head.indexOf(h)].concat(Object.keys(merged).filter(k => merged[k] === h).map(k => head.indexOf(k))).filter(j => j >= 0));
  const empty = v => v === '' || v === null || v === undefined;
  const rows = values.slice(1).filter(r => r.some(v => !empty(v)));
  return [out].concat(rows.map(r => srcs.map(js => { for (const j of js) if (!empty(r[j])) return r[j]; return ''; })));
}

function arrangeRaw_(ss, sheet) {
  const values = sheet.getDataRange().getValues();
  const head = values[0].map(h => String(h).trim());
  if (RAW_LAYOUT.every((h, i) => head[i] === h) && !DROPPED_HEAD.concat(Object.keys(MERGED_HEAD)).some(h => head.indexOf(h) >= 0)) return false;
  // 바꾸기 전에 본인 드라이브에 백업 파일을 만듭니다 (공유되지 않음)
  const stamp = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd HH:mm');
  const backup = SpreadsheetApp.create(RAW_TAB + ' 백업 (열 정리 전) ' + stamp);
  sheet.copyTo(backup).setName(RAW_TAB);
  backup.deleteSheet(backup.getSheets()[0]);
  // 열을 통째로 옮겨서 정렬·테두리·드롭다운 색 같은 서식이 열과 함께 따라가게 합니다
  ungroupColumns_(sheet);
  const headNow = () => sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const rows = Math.max(sheet.getLastRow() - 1, 1);
  // 1) 예전 이름 칸 → 새 이름 칸 (새 칸이 비어 있을 때만 값을 옮김), 예전 칸은 삭제
  Object.keys(MERGED_HEAD).forEach(from => {
    let h = headNow();
    const fi = h.indexOf(from);
    if (fi < 0) return;
    let ti = h.indexOf(MERGED_HEAD[from]);
    if (ti < 0) { sheet.getRange(1, fi + 1).setValue(MERGED_HEAD[from]); return; }
    const src = sheet.getRange(2, fi + 1, rows, 1).getValues();
    const dst = sheet.getRange(2, ti + 1, rows, 1).getValues();
    sheet.getRange(2, ti + 1, rows, 1).setValues(dst.map((r, i) => [r[0] === '' || r[0] === null ? src[i][0] : r[0]]));
    sheet.deleteColumn(fi + 1);
  });
  // 2) 지우는 칸 삭제
  DROPPED_HEAD.forEach(name => { const i = headNow().indexOf(name); if (i >= 0) sheet.deleteColumn(i + 1); });
  // 3) 없는 칸은 순서상 바로 앞 칸의 오른쪽에 새로 만듭니다 (왼쪽 칸의 정렬·테두리·색을 그대로 물려받음)
  //    앞 칸도 없으면 맨 오른쪽에 만들고, 4) 정해진 순서로 옮김 (모르는 칸은 오른쪽에 남음)
  RAW_LAYOUT.forEach((name, k) => {
    const h = headNow();
    if (h.indexOf(name) >= 0) return;
    const prev = k > 0 ? h.indexOf(RAW_LAYOUT[k - 1]) : -1;
    const at = prev >= 0 ? prev + 1 : sheet.getLastColumn();
    sheet.insertColumnAfter(at);
    sheet.getRange(1, at + 1).setValue(name);
    sheet.getRange(2, at + 1, sheet.getMaxRows() - 1, 1).clearContent().clearDataValidations();
  });
  RAW_LAYOUT.forEach((name, i) => {
    const at = headNow().indexOf(name);
    if (at !== i) sheet.moveColumns(sheet.getRange(1, at + 1, 1, 1), i + 1);
  });
  return backup.getUrl();
}

// 한 번만: 열 정리 전 백업 파일의 시트기재일을 주문일이 빈 행에 옮기고, 열 정리를 다시 실행합니다
function fillOrderDateFromBackup() {
  const ui = SpreadsheetApp.getUi();
  const ans = ui.prompt('시트기재일 → 주문일', '"구매현황RAW 백업 (열 정리 전)" 파일의 주소를 붙여넣어 주세요.', ui.ButtonSet.OK_CANCEL);
  if (ans.getSelectedButton() !== ui.Button.OK) return;
  const backup = SpreadsheetApp.openByUrl(ans.getResponseText().trim()).getSheetByName(RAW_TAB);
  if (!backup) throw new Error('백업 파일에 "' + RAW_TAB + '" 탭이 없습니다.');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RAW_TAB);
  const res = orderDatesFromBackup_(backup.getDataRange().getValues(), sheet.getDataRange().getValues());
  if (res.dates.length) sheet.getRange(2, res.col + 1, res.dates.length, 1).setValues(res.dates.map(d => [d]));
  setupRaw();
  ui.alert('주문일을 채운 행: ' + res.filled + '\n이미 주문일이 있어 그대로 둔 행: ' + res.kept + '\n백업에서 찾지 못한 행: ' + res.unmatched);
}

// 주문일이 빈 행에만 백업의 시트기재일을 넣은 주문일 칸 값 목록 (같은 위치 → 학교명·판매금액·정산월·구매처2가 하나만 맞는 행 순으로 찾음)
function orderDatesFromBackup_(oldValues, curValues) {
  const oh = oldValues[0].map(h => String(h).trim());
  const ch = curValues[0].map(h => String(h).trim());
  const so = oh.indexOf('시트기재일');
  const od = ch.indexOf('주문일');
  if (so < 0) throw new Error('백업 파일에 시트기재일 칸이 없습니다.');
  if (od < 0) throw new Error(RAW_TAB + ' 탭에 주문일 칸이 없습니다.');
  const keyOf = (row, head) => ['학교명', '판매금액', '정산월', '구매처2'].map(h => String(row[head.indexOf(h)]).trim()).join('|');
  const oldRows = oldValues.slice(1);
  const byKey = {};
  oldRows.forEach(r => { const k = keyOf(r, oh); (byKey[k] = byKey[k] || []).push(r); });
  const empty = v => v === '' || v === null || v === undefined;
  let filled = 0, kept = 0, unmatched = 0;
  const dates = curValues.slice(1).map((r, i) => {
    if (!empty(r[od])) { kept++; return r[od]; }
    if (!String(r[ch.indexOf('학교명')]).trim()) return r[od];
    const k = keyOf(r, ch);
    const src = oldRows[i] && keyOf(oldRows[i], oh) === k ? oldRows[i] : (byKey[k] && byKey[k].length === 1 ? byKey[k][0] : null);
    if (!src) { unmatched++; return r[od]; }
    if (empty(src[so])) return r[od];
    filled++;
    return src[so];
  });
  return { col: od, dates, filled, kept, unmatched };
}

// ---- 문의사항 탭 (구매 전 소통 기록) ----

// 구매여부 수식: 구매현황RAW에서 같은 학교명의 가장 아래(최근) 행의 상태. 없으면 빈칸
function inquiryStatusFormula_(schoolLetter, statusLetter, row) {
  const raw = "'" + RAW_TAB + "'!";
  const sch = raw + '$' + schoolLetter + '$2:$' + schoolLetter;
  const st = raw + '$' + statusLetter + '$2:$' + statusLetter;
  return '=IF(TRIM($C' + row + ')="","",IFERROR(ARRAYFORMULA(INDEX(SORT(FILTER({ROW(' + sch + '),' + st + '},TRIM(' + sch + ')=TRIM($C' + row + ')),1,FALSE),1,2)),""))';
}

// 문의사항 탭을 만듭니다. 이미 있으면 아무것도 바꾸지 않습니다 (직접 바꾼 서식·내용 보호)
function setupInquiry() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let msg = '"' + INQUIRY_TAB + '" 탭이 이미 있어서 그대로 두었습니다.';
  if (!ss.getSheetByName(INQUIRY_TAB)) {
    const raw = ss.getSheetByName(RAW_TAB);
    if (!raw) throw new Error('"' + RAW_TAB + '" 탭을 찾을 수 없습니다.');
    const rh = raw.getRange(1, 1, 1, raw.getLastColumn()).getValues()[0].map(h => String(h).trim());
    if (rh.indexOf('학교명') < 0 || rh.indexOf('상태') < 0) throw new Error(RAW_TAB + ' 탭에 학교명·상태 머리글이 없습니다.');
    const schoolL = columnLetter_(rh.indexOf('학교명') + 1), statusL = columnLetter_(rh.indexOf('상태') + 1);

    const sheet = ss.insertSheet(INQUIRY_TAB, ss.getSheets().indexOf(raw) + 1);
    const total = 1000;
    if (sheet.getMaxRows() < total) sheet.insertRowsAfter(sheet.getMaxRows(), total - sheet.getMaxRows());
    const n = INQUIRY_HEAD.length;
    if (sheet.getMaxColumns() > n) sheet.deleteColumns(n + 1, sheet.getMaxColumns() - n);
    const col = h => INQUIRY_HEAD.indexOf(h) + 1;
    const L = h => columnLetter_(col(h));
    const body = h => sheet.getRange(2, col(h), total - 1, 1);
    const rule = () => SpreadsheetApp.newDataValidation();

    sheet.getRange(1, 1, 1, n).setValues([INQUIRY_HEAD]).setFontWeight('bold').setBackground('#E6F4FF')
      .setVerticalAlignment('middle').setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 32);
    sheet.getRange(2, 1, total - 1, n).setHorizontalAlignment('left').setVerticalAlignment('middle');

    // 입력 형식
    ['학교명', '선생님명', '연락처', '이메일', '소통내용'].forEach(h => body(h).setNumberFormat('@')); // 전화번호 앞 0 유지
    body('문의일').setNumberFormat('yyyy-mm-dd').setHorizontalAlignment('center')
      .setDataValidation(rule().requireDate().setAllowInvalid(false).setHelpText('더블클릭해서 달력에서 고르거나 2026-11-12 형식으로 입력합니다.').build());
    Object.keys(INQUIRY_LISTS).forEach(h => body(h).setDataValidation(rule().requireValueInList(INQUIRY_LISTS[h], true).setAllowInvalid(false).build()));
    body('완료').insertCheckboxes().setHorizontalAlignment('center');
    body('소통내용').setWrap(true);

    // 구매여부: 구매현황RAW의 같은 학교 상태를 자동으로 가져옴
    body('구매여부').setHorizontalAlignment('center')
      .setFormulas(Array.from({ length: total - 1 }, (_, i) => [inquiryStatusFormula_(schoolL, statusL, i + 2)]));
    body('구매여부').protect().setDescription('자동 계산 칸').setWarningOnly(true);

    // 학교명 강조: 완료 안 됨 = 파란 글자 / 견적서발송 = 연한 주황 배경 / 구매완료 = 연한 초록 배경
    // (한 칸에는 맞는 규칙 하나만 적용되므로, 두 조건이 겹치는 경우를 먼저 둡니다)
    const open = 'TRIM($C2)<>"",$' + L('완료') + '2<>TRUE';
    const st = v => '$' + L('구매여부') + '2="' + v + '"';
    const BLUE = '#1677FF', ORANGE = '#FFE2C2', GREEN = '#D9F2D0';
    const cf = (formula, bg, font) => {
      let b = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(formula).setRanges([body('학교명')]);
      if (bg) b = b.setBackground(bg);
      if (font) b = b.setFontColor(font);
      return b.build();
    };
    sheet.setConditionalFormatRules([
      cf('=AND(' + open + ',' + st('견적서발송') + ')', ORANGE, BLUE),
      cf('=AND(' + open + ',' + st('구매완료') + ')', GREEN, BLUE),
      cf('=AND(' + open + ')', null, BLUE),
      cf('=' + st('견적서발송'), ORANGE, null),
      cf('=' + st('구매완료'), GREEN, null),
    ]);

    // 칸 너비와 머리글 메모
    const widths = { '문의일': 100, '담당자': 80, '학교명': 170, '선생님명': 90, '연락처': 120, '이메일': 190, '유입경로': 90, '솔루션명': 110, '구분': 90, '소통내용': 380, '완료': 60, '구매여부': 100 };
    INQUIRY_HEAD.forEach(h => sheet.setColumnWidth(col(h), widths[h]));
    sheet.getRange(1, col('학교명')).setNote('구매현황RAW와 똑같은 학교명으로 적어야 구매여부가 나옵니다.\n완료에 체크하지 않은 건은 파란 글자, 구매여부가 견적서발송이면 연한 주황, 구매완료면 연한 초록 배경입니다.');
    sheet.getRange(1, col('구매여부')).setNote('자동 계산 칸: 구매현황RAW에서 같은 학교명의 가장 아래(최근) 행 상태를 가져옵니다. 없으면 빈칸입니다.');
    sheet.getRange(1, col('완료')).setNote('소통이 끝나면 체크합니다. 체크하지 않은 건만 후속 관리 대상입니다.');
    sheet.getRange(1, col('연락처')).setNote('이 탭은 대시보드로 보내지 않습니다. 시트 편집자는 모두 볼 수 있습니다.');
    msg = '"' + INQUIRY_TAB + '" 탭을 만들었습니다.';
  }
  try { SpreadsheetApp.getUi().alert(msg); } catch (noUi) {}
}

// 행마다 단가 칸에 수식을 넣을지 (true) 직접 적은 값을 그대로 둘지 (false) (시트 없이 시험할 수 있는 순수 함수)
function pricePlan_(prices, amts, people, periods) {
  return prices.map((p, i) => {
    if (p === '' || p === null || p === undefined) return true;
    const a = Number(amts[i]), n = Number(people[i]), k = Number(periods[i]);
    if (typeof p !== 'number' || !(n > 0) || !(k > 0) || amts[i] === '' || isNaN(a)) return false;
    return Math.round(p) === Math.round(Math.round(a / n / k * 10) / 10); // 화면(#,##0)에서 같은 숫자로 보일 때만 수식으로 바꿈
  });
}

function ungroupColumns_(sheet) {
  const all = sheet.getRange(1, 1, 1, sheet.getMaxColumns());
  for (let i = 0; i < 8; i++) {
    try { all.shiftColumnGroupDepth(-1); } catch (e) { break; }
  }
}

function setupRaw() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RAW_TAB);
  if (!sheet) throw new Error('"' + RAW_TAB + '" 탭을 먼저 가져와 주세요.');
  let rates = ss.getSheetByName(RATE_TAB);
  if (!rates) {
    rates = ss.insertSheet(RATE_TAB);
    rates.getRange(1, 1, 1, RATE_HEAD.length).setValues([RATE_HEAD]);
  }
  Object.keys(RENAMED).forEach(from => {
    [rates, sheet].forEach(s => s.createTextFinder(from).matchEntireCell(true).replaceAllWith(RENAMED[from]));
  });
  const backupUrl = arrangeRaw_(ss, sheet);
  const head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const missing = RAW_LAYOUT.filter(h => head.indexOf(h) < 0);
  if (missing.length) throw new Error(RAW_TAB + ' 탭에 없는 머리글: ' + missing.join(', '));

  const total = Math.max(3000, sheet.getMaxRows());
  if (sheet.getMaxRows() < total) sheet.insertRowsAfter(sheet.getMaxRows(), total - sheet.getMaxRows());
  const col = h => head.indexOf(h) + 1;
  const letter = h => columnLetter_(col(h));
  const body = h => sheet.getRange(2, col(h), total - 1, 1);
  const rule = () => SpreadsheetApp.newDataValidation();
  const list = (values, allowInvalid) => rule().requireValueInList(values, true).setAllowInvalid(!!allowInvalid).build();

  // 사용자가 직접 바꾼 서식(정렬·테두리·드롭다운 색·칸 너비)을 지키기 위해,
  // 표시 형식·드롭다운·색·너비는 "아직 설치하지 않은 칸"에만 넣습니다
  const props = PropertiesService.getDocumentProperties();
  let done = JSON.parse(props.getProperty('RAW_STYLED') || 'null');
  if (!done) done = sheet.getRange(1, col('주문월')).getNote() ? RAW_LAYOUT.slice() : []; // 예전에 설치한 시트는 모두 설치된 것으로 봄
  const fresh = h => done.indexOf(h) < 0;
  const each = (names, fn) => names.filter(fresh).forEach(fn);

  // 표시 형식 (텍스트 칸이 날짜로 바뀌지 않도록 먼저 지정)
  each(CONTACT_HEAD, h => body(h).setNumberFormat('@')); // 전화번호 앞의 0이 사라지지 않도록 글자로
  each(['주문월', '정산월', '입금확인', '정산지연', '선도구분', '신규/재구매', '진행률'], h => body(h).setNumberFormat('@'));
  each(DATE_HEAD, h => body(h).setNumberFormat('yyyy-mm-dd'));
  each(['단가', '판매금액', '리셀배분액', '정산금액'], h => body(h).setNumberFormat('#,##0'));

  // 단가 수식 (처음 한 번): 비어 있거나 계산값과 같은(반올림 차이) 칸에만 수식을 넣고, 다른 값을 적어 둔 칸은 그대로 둡니다
  if (!props.getProperty(PRICE_FORMULA_KEY)) {
    const pc = col('단가');
    const grab = h => sheet.getRange(2, col(h), total - 1, 1).getValues().map(r => r[0]);
    const plan = pricePlan_(grab('단가'), grab('판매금액'), grab('인원'), grab('기간'));
    const off = h => col(h) - pc;
    const f = '=IF(AND(ISNUMBER(R[0]C[' + off('판매금액') + ']),ISNUMBER(R[0]C[' + off('인원') + ']),ISNUMBER(R[0]C[' + off('기간') + ']),R[0]C[' + off('인원') + ']>0,R[0]C[' + off('기간') + ']>0),'
      + 'ROUND(R[0]C[' + off('판매금액') + ']/R[0]C[' + off('인원') + ']/R[0]C[' + off('기간') + '],1),"")';
    // 수식을 넣을 칸이 이어진 구간마다 한 번에 씁니다
    for (let i = 0; i < plan.length;) {
      if (!plan[i]) { i++; continue; }
      let j = i;
      while (j < plan.length && plan[j]) j++;
      sheet.getRange(2 + i, pc, j - i, 1).setFormulasR1C1(Array.from({ length: j - i }, () => [f]));
      i = j;
    }
    props.setProperty(PRICE_FORMULA_KEY, '1');
  }
  each(['예외 리셀비율', '적용 리셀비율'], h => body(h).setNumberFormat('0.0%'));

  // 드롭다운과 입력 규칙
  const months = [];
  for (let y = REPORT_YEAR - 1; y <= REPORT_YEAR + 1; y++) for (let m = 1; m <= 12; m++) months.push(ym_(y, m));
  const valid = {
    '상태': () => list(STATUSES),
    '솔루션': () => list(Object.keys(SOL_KEYS)),
    '지역': () => list(LEAD_REGIONS),
    '구매처1': () => list(CHANNEL1),
    '구매처2': () => rule().requireValueInRange(rates.getRange('A2:A'), true).setAllowInvalid(false).build(),
    '가격구분': () => list(['정상가', '협의가', '확인필요']),
    '정산월': () => list(months),
    '정산주차': () => rule().requireNumberBetween(0, 6).setAllowInvalid(false).setHelpText('1~6 숫자로 입력합니다. 0 = 주차 구분 없음').build(),
    '예외 리셀비율': () => rule().requireNumberBetween(0, 1).setAllowInvalid(false).setHelpText('30%처럼 입력합니다. 비워두면 배분비율 탭 기준으로 계산합니다.').build(),
  };
  // 날짜 칸: 더블클릭하면 달력이 열리고, 날짜가 아닌 글자는 입력되지 않음
  DATE_HEAD.forEach(h => { valid[h] = () => rule().requireDate().setAllowInvalid(false).setHelpText('더블클릭해서 달력에서 고르거나 2026-11-12 형식으로 입력합니다.').build(); });
  STEPS.concat([TEACHERMALL]).forEach(h => { valid[h] = () => list(['O', 'X']); });
  each(Object.keys(valid), h => body(h).setDataValidation(valid[h]()));

  // 머리글 색(입력 칸 파랑, 자동 칸 회색)·칸 너비·판매금액 강조
  const autoCols = ORDER_AUTO.concat(AUTO_HEAD);
  // 연락처 칸은 학교명 칸의 머리글·정렬·테두리를 그대로 물려받으므로 너비만 정합니다
  const widths = { '담당자': 80, '직위': 70, '전화': 120, '이메일': 190 };
  each(CONTACT_HEAD, h => sheet.setColumnWidth(col(h), widths[h]));
  each(RAW_LAYOUT.filter(h => CONTACT_HEAD.indexOf(h) < 0), h => sheet.getRange(1, col(h)).setFontWeight('bold').setBackground('#E6F4FF').setWrap(true).setVerticalAlignment('middle'));
  each(autoCols, h => { sheet.getRange(1, col(h)).setBackground('#D9D9D9').setFontColor('#595959'); body(h).setBackground('#FAFAFA').setFontColor('#595959'); });
  each(['입금확인'], h => sheet.setColumnWidth(col(h), 150));
  each(['비고', '특이사항'], h => { sheet.setColumnWidth(col(h), 240); body(h).setWrap(true); });
  each(['학교명'], h => sheet.setColumnWidth(col(h), 160));
  each(['판매금액'], h => body(h).setBackground('#FFF4D1')); // 판매금액 강조 (연한 노랑)
  if (!done.length) { sheet.setFrozenRows(1); sheet.setRowHeight(1, 42); }

  // 머리글 메모 (서식이 아니라 다시 써도 됩니다)
  autoCols.forEach(h => sheet.getRange(1, col(h)).setNote('자동 계산 칸입니다. 직접 고치면 다음 새로고침 때 덮어씁니다.'));
  const notes = {
    '주문월': '주문일을 넣으면 자동으로 채워집니다. 주문일이 없는 예전 건만 이 칸의 값을 그대로 씁니다.',
    '입금확인': '본사계좌·학교장터 입금 확인 메모 (예: 11/12 입금 확인). 자유롭게 글로 적습니다. 계산·대시보드에는 쓰지 않습니다.',
    '학교급': '학교명에서 자동: …초등학교 → 초등, …중학교 → 중등, …고등학교 → 고등, 그 밖(…학교, 기관명) → 기타. 괄호 안 글자는 무시합니다.',
    '주문주차': '주문일을 넣으면 자동으로 채워집니다 (월요일 시작, 1일이 속한 주 = 1주차).',
    '정산월': '정산된 달 (예: 2026-11). 비워두면 주문월 기준으로 집계합니다. 정산지연 = 정산월 − 주문월.',
    '정산주차': '비워두면 실제정산일이 정산월 안에 있을 때 그 날짜의 주차로 계산합니다.',
    '예외 리셀비율': '비워두면 배분비율 탭에서 구매처2와 정산월로 찾습니다. 행별로 다른 비율일 때만 입력합니다.',
    '티처몰출고': '구매처2가 테크빌인 건만 해당합니다.',
    '예상구매일': '상태가 ' + PLAN_STATUSES.join('·') + '인 건의 예상 구매일. 주차보고의 예정에 들어갑니다.',
    '개설소통일': '개설 관련 통화를 한 날짜. 더블클릭하면 달력이 열립니다.',
    '단가': '판매금액 ÷ 인원 ÷ 기간으로 자동 계산되는 수식입니다. 다른 단가를 직접 적으면 그 행만 적은 값이 남습니다.',
    '특이사항': '자유롭게 글로 적습니다. 무언가 적히면 그 행의 학교명이 연한 빨강으로 바뀝니다. 대시보드로 보내지 않습니다.',
    '선도구분': '선도학교 탭에서 자동으로 찾습니다. 직접 고치지 않아도 됩니다.',
    '담당자': '담당자·직위·전화·이메일은 대시보드로 보내지 않습니다. 시트 편집자는 모두 볼 수 있습니다.',
  };
  Object.keys(notes).forEach(h => sheet.getRange(1, col(h)).setNote(notes[h]));

  // 조건부 서식
  const r = h => letter(h) + '2';
  const rules = [
    // 특이사항이 적힌 행은 학교명을 연한 빨강으로 (특이사항 있는 학교를 한눈에)
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=LEN(TRIM($' + r('특이사항') + '))>0')
      .setBackground('#FFCCC7').setRanges([body('학교명')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($' + r('구매처1') + '="리셀업체",$' + r('구매처2') + '="")')
      .setBackground('#FFCCC7').setRanges([body('구매처2')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($' + r('상태') + '<>"",$' + r('구매처2') + '<>"' + TEACHERMALL_VENDOR + '")')
      .setBackground('#F0F0F0').setFontColor('#BFBFBF').setRanges([body(TEACHERMALL)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($' + r('상태') + '="구매완료",ISNUMBER($' + r('주문일') + '),TODAY()-$' + r('주문일') + '>7,$' + r('사이트개설') + '<>"O")')
      .setBackground('#FFF1F0').setFontColor('#CF1322').setRanges([body('사이트개설')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(ISNUMBER($' + r('단가') + '),$' + r('단가') + '<3000)')
      .setBackground('#FFE1EA').setRanges([body('단가')]).build(),
    // 본사계좌·학교장터 구매완료인데 입금확인이 비어 있음
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(OR($' + r('구매처1') + '="본사계좌",$' + r('구매처1') + '="학교장터"),$' + r('상태') + '="구매완료",$' + r('입금확인') + '="")')
      .setBackground('#FFCCC7').setRanges([body('입금확인')]).build(),
    // 리셀업체 건은 입금확인이 필요 없음
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$' + r('구매처1') + '="리셀업체"')
      .setBackground('#F0F0F0').setFontColor('#BFBFBF').setRanges([body('입금확인')]).build(),
    // 만료일에 '확인필요' 글자가 있음 (사이트개설 경고와 같은 색)
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('확인필요')
      .setBackground('#FFF1F0').setRanges([body('만료일')]).build(),
    // 만료일이 오늘부터 30일 안 (재구매 연락 시점)
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(ISNUMBER($' + r('만료일') + '),$' + r('만료일') + '>=TODAY(),$' + r('만료일') + '-TODAY()<=30)')
      .setBackground('#FFE2C2').setRanges([body('만료일')]).build(),
    // 구매완료인데 주문일로부터 30일이 지나도록 정산월이 비어 있음
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($' + r('상태') + '="구매완료",$' + r('정산월') + '="",ISNUMBER($' + r('주문일') + '),TODAY()-$' + r('주문일') + '>30)')
      .setBackground('#FFCCC7').setRanges([body('정산월')]).build(),
    // 예외 리셀비율이 들어간 행 (일반 규칙과 다른 비율)
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=ISNUMBER($' + r('예외 리셀비율') + ')')
      .setBackground('#EEE4FF').setRanges([body('예외 리셀비율')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('확인 필요').setBackground('#FFE7BA').setRanges([body('적용 리셀비율')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('신규').setFontColor('#1677FF').setBold(true).setRanges([body('신규/재구매')]).build(),
  ];
  // 구분용 배경색 (위의 경고 색이 먼저 적용됩니다)
  Object.keys(TINTS).forEach(h => Object.keys(TINTS[h]).forEach(v => {
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(v).setBackground(TINTS[h][v]).setRanges([body(h)]).build());
  }));
  // 사용자가 직접 만든 규칙은 그대로 두고 (스크립트 규칙 다음에 둠), 같은 칸·같은 조건의 예전 스크립트 규칙만 바꿉니다
  const sig = cf => {
    const b = cf.getBooleanCondition();
    const g = cf.getRanges()[0];
    return [g.getColumn(), g.getNumColumns(), g.getRow(), b ? b.getCriteriaType() : 'gradient', b ? JSON.stringify(b.getCriteriaValues()) : ''].join('|');
  };
  const mine = {};
  rules.forEach(cf => { mine[sig(cf)] = true; });
  const userRules = sheet.getConditionalFormatRules().filter(cf => !mine[sig(cf)]);
  sheet.setConditionalFormatRules(rules.concat(userRules));

  // 자동 칸은 고치려 하면 경고
  sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).filter(p => p.getDescription() === '자동 계산 칸').forEach(p => p.remove());
  // 자동 칸이 이어진 구간마다 따로 보호 (선도구분처럼 앞쪽에 떨어진 칸 때문에 입력 칸까지 묶이지 않도록)
  const autoIdx = autoCols.map(col).sort((a, b) => a - b);
  for (let i = 0; i < autoIdx.length;) {
    let j = i;
    while (j + 1 < autoIdx.length && autoIdx[j + 1] === autoIdx[j] + 1) j++;
    sheet.getRange(2, autoIdx[i], total - 1, autoIdx[j] - autoIdx[i] + 1).protect().setDescription('자동 계산 칸').setWarningOnly(true);
    i = j + 1;
  }

  // [+]/[−] 접기 묶음: 아직 묶이지 않은 칸만 새로 묶습니다 (펼침·접힘 상태는 그대로)
  FOLD_GROUPS.forEach(g => {
    if (sheet.getColumnGroupDepth(col(g.from)) > 0) return;
    sheet.getRange(1, col(g.from), 1, col(g.to) - col(g.from) + 1).shiftColumnGroupDepth(1);
    if (g.collapsed) sheet.getColumnGroup(col(g.from), 1).collapse();
  });
  props.setProperty('RAW_STYLED', JSON.stringify(RAW_LAYOUT));

  // 배분비율 탭 (처음 한 번)
  if (!props.getProperty('RATE_STYLED') && !rates.getRange(1, 2).getNote()) {
    rates.getRange(1, 1, 1, RATE_HEAD.length).setFontWeight('bold').setBackground('#E6F4FF');
    rates.getRange('B2:B200').setNumberFormat('@');
    rates.getRange('C2:D200').setNumberFormat('0.0%');
    rates.getRange('D2:D200').setFormulas(Array.from({ length: 199 }, (_, i) => ['=IF(C' + (i + 2) + '="","",1-C' + (i + 2) + ')']));
    rates.getRange(1, 2).setNote('이 정산월부터 적용합니다 (예: 2026-11). 같은 업체의 비율이 바뀌면 아래에 새 줄을 추가합니다.');
    rates.setFrozenRows(1);
    rates.setColumnWidth(5, 360);
  }
  props.setProperty('RATE_STYLED', '1');

  // 예전에 만든 연락처 탭은 비어 있을 때만 지웁니다 (내용이 있으면 그대로 둠)
  const oldContact = ss.getSheetByName(OLD_CONTACT_TAB);
  if (oldContact && oldContact.getLastRow() <= 1) ss.deleteSheet(oldContact);

  // 예전 탭은 숨기고, 1시간마다 자동 새로고침
  OLD_TABS.forEach(name => { const s = ss.getSheetByName(name); if (s) s.hideSheet(); });
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'refreshAll')) {
    ScriptApp.newTrigger('refreshAll').timeBased().everyHours(1).create();
  }
  refreshAll();
  const msg = '설치가 끝났습니다. 자동 칸과 주차보고 탭이 채워졌습니다.' + (backupUrl ? '\n열을 정리하기 전 상태는 내 드라이브의 백업 파일에 있습니다:\n' + backupUrl : '');
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (noUi) {}
}

function columnLetter_(n) {
  let s = '';
  for (; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + (n - 1) % 26) + s;
  return s;
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

function ym_(y, m) {
  return y + '-' + ('0' + m).slice(-2);
}

// '2026-10', '2026.10', '2026-10-01', '10월 정산' → '2026-10'
function parseYm_(v) {
  const s = str_(v);
  let m = s.match(/^(\d{4})\s*[-.\/년]\s*(\d{1,2})/);
  if (m && +m[2] >= 1 && +m[2] <= 12) return ym_(+m[1], +m[2]);
  m = s.match(/^(\d{1,2})\s*월/);
  if (m && +m[1] >= 1 && +m[1] <= 12) return ym_(REPORT_YEAR, +m[1]);
  return '';
}

function ymIndex_(ym) {
  return +ym.slice(0, 4) * 12 + +ym.slice(5, 7);
}

// 30%, 0.3, 30 → 0.3
function parsePct_(v) {
  const s = str_(v);
  if (!s) return null;
  const n = parseNum_(s);
  if (n === null) return null;
  return s.indexOf('%') >= 0 || n > 1 ? n / 100 : n;
}

function str_(v) {
  return String(v === null || v === undefined ? '' : v).trim();
}

// 띄어쓰기가 달라도 같은 학교로 셉니다
function schoolName_(v) {
  return str_(v).replace(/\s+/g, '');
}

// 학교명 → 학교급. 괄호 안 글자(예: 백학초등학교(연천))는 무시합니다
function levelOf_(name) {
  const n = schoolName_(name).replace(/\([^)]*\)/g, '');
  if (!n) return '';
  if (/초등학교$/.test(n)) return '초등';
  if (/중학교$/.test(n)) return '중등';
  if (/고등학교$/.test(n)) return '고등';
  return '기타';
}

// 명단 대조용 키: 학교명 앞의 지역명이 있어도 없어도 같은 학교로 봅니다
function leadKey_(school, region) {
  const name = schoolName_(school);
  return (name.indexOf(region) === 0 ? name.slice(region.length) : name) + '|' + region;
}

function ymd_(y, m, d) {
  return y + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
}

// 그 달의 몇 번째 주인지 (월요일 시작, 첫 월요일 전 날짜는 1주차)
function weekOfMonth_(d) {
  const firstMonday = (8 - new Date(Date.UTC(d.y, d.m - 1, 1)).getUTCDay()) % 7 + 1;
  return d.d < firstMonday ? 1 : Math.floor((d.d - firstMonday) / 7) + 1;
}

function delayLabel_(orderYm, settleYm) {
  if (!orderYm || !settleYm) return '';
  const diff = ymIndex_(settleYm) - ymIndex_(orderYm);
  return diff === 0 ? '당월정산' : diff < 0 ? '조기정산(' + diff + ')' : '지연(+' + diff + ')';
}

function parseRates_(rows) {
  return (rows || []).map(r => ({ vendor: str_(r['구매처2']), from: parseYm_(r['적용 시작 정산월']) || '0000-00', rate: parsePct_(r['리셀업체 비율']) }))
    .filter(r => r.vendor && r.rate !== null);
}

// 예외 비율 → 본사계좌·학교장터 0% → 배분비율 탭에서 기준월 이전에 시작한 가장 최근 비율
function rateFor_(rates, ch1, ch2, ym, exception) {
  if (exception !== null) return exception;
  if (!ch1) return null;
  if (ch1 !== '리셀업체') return 0;
  if (!ch2 || !ym) return null;
  const found = rates.filter(r => r.vendor === ch2 && r.from <= ym).sort((a, b) => a.from < b.from ? -1 : a.from > b.from ? 1 : 0).pop();
  return found ? found.rate : null;
}

function leadTypes_(leadRows) {
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
  return lead;
}

function leadLabel_(s) {
  return !s ? '' : s.lead && s.ai ? '선도+중점' : s.lead ? '선도' : s.ai ? '중점' : '';
}

function progress_(raw, ch2, hasOrderDate) {
  const steps = STEPS.concat(ch2 === TEACHERMALL_VENDOR ? [TEACHERMALL] : []);
  const filled = steps.some(h => str_(raw[h]));
  if (!hasOrderDate && !filled) return ''; // 예전 건은 진행 기록이 없어 비워 둡니다
  return '완료 ' + steps.filter(h => str_(raw[h]).toUpperCase() === 'O').length + '/' + steps.length;
}

// 한 행에서 자동 칸 값과 집계용 값을 만듭니다
function deriveRow_(raw, rates, lead) {
  const d = { tab: raw.__tab, row: raw.__row, status: str_(raw['상태']), auto: AUTO_HEAD.map(() => ''), orderYm: '', orderWeek: '', fromDate: false, level: levelOf_(raw['학교명']) };
  const school = schoolName_(raw['학교명']);
  const amt = parseNum_(raw['판매금액']);
  if (!school && !d.status && amt === null) { d.skip = true; return d; }

  const orderDate = parseDate_(raw['주문일']);
  d.fromDate = !!orderDate;
  d.orderYm = orderDate ? ym_(orderDate.y, orderDate.m) : parseYm_(raw['주문월']);
  d.orderWeek = orderDate ? weekOfMonth_(orderDate) : parseNum_(raw['주문주차']);
  const orderWeek = d.orderWeek || 0;
  if (d.orderWeek === null) d.orderWeek = '';
  const settleYm = parseYm_(raw['정산월']);
  const settleDate = parseDate_(raw['실제정산일']);
  const settleWeek = parseNum_(raw['정산주차']) || (settleDate && ym_(settleDate.y, settleDate.m) === settleYm ? weekOfMonth_(settleDate) : 0);
  const region = str_(raw['지역']);
  const ch1 = str_(raw['구매처1']), ch2 = str_(raw['구매처2']);
  const baseYm = settleYm || d.orderYm;
  const rate = rateFor_(rates, ch1, ch2, baseYm, parsePct_(raw['예외 리셀비율']));
  const tv = rate === null || amt === null ? null : Math.round(amt * rate);
  const st = tv === null ? null : amt - tv;
  d.auto = [
    delayLabel_(d.orderYm, settleYm),
    rate !== null ? rate : ch1 && amt !== null ? '확인 필요' : '',
    tv === null ? '' : tv,
    st === null ? '' : st,
    leadLabel_(lead[leadKey_(school, region)]),
    '',
    progress_(raw, ch2, !!orderDate),
  ];

  const sol = SOL_KEYS[str_(raw['솔루션'])];
  if (PLAN_STATUSES.indexOf(d.status) >= 0) {
    const pd = parseDate_(raw['예상구매일']) || orderDate;
    if (sol && pd && school) d.plan = { sol, school, region, amt: amt || 0, st: 0, orderYm: ym_(pd.y, pd.m), orderWeek: weekOfMonth_(pd) };
    return d;
  }
  if (d.status !== '구매완료') {
    if (!d.status) d.problem = '상태 없음';
    return d;
  }
  const problems = [];
  if (!sol) problems.push('솔루션 이름');
  if (!school) problems.push('학교명 없음');
  if (!region) problems.push('지역 없음');
  if (amt === null) problems.push('판매금액');
  if (!ch1) problems.push('구매처1 없음');
  else if (ch1 === '리셀업체' && !ch2) problems.push('구매처2 없음');
  else if (rate === null) problems.push('배분비율 없음');
  if (!baseYm) problems.push('주문월·정산월 없음');
  else if (+baseYm.slice(0, 4) !== REPORT_YEAR) problems.push(REPORT_YEAR + '년 외 건');
  if (problems.length) { d.problem = problems.join(', '); return d; }
  const start = parseDate_(raw['시작일']);
  d.norm = {
    sol, school, region, amt, st, tv,
    channel: ch1 === '리셀업체' ? ch2 : ch1,
    month: +baseYm.slice(5, 7),
    week: settleYm ? settleWeek : 0, // 판매 현황·주차별 차트는 정산월·정산주차 기준
    orderYm: d.orderYm, orderWeek, settleYm, settleWeek,
    delay: delayLabel_(d.orderYm, settleYm),
    isNew: false,
    people: parseNum_(raw['인원']) || 0,
    period: parseNum_(raw['기간']) || 0,
    start,
    level: d.level,
    end: parseDate_(raw['만료일']),
    endRaw: str_(raw['만료일']),
  };
  return d;
}

// 같은 학교·솔루션의 첫 구매(주문월·주차 순)를 신규, 이후를 재구매로 표시합니다
function markNew_(derived) {
  const list = derived.filter(d => d.norm).sort((a, b) => {
    const ka = (a.norm.orderYm || a.norm.settleYm), kb = (b.norm.orderYm || b.norm.settleYm);
    return ka < kb ? -1 : ka > kb ? 1 : (a.norm.orderWeek - b.norm.orderWeek) || (a.row - b.row);
  });
  const seen = {};
  list.forEach(d => {
    const key = d.norm.school + '|' + d.norm.region + '|' + d.norm.sol;
    d.norm.isNew = !seen[key];
    seen[key] = true;
    d.auto[AUTO_HEAD.indexOf('신규/재구매')] = d.norm.isNew ? '신규' : '재구매';
  });
}

function compute_(rawRows, rateRows, leadRows, noteRows) {
  const lead = leadTypes_(leadRows);
  const rates = parseRates_(rateRows);
  const derived = rawRows.map(raw => deriveRow_(raw, rates, lead));
  markNew_(derived);
  return { derived, result: aggregate(derived, lead, noteRows) };
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
  BASE_CHANNELS.forEach(k => { obj.channelMap[k] = [k, 0, 0, 0, 0]; });
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

// 정산월·정산주차 기준 주차별·시도별 합계. 학교별 행은 포함하지 않습니다.
function weeklyData_(rows) {
  const out = { year: REPORT_YEAR, weekly: {}, monthSchools: {}, regions: {} };
  const round = v => Math.round(v);
  ['all', 'M', 'G'].forEach(key => {
    const picked = key === 'all' ? rows : rows.filter(r => r.sol === key);
    const weeks = {}, monthSch = {}, regions = {};
    REGIONS.forEach(k => { regions[k] = { m: Array.from({ length: 12 }, () => [0, 0]), w: {}, first: '' }; });
    picked.forEach(r => {
      const ym = REPORT_YEAR + '-' + ('0' + r.month).slice(-2);
      const weekKey = ym + '-' + r.week;
      const school = r.school + '|' + r.region;
      if (!weeks[weekKey]) weeks[weekKey] = { n: 0, sch: {}, amt: 0, st: 0 };
      const w = weeks[weekKey];
      w.n++; w.sch[school] = true; w.amt += r.amt; w.st += r.st;
      if (!monthSch[ym]) monthSch[ym] = {};
      monthSch[ym][school] = true;
      if (!regions[r.region]) regions[r.region] = { m: Array.from({ length: 12 }, () => [0, 0]), w: {}, first: '' };
      const reg = regions[r.region];
      reg.m[r.month - 1][0]++; reg.m[r.month - 1][1] += r.amt;
      if (!reg.w[weekKey]) reg.w[weekKey] = [0, 0];
      reg.w[weekKey][0]++; reg.w[weekKey][1] += r.amt;
      if (!reg.first || ym < reg.first) reg.first = ym;
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

// 분기별 주차 표 자료. 행: [연월, 주차(-1 = 월 합계, 0 = 주차 구분 없음), 건수, 학교 수, 신규 학교 수, 판매금액, 정산금액, 당월 정산된 판매금액]
function reportData_(rows, plans) {
  const out = {};
  ['all', 'M', 'G'].forEach(key => {
    const pick = list => key === 'all' ? list : list.filter(r => r.sol === key);
    const picked = pick(rows);
    const add = (map, ym, week, r) => {
      [week, -1].forEach(w => {
        const id = ym + '|' + w;
        if (!map[id]) map[id] = { n: 0, sch: {}, nw: {}, amt: 0, st: 0, same: 0 };
        const c = map[id], school = r.school + '|' + r.region + '|' + r.sol;
        c.n++; c.sch[school] = true; if (r.isNew) c.nw[school] = true;
        c.amt += r.amt; c.st += r.st;
        if (r.orderYm && r.orderYm === r.settleYm) c.same += r.amt;
      });
    };
    const flat = map => Object.keys(map).sort().map(id => {
      const c = map[id], parts = id.split('|');
      return [parts[0], +parts[1], c.n, Object.keys(c.sch).length, Object.keys(c.nw).length, Math.round(c.amt), Math.round(c.st), Math.round(c.same)];
    });
    const order = {}, settle = {}, plan = {}, matrix = {}, delays = {};
    const noOrder = [0, 0], noSettle = [0, 0];
    picked.forEach(r => {
      if (r.orderYm) add(order, r.orderYm, r.orderWeek || 0, r); else { noOrder[0]++; noOrder[1] += r.amt; }
      if (r.settleYm) add(settle, r.settleYm, r.settleWeek || 0, r); else { noSettle[0]++; noSettle[1] += r.amt; }
      if (r.orderYm && r.settleYm) {
        const id = r.orderYm + '|' + r.settleYm;
        if (!matrix[id]) matrix[id] = [0, 0];
        matrix[id][0]++; matrix[id][1] += r.amt;
        const diff = ymIndex_(r.settleYm) - ymIndex_(r.orderYm);
        if (!delays[diff]) delays[diff] = [0, 0];
        delays[diff][0]++; delays[diff][1] += r.amt;
      }
    });
    pick(plans).forEach(p => add(plan, p.orderYm, p.orderWeek, p));
    out[key] = {
      order: flat(order), settle: flat(settle), plan: flat(plan),
      matrix: Object.keys(matrix).sort().map(id => id.split('|').concat([matrix[id][0], Math.round(matrix[id][1])])),
      delays: Object.keys(delays).map(Number).sort((a, b) => a - b).map(k => [k, delays[k][0], Math.round(delays[k][1])]),
      noOrder: [noOrder[0], Math.round(noOrder[1])], noSettle: [noSettle[0], Math.round(noSettle[1])],
    };
  });
  return out;
}

// 주차보고 탭에 쓸 표 (전체 솔루션). 구매일 기준과 정산일 기준을 분기·월별로 나눕니다.
function reportTable_(rep, updatedAt) {
  const W = 6, width = 3 + W + 1;
  const values = [], sectionRows = [], quarterRows = [], headRows = [], amountRows = [];
  const blank = () => new Array(width).fill('');
  const push = (row, kind) => {
    const r = row.concat(new Array(width - row.length).fill('')).slice(0, width);
    values.push(r);
    if (kind) kind.push(values.length);
  };
  const index = list => { const m = {}; list.forEach(x => { m[x[0] + '|' + x[1]] = x; }); return m; };
  push([REPORT_YEAR + ' 분기별 주차 현황 (전체 솔루션, 금액 원 단위)', '', '', '', '', '', '', '갱신 ' + updatedAt]);
  [['order', '구매일 기준 (주문월·주문주차)'], ['settle', '정산일 기준 (정산월·정산주차)']].forEach(([basis, title]) => {
    push(blank());
    push([title], sectionRows);
    const data = index(rep[basis]), plan = index(rep.plan);
    for (let q = 1; q <= 4; q++) {
      const yms = [1, 2, 3].map(i => ym_(REPORT_YEAR, (q - 1) * 3 + i));
      const qt = yms.reduce((s, ym) => { const t = data[ym + '|-1']; return t ? [s[0] + t[2], s[1] + t[5], s[2] + t[6]] : s; }, [0, 0, 0]);
      push(blank());
      push([q + '분기', '구매 ' + qt[0] + '건', '매출금액', qt[1], '정산금액', qt[2]], quarterRows);
      yms.forEach(ym => {
        const m = +ym.slice(5);
        const get = (map, w, k) => { const x = map[ym + '|' + w]; return x ? x[k] : 0; };
        const line = (group, label, map, k) => [group, label].concat([-1, 1, 2, 3, 4, 5, 6, 0].map(w => get(map, w, k)));
        push(['구분', m + '월', '계', '1주차', '2주차', '3주차', '4주차', '5주차', '6주차', '주차 구분 없음'], headRows);
        if (basis === 'order') {
          push(line('예정', '구매 학교 수', plan, 3));
          push(line('예정', '매출금액', plan, 5), amountRows);
        }
        push(line('최종', '구매 건수', data, 2));
        push(line('최종', '구매 학교 수', data, 3));
        push(line('최종', '최초 개설 학교 수', data, 4));
        push(line('최종', '매출금액', data, 5), amountRows);
        push(line('최종', '정산금액', data, 6), amountRows);
        if (basis === 'order') {
          const amt = get(data, -1, 5);
          push(['최종', '당월 정산율', amt ? (Math.round(get(data, -1, 7) / amt * 1000) / 10) + '%' : '-']);
        }
      });
    }
  });
  return { values, sectionRows, quarterRows, headRows, amountRows };
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

function aggregate(derived, lead, noteRows) {
  const groups = { all: emptyAgg_(), M: emptyAgg_(), G: emptyAgg_() };
  const warnings = [];
  const accepted = [];
  const plans = [];
  derived.forEach(d => {
    if (d.skip) return;
    if (d.plan) plans.push(d.plan);
    if (d.problem) {
      warnings.push({ tab: d.tab, row: d.row, problem: d.problem });
      return;
    }
    if (!d.norm) return;
    accepted.push(d.norm);
    addRow_(groups.all, d.norm);
    addRow_(groups[d.norm.sol], d.norm);
  });

  // 월 라벨 앞에 과거 연도, 뒤에 이후 연도가 오도록 정렬
  const seen = {};
  accepted.forEach(r => { if (r.start) seen[r.start.y * 100 + r.start.m] = startKey_(r.start); });
  for (let m = 1; m <= 12; m++) seen[REPORT_YEAR * 100 + m] = m + '월';
  const startKeys = Object.keys(seen).map(Number).sort((a, b) => a - b).map(k => seen[k]);

  const both = Object.keys(groups.M.schools).filter(k => groups.G.schools[k]).length;

  // 선도·AI중점 침투율
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
    report: reportData_(accepted, plans),
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
