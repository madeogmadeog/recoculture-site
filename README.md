# 레코컬쳐 홈페이지

전문직 유튜브 미디어 브랜딩 레코컬쳐 공식 홈페이지 — https://recoculture.com

- 저장소: madeogmadeog/recoculture-site
- 정적 사이트 (HTML/CSS/JS), GitHub Pages 배포, CNAME `recoculture.com`
- **실서비스 소스. 삭제·대규모 변경 전 대표 확인.**

## 현재 상태 (2026-09)

리빌드 중. `deploy.yml`의 `publish_dir`가 `./maintenance`라 **임시 페이지만 라이브**다.
새 사이트가 확인되면 `publish_dir: .`로 바꾸고 `maintenance/`를 지운다.

옛 사이트(다크 테마 5페이지)의 카피·요금·채용·채널 설정은 `docs/SITE-CONTENT.md`에 전부 보존했다.
소스 자체는 git 히스토리(`git show ad41311:index.html`)로 복구할 수 있다.

## 파일 구조

```
├── index.html        # 메인 (명함)
├── work.html         # 작업물 전체 (채널별 필터)
├── careers.html      # 채용
├── styles.css        # 공통 스타일 (디자인 토큰은 :root)
├── main.js           # work.html 데이터 로드·필터
├── assets/logo/      # 심볼·로고타입·시그니처
├── assets/           # favicon, og-image
├── docs/
│   ├── SITE-CONTENT.md      # 옛 사이트 정보 전수 보존
│   ├── portfolio-data.json  # 영상 데이터 {i,t,v,s,c} — work.html이 읽음
│   └── funnel.png           # 옛 퍼널 이미지
├── content/blog/     # 옛 블로그 마크다운 원본 (보존만)
├── maintenance/      # 개편 중 임시 페이지 (현재 라이브)
└── .github/workflows/deploy.yml
```

## 자주 하는 수정

| 대상 | 파일 |
|---|---|
| 연락처·이메일 | `index.html` Contact 섹션, 각 페이지 푸터 |
| 대표 채널 6개 | `index.html` Selected Work 섹션 |
| 작업물 추가·삭제 | `docs/portfolio-data.json` (키 `i` 영상ID, `t` 제목, `v` 조회수, `s` 정렬, `c` 채널명) |
| 채용 공고 | `careers.html` |
| 색·폰트 | `styles.css` `:root` |

## 로컬 확인

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## 배포

`main`에 push하면 GitHub Actions가 자동 배포한다. 빌드 단계 없음.
