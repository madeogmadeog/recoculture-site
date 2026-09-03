# 옛 recoculture.com 콘텐츠·설정 보존 문서

> 2026-09-03 리빌드 전 옛 사이트(다크 테마, 5페이지)에서 추출한 전수 인벤토리. 삭제된 소스의 유일한 원본이다.
> 옛 소스 자체는 git 히스토리 `git show ad41311:index.html` 등으로 복구할 수 있다.

## 목차

1. 연락처 / 사업자 정보
2. index (메인)
3. services (서비스·요금·상담폼)
4. careers (채용)
5. blog
6. portfolio (채널 ID·API·데이터)
7. SEO / 추적
8. 옛 폰트·컬러
9. 재구축 시 정리할 불일치
10. 인프라 메모

## 1. 연락처 / 사업자 정보 (전 페이지 푸터 공통)

| 항목 | 값 |
|---|---|
| 이메일 | og@recoculture.com |
| 카카오톡 채널 | http://pf.kakao.com/_PxfyFn/chat (target=_blank) 표기 `KakaoTalk →` |
| 전화번호 | 없음 (blog 템플릿에만 010-2749-5144 잔존 — 본 페이지엔 없음) |
| 주소 | services 연락처 블록 `Location: 서울특별시` |
| 회사명 | 주식회사 레코컬쳐(RECOCULTURE) / 대표 진성욱 |
| 도메인 | recoculture.com |
| SNS | 없음 (카카오만) |

푸터: 로고 `REC●CULTURE` / 태그라인 `전문직 유튜브 미디어 브랜딩` / Menu: ABOUT US, Portfolio, Services, Careers, Blog / Contact: og@recoculture.com, KakaoTalk → / `© 2025-2026 주식회사 레코컬쳐(RECOCULTURE). All rights reserved.` / `주식회사 레코컬쳐 | 대표: 진성욱`

네비: ABOUT US / Portfolio / Services / Careers / Blog / CTA `연락하기` → services.html#contact

## 2. index.html

메타: title `RECOCULTURE | 전문직 유튜브 미디어 브랜딩` / description `전문직을 위한 유튜브 미디어 브랜딩. 조회수가 아닌 실제 비즈니스 성장을 만드는 파트너, 레코컬쳐.` / og:description `전문직을 위한 유튜브 미디어 브랜딩. 조회수가 아닌 실제 비즈니스 성장을 만드는 파트너.` / og:image https://recoculture.com/assets/og-image.png / og:locale ko_KR / twitter:card summary_large_image

HERO: 라벨 `Professional YouTube Branding` / 헤드 `저 의사들은 어떻게` `유튜브를 하고 있을까?`(em) / 서브 `누구나 시작할 수는 있지만` `모두가 잘 되지는 않습니다.` / CTA `연락하기 →`, `서비스 자세히보기`
배경 썸네일 마퀴 4줄 (videoId):
- 1: OGoD3pjPdpc, MaZnabYDYG4, BUMV0e-aTZM, gkv28WNJiHs, RCo7iMx9YrY, zTDDRkEu0cQ, BhvTHSE3Ls, 0VarMSXsZ3o, j7LjP0QCv-I, 6TuwFWwpY7s
- 2: hHSrVt28xzA, P2xLP-g1LA0, ehbWoKNK3ss, G7ogUEpPEL0, Xdw76U6x0dQ, ZvEqTJKtPN0, feHnxuftsyI, 3xuIdKdMGww, 1pPPIBGoR78, 4q23LOxUHcM
- 3: b5FiwJKCf_w, I8iO-y4nXIY, kEHDVFOMxks, f-UYrTXvrvU, YWv6ppeJRGY, bJoPzoRSR9M, wF2tnX7rNbo, oxdedv2hudY, qvNxbtWg-Gg, mGiNdBK5ZFQ
- 4: NXevsWOK8uo, lfDdfGY_DHo, WY0bY674fvo, YKWns8sEYvY, l-on0ELk1uk, L9xf8jMx5dc, JyAWWodx8yM, xCcVmn9GdU0, V1Tw7pAo2TU, emfxexEvPMA
- 패턴 https://img.youtube.com/vi/{id}/mqdefault.jpg

통계바: `10+` 운영 채널 / `5,700만+` 누적 조회수 / `2년` 평균 계약 유지기간 / `40만+` 총 구독자

