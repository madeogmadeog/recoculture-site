#!/bin/zsh
# 더블클릭하면 컬럼 스튜디오를 설치하고 켭니다 (localhost:3300, 맥 켜질 때 자동 시작)
cd "$(dirname "$0")/../.."
mkdir -p ~/Library/LaunchAgents .omc/logs
cp scripts/launchd/com.recoculture.column-studio.plist ~/Library/LaunchAgents/
launchctl unload ~/Library/LaunchAgents/com.recoculture.column-studio.plist 2>/dev/null
launchctl load ~/Library/LaunchAgents/com.recoculture.column-studio.plist
sleep 2
open http://localhost:3300
echo "설치 완료 — 브라우저에 컬럼 스튜디오가 열립니다. 이 창은 닫아도 됩니다."
