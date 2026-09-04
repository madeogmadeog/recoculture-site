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
| 통계 고정값 (1.5억 등) | `index.html` `.stat__n[data-n]` |
| 채널 추가·제외 | `data/channels.config.json` → 스크립트 실행 |
| 후기 카드 | `data/reviews.json` |
| work 키워드·인용 | `data/influence.json` |
| 채용 공고 | `careers.html` |
| 색·폰트 | `styles.css` `:root` |

## 로컬 확인

```bash
python3 scripts/dev-server.py 8080   # http://localhost:8080 (캐시 없음)
```

## 배포

`main`에 push하면 GitHub Actions가 자동 배포한다. 빌드 단계 없음.
