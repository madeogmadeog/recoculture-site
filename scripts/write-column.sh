#!/bin/zsh
# 컬럼 자동 생성 파이프라인
#   수동: scripts/write-column.sh [--draft] [--topic "주제"]
#   자동: launchd com.recoculture.column (scripts/launchd/ 참조)
# 1) 뉴스 수집 → 2) claude -p 로 대표 시각의 컬럼 작성 → 3) 빌드 → 4) 커밋·푸시(배포)
set -euo pipefail
setopt null_glob
export PATH="$HOME/.nvm/versions/node/v24.11.1/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p "$ROOT/.omc/logs"
LOG="$ROOT/.omc/logs/column-$(date +%Y%m%d-%H%M).log"
exec > >(tee -a "$LOG") 2>&1
echo "== column pipeline $(date '+%F %T')"

DRAFT=0; TOPIC=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --draft) DRAFT=1 ;;
    --topic) TOPIC="$2"; shift ;;
  esac
  shift
done

git pull --rebase -q origin main || true
node scripts/fetch-news.js

TODAY=$(date +%F)
EXISTING=$( { grep -h -m1 '^title:' content/columns/*.md 2>/dev/null || true; } | sed 's/^title: *//' | tr '\n' '|')
STATUS=published; [[ $DRAFT == 1 ]] && STATUS=draft
PROMPT=$(cat docs/column/PROMPT.md)
PROMPT="${PROMPT//\{\{TODAY\}\}/$TODAY}"
PROMPT="${PROMPT//\{\{EXISTING\}\}/$EXISTING}"
PROMPT="${PROMPT//\{\{TOPIC\}\}/$TOPIC}"
PROMPT="${PROMPT//\{\{STATUS\}\}/$STATUS}"

# 작성: 파일 읽기/쓰기와 뉴스 원문 확인만 허용
claude -p "$PROMPT" \
  --allowedTools "Read,Write,WebFetch,WebSearch,Glob,Grep" \
  --permission-mode acceptEdits \
  --max-turns 40 \
  --output-format text > "$ROOT/.omc/logs/column-last-output.txt" || { echo "claude 실패"; exit 1; }

NEW=$(git status --porcelain -uall -- content/columns | awk '{print $2}' | grep '\.md$' | head -1)
if [[ -z "$NEW" ]]; then echo "새 컬럼 파일이 없음"; exit 1; fi
echo "생성: $NEW"

# 사용한 뉴스 기록 (다음 회차 중복 방지)
node -e '
const fs=require("fs");const f=process.argv[1];const raw=fs.readFileSync(f,"utf8");const m=raw.match(/^source_url:\s*(.+)$/m);
const p="data/news-used.json";const used=fs.existsSync(p)?JSON.parse(fs.readFileSync(p,"utf8")):[];
if(m){used.push({link:m[1].trim(),date:new Date().toISOString().slice(0,10),file:f});fs.writeFileSync(p,JSON.stringify(used.slice(-300),null,1)+"\n");}
' "$NEW"

node scripts/build-columns.js
git add -A content/columns columns columns.html data/columns.json data/news-used.json sitemap.xml
git -c core.quotepath=false commit -q -m "column: $(grep -m1 '^title:' "$NEW" | sed 's/^title: *//')" || { echo "커밋할 변경 없음"; exit 0; }
if [[ $DRAFT == 1 ]]; then echo "draft 모드: 푸시 생략 (확인 후 git push)"; exit 0; fi
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -q origin main
echo "== done $(date '+%F %T')"
