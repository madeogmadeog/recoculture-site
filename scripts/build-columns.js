#!/usr/bin/env node
/**
 * content/columns/*.md → columns/<slug>.html + columns.html + data/columns.json + sitemap.xml 갱신
 * 의존성 없음(내장 마크다운 렌더러). 실행: node scripts/build-columns.js [--drafts]  (--drafts: 로컬 확인용으로 초안 포함)
 * frontmatter: title, date(YYYY-MM-DD), slug, excerpt, tags(쉼표), source_title, source_url, status(published|draft)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'content/columns'), OUT = path.join(ROOT, 'columns');
const SITE = 'https://recoculture.com';
const DRAFTS = process.argv.includes('--drafts');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function inline(t) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
function md(src) {
  const lines = src.replace(/\r/g, '').split('\n'); const out = []; let i = 0;
  const para = []; const flush = () => { if (para.length) { out.push(`<p>${para.map(inline).join('<br>')}</p>`); para.length = 0; } };
  while (i < lines.length) {
    const l = lines[i];
    if (/^\s*$/.test(l)) { flush(); i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,4})\s+(.*)/))) { flush(); const n = m[1].length + 1; out.push(`<h${n}>${inline(m[2])}</h${n}>`); i++; continue; }
    if (/^---+\s*$/.test(l)) { flush(); out.push('<hr>'); i++; continue; }
    if ((m = l.match(/^!\[([^\]]*)\]\(([^)]+)\)/))) { flush(); out.push(`<figure><img src="${esc(m[2])}" alt="${esc(m[1])}" loading="lazy">${m[1] ? `<figcaption>${esc(m[1])}</figcaption>` : ''}</figure>`); i++; continue; }
    if (/^>\s?/.test(l)) { flush(); const q = []; while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i].replace(/^>\s?/, '')), i++; out.push(`<blockquote>${md(q.join('\n'))}</blockquote>`); continue; }
    if (/^(\s*)([-*]|\d+\.)\s+/.test(l)) {
      flush(); const ordered = /^\s*\d+\./.test(l); const items = [];
      while (i < lines.length && /^(\s*)([-*]|\d+\.)\s+/.test(lines[i])) { items.push(lines[i].replace(/^(\s*)([-*]|\d+\.)\s+/, '')); i++; }
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.map(x => `<li>${inline(x)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`); continue;
    }
    if (/^```/.test(l)) { flush(); const c = []; i++; while (i < lines.length && !/^```/.test(lines[i])) c.push(lines[i]), i++; i++; out.push(`<pre><code>${esc(c.join('\n'))}</code></pre>`); continue; }
    para.push(l.trim()); i++;
  }
  flush(); return out.join('\n');
}
function fm(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/); if (!m) return { meta: {}, body: raw };
  const meta = {}; m[1].split('\n').forEach(line => { const k = line.match(/^(\w+):\s*(.*)$/); if (k) meta[k[1]] = k[2].replace(/^["']|["']$/g, '').trim(); });
  return { meta, body: m[2].trim() };
}
const shell = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const head = shell.slice(shell.indexOf('<link rel="icon"'), shell.indexOf('<script>document.documentElement'));
const nav = shell.slice(shell.indexOf('<nav class="nav"'), shell.indexOf('</nav>') + 6).replace(/href="#(\w+)"/g, 'href="/#$1"').replace('href="/columns.html">Column</a>', 'href="/columns.html" aria-current="page">Column</a>');
const foot = shell.slice(shell.indexOf('<footer class="footer">'), shell.indexOf('</footer>') + 9);
const scripts = shell.slice(shell.indexOf('<script src="https://cdnjs'), shell.indexOf('</body>'));
const ver = (shell.match(/styles\.css\?v=(\d+)/) || [])[1] || '';
const page = ({ title, desc, url, body, ld }) => `<!DOCTYPE html>
<html lang="ko" class="no-js">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — RECOCULTURE</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/assets/og-image.png">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${url}">
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n` : ''}${head}<script>document.documentElement.classList.remove('no-js')</script>
</head>
<body>

${nav}

<main>
${body}
</main>

${foot}

${scripts}</body>
</html>
`;

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter(f => f.endsWith('.md') && !f.startsWith('._')) : [];
const posts = [];
for (const f of files) {
  const { meta, body } = fm(fs.readFileSync(path.join(SRC, f), 'utf8'));
  if (!DRAFTS && (meta.status || 'published') !== 'published') continue;
  const slug = meta.slug || f.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const date = meta.date || f.slice(0, 10);
  const tags = (meta.tags || '').split(',').map(s => s.trim()).filter(Boolean);
  const html = md(body);
  const words = body.replace(/\s+/g, '').length; const mins = Math.max(2, Math.round(words / 500));
  posts.push({ title: meta.title, date, slug, excerpt: meta.excerpt || '', tags, source_title: meta.source_title || '', source_url: meta.source_url || '', mins });
  const url = `${SITE}/columns/${slug}.html`;
  const body2 = `  <article class="post">
    <div class="wrap post__wrap">
      <div class="post__head" data-reveal>
        <div class="eyebrow">Column</div>
        <h1 class="post__title">${esc(meta.title)}</h1>
        <div class="post__meta"><span>진성욱 · 레코컬쳐 대표</span><span>${date.replace(/-/g, '.')}</span><span>${mins}분 읽기</span>${tags.map(t => `<span class="post__tag">${esc(t)}</span>`).join('')}</div>
        ${meta.source_url ? `<div class="post__source">이 글이 다룬 뉴스: <a href="${esc(meta.source_url)}" target="_blank" rel="noopener noreferrer">${esc(meta.source_title || meta.source_url)}</a></div>` : ''}
      </div>
      <div class="post__body" data-reveal>
${html}
      </div>
      <div class="post__foot" data-reveal>
        <div class="post__cta"><div><b>당신의 채널에도 적용해 볼 수 있습니다.</b><p>채널 링크와 고민을 남겨주시면 첫 미팅에서 함께 봅니다.</p></div><a class="btn btn--orange" href="/#contact">채널 문의</a></div>
        <a class="post__back" href="/columns.html">← 모든 컬럼</a>
      </div>
    </div>
  </article>`;
  fs.writeFileSync(path.join(OUT, `${slug}.html`), page({ title: meta.title, desc: meta.excerpt || meta.title, url, body: body2, ld: { '@context': 'https://schema.org', '@type': 'Article', headline: meta.title, datePublished: date, author: { '@type': 'Person', name: '진성욱', jobTitle: '대표', worksFor: { '@type': 'Organization', name: '레코컬쳐' } }, publisher: { '@type': 'Organization', name: '레코컬쳐', logo: { '@type': 'ImageObject', url: `${SITE}/assets/logo/symbol.svg` } }, description: meta.excerpt || '', mainEntityOfPage: url } }));
}
// 빌드 대상에서 빠진(초안으로 되돌린·삭제된) 글의 html 정리
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.html') && !posts.some(p => `${p.slug}.html` === f)) fs.unlinkSync(path.join(OUT, f));
posts.sort((a, b) => b.date.localeCompare(a.date));
fs.writeFileSync(path.join(ROOT, 'data/columns.json'), JSON.stringify(posts, null, 1) + '\n');

// 목록 페이지
const list = posts.map(p => `        <a class="col" href="/columns/${p.slug}.html" data-reveal>
          <div class="col__meta"><span>${p.date.replace(/-/g, '.')}</span><span>${p.mins}분</span></div>
          <h2 class="col__title">${esc(p.title)}</h2>
          <p class="col__excerpt">${esc(p.excerpt)}</p>
          <div class="col__tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </a>`).join('\n');
const indexBody = `  <section class="hero" style="padding-bottom:0">
    <div class="hero__blob" data-blob></div>
    <div class="wrap">
      <div class="eyebrow" data-hero>Column</div>
      <h1 id="h1"><span class="line"><span>꾸미지 않는</span></span><span class="line"><span>유튜브 <span class="grad">생각</span>.</span></span></h1>
      <p class="hero__sub" data-hero>전문직 유튜브를 만들고 운영하며 매주 배우는 것, 그리고 이번 주 뉴스를 우리 시각으로 읽은 것.</p>
    </div>
  </section>
  <section class="section" style="padding-top:48px">
    <div class="wrap">
      <div class="cols">
${list || '        <p class="empty">첫 컬럼을 준비 중입니다.</p>'}
      </div>
    </div>
  </section>`;
fs.writeFileSync(path.join(ROOT, 'columns.html'), page({ title: '컬럼', desc: '전문직 유튜브를 만들고 운영하며 배우는 것. 레코컬쳐 대표 진성욱의 컬럼.', url: `${SITE}/columns.html`, body: indexBody }).replace(' — RECOCULTURE</title>', ' — RECOCULTURE</title>'));

// sitemap: 기존 고정 URL 유지 + 컬럼 추가
const fixed = ['/', '/work.html', '/careers.html'];
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  fixed.map(u => `  <url><loc>${SITE}${u}</loc><changefreq>weekly</changefreq><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n') +
  `\n  <url><loc>${SITE}/columns.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n` +
  posts.map(p => `  <url><loc>${SITE}/columns/${p.slug}.html</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm);
console.log(`컬럼 ${posts.length}편 빌드 완료${DRAFTS ? ' (초안 포함 — 배포 전 --drafts 없이 다시 빌드)' : ''}`);
