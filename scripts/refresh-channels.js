#!/usr/bin/env node
/**
 * data/channels.config.json 의 채널 ID로 YouTube Data API v3 를 조회해 data/channels.json 을 갱신한다.
 *  - channels: 구독자·조회수·최신 롱폼 영상 (쇼츠 제외, 조회수 5만 이상 우선)
 *  - featured: 롱폼 10만 뷰 이상 / 쇼츠 30만 뷰 이상 (excludeFeatured 채널 제외) — 메인 마퀴용
 * 실행: YOUTUBE_API_KEY=... node scripts/refresh-channels.js
 * GitHub Actions(refresh-channels.yml)가 매일 실행해 커밋한다. 하루 쿼터 사용량 약 150 units.
 */
const fs = require('fs');
const path = require('path');

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) { console.error('YOUTUBE_API_KEY 환경변수가 없습니다.'); process.exit(1); }

const ROOT = path.join(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/channels.config.json'), 'utf8'));
const API = 'https://www.googleapis.com/youtube/v3/';
const MAX_UPLOADS = 400;        // 채널당 훑을 최대 업로드 수
const LONG_MIN_VIEWS = 100000;  // 롱폼 기준
const SHORT_MIN_VIEWS = 300000; // 쇼츠 기준
const FEATURED_CAP = 16;
const CARD_MIN_VIEWS = 50000;  // 채널 카드에 보일 최신 영상의 최소 조회수

async function get(endpoint, params) {
  const url = API + endpoint + '?' + new URLSearchParams({ ...params, key: KEY });
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(`${endpoint}: ${json.error.message}`);
  return json;
}

function seconds(iso) {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || '') || [];
  return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
}
function isShort(v) {
  const s = seconds(v.contentDetails.duration);
  return s <= 180; // 3분 이하는 쇼츠로 본다 (2024-10 이후 쇼츠 상한)
}

async function uploads(playlistId) {
  const ids = [];
  let pageToken;
  while (ids.length < MAX_UPLOADS) {
    const pl = await get('playlistItems', { part: 'contentDetails', playlistId, maxResults: 50, pageToken: pageToken || '' });
    ids.push(...pl.items.map(i => i.contentDetails.videoId));
    pageToken = pl.nextPageToken;
    if (!pageToken) break;
  }
  return ids;
}

async function videos(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 50) {
    const r = await get('videos', { part: 'contentDetails,statistics,snippet', id: ids.slice(i, i + 50).join(','), maxResults: 50 });
    out.push(...r.items);
  }
  return out;
}

