# 프로젝트명: Hanabi Web (Online Multiplayer)

## 1. 프로젝트 개요
보드게임 '하나비(Hanabi)'를 웹 브라우저에서 실시간 멀티플레이로 즐길 수 있도록 개발한다. PC와 모바일 모든 환경에서 최적화된 UX를 제공하며, 하나비의 테마인 '불꽃놀이' 에셋을 활용해 높은 완성도의 UI를 구현한다.

## 2. 저장소 및 배포 정보
- **GitHub Repository:** [https://github.com/woongiiit/Hanabi](https://github.com/woongiiit/Hanabi)
- **Deployment Platform:** Railway (GitHub 연동 자동 배포)
- **CI/CD 전략:** `main` 브랜치 푸시 시 Railway를 통해 실시간 배포 진행

## 3. 핵심 메커니즘
- **정보 비대칭:** 자신의 패는 가려지고(뒷면), 타인의 패만 보여야 함(앞면).
- **실시간 동기화:** 플레이어의 모든 행동(힌트, 버리기, 내려놓기)이 실시간으로 모든 클라이언트에 반영.
- **게임 자원 관리:** 힌트 토큰(8개), 생명 토큰(3개), 덱(Deck), 더미(Discard), 불꽃놀이 완성 스택.

## 4. 기술 스택
- **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion
- **Real-time Engine:** Supabase Realtime 또는 Firebase (실시간 상태 동기화)
- **Styling:** 모바일 우선(Mobile-First) 반응형 디자인

## 5. 디자인 및 UI/UX 가이드라인
- **비주얼 컨셉:** - 어두운 밤하늘 배경(Dark Theme)에 화려한 불꽃놀이 그래픽 에셋 활용.
  - 카드가 성공적으로 배치될 때마다 화려한 파티클 이펙트(불꽃) 발생.
- **반응형 최적화:**
  - **Mobile:** 하단 고정 내 카드 영역, 상단 스크롤/슬라이드 방식의 상대방 카드 영역.
  - **PC:** 넓은 대시보드 형태의 레이아웃.
- **접근성:** 터치 기반 인터랙션(드래그 앤 드롭 또는 롱탭) 고려.

## 6. 개발 로직 상세 로드맵

### Phase 1: 기반 구축 (Setup)
- [ ] Next.js 프로젝트 초기화 및 깃허브 저장소(`woongiiit/Hanabi`) 연결
- [ ] Railway 환경 설정 및 배포 테스트
- [ ] 전역 상태 관리(Zustand 등) 구축

### Phase 2: 게임 엔진 (Core Logic)
- [ ] 셔플 및 인원별 카드 분배 로직
- [ ] 실시간 데이터베이스 연동 (행동 로그 및 상태 동기화)
- [ ] 내 카드의 실제 값을 가리는 보안 로직 (UI 필터링)

### Phase 3: UI/UX 및 에셋 적용
- [ ] 불꽃놀이 컨셉 테마 적용 (이미지 에셋 및 애니메이션)
- [ ] 모바일/PC 반응형 레이아웃 완성
- [ ] 힌트 주기 모달 및 효과 알림 UI

### Phase 4: 게임 고도화
- [ ] 최종 점수 계산 및 결과 화면 구현
- [ ] 사운드 이펙트(불꽃 소리, 토큰 소리) 추가

## 7. Cursor를 위한 프롬프트 지시사항
"이 프로젝트는 `https://github.com/woongiiit/Hanabi`에 배포될 예정이야. 
1. 먼저 프로젝트의 폴더 구조를 Next.js App Router 기준으로 잡아줘. 
2. 모바일 사용자를 위해 `Mobile-First` 레이아웃을 최우선으로 구현하고, 어두운 밤하늘 테마를 Tailwind CSS로 설정해줘. 
3. Railway 배포를 위해 필요한 `Dockerfile`이나 `railway.json` 설정이 필요하다면 함께 제안해줘."