매니지먼트 채널: 라벨 Management / `매니지먼트 채널` / `레코컬쳐가 매니지먼트하는 대표 채널입니다.`
| 채널 | 분류 | channelId |
|---|---|---|
| 하원장 강동현 | 미용의원 · 피부과 | UCvQCmSsCRb8z3q0SO5JW8Pw |
| 친절한 송이씨 | 미용의원 · 피부과 | UCa16_cbdgo7BDjHbJvJowGw |
| 이바다 이야기 | 치과의사 | UCa4XAtZ_04zXUAh28HFbJQw |
| 권의 시선 | 치과의사 | UCdRgh9GCeMs8Bo86QMSuiuA |

ABOUT: `우리는 전문직의 전문지식과 경험을` `콘텐츠로 연결하고` `사람들을 행동하게 만듭니다.`(행동=orange) / 숫자 `5,700만+` 누적 조회수 · `456+` 제작 영상 · `9` 직접 운영 채널

Our Difference: `우리는 단순히 영상을` `만들지 않습니다` / `조회수는 허영 지표입니다.` `올바른 사람에게 도달해서 실제 행동을 만들어냅니다.`
- 좌 `일반 유튜브 대행사` / `제작에 집중` / ✕ 월 N회 콘텐츠 납품 (횟수 중심), 조회수 중심 KPI, 전문직 특성 이해 부족
- 우 `RECOCULTURE` / `브랜딩에 집중` / ✓ 퍼스널 브랜딩 기반 콘텐츠 기획, 비틀리 퍼널로 실제 내원 추적, 대체 불가능한 신뢰 기반 브랜딩
- 버튼 `서비스 상세 보기 →`

Real Impact: `숫자가 증명합니다` / `영상을 본 사람들이 실제로 행동했습니다.` / `400%` 신환 증가율 · `95%` 유튜브 내원율 · `5x` 객단가 상승 · `70%` 클라이언트 (병원 확장이전 or 페이닥터 채용)

CTA: `전문직의 이야기를` `콘텐츠로 연결합니다`(orange) / `지금 무료 채널 진단을 시작하세요.` / `연락하기 →`

스크립트: API_KEY 아래 동일, REFRESH_MIN=5, youtube/v3/channels?part=statistics,snippet, 슬롯 카운터 + 아바타 주입, 실패 시 `—`

## 3. services.html

메타: title `서비스 | RECOCULTURE` / description `레코컬쳐의 서비스와 요금 안내. 채널 전략 컨설팅, 영상 제작 대행, 채널 운영 관리까지 전문직 맞춤 유튜브 브랜딩.` / og:description `채널 전략 컨설팅, 영상 제작 대행, 채널 운영 관리까지 전문직 맞춤 유튜브 브랜딩.`

