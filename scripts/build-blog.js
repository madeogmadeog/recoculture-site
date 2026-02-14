#!/usr/bin/env node
/**
 * 블로그 빌드: content/blog/*.md → data/blog-posts.json + blog/*.html
 * 실행: npm run build:blog
 */
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const CONTENT_DIR = path.join(__dirname, '../content/blog');
const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_DIR = path.join(__dirname, '../blog');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) meta[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  });
  return { meta, body: match[2].trim() };
}

function build() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('content/blog 폴더 없음');
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') && !f.startsWith('._'));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);
    const slug = meta.slug || file.replace(/\.md$/, '');
    const html = marked.parse(body);
    posts.push({
      title: meta.title || '제목 없음',
      date: meta.date || '',
      slug,
      excerpt: meta.excerpt || '',
    });
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const postHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta.title || '블로그'} | RECOCULTURE</title>
<meta name="description" content="${(meta.excerpt || '').replace(/"/g, '&quot;')}">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<nav class="nav">
  <a href="/" class="nav__logo">REC<span class="rc-o">O</span>CULTURE</a>
  <ul class="nav__links">
    <li><a href="/" class="nav__link">Home</a></li>
    <li><a href="/portfolio.html" class="nav__link">Portfolio</a></li>
    <li><a href="/services.html" class="nav__link">Services</a></li>
    <li><a href="/careers.html" class="nav__link">Careers</a></li>
    <li><a href="/blog.html" class="nav__link nav__link--active">Blog</a></li>
    <li><a href="/services.html#contact" class="nav__cta">무료 상담</a></li>
  </ul>
  <div class="nav__hamburger" onclick="document.querySelector('.nav__mobile-menu').classList.toggle('is-open')">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="nav__mobile-menu">
  <a href="/">Home</a>
  <a href="/portfolio.html">Portfolio</a>
  <a href="/services.html">Services</a>
  <a href="/careers.html">Careers</a>
  <a href="/blog.html" class="nav__link--active">Blog</a>
  <a href="/services.html#contact">무료 상담</a>
</div>
<div style="height: 72px;"></div>
<article class="blog-post">
  <div class="blog-post__inner">
    <h1 class="blog-post__title">${meta.title || '제목 없음'}</h1>
    <time class="blog-post__date">${meta.date || ''}</time>
    <div class="blog-post__body">${html}</div>
    <a href="/blog.html" class="btn btn--outline" style="margin-top: 32px;">← 목록으로</a>
  </div>
</article>
<footer class="footer">
  <div class="footer__top">
    <div>
      <div class="footer__logo">REC<span class="rc-o">O</span>CULTURE</div>
      <p class="footer__tagline">전문직 유튜브 미디어 브랜딩</p>
    </div>
    <div class="footer__links">
      <div class="footer__col">
        <div class="footer__col-title">Menu</div>
        <a href="/">Home</a>
        <a href="/portfolio.html">Portfolio</a>
        <a href="/services.html">Services</a>
        <a href="/careers.html">Careers</a>
        <a href="/blog.html">Blog</a>
      </div>
      <div class="footer__col">
        <div class="footer__col-title">Contact</div>
        <a href="mailto:og@recoculture.com">og@recoculture.com</a>
        <a href="tel:01027495144">010-2749-5144</a>
        <a href="http://pf.kakao.com/_PxfyFn/chat">KakaoTalk →</a>
      </div>
    </div>
  </div>
  <div class="footer__bottom">
    <p class="footer__copy">© 2025 RECOCULTURE CO., LTD.</p>
  </div>
</footer>
</body>
</html>`;
    fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.html`), postHtml);
  }

  posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, 'blog-posts.json'), JSON.stringify(posts, null, 2));

  // sitemap.xml 재생성 (블로그 URL 포함)
  const base = 'https://recoculture.com';
  const blogUrls = posts.map(p => `  <url>
    <loc>${base}/blog/${p.slug}.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${base}/portfolio.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${base}/services.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${base}/careers.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${base}/blog.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${blogUrls}
</urlset>`;
  fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemap);
  console.log(`블로그 빌드 완료: ${posts.length}개 포스트`);
}

build();
