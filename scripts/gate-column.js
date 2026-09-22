#!/usr/bin/env node
// gate-column.js — 컬럼 발행 전 실검사. docs/column/VOICE.md §7 가드레일·§8 숫자 범위를 코드로 고정한다.
//   node scripts/gate-column.js content/columns/2026-09-13-어쩌고.md
// exit 0 = PASS(발행 가능) / exit 1 = FAIL(발행 금지)
//
// 왜 있나: 컬럼은 claude -p 가 써서 대표 이름으로 public 저장소에 바로 push 된다.
// 산문 지시만으로는 클라이언트 실명·보장 표현·지어낸 수치를 막지 못한다 (2026-09-13 감사).
// 기획제작 tools/gates.py 와 같은 원칙: "PASS 라고 쓰는 것"이 아니라 "exit 0 을 보는 것".

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.resolve(ROOT, '../../../2-제작/기획제작/_프로그램/channels/registry.json');

const file = process.argv[2];
if (!file) { console.error('사용법: node scripts/gate-column.js <컬럼.md>'); process.exit(2); }
if (!fs.existsSync(file)) { console.error(`파일 없음: ${file}`); process.exit(2); }

const raw = fs.readFileSync(file, 'utf8');
// 본문만 검사 (frontmatter 의 source_url 등은 제외)
const fmEnd = raw.indexOf('\n---', 4);
const body = raw.startsWith('---') && fmEnd > 0 ? raw.slice(fmEnd + 4) : raw;
const fm = raw.startsWith('---') && fmEnd > 0 ? raw.slice(0, fmEnd) : '';

const fails = [];
const warns = [];

// ── G1. 클라이언트 실명 (registry 정본에서 읽는다) ────────────────────────────
// 일반 명사와 겹쳐 오탐이 나는 별칭은 제외한다. 길이 2 이하도 제외.
const GENERIC = new Set(['의원', '치과', '병원', '클리닉', '한의원', '정형외과', '피부과', '성형외과', '의사', '원장']);
if (!fs.existsSync(REGISTRY)) {
  fails.push(`G1 registry.json 을 찾을 수 없다 (${REGISTRY}). 실명 검사를 못 하므로 발행을 막는다.`);
} else {
  const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  const chans = Array.isArray(reg) ? reg : (reg.channels ? (Array.isArray(reg.channels) ? reg.channels : Object.values(reg.channels)) : Object.values(reg));
  const names = new Set();
  for (const c of chans) {
    if (!c || typeof c !== 'object') continue;
    for (const k of ['name', 'company', 'aliases']) {
      const v = c[k];
      if (!v) continue;
      for (const x of (Array.isArray(v) ? v : [v])) {
        if (typeof x !== 'string') continue;
        const s = x.trim();
        if (s.length >= 3 && !GENERIC.has(s)) names.add(s);
      }
    }
  }
  for (const n of names) {
    if (body.includes(n)) fails.push(`G1 클라이언트 실명 노출: "${n}" (VOICE §7 — 사례는 익명으로)`);
  }
}

