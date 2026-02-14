# 레코컬쳐 홈페이지

전문직 유튜브 미디어 브랜딩 레코컬쳐 공식 홈페이지

- **사이트**: https://recoculture.com
- **저장소**: madeogmadeog/recoculture-site

---

## 📋 유지보수 가이드

### 파일 구조

```
├── index.html          # 메인
├── portfolio.html      # 포트폴리오 (슬롯 스크롤)
├── services.html       # 서비스·상담폼
├── careers.html        # 채용
├── blog.html           # 블로그 목록
├── blog/               # 블로그 상세 (빌드 생성)
├── content/blog/       # 블로그 마크다운 원본
├── data/               # blog-posts.json (빌드 생성)
├── admin/              # Decap CMS 관리자
├── styles.css          # 공통 스타일
├── portfolio-data-compact.json  # 포트폴리오 영상 데이터
└── scripts/build-blog.js       # 블로그 빌드 스크립트
```

### 자주 하는 수정

| 수정 대상 | 파일 | 비고 |
|-----------|------|------|
| 연락처·이메일 | `services.html`, `index.html`, `careers.html`, `footer` | 여러 페이지에 반복됨 |
| 상담 폼 수신 주소 | `services.html` 폼 `action` | FormSubmit.co 이메일 |
| 포트폴리오 영상 | `portfolio-data-compact.json` | JSON 형식 유지 |
| 채널 추가/삭제 | `portfolio.html` 내 `CHANNELS`, `CHANNEL_COLORS` | YouTube API 채널 ID |
| YouTube API 키 | `portfolio.html` 내 `API_KEY` | 만료 시 새 키 발급 |
| 메인 문구·통계 | `index.html` hero, stats | 숫자·문구 수정 |
| 서비스 가격·플랜 | `services.html` pricing 섹션 | |
| 채용 공고 | `careers.html` positions | |

### 블로그 유지보수

- **글 작성**: https://recoculture.com/admin/ (비개발자용)
- **글 수정**: admin에서 선택 후 편집
- **빌드**: `npm run build:blog` → `data/`, `blog/`, `sitemap.xml` 갱신
- **배포**: push 시 GitHub Actions가 자동 빌드·배포

### 배포

```bash
# 1. 블로그 빌드 (새 글이 있으면)
npm run build:blog

# 2. 커밋 & 푸시
git add .
git commit -m "업데이트 내용"
git push origin main
```

> GitHub Actions가 push 시 자동 배포. Pages Source가 `gh-pages`면 해당 브랜치에 푸시됨.

---

## 🛠️ 환경

- Node.js 18+ (블로그 빌드용)
- `npm install` → `marked` 설치
- 정적 사이트 (HTML/CSS/JS)

---

## 📁 관련 문서

- [배포가이드.md](./배포가이드.md) — DNS, GitHub Pages 초기 설정
- [README-BLOG.md](./README-BLOG.md) — 블로그·Decap CMS 상세

---

## ⚠️ 주의사항

1. **portfolio-data-compact.json**  
   `portfolio-data.json`에서 변환 필요 시 별도 스크립트 사용. 키: `i`(id), `t`(title), `v`(views), `s`(duration), `c`(channel).

2. **FormSubmit**  
   이메일 변경 후 첫 1회 `og@recoculture.com` 또는 해당 주소로 인증 메일 수신 → Activate 링크 클릭 필요.

3. **Decap CMS**  
   저장소가 private이면 GitHub OAuth App 별도 등록 필요.
