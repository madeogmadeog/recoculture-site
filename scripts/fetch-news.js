#!/usr/bin/env node
/**
 * 최근 뉴스 수집 → data/news-inbox.json
 * Google News RSS(키 불필요) + YouTube 공식 블로그. 최근 10일, 이미 쓴 기사(data/news-used.json)는 제외.
 * 실행: node scripts/fetch-news.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const QUERIES = [
  '유튜브 알고리즘', '유튜브 쇼츠', '유튜브 정책 변경', '유튜브 크리에이터', '병원 유튜브', '의사 유튜버',
  '의료광고 심의', '의료법 광고 유튜브', '치과 유튜브', '피부과 마케팅', '전문직 유튜브', '유튜브 수익 창출 요건',
  '숏폼 트렌드', '유튜브 검색 AI', '개원의 마케팅',
];
const DAYS = 10;
const strip = s => (s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
async function rss(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const x = await r.text();
  return [...x.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
    const it = m[1], g = re => (it.match(re) || [])[1];
    return { title: strip(g(/<title>([\s\S]*?)<\/title>/)), link: strip(g(/<link>([\s\S]*?)<\/link>/)) || strip(g(/<guid[^>]*>([\s\S]*?)<\/guid>/)), date: new Date(strip(g(/<pubDate>([\s\S]*?)<\/pubDate>/))).toISOString(), source: strip(g(/<source[^>]*>([\s\S]*?)<\/source>/)), desc: strip(g(/<description>([\s\S]*?)<\/description>/)).slice(0, 300) };
  });
}
(async () => {
  const used = new Set((JSON.parse(fs.existsSync(path.join(ROOT, 'data/news-used.json')) ? fs.readFileSync(path.join(ROOT, 'data/news-used.json'), 'utf8') : '[]')).map(u => u.link));
  const since = Date.now() - DAYS * 864e5;
  const seen = new Map();
  for (const q of QUERIES) {
    try {
      const items = await rss(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR&ceid=KR:ko`);
      items.forEach(it => { if (new Date(it.date) < since || used.has(it.link)) return; const k = it.title.replace(/\s+/g, ' ').slice(0, 40); if (!seen.has(k)) seen.set(k, { ...it, query: q }); });
    } catch (e) { console.warn('rss fail', q, e.message); }
  }
  try { (await rss('https://blog.youtube/rss/')).forEach(it => { if (new Date(it.date) >= since && !used.has(it.link)) seen.set(it.title, { ...it, query: 'youtube-blog', source: 'YouTube Official Blog' }); }); } catch (e) {}
  const out = [...seen.values()].sort((a, b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync(path.join(ROOT, 'data/news-inbox.json'), JSON.stringify({ fetchedAt: new Date().toISOString(), items: out }, null, 1) + '\n');
  console.log(`뉴스 ${out.length}건 → data/news-inbox.json`);
})();