async function main() {
  const ch = await get('channels', { part: 'snippet,statistics,contentDetails', id: config.map(c => c.id).join(','), maxResults: 50 });
  const byId = Object.fromEntries(ch.items.map(it => [it.id, it]));

  const channels = [];
  const longs = [], shorts = [];

  for (const c of config) {
    const it = byId[c.id];
    if (!it) { console.warn('채널 없음:', c.id, c.name); continue; }
    const st = it.statistics;
    const entry = {
      id: c.id, name: c.name, industry: c.industry, status: c.status, excludeFeatured: !!c.excludeFeatured,
      handle: it.snippet.customUrl || null,
      avatar: (it.snippet.thumbnails.medium || it.snippet.thumbnails.default).url,
      subscribers: +st.subscriberCount || 0, views: +st.viewCount || 0, videos: +st.videoCount || 0,
      lastUploadAt: null,
      latest: null,
      growth: null,
    };
    try {
      const ids = await uploads(it.contentDetails.relatedPlaylists.uploads);
      const vids = await videos(ids);
      const longs_ = vids.filter(v => !isShort(v));
      const latestLong = longs_.find(v => (+v.statistics.viewCount || 0) >= CARD_MIN_VIEWS) || longs_[0];
      if (longs_[0]) entry.lastUploadAt = longs_[0].snippet.publishedAt;
      if (latestLong) entry.latest = { id: latestLong.id, title: latestLong.snippet.title, publishedAt: latestLong.snippet.publishedAt, views: +latestLong.statistics.viewCount || 0 };
      // 성장 기록: 롱폼 기준, 오래된 순
      const asc = longs_.slice().sort((a, b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt));
      const views = v => +v.statistics.viewCount || 0;
      const firstAt = th => { const i = asc.findIndex(v => views(v) >= th); return i < 0 ? null : { n: i + 1, at: asc[i].snippet.publishedAt, id: asc[i].id, title: asc[i].snippet.title, views: views(asc[i]) }; };
      const weeks = 12, now = Date.now(), wk = new Set();
      asc.forEach(v => { const d = (now - new Date(v.snippet.publishedAt)) / 6048e5; if (d < weeks) wk.add(Math.floor(d)); });
      entry.growth = {
        firstUploadAt: asc[0] ? asc[0].snippet.publishedAt : null,
        longforms: asc.length,
        over100k: asc.filter(v => views(v) >= 100000).length,
        first100k: firstAt(100000),
        first1m: firstAt(1000000),
        weeksActive12: wk.size,
        likes: longs_.reduce((t, v) => t + (+v.statistics.likeCount || 0), 0),
        comments: longs_.reduce((t, v) => t + (+v.statistics.commentCount || 0), 0),
        top: longs_.slice().sort((a, b) => views(b) - views(a)).slice(0, 3).map(v => ({ id: v.id, title: v.snippet.title, views: views(v), publishedAt: v.snippet.publishedAt })),
        series: asc.map(v => ({ id: v.id, t: v.snippet.title, at: v.snippet.publishedAt.slice(0, 10), v: views(v) })),
      };
      if (!c.excludeFeatured) {
        for (const v of vids) {
          const views = +v.statistics.viewCount || 0;
          const rec = { id: v.id, title: v.snippet.title, channel: c.name, views, publishedAt: v.snippet.publishedAt };
          if (isShort(v)) { if (views >= SHORT_MIN_VIEWS) shorts.push(rec); }
          else if (views >= LONG_MIN_VIEWS) longs.push(rec);
        }
      }
      console.log(`${c.name}: 업로드 ${vids.length}편`);
    } catch (e) { console.warn('영상 조회 실패:', c.name, e.message); }
    channels.push(entry);
  }

  // ── 일 단위 스냅샷 → 초당 증가율
  const HIST = path.join(ROOT, 'data/channels-history.json');
  let hist = {};
  try { hist = JSON.parse(fs.readFileSync(HIST, 'utf8')); } catch (e) {}
  const nowIso = new Date().toISOString(), today = nowIso.slice(0, 10);
  const snap = {};
  channels.forEach(c => { snap[c.id] = { views: c.views, subscribers: c.subscribers, likes: c.growth ? c.growth.likes : 0, comments: c.growth ? c.growth.comments : 0 }; });
  hist[today] = { at: nowIso, channels: snap };
  const days = Object.keys(hist).sort().slice(-30);
  hist = Object.fromEntries(days.map(d => [d, hist[d]]));
  fs.writeFileSync(HIST, JSON.stringify(hist) + '\n');
  const prevDay = days.filter(d => d !== today).pop();
  const prev = prevDay ? hist[prevDay] : null;
  const secs = prev ? Math.max(3600, (new Date(nowIso) - new Date(prev.at)) / 1000) : null;
  channels.forEach(c => {
    const age = c.growth && c.growth.firstUploadAt ? Math.max(86400, (Date.now() - new Date(c.growth.firstUploadAt)) / 1000) : 86400 * 365;
    const p = prev && prev.channels[c.id];
    const rate = k => { const cur = snap[c.id][k]; if (p && typeof p[k] === 'number') return Math.max(0, (cur - p[k]) / secs); return cur / age; };
    c.rate = { views: rate('views'), subscribers: rate('subscribers'), likes: rate('likes'), comments: rate('comments'), basis: p ? `daily:${prevDay}` : 'lifetime' };
  });
  const byViews = (a, b) => b.views - a.views;
  const active = channels.filter(c => c.status === 'active');
  const out = {
    updatedAt: new Date().toISOString(),
    rate: {
      views: channels.reduce((s, c) => s + c.rate.views, 0),
      subscribers: channels.reduce((s, c) => s + c.rate.subscribers, 0),
      basis: channels[0] && channels[0].rate.basis,
    },
    totals: {
      channels: channels.length,
      activeChannels: active.length,
      subscribers: channels.reduce((s, c) => s + c.subscribers, 0),
      views: channels.reduce((s, c) => s + c.views, 0),
      videos: channels.reduce((s, c) => s + c.videos, 0),
    },
    featured: {
      long: longs.sort(byViews).slice(0, FEATURED_CAP),
      shorts: shorts.sort(byViews).slice(0, FEATURED_CAP),
    },
    channels,
  };
  fs.writeFileSync(path.join(ROOT, 'data/channels.json'), JSON.stringify(out, null, 2) + '\n');
  console.log(`갱신 완료: 채널 ${channels.length}개, 롱폼 ${longs.length}편(≥${LONG_MIN_VIEWS}), 쇼츠 ${shorts.length}편(≥${SHORT_MIN_VIEWS})`);
}

main().catch(e => { console.error(e); process.exit(1); });
