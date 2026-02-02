import { CreateRoomClient } from "@/components/lobby/CreateRoomClient";
import { Suspense } from "react";

export default function CreateRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-night-950" />}>
      <CreateRoomClient />
    </Suspense>
  );
}

