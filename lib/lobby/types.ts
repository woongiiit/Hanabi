export type RoomSummary = {
  id: string;
  title: string;
  playerCount: number;
  createdAt: number;
  mode: "online" | "local";
};

