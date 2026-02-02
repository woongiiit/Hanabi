import { JoinRoomClient } from "@/components/lobby/JoinRoomClient";
import { Suspense } from "react";

export default function JoinRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-night-950" />}>
      <JoinRoomClient />
    </Suspense>
  );
}

