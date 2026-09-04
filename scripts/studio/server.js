#!/usr/bin/env node
/**
 * 컬럼 스튜디오 — 코딩 없이 컬럼을 보고·고치고·발행하는 로컬 UI
 * 실행: node scripts/studio/server.js  → http://localhost:3300
 * 상시 실행: scripts/launchd/com.recoculture.column-studio.plist (scripts/studio/install.command 더블클릭)
 * 의존성 없음. 저장소 파일을 직접 읽고 쓰며, 발행은 git commit + push.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const PORT = Number(process.env.PORT) || 3300;
const builder = require(path.join(ROOT, 'scripts/build-columns.js'));
const COLS = path.join(ROOT, 'content/columns');
const DOCS = { voice: 'docs/column/VOICE.md', topics: 'docs/column/TOPICS.md', seo: 'docs/column/BLOG-SEO.md', prompt: 'docs/column/PROMPT.md' };
const PLIST_SRC = path.join(ROOT, 'scripts/launchd/com.recoculture.column.plist');
const PLIST_DST = path.join(os.homedir(), 'Library/LaunchAgents/com.recoculture.column.plist');
const NODE_BIN = path.dirname(process.execPath);
const ENV = { ...process.env, PATH: `${NODE_BIN}:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}` };
delete ENV.CLAUDECODE; delete ENV.CLAUDE_CODE_ENTRYPOINT;

// ── 유틸
const readJSON = (rel, def) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')); } catch { return def; } };
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'Content-Type': type + '; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); };
const readBody = req => new Promise(r => { let d = ''; req.on('data', c => d += c); req.on('end', () => { try { r(d ? JSON.parse(d) : {}); } catch { r({}); } }); });
const safeName = n => /^[\w.\-가-힣]+\.md$/.test(n) && !n.includes('..');
const git = (...args) => execFileSync('git', ['-c', 'core.quotepath=false', ...args], { cwd: ROOT, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const gitPush = () => execFileSync('git', ['-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential', 'push', '-q', 'origin', 'main'], { cwd: ROOT, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

function listColumns() {
  if (!fs.existsSync(COLS)) return [];
  return fs.readdirSync(COLS).filter(f => f.endsWith('.md') && !f.startsWith('._')).map(f => {
    const raw = fs.readFileSync(path.join(COLS, f), 'utf8'); const { meta, body } = builder.fm(raw);
    return { file: f, title: meta.title || f, date: meta.date || f.slice(0, 10), slug: meta.slug || f.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''), status: meta.status || 'published', excerpt: meta.excerpt || '', tags: meta.tags || '', source_title: meta.source_title || '', source_url: meta.source_url || '', chars: body.replace(/\s+/g, '').length, mtime: fs.statSync(path.join(COLS, f)).mtimeMs };
  }).sort((a, b) => b.date.localeCompare(a.date) || b.mtime - a.mtime);
}
function composeMd(meta, body) {
  const keys = ['title', 'date', 'slug', 'excerpt', 'tags', 'source_title', 'source_url', 'status'];
  return '---\n' + keys.map(k => `${k}: ${(meta[k] ?? '').toString().replace(/\r?\n/g, ' ').trim()}`).join('\n') + '\n---\n\n' + body.replace(/\r/g, '').trim() + '\n';
}
function rebuildAndPublish(message) {
  builder.build({ drafts: false });
  git('add', '-A', 'content/columns', 'columns', 'columns.html', 'data/columns.json', 'sitemap.xml', 'data/news-used.json');
  let committed = true;
  try { git('commit', '-q', '-m', message + '\n\nvia 컬럼 스튜디오'); } catch { committed = false; }
  let pushed = false, pushErr = '';
  if (committed) { try { gitPush(); pushed = true; } catch (e) { pushErr = String(e.stderr || e.message).slice(0, 400); } }
  return { committed, pushed, pushErr };
}

// ── 작업(새 컬럼 생성) 실행 상태
const jobs = new Map();
function startJob(args) {
  const id = Date.now().toString(36); const job = { id, log: '', done: false, code: null, started: new Date().toISOString(), newFile: '' };
  jobs.set(id, job);
  const before = new Set(fs.existsSync(COLS) ? fs.readdirSync(COLS) : []);
  const child = spawn('/bin/zsh', [path.join(ROOT, 'scripts/write-column.sh'), ...args], { cwd: ROOT, env: ENV });
  child.stdout.on('data', d => job.log += d); child.stderr.on('data', d => job.log += d);
  child.on('close', code => { job.done = true; job.code = code; const after = fs.existsSync(COLS) ? fs.readdirSync(COLS) : []; job.newFile = after.find(f => !before.has(f) && f.endsWith('.md')) || ''; });
  return job;
}

// ── 스케줄(launchd)
function scheduleStatus() {
  const installed = fs.existsSync(PLIST_DST);
  let loaded = false; try { loaded = execFileSync('launchctl', ['list'], { encoding: 'utf8' }).includes('com.recoculture.column'); } catch {}
  let mode = 'publish', days = [1, 4], hour = 9, minute = 30;
  if (installed) {
    const x = fs.readFileSync(PLIST_DST, 'utf8'); if (x.includes('--draft')) mode = 'draft';
    days = [...x.matchAll(/<key>Weekday<\/key><integer>(\d)<\/integer>/g)].map(m => Number(m[1])); const h = x.match(/<key>Hour<\/key><integer>(\d+)/); const mi = x.match(/<key>Minute<\/key><integer>(\d+)/); if (h) hour = Number(h[1]); if (mi) minute = Number(mi[1]);
    if (!days.length) days = [1, 4];
  }
  return { installed, loaded, mode, days, hour, minute, plist: PLIST_DST };
}
function writePlist({ mode, days, hour, minute }) {
  const script = path.join(ROOT, 'scripts/write-column.sh') + (mode === 'draft' ? ' --draft' : '');
  const cal = days.map(d => `    <dict><key>Weekday</key><integer>${d}</integer><key>Hour</key><integer>${hour}</integer><key>Minute</key><integer>${minute}</integer></dict>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.recoculture.column</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>-lc</string>
    <string>${script}</string>
  </array>
  <key>StartCalendarInterval</key>
  <array>
${cal}
  </array>
  <key>StandardOutPath</key><string>${ROOT}/.omc/logs/column-launchd.out</string>
  <key>StandardErrorPath</key><string>${ROOT}/.omc/logs/column-launchd.err</string>
  <key>RunAtLoad</key><false/>
</dict>
</plist>
`;
  fs.mkdirSync(path.dirname(PLIST_DST), { recursive: true }); fs.writeFileSync(PLIST_DST, xml); fs.writeFileSync(PLIST_SRC, xml);
}
function setSchedule({ enabled, mode, days, hour, minute }) {
  try { execFileSync('launchctl', ['unload', PLIST_DST], { stdio: 'ignore' }); } catch {}
  if (!enabled) { return scheduleStatus(); }
  writePlist({ mode: mode === 'draft' ? 'draft' : 'publish', days: (days && days.length ? days : [1, 4]).map(Number), hour: Number(hour ?? 9), minute: Number(minute ?? 30) });
  execFileSync('launchctl', ['load', PLIST_DST], { stdio: 'ignore' });
  return scheduleStatus();
}

// ── 미리보기 HTML (사이트 CSS 그대로)
function previewHtml(meta, body) {
  const html = builder.md(body); const date = (meta.date || '').replace(/-/g, '.');
  const tags = (meta.tags || '').split(',').map(s => s.trim()).filter(Boolean);
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/site/styles.css"><link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><style>body{background:#fff}.post{padding:36px 0 80px}[data-reveal]{opacity:1!important;transform:none!important}</style></head><body><main><article class="post"><div class="wrap post__wrap"><div class="post__head"><div class="eyebrow">Column</div><h1 class="post__title">${esc(meta.title)}</h1><div class="post__meta"><span>진성욱 · 레코컬쳐 대표</span><span>${date}</span>${tags.map(t => `<span class="post__tag">${esc(t)}</span>`).join('')}</div>${meta.source_url ? `<div class="post__source">이 글이 다룬 뉴스: <a href="${esc(meta.source_url)}" target="_blank">${esc(meta.source_title || meta.source_url)}</a></div>` : ''}</div><div class="post__body">${html}</div></div></article></main></body></html>`;
}

// ── 라우팅
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp', '.xml': 'application/xml' };
function serveStatic(res, base, rel) {
  const p = path.normalize(path.join(base, rel)); if (!p.startsWith(base) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return send(res, 404, 'not found', 'text/plain');
  res.writeHead(200, { 'Content-Type': (MIME[path.extname(p)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-store' }); fs.createReadStream(p).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x'); const p = url.pathname; const m = req.method;
  try {
    if (p === '/' || p === '/index.html') return serveStatic(res, __dirname, 'index.html');
    if (p.startsWith('/site/')) return serveStatic(res, ROOT, decodeURIComponent(p.slice(6)));

    if (p === '/api/columns' && m === 'GET') return send(res, 200, listColumns());
    if (p.startsWith('/api/column/')) {
      const parts = p.split('/'); const name = decodeURIComponent(parts[3]); const action = parts[4] || '';
      if (!safeName(name)) return send(res, 400, { error: 'bad name' });
      const fp = path.join(COLS, name);
      if (m === 'GET' && !action) { const { meta, body } = builder.fm(fs.readFileSync(fp, 'utf8')); return send(res, 200, { file: name, meta, body }); }
      if (m === 'PUT' && !action) { const { meta, body } = await readBody(req); fs.writeFileSync(fp, composeMd(meta, body)); builder.build({ drafts: true }); return send(res, 200, { ok: true }); }
      if (m === 'POST' && (action === 'publish' || action === 'unpublish')) {
        const { meta, body } = builder.fm(fs.readFileSync(fp, 'utf8')); meta.status = action === 'publish' ? 'published' : 'draft'; fs.writeFileSync(fp, composeMd(meta, body));
        const r = rebuildAndPublish(`column: ${action === 'publish' ? '발행' : '내림'} — ${meta.title}`); return send(res, 200, { ok: true, ...r });
      }
      if (m === 'DELETE') { const { meta } = builder.fm(fs.readFileSync(fp, 'utf8')); fs.unlinkSync(fp); const r = rebuildAndPublish(`column: 삭제 — ${meta.title}`); return send(res, 200, { ok: true, ...r }); }
      if (m === 'POST' && action === 'preview') { const { meta, body } = await readBody(req); return send(res, 200, previewHtml(meta, body), 'text/html'); }
    }
    if (p === '/api/preview' && m === 'POST') { const { meta, body } = await readBody(req); return send(res, 200, previewHtml(meta || {}, body || ''), 'text/html'); }

    if (p === '/api/generate' && m === 'POST') {
      if ([...jobs.values()].some(j => !j.done)) return send(res, 409, { error: '이미 생성 중입니다' });
      const { topic } = await readBody(req); const args = ['--draft']; if (topic && topic.trim()) args.push('--topic', topic.trim());
      const job = startJob(args); return send(res, 200, { id: job.id });
    }
    if (p.startsWith('/api/jobs/')) { const j = jobs.get(p.split('/')[3]); return j ? send(res, 200, j) : send(res, 404, { error: 'no job' }); }
    if (p === '/api/jobs' && m === 'GET') return send(res, 200, [...jobs.values()].slice(-5));

    if (p === '/api/news' && m === 'GET') { const inbox = readJSON('data/news-inbox.json', { items: [] }); return send(res, 200, inbox); }
    if (p === '/api/news/refresh' && m === 'POST') { execFileSync('node', [path.join(ROOT, 'scripts/fetch-news.js')], { cwd: ROOT, env: ENV, stdio: 'ignore' }); return send(res, 200, readJSON('data/news-inbox.json', { items: [] })); }

    if (p.startsWith('/api/doc/')) {
      const key = p.split('/')[3]; if (!DOCS[key]) return send(res, 404, { error: 'no doc' }); const fp = path.join(ROOT, DOCS[key]);
      if (m === 'GET') return send(res, 200, { key, path: DOCS[key], text: fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '' });
      if (m === 'PUT') { const { text } = await readBody(req); fs.writeFileSync(fp, text); git('add', DOCS[key]); let committed = true; try { git('commit', '-q', '-m', `docs: ${path.basename(DOCS[key])} 수정\n\nvia 컬럼 스튜디오`); } catch { committed = false; } let pushed = false; if (committed) { try { gitPush(); pushed = true; } catch {} } return send(res, 200, { ok: true, committed, pushed }); }
    }

    if (p === '/api/schedule' && m === 'GET') return send(res, 200, scheduleStatus());
    if (p === '/api/schedule' && m === 'POST') { const b = await readBody(req); return send(res, 200, setSchedule(b)); }
    if (p === '/api/status' && m === 'GET') {
      let dirty = '', last = '', ahead = 0; try { dirty = git('status', '--porcelain', '--', 'content/columns', 'columns', 'columns.html').trim(); last = git('log', '-1', '--format=%h %s (%cr)').trim(); ahead = Number(git('rev-list', '--count', '@{u}..HEAD').trim()) || 0; } catch {}
      const logs = path.join(ROOT, '.omc/logs'); let lastLog = ''; try { const f = fs.readdirSync(logs).filter(x => x.startsWith('column-') && x.endsWith('.log')).sort().pop(); if (f) lastLog = fs.readFileSync(path.join(logs, f), 'utf8').slice(-1500); } catch {}
      return send(res, 200, { dirty, last, ahead, lastLog, site: builder.SITE });
    }
    send(res, 404, { error: 'not found' });
  } catch (e) { send(res, 500, { error: String(e.stderr || e.message || e).slice(0, 800) }); }
});
server.listen(PORT, '127.0.0.1', () => console.log(`컬럼 스튜디오 → http://localhost:${PORT}`));
