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
const STATUSES = ['문의', '견적', '결제대기', '구매완료', '취소'];
const PLAN_STATUSES = ['견적', '결제대기']; // 주차보고의 '예정'으로 셉니다
const CHANNEL1 = ['본사계좌', '학교장터', '리셀업체'];
const STEPS = ['계정등록메일', '사이트개설', '계정등록', '문자안내'];
const TEACHERMALL = '티처몰출고';  // 테크빌 건만 해당
const TEACHERMALL_VENDOR = '테크빌';

// 구매현황RAW 열 순서 (왼쪽부터). 입력 칸(파랑) 다음에 자동 칸(회색)이 옵니다
const INPUT_HEAD = ['주문일', '정산월', '상태', '솔루션', '지역', '학교명', '구매처1', '구매처2', '인원', '기간', '단가', '판매금액',
  '시작일', '만료일', '소통일', '계정등록메일', '사이트개설', '계정등록', '문자안내', '티처몰출고', '비고',
  '정산주차', '실제정산일', '예외 리셀비율', '가격구분', '예상구매일', '특이사항'];
// 학교급은 학교명에서, 주문월·주문주차는 주문일에서 자동 (주문일이 없는 예전 건은 주문월·주차 값을 그대로 둠)
const ORDER_AUTO = ['학교급', '주문월', '주문주차'];
const AUTO_HEAD = ['정산지연', '적용 리셀비율', '리셀배분액', '정산금액', '선도구분', '신규/재구매', '진행률'];
const RAW_LAYOUT = INPUT_HEAD.concat(ORDER_AUTO, AUTO_HEAD);
const DROPPED_HEAD = ['시트기재일']; // 열 정리 때 지우는 칸
// [+]/[−]로 접는 묶음. collapsed = 설치 직후 접힌 상태
const FOLD_GROUPS = [
  { from: '소통일', to: '티처몰출고', collapsed: false },
  { from: '정산주차', to: '특이사항', collapsed: true },
];
const RENAMED = { '디스픽토': '디스픽트' }; // 잘못 적힌 구매처2 이름 고치기
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
    .addItem('백업의 시트기재일을 주문일로 옮기기 (한 번)', 'fillOrderDateFromBackup')
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
function rearrange_(values, layout, dropped) {
  const head = values[0].map(h => String(h).trim());
  const extra = head.filter(h => h && layout.indexOf(h) < 0 && dropped.indexOf(h) < 0);
  const out = layout.concat(extra);
  const idx = out.map(h => head.indexOf(h));
  const rows = values.slice(1).filter(r => r.some(v => v !== '' && v !== null));
  return [out].concat(rows.map(r => idx.map(j => (j >= 0 ? r[j] : ''))));
}

