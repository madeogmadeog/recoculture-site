#!/bin/zsh
# 컬럼 한 편을 커밋하고 홈페이지에 올린다 — write-column.sh 가 마지막에 부른다.
#   scripts/publish-column.sh <content/columns/….md> [--no-push]
# 2026-10-09 (감독관): 다른 세션의 커밋 안 된 수정이 남아 있으면 `git pull --rebase` 가 "unstaged changes" 로 멈춰
# 10/5·10/8 두 번 원문 오류(종료 코드 128)만 대표에게 갔다. 그래서:
#  - 커밋은 이 컬럼 파일과 빌드 결과 경로만 (다른 세션 수정·스테이징은 건드리지 않는다)
#  - 받기는 `rebase --autostash` — 남의 수정을 잠시 비켜 두었다가 되돌린다
#  - 못 올리면 대표에게 쉬운 말 한 줄(오피스 소식 + 할 일 + 맥 알림), 원문 오류는 로그에만.
#    처리한 실패는 exit 0 — 자동화 감시가 같은 일을 원문으로 또 알리지 않게 한다
# 시험: COLUMN_NOTIFY_DRY=1 이면 알림을 보내지 않고 출력만 한다
set -uo pipefail
NEW=${1:?컬럼 파일}; NOPUSH=${2:-}
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
GEN=(columns columns.html data/columns.json data/news-used.json sitemap.xml)
TITLE=$(grep -m1 '^title:' "$NEW" | sed 's/^title: *//; s/^"//; s/"$//')

tell() { # $1 = 대표가 읽는 한 줄
  echo "[대표 알림] $1"
  [[ -n "${COLUMN_NOTIFY_DRY:-}" ]] && return 0
  local body; body=$(node -e 'console.log(JSON.stringify({text:process.argv[1],kind:"warn",todo:true}))' "$1")
  curl -s -m 5 -X POST http://localhost:3100/api/office/say -H 'Content-Type: application/json' -d "$body" >/dev/null 2>&1 || true
  osascript -e "display notification \"${1//\"/}\" with title \"컬럼\"" 2>/dev/null || true
}
fail() { tell "컬럼 「$TITLE」은 만들었는데 홈페이지에 못 올렸어요 — $1"; exit 0; }

[[ "$(git rev-parse --abbrev-ref HEAD)" == main ]] || fail "홈페이지 폴더가 다른 작업 갈래에 있어서요. 개발 세션에서 확인이 필요해요"

git add -- "$NEW" "${GEN[@]}"
if git diff --cached --quiet -- "$NEW" "${GEN[@]}"; then echo "커밋할 변경 없음"; exit 0; fi
git -c core.quotepath=false commit -q -m "column: $TITLE" -- "$NEW" "${GEN[@]}" || fail "저장(커밋) 단계에서 막혔어요. 개발 세션에서 확인이 필요해요"
[[ "$NOPUSH" == --no-push ]] && { echo "푸시 생략"; exit 0; }

# 작성 중에 채널 데이터 자동 갱신 등이 먼저 올라가 있을 수 있다 — 받아서 그 위에 다시 얹는다
git fetch -q origin main || fail "인터넷 연결이 안 돼서요. 연결되면 다시 올리면 돼요"
if ! git merge-base --is-ancestor origin/main HEAD; then
  before=$(git stash list | wc -l)
  if ! git rebase --autostash -q origin/main; then
    # 겹친 곳이 빌드 결과(목록·사이트맵·사용한 뉴스)뿐이면 스스로 푼다 — 다른 컬럼이 손으로 먼저 올라간 경우(10/5·10/8)
    conflicted=(${(f)"$(git diff --name-only --diff-filter=U)"})
    only_gen=1
    for f in $conflicted; do [[ $f == columns/* || $f == columns.html || $f == data/columns.json || $f == data/news-used.json || $f == sitemap.xml ]] || only_gen=0; done
    if (( only_gen )) && (( ${#conflicted} )); then
      if (( ${conflicted[(Ie)data/news-used.json]} )); then # 사용한 뉴스 기록은 양쪽 합집합
        node -e 'const {execSync}=require("child_process");const g=s=>{try{return JSON.parse(execSync(`git show ${s}:data/news-used.json`,{encoding:"utf8"}))}catch{return []}};
const seen=new Set(),out=[];for(const x of [...g(":2"),...g(":3")]){if(!seen.has(x.link)){seen.add(x.link);out.push(x)}}
require("fs").writeFileSync("data/news-used.json",JSON.stringify(out.slice(-300),null,1)+"\n")'
      fi
      if node scripts/build-columns.js && git add -- "${GEN[@]}" && GIT_EDITOR=true git rebase --continue; then
        echo "(빌드 결과 겹침을 다시 빌드해서 풀었다: ${conflicted[*]})"
      else
        git rebase --abort 2>/dev/null
        fail "그사이 홈페이지에 바뀐 내용과 겹쳐서요. 개발 세션에서 합쳐 올려야 해요"
      fi
    else
      git rebase --abort 2>/dev/null
      fail "그사이 홈페이지에 바뀐 내용과 겹쳐서요. 개발 세션에서 합쳐 올려야 해요"
    fi
  fi
  if (( $(git stash list | wc -l) > before )); then
    tell "홈페이지 폴더에서 다른 세션이 고치던 내용이 따로 보관(stash)됐어요 — 개발 세션에서 되돌려 주세요"
  fi
fi
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -q origin HEAD:main || fail "올리기가 거절됐어요. 개발 세션에서 다시 올려야 해요"
echo "== 올림: $TITLE"
