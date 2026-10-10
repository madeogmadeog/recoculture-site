# 홈페이지 (CLAUDE.md) — recoculture.com 실서비스

## 실행 위치와 결과물

실제 실행·개발·Git 작업 위치는 `~/Code/3-마케팅/홈페이지/_프로그램/`다. 이 문서의 내부 상대 경로는 이 위치 기준이며, 상위 폴더의 지침 연결을 읽었더라도 명령은 `_프로그램` 안에서 실행한다. 대표가 확인하는 결과물은 `../칼럼원고/`, `../게시된칼럼/`, `../웹사이트/`다. 결과물 연결은 원본의 복사본이 아니며 연결 안에서 수정하면 원본도 바뀐다. 새 코드·로그·작업용 자료를 상위 결과물 영역에 만들지 않는다. 전사 폴더 규칙의 정본은 `~/Code/CLAUDE.md`다.

이 폴더에서 세션을 열면 이 파일을 먼저 읽고, 상세는 `README.md`를 본다. 대표(진성욱)는 코딩을 하지 않으므로 조작 안내는 화면·결과 기준으로 한다.

## 현재 상태 (2026-09-05)
- 2026-09 리빌드 버전 라이브. 페이지: `index.html`(메인) · `work.html`(함께 만들어갈 영향력) · `careers.html` · `columns.html` + `columns/*.html`(컬럼).
- `hospital-youtube.html` (2026-09-16): '병원유튜브제작' 검색 랜딩. title·H1·본문에 검색어를 앞세운 SEO 전용 페이지. 내비·푸터 링크는 `index.html` 셸에서 컬럼 빌드가 복사하므로 내비를 바꾸면 `node scripts/build-columns.js` 로 컬럼도 재빌드. 사이트맵 고정 URL 은 `build-columns.js` 의 `fixed` 배열. 진료과별 하위 페이지 `dermatology-youtube.html`(피부과·성형외과)·`dental-youtube.html`(치과)이 있다. 후기·추천사는 `#reviews[data-industry]`·`#voices-grid[data-role]`로 진료과별 필터(main.js). 새 진료과를 추가하면 이 둘을 복제하고 `build-columns.js` `fixed`에 URL을 넣는다. 컬럼 하단 CTA는 hospital-youtube.html로 간다.
- 배포: `git push origin main` → GitHub Actions(`.github/workflows/deploy.yml`) → GitHub Pages. 푸시는 `git -c credential.helper='!gh auth git-credential' push`. **실행이 두 번 돈다** — `Deploy`(gh-pages 브랜치로 복사)가 성공해도 뒤이은 `pages build and deployment` 가 끝나기 전엔 새 파일이 404 다(2026-10-09). 기다림은 `gh run watch <id> --interval 30`, 실서비스 확인은 끝난 뒤 1회.
- 브랜드 필름(2026-10-09): 첫 화면 「브랜드 필름 0:33」 버튼(`[data-film]`) → 전체 화면 재생기(main.js 맨 끝). 파일은 누를 때만 받는다 — 폰·데이터 절약 `assets/film/reco-film-720.mp4`, 그 외 1080p. 원본·인코딩은 나스 `4.마케팅관리/2.마케팅/회사소개영상/`. 영상 저장 금지 훅이 이 `assets/film/` 만 **10MB 이하 cp** 로 열어 둔다(대표 승인) — 새 영상은 나스에서 웹용으로 줄인 뒤 cp 로 넣는다.
- 채널 데이터는 매일 자동 갱신(`refresh-channels.yml`, secret `YOUTUBE_API_KEY`).
- **성능 (2026-09-25)**: Anthropic "claude.ai 3배 빠르게" 방식(측정→수정→재측정→상한 고정)을 적용한 1차. 글꼴 CSS 는 `assets/fonts/pretendard.css`(jsDelivr 사본, 글꼴 파일은 계속 jsDelivr)를 `rel=preload` 로 비동기 로드해 화면 그리기를 막지 않고, `cdn.jsdelivr.net`·`cdnjs`·`i.ytimg.com` 은 preconnect. 마퀴·배경 썸네일은 유튜브 WebP(`/vi_webp/…`, 같은 화질에 절반 용량) 우선 + jpg 대체, 배경 레인 70장은 채널 섹션이 가까워질 때만 받는다(main.js). 로컬 실측(devtools 스로틀 3회 중앙값): 전송량 3.7→2.1MB, 이미지 3.0→1.3MB, LCP 6.97→6.44s, FCP 1.56→1.50s. **남은 병목**: LCP 가 JS 로 그리는 마퀴 첫 썸네일이라 스크립트 체인 뒤에 온다 — 첫 타일을 HTML 에 미리 넣는 것(refresh-channels 빌드 단계)이 다음 레버. 히어로 문장이 GSAP 로 투명→표시되며 FCP 뒤 다시 사라졌다 나타나는 것도 남은 과제(디자인 결정 필요). 재측정은 `scripts/perf-server.py` 머리말의 명령으로, 배포 후엔 실서비스 1회만.

## 컬럼 — 2026-10-09 대표 지시로 중지, 발행본만 유지
- **새 컬럼은 만들지 않는다.** 자동 작성(`write-column.sh`·`publish-column.sh`·뉴스 수집 `fetch-news.js`)·발행 게이트(`gate-column.js`)·컬럼 스튜디오(localhost:3300)·launchd `com.recoculture.column`·`column-studio`·문체 가이드 `docs/column/` 는 삭제했다(git 기록에 남아 있다. launchd plist 는 `~/Code/_보관/컬럼중지_2026-10-09/`). 다시 시작하려면 대표 결정부터
- 이미 발행된 컬럼은 그대로 둔다 — `content/columns/*.md`·`columns.html`·`columns/*.html`·`data/columns.json`·메뉴 링크. 사이트에서 내릴지는 대표가 따로 정한다(검색 노출·외부 링크가 걸려 있다)
- `scripts/build-columns.js` 는 남긴다 — 내비·푸터를 바꾸면 컬럼 페이지에도 복사하려고 다시 돌린다(위 hospital-youtube 줄). 사이트맵 고정 URL 도 여기
- 중지 직전 사고(참고): 다른 세션의 미커밋 수정 때문에 자동 작성의 `git pull --rebase` 가 멈춰 10/5·10/8 두 번 "종료 코드 128" 만 대표에게 갔다

## 규칙
- 실서비스 소스. 삭제·대규모 변경 전 대표 확인. 변경 후 로컬(`python3 scripts/dev-server.py 8080`)에서 확인하고 커밋.
- 저장소는 **public**. 클라이언트 실명·계약 조건·매출 수치를 넣지 않는다. 병원명은 ○○의원/○○치과로 마스킹.
- 지침 문서(`CLAUDE.md`·`AGENTS.md`)·`.githooks/`·`.gitignore` 는 사이트에 올리지 않는다 — `deploy.yml` `exclude_assets`. 루트에 사람이 보면 안 되는 파일을 새로 두면 여기에 같이 넣는다 (2026-10-10 레드팀: recoculture.com/CLAUDE.md 로 내부 절차가 열려 있었다)
- 회사 숫자(누적 조회수·구독자·제작 영상·함께한 채널)는 `index.html` 의 stats 와 같게 쓴다. 근거였던 인용 범위표(옛 `docs/column/VOICE.md` §8)는 컬럼 중지로 삭제 — git 기록에만 있다
- 대표가 ~/Library/LaunchAgents 쓰기·launchctl은 직접 해야 할 수 있다(에이전트 권한 분류기가 막음).
- 세션 시작 시 `git status --short --branch` 로 현재 상태를 먼저 본다.
