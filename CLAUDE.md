# 홈페이지 (CLAUDE.md) — recoculture.com 실서비스

## 실행 위치와 결과물

실제 실행·개발·Git 작업 위치는 `~/Code/3-마케팅/홈페이지/_프로그램/`다. 이 문서의 내부 상대 경로는 이 위치 기준이며, 상위 폴더의 지침 연결을 읽었더라도 명령은 `_프로그램` 안에서 실행한다. 대표가 확인하는 결과물은 `../칼럼원고/`, `../게시된칼럼/`, `../웹사이트/`다. 결과물 연결은 원본의 복사본이 아니며 연결 안에서 수정하면 원본도 바뀐다. 새 코드·로그·작업용 자료를 상위 결과물 영역에 만들지 않는다. 전사 폴더 규칙의 정본은 `~/Code/CLAUDE.md`다.

이 폴더에서 세션을 열면 이 파일을 먼저 읽고, 상세는 `README.md`를 본다. 대표(진성욱)는 코딩을 하지 않으므로 **모든 조작 안내는 컬럼 스튜디오 UI 기준**으로 한다.

## 현재 상태 (2026-09-05)
- 2026-09 리빌드 버전 라이브. 페이지: `index.html`(메인) · `work.html`(함께 만들어갈 영향력) · `careers.html` · `columns.html` + `columns/*.html`(컬럼).
- `hospital-youtube.html` (2026-09-16): '병원유튜브제작' 검색 랜딩. title·H1·본문에 검색어를 앞세운 SEO 전용 페이지. 내비·푸터 링크는 `index.html` 셸에서 컬럼 빌드가 복사하므로 내비를 바꾸면 `node scripts/build-columns.js` 로 컬럼도 재빌드. 사이트맵 고정 URL 은 `build-columns.js` 의 `fixed` 배열. 진료과별 하위 페이지 `dermatology-youtube.html`(피부과·성형외과)·`dental-youtube.html`(치과)이 있다. 후기·추천사는 `#reviews[data-industry]`·`#voices-grid[data-role]`로 진료과별 필터(main.js). 새 진료과를 추가하면 이 둘을 복제하고 `build-columns.js` `fixed`에 URL을 넣는다. 컬럼 하단 CTA는 hospital-youtube.html로 간다.
- 배포: `git push origin main` → GitHub Actions(`.github/workflows/deploy.yml`) → GitHub Pages. 푸시는 `git -c credential.helper='!gh auth git-credential' push`. **실행이 두 번 돈다** — `Deploy`(gh-pages 브랜치로 복사)가 성공해도 뒤이은 `pages build and deployment` 가 끝나기 전엔 새 파일이 404 다(2026-10-09). 기다림은 `gh run watch <id> --interval 30`, 실서비스 확인은 끝난 뒤 1회.
- 브랜드 필름(2026-10-09): 첫 화면 「브랜드 필름 0:33」 버튼(`[data-film]`) → 전체 화면 재생기(main.js 맨 끝). 파일은 누를 때만 받는다 — 폰·데이터 절약 `assets/film/reco-film-720.mp4`, 그 외 1080p. 원본·인코딩은 나스 `4.마케팅관리/2.마케팅/회사소개영상/`. 영상 저장 금지 훅이 이 `assets/film/` 만 **10MB 이하 cp** 로 열어 둔다(대표 승인) — 새 영상은 나스에서 웹용으로 줄인 뒤 cp 로 넣는다.
- 채널 데이터는 매일 자동 갱신(`refresh-channels.yml`, secret `YOUTUBE_API_KEY`).
- 컬럼 2편 발행됨. 컬럼 파이프라인·스튜디오 완성.
- **성능 (2026-09-25)**: Anthropic "claude.ai 3배 빠르게" 방식(측정→수정→재측정→상한 고정)을 적용한 1차. 글꼴 CSS 는 `assets/fonts/pretendard.css`(jsDelivr 사본, 글꼴 파일은 계속 jsDelivr)를 `rel=preload` 로 비동기 로드해 화면 그리기를 막지 않고, `cdn.jsdelivr.net`·`cdnjs`·`i.ytimg.com` 은 preconnect. 마퀴·배경 썸네일은 유튜브 WebP(`/vi_webp/…`, 같은 화질에 절반 용량) 우선 + jpg 대체, 배경 레인 70장은 채널 섹션이 가까워질 때만 받는다(main.js). 로컬 실측(devtools 스로틀 3회 중앙값): 전송량 3.7→2.1MB, 이미지 3.0→1.3MB, LCP 6.97→6.44s, FCP 1.56→1.50s. **남은 병목**: LCP 가 JS 로 그리는 마퀴 첫 썸네일이라 스크립트 체인 뒤에 온다 — 첫 타일을 HTML 에 미리 넣는 것(refresh-channels 빌드 단계)이 다음 레버. 히어로 문장이 GSAP 로 투명→표시되며 FCP 뒤 다시 사라졌다 나타나는 것도 남은 과제(디자인 결정 필요). 재측정은 `scripts/perf-server.py` 머리말의 명령으로, 배포 후엔 실서비스 1회만.

