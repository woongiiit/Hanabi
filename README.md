# Hanabi Web (MVP)

`project_plan.md`를 기반으로 만든 **웹 하나비 MVP**입니다.

## 기능(현재 구현)
- **코어 룰**: 덱/셔플/카드 분배, 힌트(색/숫자), 버리기(힌트 +1), 내려놓기(성공/실패), 생명/힌트 토큰, 덱 소진 후 마지막 턴, 점수 계산
- **정보 비대칭(UI)**: 내 손패는 뒷면으로 표시되고, 힌트로 알게 된 정보만 표시
- **UI/UX**: Mobile-First, 어두운 밤하늘 테마 + 간단한 불꽃 파티클(Framer Motion)
- **실시간 동기화(옵션)**: Supabase Realtime 브로드캐스트 기반(ENV가 있을 때만 활성)

## 로컬 실행(Windows PowerShell)
1) 의존성 설치

```powershell
npm install
```

2) 개발 서버

```powershell
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 플레이 방법(로컬 모드)
- 홈에서 “새 게임 생성” 클릭
- 다른 플레이어 시점 테스트는 URL의 `me` 또는 상단 드롭다운으로 변경
  - 예: `/room/ABC123?mode=local&me=P2`

## 온라인 모드(Supabase Realtime)
1) `.env.local` 생성 후 값 입력

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

2) 룸 URL에 `mode=online`을 붙여 접속
- 예: `/room/ABC123?mode=online&me=P1`
- 다른 브라우저/기기에서 `/room/ABC123?mode=online&me=P2`

> 참고: 현재 온라인 모드는 **브로드캐스트 기반 동기화 MVP**라서 “서버 권위(authoritative server)”가 없습니다.
> 실서비스 수준의 치팅 방지/완전한 보안(자기 패 값 비공개)은 서버/DB 기반으로 추가 구현이 필요합니다.

## Railway 배포
- `Dockerfile`과 `railway.json` 포함
- Railway에서 GitHub 연동 후 배포하면 됩니다.