// ── G2. 보장·의료광고 심의 표현 ──────────────────────────────────────────────
const FORBID = [
  [/무조건\s*(잘\s*)?(됩니다|된다|성공)/, '성과 보장 ("무조건")'],
  [/보장(합니다|해\s*드립니다|해드립니다|됩니다)/, '성과 보장'],
  [/(완치|전후\s*사진)/, '의료광고 심의 표현'],
  [/(최고의|국내\s*유일|유일한|1위\s*병원|최상의)/, '최상급·유일 표현'],
  [/책임\s*(집니다|지겠습니다)/, '성과 책임 표현'],
  [/(할인|이벤트\s*가|시술\s*비용은|가격은\s*\d)/, '가격 유도'],
  // 자사 비용·단가·계약 금액은 과거 회고여도 쓰지 않는다 (2026-09-16 OG — 금액은 상담에서만)
  [/(월|편당|단가|계약\s*금액?|비용은?|가격은?)\s*[\d,.]+\s*만\s*원/, '자사 비용·단가 노출'],
  [/[\d,.]+\s*만\s*원(에|으로|부터|짜리)?\s*(계약|진행|제작|시작|맡)/, '자사 비용·단가 노출'],
];
// 따옴표 안에 든 표현은 "그렇게 말하는 업체를 걸러라" 식 비판 인용일 수 있다.
// 인용은 경고로 낮추고, 따옴표 밖에서 단정하는 경우만 FAIL 한다.
const isQuoted = (text, idx, len) => {
  const before = text.slice(Math.max(0, idx - 2), idx);
  const after = text.slice(idx + len, idx + len + 2);
  return /["'"「『]$/.test(before) && /^["'"」』]/.test(after);
};
for (const [re, why] of FORBID) {
  const m = body.match(re);
  if (!m) continue;
  if (isQuoted(body, m.index, m[0].length)) {
    warns.push(`G2 ${why}가 따옴표 안에 있다 (비판 인용으로 보임): "${m[0].trim()}" — 단정이면 고칠 것`);
  } else {
    fails.push(`G2 ${why}: "${m[0].trim()}"`);
  }
}

// ── G3. AI·자동화 언급 (글은 대표 이름으로 나간다) ────────────────────────────
const AI_RE = /(ChatGPT|GPT-?\d|Claude|클로드|인공지능이\s*(썼|작성)|AI가\s*(썼|작성|생성)|자동\s*생성된\s*(글|칼럼|컬럼))/i;
const am = body.match(AI_RE);
if (am) fails.push(`G3 AI·자동화 언급: "${am[0].trim()}" (VOICE §7)`);

// ── G4. §8 밖의 내부 수치 ────────────────────────────────────────────────────
// VOICE §8 이 허용한 숫자만 통과. 그 밖의 "구독자 N만"·"조회수 N만/억"·"N개월 만에" 는 세운다.
const ALLOWED_NUM = [
  /30\s*\+/, /1\.5\s*억/, /41\s*만/, /1,?000\s*\+/, /1년\s*6개월/, /3개월/, /1개월/,
  /2023년\s*6월/, /월\s*4편/, /30%/, /3~4분/, /80%/, /5~6시간/, /100건/, /90%/,
  /10만/, /100만/, /수백\s*건/, /수백만/, /7주/, /30초/, /1분/,
];
const numClaims = body.match(/(구독자|조회수|신환|매출)\s*[가-힣]{0,3}\s*[\d,.]+\s*(만|억|명|원|건|%)?/g) || [];
for (const claim of numClaims) {
  if (!ALLOWED_NUM.some(re => re.test(claim))) {
    warns.push(`G4 §8 목록 밖 수치 의심: "${claim.trim()}" — 내부 데이터면 한정어를 붙이고 §8 범위인지 확인`);
  }
}

// ── G5. frontmatter 무결성 ──────────────────────────────────────────────────
if (fm && !/^status:\s*(published|draft)\s*$/m.test(fm)) fails.push('G5 frontmatter 에 status 가 없거나 값이 이상하다');
if (fm && !/^title:\s*\S/m.test(fm)) fails.push('G5 frontmatter 에 title 이 없다');

// ── 보고 ────────────────────────────────────────────────────────────────────
const rel = path.relative(ROOT, file);
console.log(`[gate-column] ${rel}`);
console.log(`  본문 ${body.replace(/\s/g, '').length}자 · 검사 G1~G5`);
for (const w of warns) console.log(`  ⚠️  ${w}`);
if (fails.length) {
  for (const f of fails) console.log(`  ❌ ${f}`);
  console.log(`[gate-column] FAIL ${fails.length}건 — 발행하지 않는다`);
  process.exit(1);
}
console.log(`[gate-column] PASS${warns.length ? ` (경고 ${warns.length}건)` : ''}`);
process.exit(0);
