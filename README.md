# 레코컬쳐 홈페이지

전문직 유튜브 미디어 브랜딩 레코컬쳐 공식 홈페이지 — https://recoculture.com

- 저장소: madeogmadeog/recoculture-site
- 정적 사이트 (HTML/CSS/JS), GitHub Pages 배포, CNAME `recoculture.com`
- **실서비스 소스. 삭제·대규모 변경 전 대표 확인.**

## 현재 상태 (2026-09)

2026-09 리빌드 버전이 라이브다. 옛 사이트(다크 테마 5페이지)의 카피·요금·채용·채널 설정은 `docs/SITE-CONTENT.md`에 보존했고, 소스는 git 히스토리(`git show ad41311:index.html`)로 복구할 수 있다.

## 데이터 자동 갱신

- `data/channels.json`: 채널 통계·최신 영상·성장 지표. `.github/workflows/refresh-channels.yml`이 매일 09:00 KST에 `scripts/refresh-channels.js`를 돌려 갱신·커밋한다.
- 동작하려면 GitHub 저장소 Settings → Secrets에 `YOUTUBE_API_KEY`를 넣어야 한다. 로컬 실행: `YOUTUBE_API_KEY=... node scripts/refresh-channels.js`
- `data/channels-history.json`: 일별 스냅샷 30일. 어제 대비 증가분으로 화면의 실시간 증가 속도를 계산한다.
- `data/channels.config.json`: 채널 ID·분야·상태. 채널 추가는 여기에.
- `data/influence.json`: work.html 키워드 맵·인용·후기 매칭 (수동 편집).
- `data/reviews.json`: 메인 후기 카드 (수동 편집).

## 파일 구조

```
├── index.html        # 메인
├── work.html         # 함께 만들어갈 영향력 (키워드 맵·성장 기록)
├── careers.html      # 채용
├── styles.css        # 공통 스타일 (디자인 토큰은 :root)
├── main.js           # 인터랙션(GSAP·Lenis)·데이터 렌더
├── assets/logo/      # 심볼·로고타입·시그니처 SVG
├── assets/           # favicon, og-image
├── data/             # channels.json 등 (위 참조)
├── scripts/          # refresh-channels.js, dev-server.py
├── docs/             # 옛 사이트 정보 보존 (배포 제외)
├── content/blog/     # 옛 블로그 마크다운 원본 (배포 제외)
└── .github/workflows/  deploy.yml, refresh-channels.yml
```

## 자주 하는 수정

| 대상 | 파일 |
|---|---|
| 카피 전반 | `index.html` (섹션별 텍스트가 그대로 들어 있음) |
| 연락처·폼 수신 주소 | `index.html` Contact 섹션, `main.js`의 formsubmit 주소 |
| 문의 폼 (3단계) | `index.html` `#lead-form`, `main.js` 리드 폼 블록 — Supabase `inquiries` 저장 + FormSubmit 메일 이중 발송, 접수 건은 오피스 상황판에서 확인 |
| 통계 고정값 (1.5억 등) | `index.html` `.stat__n[data-n]` |
| 채널 추가·제외 | `data/channels.config.json` → 스크립트 실행 |
| 후기 카드 | `data/reviews.json` |
| work 키워드·인용 | `data/influence.json` |
| 채용 공고 | `careers.html` |
| 색·폰트 | `styles.css` `:root` |

## 컬럼 스튜디오 (코딩 없이 쓰는 UI)

- `scripts/studio/install.command` 더블클릭 → http://localhost:3300 (맥 켜질 때 자동 시작, launchd `com.recoculture.column-studio`)
- 할 수 있는 것: 컬럼 목록·수정·실시간 미리보기·그림 카드 삽입, 사이트 발행/내리기/삭제(커밋·푸시 자동), 주제 입력 또는 뉴스 선택으로 새 초안 생성, 자동 실행 요일·시간·초안/발행 설정, 문체·주제 가이드 편집
- 수동 실행: `node scripts/studio/server.js`

## 컬럼 자동 발행

- 원고: `content/columns/YYYY-MM-DD-slug.md` (frontmatter: title, date, slug, excerpt, tags, source_title, source_url, status)
- 빌드: `node scripts/build-columns.js` → `columns/*.html`, `columns.html`, `data/columns.json`, `sitemap.xml`
- 자동 생성: `scripts/write-column.sh` — 뉴스 수집(`scripts/fetch-news.js`) → `claude -p`가 `docs/column/VOICE.md`(대표 문체·주장·가드레일)와 `PROMPT.md`로 컬럼 작성 → 빌드 → 커밋·푸시
  - 초안만: `scripts/write-column.sh --draft` (status: draft로 저장·커밋, 푸시 없음). 초안은 빌드에서 제외되므로 확인하려면 `node scripts/build-columns.js --drafts` 후 로컬에서 열고, 발행하려면 frontmatter `status: published`로 바꾼 뒤 `node scripts/build-columns.js && git add -A && git commit && git push`
  - 주제 지정: `scripts/write-column.sh --topic "고정댓글 활용법"`
- 스케줄: `scripts/launchd/com.recoculture.column.plist` (월·목 09:30). 설치: `cp scripts/launchd/com.recoculture.column.plist ~/Library/LaunchAgents/ && launchctl load ~/Library/LaunchAgents/com.recoculture.column.plist`. 해제: `launchctl unload ...`
- 로그: `.omc/logs/column-*.log`
- 대표 문체를 바꾸려면 `docs/column/VOICE.md`를 고친다. 이 파일이 곧 "나의 시각"이다. 뉴스가 없을 때 고르는 주제 목록은 `docs/column/TOPICS.md`.
- 저장소가 공개(public)이므로 VOICE.md·TOPICS.md·컬럼 원고에 클라이언트 실명·계약 조건을 쓰지 않는다.

## 로컬 확인

```bash
python3 scripts/dev-server.py 8080   # http://localhost:8080 (캐시 없음)
```

## 배포

`main`에 push하면 GitHub Actions가 자동 배포한다. 빌드 단계 없음.
