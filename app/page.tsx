import Link from "next/link";
import { NightSky } from "@/components/NightSky";

function randomRoomId() {
  // human-friendly short id
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function HomePage() {
  const roomId = randomRoomId();

  return (
    <main className="relative min-h-dvh">
      <NightSky />
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-10">
        <header className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-slate-300/80">Hanabi Web</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">온라인 하나비 (웹)</h1>
          <p className="mt-3 text-slate-200/80">
            모바일 우선 UI로 빠르게 시작할 수 있는 MVP입니다. Supabase 환경변수가 없으면 로컬(단일 브라우저)
            모드로 동작합니다.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold">로컬 게임 시작</h2>
            <p className="mt-2 text-sm text-slate-200/80">
              같은 브라우저에서 플레이어를 바꿔가며 테스트할 수 있습니다. (보안은 UI 필터링 수준)
            </p>
            <Link className="btn-primary mt-4 w-full" href={`/room/${roomId}?mode=local&me=P1`}>
              새 게임 생성
            </Link>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold">룸에 참가</h2>
            <p className="mt-2 text-sm text-slate-200/80">
              URL로 공유받은 룸에 들어가세요. 예: <code className="rounded bg-white/10 px-1">/room/ABC123?me=P2</code>
            </p>
            <div className="mt-4 text-sm text-slate-200/80">
              룸 ID를 알고 있다면 주소창에 직접 입력하면 됩니다.
            </div>
          </div>
        </section>

        <footer className="mt-auto pt-10 text-center text-xs text-slate-300/70">
          Next.js + Tailwind + Framer Motion + Zustand
        </footer>
      </div>
    </main>
  );
}

