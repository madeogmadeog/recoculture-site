# 홈페이지 (CLAUDE.md) — recoculture.com 실서비스

이 폴더에서 세션을 열면 이 파일을 먼저 읽고, 상세는 `README.md`를 본다. 대표(진성욱)는 코딩을 하지 않으므로 **모든 조작 안내는 컬럼 스튜디오 UI 기준**으로 한다.

## 현재 상태 (2026-09-05)
- 2026-09 리빌드 버전 라이브. 페이지: `index.html`(메인) · `work.html`(함께 만들어갈 영향력) · `careers.html` · `columns.html` + `columns/*.html`(컬럼).
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
- 문체를 바꾸려면 VOICE.md만 고친다. 자청 방법론 원자료(영상 121편·네이버 글 59편)는 세션 스크래치에만 있었고 정리본이 BLOG-SEO.md다.
- 대표가 ~/Library/LaunchAgents 쓰기·launchctl은 직접 해야 할 수 있다(에이전트 권한 분류기가 막음). 스튜디오 UI의 버튼은 대표가 누르면 된다.
- 세션 시작 시 `git status --short --branch`와 `curl -s localhost:3300/api/columns`로 현재 상태를 먼저 본다.