HERO: `조회수는 높은데` `환자가 안 오시죠?` / `유튜브 조회수가 비즈니스 성과를 보장하지 않습니다.` `**누가 봤는가**가 **얼마나 봤는가**보다 중요합니다.` / CTA `연락하기 →`(#contact), `브랜딩 시스템 보기`(#funnel) / 통계 `50+` 운영 채널 · `5,700만+` 누적 조회수 · `98+` 검증된 썸네일 패턴 · `400%` 신환 증가 사례

Why Different: 인용 `"조회수가 10만이 나와도` `병원에 환자가 0명이면,` `그 영상은 실패한 영상입니다."` / 본문 `대부분의 유튜브 대행사는 '제작'에 집중합니다.` `월 N회 콘텐츠, 최신 장비, 예능 편집. 결과는?` `조회수 보고서 한 장.` / `레코컬쳐는 '브랜딩'에 집중합니다. 조회수가 아닌,` `실제로 내 병원에 찾아오는 환자를 만드는 시스템을 설계합니다.`
- 좌 `기존 유튜브 대행사` / `제작에 집중` / ✕ 월 N회 콘텐츠 제작 (횟수 중심), 숏폼 N건 납품, 4K 카메라 등 최신장비 어필, 예능 편집 (재미 위주), 조회수 보고서만 전달, 대본 100% 작성 → 그대로 읽기
- 우 `RECOCULTURE` / `브랜딩에 집중` / ✓ 퍼스널 브랜딩 기반 콘텐츠 기획, 철학을 담는 기획 루틴 (대본 읽기 X), 40만 구독자, 1억 조회수 전담 PD 배치, 브랜딩 컨셉에 맞는 촬영 환경 세팅, 비틀리 퍼널로 실제 내원 추적, 대체 불가능한 신뢰 기반 브랜딩

콘텐츠 퍼널 시스템(#funnel): 라벨 Branding System / `콘텐츠 퍼널 시스템` / `시청자의 관심을 신뢰로, 신뢰를 내원으로 전환하는 구조화된 콘텐츠 설계.` `영상 하나하나가 브랜딩 시스템의 일부로 작동합니다.` / 이미지 funnel.png
1. Base Content / `시청자의 기본 욕구를 해결` / `영상만으로 문제가 해결됩니다. 골과 직접적 연결은 없지만, 시청자의 최종 욕구에 맞닿아 있는 콘텐츠.` / 예 `홈케어 루틴, 다이소 시리즈, 셀프 정비법`
2. Main Content / `영상만으로 해결되지 않는 욕구` / `골을 통해 욕구를 해결할 수 있는 콘텐츠. 영상을 시청한 것으로 문제가 해결되지 않아, 랜딩으로 자연스럽게 유도됩니다.` / 예 `시술 전/후 비교, 전문 상담이 필요한 주제`
3. Landing / `행동을 유도하는 도착 지점` / `시청자가 영상에서 무언가를 느끼고 방문하는 곳. 홈페이지, 블로그, 플레이스 등 비틀리로 유입을 추적합니다.`
4. Goal / `실제 비즈니스 전환` / `내원, 상품 판매, 문의. 베이스→메인→랜딩의 욕구가 일치하면 골 전환률이 높아집니다.`

서비스 3종 (`전문직 유튜브 성장의 모든 단계를 함께합니다.`):
- 01 🎯 채널 전략 컨설팅 — `타겟 오디언스 정의부터 채널 포지셔닝, 콘텐츠 퍼널 설계까지. 전문직 시장에 최적화된 유튜브 성장 전략을 설계합니다.` / 타겟 오디언스 분석 · 페르소나 정의, 브랜딩 아이덴티티 설계, 콘텐츠 퍼널 로드맵 수립, 경쟁 채널 분석 · 포지셔닝
- 02 🎬 영상 제작 대행 — `기획, 촬영, 편집, 썸네일까지 원스톱 제작. 98개 이상의 검증된 패턴과 공감 트리거 카피라이팅으로 클릭과 전환을 동시에 잡습니다.` / 기획 · 촬영 · 편집 (풀 프로덕션), 패턴 기반 썸네일 제작, 공감 트리거 카피라이팅, 코드라인 · 고정댓글 설계
- 03 📊 채널 운영 · 성과 추적 — `본업에 집중하시면 됩니다. 업로드부터 커뮤니티 관리, 비틀리 퍼널 기반 실제 내원 추적까지 채널 운영 전반을 대행합니다.` / 콘텐츠 업로드 · 최적화, 댓글 · 커뮤니티 · 고정댓글 관리, 비틀리 퍼널 내원 추적, 월간 성과 리포트 · 전략 리뷰

프로세스 (`구조화된 실행 프로세스` / `모든 프로젝트는 검증된 프로세스를 따릅니다.`): 01 상담 · 진단(현재 상황 분석 / 목표 · 타겟 설정) → 02 브랜딩 설계(아이덴티티 정의 / 콘텐츠 퍼널 설계) → 03 콘텐츠 제작(기획 · 촬영 · 편집 / 썸네일 · 카피) → 04 운영 · 추적(업로드 · 퍼널 추적 / 내원 데이터 분석) → 05 성과 리포트(비즈니스 임팩트 분석 / 전략 고도화)

요금제 (`서비스 요금 안내` / `채널 상황과 목표에 맞는 플랜을 선택하세요.`):
- STARTER 채널 셋업 — `유튜브를 처음 시작하는 전문직을 위한 기초 브랜딩 패키지` / 별도 문의 / 1회성 프로젝트 / 브랜딩 아이덴티티 컨설팅 (1회), 채널 아트 · 프로필 디자인, 콘텐츠 퍼널 로드맵 수립 (3개월), 초기 영상 3편 제작, 썸네일 패턴 가이드
- GROWTH 채널 성장 관리 (featured) — `지속적인 채널 성장과 실제 비즈니스 전환을 위한 풀 매니지먼트` / 별도 문의 / 월 구독 · 최소 3개월 / Starter 전체 포함, 월 4~8편 영상 제작, 촬영 · 편집 · 썸네일 일괄, 채널 운영 대행 (업로드 · 댓글), 비틀리 퍼널 내원 추적, 월간 성과 리포트 · 전략 리뷰, 전담 PD 배정
- ENTERPRISE 토탈 브랜딩 — `유튜브를 넘어 전체 미디어 브랜딩이 필요한 대형 병원 · 법인 맞춤` / 별도 협의 / 맞춤 계약 / Growth 전체 포함, 숏폼 콘텐츠 제작, 블로그 · SNS 연동 운영, 광고 캠페인 기획 · 운영, 분기별 전략 리뷰 미팅, 멀티 플랫폼 확장 관리
- 주석 `* 모든 요금은 채널 상황과 규모에 따라 달라집니다. 상담을 통해 맞춤 견적을 안내드립니다.` / CTA 공통 `상담 신청하기`

Fit Check (`이런 형태는 지양하고 있습니다` / `브랜딩은 준비 없이 갑작스럽게 만들어지지 않습니다.` `최소 3개월의 여유를 가지고 시작하실 수 있어야 합니다.`):
- ⛔ 함께하기 어려운 경우: 단기 성과(1~2개월)를 최우선으로 원하시는 경우 / "알아서 잘 해주세요" — 전적으로 위임만 원하시는 경우 / 조회수만을 KPI로 삼고 싶으신 경우 / 대본을 100% 작성해 그대로 읽는 촬영을 원하시는 경우
- ✅ 잘 맞는 분: 유튜브를 장기적 신뢰 자산으로 생각하시는 분 / 본인의 전문성과 소신을 콘텐츠에 담고 싶으신 분 / "내 병원에 올 환자"에게 도달하고 싶으신 분 / 최소 3개월 이상의 여유를 가지고 시작하실 수 있는 분

상담 폼(#contact): 라벨 Get In Touch / `무료 채널 진단 신청` / `현재 채널 상황을 분석하고, 타겟 도달 전략을 제안합니다.` / 좌측 📧 Email og@recoculture.com · 💬 KakaoTalk `카카오톡 채널 바로가기 →` · 📍 Location 서울특별시
| label | name | type | placeholder/옵션 | req |
|---|---|---|---|---|
| (허니팟) | _honey | hidden text | | |
| 이름 | 이름 | text | 이름을 입력해주세요 | ✅ |
| 연락처 | 연락처 | tel | 010-0000-0000 | ✅ |
| 업종 | 업종 | select | 의료 (병·의원) / 치과 / 피부과 · 성형외과 / 한의원 / 법률 (법무법인 · 변호사) / 재무 (세무사 · 회계사 · 재무설계사) / 기타 전문직 | ✅ |
| 관심 서비스 | 관심서비스 | select | Starter — 채널 셋업 / Growth — 채널 성장 관리 / Enterprise — 토탈 브랜딩 / 아직 모르겠음 (상담 후 결정) | |
| 현재 유튜브 채널 (선택) | 유튜브채널 | url | https://youtube.com/@channel | |
| 문의 내용 | 문의내용 | textarea | 현재 상황과 목표를 간략히 알려주세요. | |
- 제출 `연락하기 →` / 전송 중 `전송 중...`
- FormSubmit AJAX: POST https://formsubmit.co/ajax/og@recoculture.com (Accept: application/json), 히든 `_subject=[레코컬쳐] 새 상담 신청`, `_captcha=false`, `_template=table`, `_next` 미사용
- 토스트: 성공 `신청이 완료되었습니다! 빠른 시일 내에 연락드리겠습니다.` / 실패 `전송에 실패했습니다. 다시 시도해주세요.` / 네트워크 `네트워크 오류가 발생했습니다. 다시 시도해주세요.` / 4초 후 숨김
- FAQ 섹션 없음

## 4. careers.html

메타: title `채용 | RECOCULTURE` / description `레코컬쳐와 함께 성장할 팀원을 찾습니다. 전문직 유튜브 브랜딩 분야의 선두에서 함께할 인재를 모집합니다.` / og:description `전문직 유튜브 브랜딩 분야의 선두에서 함께할 인재를 모집합니다.`

HERO: `함께 성장할` `팀원을 찾습니다`(성장=em) / `전문직 유튜브 브랜딩이라는 새로운 시장을 함께 개척할 열정 있는 인재를 모집합니다.`

Our Culture (`레코컬쳐가` `일하는 방식` / `우리는 이런 가치를 중요하게 생각합니다.`):
- 🎯 주도적인 태도 Ownership — `문제를 먼저 발견하고 해결 방안을 주도적으로 제안합니다. 실행보다 정의를 먼저.`
- 🔬 데이터 기반 창의성 Data-Driven Creativity — `감각에 의존하지 않지만 감각을 믿습니다. 아이디어는 반드시 데이터 인사이트와 연결.`
- 📐 구조화된 실행 Structured Execution — `목표를 명확히 정의하고 실행 흐름을 체계적으로 설계. 누구나 이해할 수 있도록 구조화.`
- 📚 끊임없는 학습 Continuous Learning — `학습은 '그냥' 합니다. 항상 모른다고 생각합니다. 초등학생에게도 배울 수 있다는 마음.`
- 💡 의미있는 실패 Meaningful Failure — `실패해도 괜찮습니다. 같은 실수를 반복하지 않는 것이 핵심. 틀리는 걸 좋아해야 합니다.`

회사 소개문: `레코컬쳐(RECOCULTURE)는 전문직의 전문지식과 경험을 콘텐츠로 연결하여 사람들의 실질적인 행동 변화를 만드는 회사입니다. 단순한 콘텐츠 제작을 넘어 '삶의 변화를 만드는 콘텐츠'를 추구하며, 전문직들이 유튜브를 통해 사회에 영향력을 미치도록 돕습니다. 우리는 전문가와 대중이 만나는 새로운 콘텐츠 생태계를 구축하여, 사람들이 광고나 검색이 아닌 우리의 콘텐츠를 통해 전문가를 찾고 선택하는 세상을 만들어가고자 합니다. 데이터 기반의 창의적 사고와 주도적인 실행력을 바탕으로, 함께 성장하며 도전하는 문화를 추구합니다.`

포지션 헤더: Open Positions / `채용 중인 포지션` / `아래 포지션에 관심이 있으시면 지원하기 버튼을 통해 지원해주세요.`

**포지션 1 — 영상 편집 제작자** (태그 상시 채용, 정규직)
- 성장 기회: `다양한 전문직(의사, 변호사, 회계사 등)의 전문 지식과 스토리를 매력적인 영상 콘텐츠로 구현하며 '스토리텔링 편집 전문가'로 성장할 수 있습니다. 단순한 컷 편집을 넘어, 촬영 원본을 분석하고 기획 의도를 시각화하여 시청자의 행동을 이끌어내는 '가치 있는 콘텐츠'를 만드는 노하우를 습득합니다. 빠르게 성장하는 스타트업 환경에서 데이터 기반의 편집 스킬을 익히며, 미디어 산업 전문가로서의 커리어를 쌓아갈 수 있습니다.`
- 주요 업무: 유튜브 영상 콘텐츠 편집 (Long-form) — 전문직 인터뷰, 정보성 콘텐츠의 본편 영상 편집 / 컷 편집, 스토리 재구성, 자막 및 오디오 믹싱 · 숏폼 콘텐츠 제작 (Short-form) — 본편 영상을 활용한 유튜브 쇼츠, 인스타그램 릴스 편집 / 트렌드에 맞는 빠른 호흡의 숏폼 콘텐츠 기획 및 제작 · 모션 그래픽 및 디자인 — 영상 몰입도를 높이는 모션 그래픽, 인포그래픽, 타이포그래피 / Adobe After Effects, Photoshop 활용 · 썸네일 제작 — 채널 브랜딩 및 클릭률(CTR)을 고려한 썸네일 디자인 · 후반 작업 및 데이터 관리 — 컬러 그레이딩(색 보정) 및 음향 보정 / 촬영 원본 데이터 아카이빙 및 관리 · 기획자/PD와의 협업 — 기획 의도 파악 및 피드백 수용으로 영상 퀄리티 향상 / 편집 트렌드 리서치 및 신규 포맷 R&D 참여
- 자격요건: 핵심 역량: 콘텐츠의 기획 의도를 파악하고 시각적으로 구현하는 스토리텔링 능력 / 기술 요구 (필수): Adobe Premiere Pro, Photoshop 툴 활용이 능숙하신 분 / 크리에이티브 역량: 트렌디한 영상미, 타이포그래피, 썸네일 디자인 감각 / 소통 능력: 기획자 및 PD와 원활히 소통하며 피드백을 건설적으로 수용하시는 분 / 실행 능력: 마감 기한 준수, 주도적 퀄리티 관리 / 경력: 신입 또는 경력 (유튜브 채널 편집·운영 경험자 우대) / 포트폴리오: (필수) 편집 스킬과 스타일을 보여줄 수 있는 영상 포트폴리오
- 근로형태: `계약직 (3개월) — 정규직 전환 가능` / `편집 포지션 기준 인턴 3개월 이후 상시 재택 가능`
- 전형: `서류 전형 → 1차 인터뷰 (화상/포트폴리오 리뷰) → 2차 인터뷰 (대면) → 처우협의 → 최종합격` / `전형단계는 생략되거나 추가될 수 있습니다.`
- 지원: mailto:og@recoculture.com?subject=[채용지원] 영상 편집 제작자

**포지션 2 — 콘텐츠 기획자** (태그 상시 채용, 계약직, 기획)
- 성장 기회: `다양한 전문직(의사, 변호사, 회계사 등)의 개인 브랜드를 A to Z로 기획·관리하며 브랜딩 전문가로 성장할 수 있습니다. 데이터 기반의 창의적 콘텐츠 기획부터 고급 클라이언트와의 관계 관리까지, 단순한 실무를 넘어선 비즈니스 전반의 역량을 체계적으로 습득하게 됩니다. 빠르게 성장하는 스타트업 환경에서 콘텐츠 제작 전 과정을 경험하며, 미디어 산업 전문가로서의 커리어를 쌓아갈 수 있습니다.`
- 주요 업무: 채널 브랜딩 기획 — 클라이언트 니즈 분석 및 트렌드 리서치 / 채널명, 컨셉, 철학을 담은 기획안 작성 / 타겟 오디언스에 맞는 비주얼 컨셉 및 촬영 방식 결정 · 영상 콘텐츠 기획 — 영상 주제 발굴 및 스토리보드 작성 / 썸네일 기획 및 탐색 최적화 제목 작성 / 촬영용 상세 기획안 작성 및 클라이언트 전달 · 클라이언트 관계 관리 — 노션 기반 클라이언트 대시보드 구축·운영 / 기획안 피드백 수렴 및 일정 관리 / 지속적 소통을 통한 신뢰 관계 구축 · 현장 제작 관리 (PD 역할) — 촬영 현장 디렉션 및 인터뷰 진행 / 클라이언트와의 라포 형성 및 분위기 조성 / 기획 의도 구현을 위한 실시간 퀄리티 관리 · 후반 작업 관리 — 촬영 데이터 관리 및 가편집 / 프리랜서 에디터 협업 및 작업 가이드 제공 / 썸네일 제작 및 유튜브 업로드 최적화 · 채널 운영 및 R&D — 업로드 후 댓글 모니터링 및 성과 분석 / 성공 사례 벤치마킹 및 트렌드 레퍼런스 수집 / 데일리 정보 구조화 및 채널별 성장 전략 수립
- 자격요건: 핵심 역량: 목표 지향적 사고, 고객 중심 마인드, 서비스 마인드 / 소통 능력: 라포 형성 능력, 명확한 의사전달, 현장 상황 대응력 / 크리에이티브 역량: 대중적 미적 감각, 클릭 유도 썸네일 기획 센스 / 실행 능력: 프로젝트 관리, 지속적 학습 의지 / 기술 요구: 노션, Adobe/MS Office/AI 툴 우대 / 경력: 신입 가능 / 포트폴리오: 필수 제출
- 근로형태: `계약직 (6개월) — 정규직 전환 가능`
- 전형: `서류 전형 → 1차 인터뷰 (화상) → 2차 인터뷰 (대면) → 처우협의 → 최종합격`
- 지원: mailto:og@recoculture.com?subject=[채용지원] 콘텐츠 기획자

복리후생: 🌙 야근 없는 회사 `8시 전에 모든 업무를 마무리합니다.` / ⏰ 자율 출퇴근 `퇴근 시간은 정해져 있지만 출근은 자유입니다.` / 🍽️ 점심 자유 `지정된 점심시간 없이 자유롭게 식사합니다.` / 🏃 업무 완료 시 자율 퇴근 `금일 할당 업무 완료 시 자율 퇴근 가능합니다.` / 💬 비동기 소통 우선 `시급한 일만 대면, 나머지는 노션 & 카톡으로.` / 🎂 생일 휴가 · 명절 지원금 · 여름/겨울 휴가 `생일 휴가, 명절 지원금, 여름 휴가, 겨울 휴가를 지원합니다.`

CTA: `레코컬쳐와 함께` `성장하고 싶다면` / `이력서와 포트폴리오를 보내주세요.` / `지원하기 →` mailto:og@recoculture.com?subject=[채용문의] 지원합니다

## 5. blog.html

메타: title `블로그 | RECOCULTURE | 전문직 유튜브 브랜딩` / description `전문직 유튜브 채널 운영 노하우, 썸네일·카피 전략, 성과 사례. 레코컬쳐의 인사이트를 공유합니다.` / og:title `블로그 | RECOCULTURE` / og:description `전문직 유튜브 채널 운영 노하우, 썸네일·카피 전략, 성과 사례.`
카피: `전문직 유튜브` `인사이트`(em) / `채널 운영 노하우, 성과 사례, 썸네일·카피 전략을 공유합니다.` / CTA `궁금한 점이 있으신가요?` `무료 채널 진단을 받아보세요`(orange) / `채널 현황을 분석하고 맞춤 전략을 제안합니다.` / `연락하기 →`
로딩: fetch data/blog-posts.json → 카드 (title, date, excerpt, `더 읽기 →`) / 폴백 `콘텐츠를 준비 중입니다. 곧 유용한 인사이트를 공유할 예정입니다.`
포스트 1건: title `레코컬쳐 블로그에 오신 것을 환영합니다` / 2025-02-14 / slug welcome / excerpt `전문직 유튜브 브랜딩의 성과와 인사이트를 공유합니다.` (원본 content/blog/2025-02-14-welcome.md 유지)

## 6. portfolio.html

메타: title `포트폴리오 | RECOCULTURE` / description `레코컬쳐가 만든 456개 영상, 5700만+ 누적 조회수. 전문직 유튜브 브랜딩의 실제 성과.` / og:description `456개 영상, 5700만+ 누적 조회수. 전문직 유튜브 브랜딩의 실제 성과.` / 폰트 Inter:wght@400..900 추가
카피: 카운터 라벨 `레코컬쳐에서 만든 영상의 누적 조회수` / `{YYYY}.{MM}.{DD} {HH}:{mm}:{ss} 기준 · 실시간 집계 중` / 제목 `RECOCULTURE PROJECT PORTFOLIO` (O=orange) / `Representative Clients` / CTA `다음 성공 사례의` `주인공이 되세요` / `무료 상담으로 채널 성장 전략을 확인하세요.` / `연락하기 →`

대표 클라이언트: 친절한 송이씨 피부과 3.4만 / 하원장 강동현 피부과 9.4만 / 이바다이야기 치과 5.3만 / 우선이선우 치과 3.0만 / 웃는치과의사 오원장 치과 4.8만 / 재활운동 물리치료사, 박PT 물리치료 13.6만

CHANNEL_COLORS: 이바다이야기 #ED6C00 / 친절한 송이씨 #E8488A / 권의시선 #3B82F6 / 하원장 강동현 #8B5CF6 / Prepatina 차랑꾼 #444 / 태오네모세모 #06B6D4 / 진로사이다 #F59E0B / 바른의사 백승우 #10B981 / 우선이선우 #EC4899 / 이태호 수의사 #6366F1 (코드 내 미참조)

CHANNELS (10): UCa4XAtZ_04zXUAh28HFbJQw(이바다 이야기), UCa16_cbdgo7BDjHbJvJowGw(친절한 송이씨), UCdRgh9GCeMs8Bo86QMSuiuA(권의 시선), UCvQCmSsCRb8z3q0SO5JW8Pw(하원장 강동현), UCQs5sRayqKqrdxTaV38OVRA, UCj_RY4FlDqfafum6Gy5nUiA, UCDy8IPYmRu6WbDUyAs1ffyg, UC9yDBiSGrXpooefuaXO6BaA, UC2kME1ttakYQVNxBQJJo6Sw, UCwDwL7htetGbWwypB1sYK5A — 뒤 6개는 이름 매핑 없음 (CHANNEL_COLORS 나머지 6개와 순서 대응 추정)

API_KEY: `AIzaSyA1GYd6qA5-4A_TSernWSAFPirQDyfDIFs` (index/portfolio 동일, 평문) / 코드 TODO `API 키를 빌드 시 JSON으로 캐싱하는 구조로 전환 검토`

카운터: channels?part=statistics 10개 viewCount 합산 / localStorage `rc_counter` {v,t,vps} / 기본 vps 0.5, 1시간마다 재fetch / 실패 폴백 **56923406** / 슬롯 롤링
portfolio-data-compact.json: 456건, 스키마 `{i: videoId, t: 제목, v: 조회수, s: 정렬값, c: 채널명}` / 채널별 건수: 하원장 강동현 132, 바른의사 백승우 110, 친절한 송이씨 86, 이바다이야기 47, 우선이선우 29, 이태호 수의사 28, 태오네모세모 10, 권의시선 10, Prepatina 차랑꾼 4 / 셔플 후 2회 append 마퀴, 링크 youtube.com/watch?v={i}, 썸네일 i.ytimg.com/vi/{i}/mqdefault.jpg (onerror hqdefault) / 호버: 채널명·제목·`조회수 X.X만` / 속도 상수 BASE 0.35, FAST 32, DECEL 0.92, ACCEL 0.8, BLUR 8

## 7. SEO / 추적

| 페이지 | title | og:url |
|---|---|---|
| index | RECOCULTURE \| 전문직 유튜브 미디어 브랜딩 | https://recoculture.com/ |
| services | 서비스 \| RECOCULTURE | /services.html |
| careers | 채용 \| RECOCULTURE | /careers.html |
| blog | 블로그 \| RECOCULTURE \| 전문직 유튜브 브랜딩 | /blog.html |
| portfolio | 포트폴리오 \| RECOCULTURE | /portfolio.html |

공통: og:type website, og:image /assets/og-image.png (1200×630), og:locale ko_KR, twitter:card summary_large_image, lang ko
추적 스니펫: GA/GTM, Meta Pixel, 네이버·구글 site-verification, Clarity/Hotjar **모두 없음**. 외부 호출은 Google Fonts, YouTube Data API, formsubmit.co, img.youtube.com/i.ytimg.com 뿐
robots.txt: `User-agent: *` / `Allow: /` / `Sitemap: https://recoculture.com/sitemap.xml`
sitemap 6 URL: / (1.0 weekly), /portfolio.html (0.9 weekly), /services.html (0.9 monthly), /careers.html (0.8 monthly), /blog.html (0.9 weekly), /blog/welcome.html (0.7 monthly)
404.html: meta refresh 0 → /

## 8. 폰트 & 컬러 (styles.css :root)

Google Fonts: `https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap`

```css
--bg:#0A0A0B; --bg-card:#111113; --bg-elevated:#18181B; --bg-secondary:#0F0F11;
--text:#EDEDED; --text-secondary:#A1A1AA; --text-muted:#71717A;
--orange:#ED6C00; --orange-hover:#FF7A0D; --orange-glow:rgba(237,108,0,0.15); --orange-subtle:rgba(237,108,0,0.06);
--green:#22C55E; --red:#EF4444;
--border:rgba(255,255,255,0.06); --border-hover:rgba(255,255,255,0.12); --border-orange:rgba(237,108,0,0.3);
--max-w:1200px; --side-pad:clamp(20px,5vw,80px); --section-pad:clamp(80px,10vw,140px); --radius:16px; --radius-sm:10px;
--font-display:'Syne',sans-serif; --font-body:'Noto Sans KR',sans-serif; --font-mono:'JetBrains Mono',monospace;
--ease-out:cubic-bezier(0.16,1,0.3,1);
```

에셋: assets/favicon.ico (16/32 ico), og-image.png 1200×630, logo-dark.png / logo-light.png (1000×1000, 실제는 JPEG 데이터), images/funnel.png 293×334

## 9. 재구축 시 정리할 불일치
1. 운영 채널 수: index hero `10+` / services `50+` / index About `9` / CHANNELS 배열 10개
2. 채용 영상 편집자: 태그 `정규직` vs 본문 `계약직 (3개월)`
3. 채널명 표기: `이바다 이야기`/`이바다이야기`, `권의 시선`/`권의시선`
4. API 키 평문 2곳 — 재발급 또는 referrer 제한 + 빌드 타임 캐싱
5. CHANNEL_COLORS 미사용
6. CHANNELS 뒤 6개 ID 이름 미확정
7. 블로그 템플릿(build-blog.js)에 전화번호 010-2749-5144, CTA `무료 상담`, 메뉴 `Home` 등 본 페이지와 다른 구버전 잔존

## 10. 인프라 메모

- 배포: GitHub Pages, `peaceiris/actions-gh-pages`, CNAME `recoculture.com`, `.nojekyll`
- 2026-08-28부터 `publish_dir: ./maintenance` (임시 페이지, noindex). 라이브 전환 시 `.`로 변경하고 `maintenance/` 삭제
- FormSubmit: 수신 이메일을 바꾸면 첫 1회 해당 주소로 인증 메일이 오고 Activate 링크를 눌러야 한다
- YouTube Data API 키는 옛 소스에 평문 노출되어 있었다. 재사용하려면 Google Cloud 콘솔에서 HTTP referrer(recoculture.com) 제한을 걸거나 재발급한다
- 옛 블로그 파이프라인: `content/blog/*.md` → `scripts/build-blog.js`(marked) → `blog/*.html` + `data/blog-posts.json` + `sitemap.xml`. 원본 마크다운은 `content/blog/`에 남겨 두었다
- 퍼널 이미지: `docs/funnel.png` (293×334)
- 영상 데이터: `docs/portfolio-data.json` (456건)
