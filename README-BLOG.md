# 레코컬쳐 블로그 · 관리자 안내

## 비개발자 관리자용

### 1. 글 작성 (Decap CMS)

1. 브라우저에서 **https://recoculture.com/admin/** 접속
2. **GitHub로 로그인** (저장소 권한 필요)
3. 좌측 **블로그** 메뉴 → **새 블로그** 클릭
4. 제목, 날짜, 슬러그, 요약, 본문 입력
5. **게시** 클릭 → GitHub에 자동 커밋

### 2. 배포 (새 글이 반영되려면)

관리자가 글을 게시하면 GitHub에 커밋됩니다. **배포는 별도로** 필요합니다.

**방법 A: GitHub Actions (추천)**  
- 저장소에 `.github/workflows/deploy.yml` 추가  
- push 시 자동으로 `npm run build:blog` 실행 후 GitHub Pages 배포  

**방법 B: 수동**  
- 로컬에서 `npm run build:blog` 실행  
- `data/blog-posts.json`, `blog/*.html`, `sitemap.xml` 생성됨  
- 변경사항 커밋 후 `git push`

### 3. 폴더 구조

```
content/blog/      ← 마크다운 원본 (Decap CMS가 여기에 저장)
data/              ← blog-posts.json (빌드 생성)
blog/              ← 개별 포스트 HTML (빌드 생성)
blog.html          ← 블로그 목록 페이지
admin/             ← Decap CMS 관리자 UI
```

### 4. Decap CMS 설정

- `admin/config.yml`에서 GitHub 저장소 확인
- 저장소가 private이면 GitHub OAuth App 등록 필요
