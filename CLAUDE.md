# 홈페이지 (CLAUDE.md) — recoculture.com 실서비스

## 실행 위치와 결과물

실제 실행·개발·Git 작업 위치는 `~/Code/3-마케팅/홈페이지/_프로그램/`다. 이 문서의 내부 상대 경로는 이 위치 기준이며, 상위 폴더의 지침 연결을 읽었더라도 명령은 `_프로그램` 안에서 실행한다. 대표가 확인하는 결과물은 `../칼럼원고/`, `../게시된칼럼/`, `../웹사이트/`다. 결과물 연결은 원본의 복사본이 아니며 연결 안에서 수정하면 원본도 바뀐다. 새 코드·로그·작업용 자료를 상위 결과물 영역에 만들지 않는다. 전사 폴더 규칙의 정본은 `~/Code/CLAUDE.md`다.

이 폴더에서 세션을 열면 이 파일을 먼저 읽고, 상세는 `README.md`를 본다. 대표(진성욱)는 코딩을 하지 않으므로 **모든 조작 안내는 컬럼 스튜디오 UI 기준**으로 한다.

## 현재 상태 (2026-09-05)
- 2026-09 리빌드 버전 라이브. 페이지: `index.html`(메인) · `work.html`(함께 만들어갈 영향력) · `careers.html` · `columns.html` + `columns/*.html`(컬럼).
- `hospital-youtube.html` (2026-09-16): '병원유튜브제작' 검색 랜딩. title·H1·본문에 검색어를 앞세운 SEO 전용 페이지. 내비·푸터 링크는 `index.html` 셸에서 컬럼 빌드가 복사하므로 내비를 바꾸면 `node scripts/build-columns.js` 로 컬럼도 재빌드. 사이트맵 고정 URL 은 `build-columns.js` 의 `fixed` 배열. 진료과별 하위 페이지 `dermatology-youtube.html`(피부과·성형외과)·`dental-youtube.html`(치과)이 있다. 후기·추천사는 `#reviews[data-industry]`·`#voices-grid[data-role]`로 진료과별 필터(main.js). 새 진료과를 추가하면 이 둘을 복제하고 `build-columns.js` `fixed`에 URL을 넣는다. 컬럼 하단 CTA는 hospital-youtube.html로 간다.
- 배포: `git push origin main` → GitHub Actions(`.github/workflows/deploy.yml`) → GitHub Pages. 푸시는 `git -c credential.helper='!gh auth git-credential' push`.
- 채널 데이터는 매일 자동 갱신(`refresh-channels.yml`, secret `YOUTUBE_API_KEY`).
- 컬럼 2편 발행됨. 컬럼 파이프라인·스튜디오 완성.

## 컬럼 시스템 (핵심)
- 원고: `content/columns/YYYY-MM-DD-slug.md` (frontmatter `status: draft|published`, draft는 빌드 제외)
- 빌드: `node scripts/build-columns.js` → `columns/`, `columns.html`, `data/columns.json`, `sitemap.xml`. 본문 그림 카드는 `:::flow|steps|compare|stat|check|quote` 블록.
- 자동 생성: `scripts/write-column.sh [--draft] [--topic "…"]` — 뉴스 수집 → `claude -p`가 `docs/column/`의 VOICE.md(문체·주장·가드레일) + BLOG-SEO.md(자청식 검색 최적화 규칙) + TOPICS.md(주제 은행) + PROMPT.md(지시문)로 작성 → 빌드 → 커밋(·푸시).
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

## 외부 서비스 폴링 금지 (2026-09-14 사고 재발 방지)

**기다리려고 남의 서버를 반복 호출하지 않는다.** 배포·빌드·작업 완료를 기다린다고 운영 도메인이나 외부 API 를 짧은 간격으로 연타하면 봇으로 잡히고, 그 계정·프로젝트가 막힌다.

- 기본은 **기다리지 않는 것**이다. 백그라운드 작업은 끝나면 알림이 오고, 진행 상황은 **로컬 로그 파일**로 본다
- 외부 주소를 꼭 확인해야 하면 **간격 30초 이상 · 총 10회 이하**. 대개는 **1회 확인이면 충분하다**
- 상태는 전용 수단으로 묻는다 — 배포는 `vercel ls`·상태 API, 서비스는 헬스 엔드포인트 **1회**. 결과물 URL 을 반복해서 받아 상태를 유추하지 않는다
- 대기 루프의 종료 조건은 **파싱 실패를 성공으로 오인하지 않게** 짠다 (빈 값·오류 페이지 ≠ 새 버전)
- 같은 배포·빌드 명령을 **동시에 두 번 띄우지 않는다**. 느리다고 다시 실행하면 큐만 엉킨다

**사고 기록**: 쇼루이 배포를 기다린다고 `shorui.vercel.app/updates.json` 을 100회 가까이 연타 → Vercel Security Checkpoint 발동 → 이후 배포 5건이 전부 `BLOCKED`. 코드·로컬 빌드·테스트는 전부 정상이었는데 배포만 반나절 막혔다. 사유는 CLI·API 어디에도 안 나와 대표가 대시보드를 직접 열어야 했다.