function arrangeRaw_(ss, sheet) {
  const values = sheet.getDataRange().getValues();
  const head = values[0].map(h => String(h).trim());
  if (RAW_LAYOUT.every((h, i) => head[i] === h) && !DROPPED_HEAD.some(h => head.indexOf(h) >= 0)) return false;
  // 바꾸기 전에 본인 드라이브에 백업 파일을 만듭니다 (공유되지 않음)
  const stamp = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd HH:mm');
  const backup = SpreadsheetApp.create(RAW_TAB + ' 백업 (열 정리 전) ' + stamp);
  sheet.copyTo(backup).setName(RAW_TAB);
  backup.deleteSheet(backup.getSheets()[0]);
  const next = rearrange_(values, RAW_LAYOUT, DROPPED_HEAD);
  // 서식·드롭다운·보호·묶음을 모두 지운 뒤 새 순서로 씁니다
  sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(p => p.remove());
  const all = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
  ungroupColumns_(sheet);
  all.clearDataValidations();
  all.clearNote();
  sheet.clearConditionalFormatRules();
  sheet.clear();
  const width = next[0].length;
  if (sheet.getMaxColumns() < width) sheet.insertColumnsAfter(sheet.getMaxColumns(), width - sheet.getMaxColumns());
  const textCols = ['주문월', '정산월', '정산지연', '선도구분', '신규/재구매', '진행률'];
  next[0].forEach((h, j) => { if (textCols.indexOf(h) >= 0) sheet.getRange(1, j + 1, sheet.getMaxRows(), 1).setNumberFormat('@'); });
  sheet.getRange(1, 1, next.length, width).setValues(next);
  sheet.setColumnWidths(1, sheet.getMaxColumns(), 100);
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

  const total = 3000;
  if (sheet.getMaxRows() < total) sheet.insertRowsAfter(sheet.getMaxRows(), total - sheet.getMaxRows());
  const col = h => head.indexOf(h) + 1;
  const letter = h => columnLetter_(col(h));
  const body = h => sheet.getRange(2, col(h), total - 1, 1);
  const rule = () => SpreadsheetApp.newDataValidation();
  const list = (values, allowInvalid) => rule().requireValueInList(values, true).setAllowInvalid(!!allowInvalid).build();

  // 표시 형식 (텍스트 칸이 날짜로 바뀌지 않도록 먼저 지정)
  ['주문월', '정산월', '정산지연', '선도구분', '신규/재구매', '진행률'].forEach(h => body(h).setNumberFormat('@'));
  ['주문일', '예상구매일', '실제정산일', '시작일', '만료일', '소통일'].forEach(h => body(h).setNumberFormat('yyyy-mm-dd'));
  ['단가', '판매금액', '리셀배분액', '정산금액'].forEach(h => body(h).setNumberFormat('#,##0'));
  ['예외 리셀비율', '적용 리셀비율'].forEach(h => body(h).setNumberFormat('0.0%'));

  // 드롭다운과 입력 규칙
  const months = [];
  for (let y = REPORT_YEAR - 1; y <= REPORT_YEAR + 1; y++) for (let m = 1; m <= 12; m++) months.push(ym_(y, m));
  body('상태').setDataValidation(list(STATUSES));
  body('솔루션').setDataValidation(list(Object.keys(SOL_KEYS)));
  body('지역').setDataValidation(list(LEAD_REGIONS));
  body('구매처1').setDataValidation(list(CHANNEL1));
  body('구매처2').setDataValidation(rule().requireValueInRange(rates.getRange('A2:A'), true).setAllowInvalid(false).build());
  body('가격구분').setDataValidation(list(['정상가', '협의가', '확인필요']));
  body('정산월').setDataValidation(list(months));
  body('정산주차').setDataValidation(rule().requireNumberBetween(0, 6).setAllowInvalid(false).setHelpText('1~6 숫자로 입력합니다. 0 = 주차 구분 없음').build());
  body('예외 리셀비율').setDataValidation(rule().requireNumberBetween(0, 1).setAllowInvalid(false).setHelpText('30%처럼 입력합니다. 비워두면 배분비율 탭 기준으로 계산합니다.').build());
  ['주문일', '예상구매일', '실제정산일', '시작일', '만료일', '소통일'].forEach(h => body(h).setDataValidation(rule().requireDate().setAllowInvalid(true).build()));
  STEPS.concat([TEACHERMALL]).forEach(h => body(h).setDataValidation(list(['O', 'X'])));

  // 머리글 색: 입력 칸은 파랑, 자동 칸은 회색
  const last = sheet.getLastColumn();
  sheet.getRange(1, 1, 1, last).setFontWeight('bold').setBackground('#E6F4FF').setWrap(true).setVerticalAlignment('middle');
  const autoCols = ORDER_AUTO.concat(AUTO_HEAD);
  autoCols.forEach(h => {
    sheet.getRange(1, col(h)).setBackground('#D9D9D9').setFontColor('#595959').setNote('자동 계산 칸입니다. 직접 고치면 다음 새로고침 때 덮어씁니다.');
    body(h).setBackground('#FAFAFA').setFontColor('#595959');
  });
  sheet.getRange(1, col('주문월')).setNote('주문일을 넣으면 자동으로 채워집니다. 주문일이 없는 예전 건만 이 칸의 값을 그대로 씁니다.');
  sheet.getRange(1, col('학교급')).setNote('학교명에서 자동: …초등학교 → 초등, …중학교 → 중등, …고등학교 → 고등, 그 밖(…학교, 기관명) → 기타. 괄호 안 글자는 무시합니다.');
  sheet.getRange(1, col('주문주차')).setNote('주문일을 넣으면 자동으로 채워집니다 (월요일 시작, 1일이 속한 주 = 1주차).');
  sheet.getRange(1, col('정산월')).setNote('정산된 달 (예: 2026-11). 비워두면 주문월 기준으로 집계합니다. 정산지연 = 정산월 − 주문월.');
  sheet.getRange(1, col('정산주차')).setNote('비워두면 실제정산일이 정산월 안에 있을 때 그 날짜의 주차로 계산합니다.');
  sheet.getRange(1, col('예외 리셀비율')).setNote('비워두면 배분비율 탭에서 구매처2와 정산월로 찾습니다. 행별로 다른 비율일 때만 입력합니다.');
  sheet.getRange(1, col('티처몰출고')).setNote('구매처2가 테크빌인 건만 해당합니다.');
  sheet.getRange(1, col('예상구매일')).setNote('상태가 견적·결제대기인 건의 예상 구매일. 주차보고의 예정에 들어갑니다.');
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 42);
  ['비고', '특이사항'].forEach(h => { sheet.setColumnWidth(col(h), 240); body(h).setWrap(true); });
  sheet.setColumnWidth(col('학교명'), 160);

  // 조건부 서식
  const r = h => letter(h) + '2';
  const rules = [
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($' + r('구매처1') + '="리셀업체",$' + r('구매처2') + '="")')
      .setBackground('#FFCCC7').setRanges([body('구매처2')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($' + r('상태') + '<>"",$' + r('구매처2') + '<>"' + TEACHERMALL_VENDOR + '")')
      .setBackground('#F0F0F0').setFontColor('#BFBFBF').setRanges([body(TEACHERMALL)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($' + r('상태') + '="구매완료",ISNUMBER($' + r('주문일') + '),TODAY()-$' + r('주문일') + '>7,$' + r('사이트개설') + '<>"O")')
      .setBackground('#FFF1F0').setFontColor('#CF1322').setRanges([body('사이트개설')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('확인 필요').setBackground('#FFE7BA').setRanges([body('적용 리셀비율')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('신규').setFontColor('#1677FF').setBold(true).setRanges([body('신규/재구매')]).build(),
  ];
  sheet.setConditionalFormatRules(rules);

  // 자동 칸은 고치려 하면 경고
  sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).filter(p => p.getDescription() === '자동 계산 칸').forEach(p => p.remove());
  const firstAuto = Math.min.apply(null, autoCols.map(col));
  const lastAuto = Math.max.apply(null, autoCols.map(col));
  sheet.getRange(2, firstAuto, total - 1, lastAuto - firstAuto + 1).protect().setDescription('자동 계산 칸').setWarningOnly(true);

  // [+]/[−] 접기 묶음
  ungroupColumns_(sheet);
  FOLD_GROUPS.forEach(g => {
    sheet.getRange(1, col(g.from), 1, col(g.to) - col(g.from) + 1).shiftColumnGroupDepth(1);
    if (g.collapsed) sheet.getColumnGroup(col(g.from), 1).collapse();
  });

  // 배분비율 탭
  rates.getRange(1, 1, 1, RATE_HEAD.length).setFontWeight('bold').setBackground('#E6F4FF');
  rates.getRange('B2:B200').setNumberFormat('@');
  rates.getRange('C2:D200').setNumberFormat('0.0%');
  rates.getRange('D2:D200').setFormulas(Array.from({ length: 199 }, (_, i) => ['=IF(C' + (i + 2) + '="","",1-C' + (i + 2) + ')']));
  rates.getRange(1, 2).setNote('이 정산월부터 적용합니다 (예: 2026-11). 같은 업체의 비율이 바뀌면 아래에 새 줄을 추가합니다.');
  rates.setFrozenRows(1);
  rates.setColumnWidth(5, 360);

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