## 컬럼 시스템 (핵심)
- 원고: `content/columns/YYYY-MM-DD-slug.md` (frontmatter `status: draft|published`, draft는 빌드 제외)
- 빌드: `node scripts/build-columns.js` → `columns/`, `columns.html`, `data/columns.json`, `sitemap.xml`. 본문 그림 카드는 `:::flow|steps|compare|stat|check|quote` 블록.
- 자동 생성: `scripts/write-column.sh [--draft] [--topic "…"]` — 뉴스 수집 → `claude -p`가 `docs/column/`의 VOICE.md(문체·주장·가드레일) + BLOG-SEO.md(자청식 검색 최적화 규칙) + TOPICS.md(주제 은행) + PROMPT.md(지시문)로 작성 → 빌드 → 커밋(·푸시).
  - 커밋·받기·올리기는 `scripts/publish-column.sh <컬럼.md> [--no-push]` (2026-10-09, 감독관 요청): 그 컬럼 파일과 빌드 결과 경로만 커밋하고(다른 세션 수정·스테이징은 안 건드림), 받기는 `rebase --autostash`, 겹친 곳이 빌드 결과(목록·사이트맵·사용한 뉴스)뿐이면 다시 빌드해서 스스로 푼다. 못 올리면 대표에게 쉬운 말 한 줄(오피스 소식+할 일+맥 알림)을 보내고 원문 오류는 로그에만, **exit 0** — 자동화 감시가 원문 경고를 또 보내지 않게. 이유: 다른 세션의 미커밋 수정 때문에 `git pull --rebase` 가 멈춰 10/5·10/8 두 번 "종료 코드 128" 만 갔다. 시험은 `COLUMN_NOTIFY_DRY=1` 로 저장소 사본에서
- 자동 실행: launchd `com.recoculture.column` (스튜디오에서 요일·시간·초안/발행 설정).
- **컬럼 스튜디오**: `node scripts/studio/server.js` → http://localhost:3300. 목록·편집·미리보기·발행·새 초안·자동 실행·가이드 편집. 상시 실행 등록은 `scripts/studio/install.command` 더블클릭 (launchd `com.recoculture.column-studio`).
- 로그: `.omc/logs/column-*.log`

## 규칙
- 실서비스 소스. 삭제·대규모 변경 전 대표 확인. 변경 후 로컬(`python3 scripts/dev-server.py 8080`)에서 확인하고 커밋.
- 저장소는 **public**. VOICE.md·TOPICS.md·컬럼 원고에 클라이언트 실명·계약 조건·매출 수치 금지. 병원명은 ○○의원/○○치과로 마스킹.
- 컬럼은 대표 이름으로 나간다. 사례 에피소드를 지어내지 않는다(VOICE.md §7). 숫자는 VOICE.md §8 범위만.
- **발행 전 게이트 (2026-09-13 신설)**: `node scripts/gate-column.js <컬럼.md>` — G1 클라이언트 실명
  (registry.json 정본에서 읽음) · G2 보장·의료광고 심의 표현 · G3 AI 언급 · G4 §8 밖 수치(경고) ·
  G5 frontmatter. **exit 1 = 발행 금지.** `write-column.sh` 가 빌드 전에 부르고, FAIL 이면
  `status` 를 draft 로 강등하고 push 를 생략한 뒤 맥 알림을 띄운다.
  그전까지 이 경로는 `claude -p` 가 쓴 글을 검사 없이 public 저장소 main 에 바로 push 했다 —
  기획제작이 regex 로 막는 바로 그 위험(실명·가격·보장)이 0겹이었다.
  따옴표 안 인용("무조건 잘 됩니다"를 걸러라 같은 비판)은 경고로 낮춰 오탐을 막는다.
  회귀 픽스처는 `scripts/fixtures/bad-column.md` (위반 8건 검출 — 2026-09-16 자사 금액 노출 추가). 규칙을 고치면 발행된 컬럼
  전부에 다시 돌려 PASS 인지 본다 — 통과작을 깨는 규칙은 좁힌다.
- 문체를 바꾸려면 VOICE.md만 고친다. 자청 방법론 원자료(영상 121편·네이버 글 59편)는 세션 스크래치에만 있었고 정리본이 BLOG-SEO.md다.
- 대표가 ~/Library/LaunchAgents 쓰기·launchctl은 직접 해야 할 수 있다(에이전트 권한 분류기가 막음). 스튜디오 UI의 버튼은 대표가 누르면 된다.
- 세션 시작 시 `git status --short --branch`와 `curl -s localhost:3300/api/columns`로 현재 상태를 먼저 본다.
