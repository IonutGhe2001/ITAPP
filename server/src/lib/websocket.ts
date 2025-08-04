import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

export interface Update {
  id: string;
  type: "Echipament" | "Coleg" | "SIM";
  message: string;
  importance?: "high" | "normal";
  timestamp: Date;
}

let io: Server | null = null;
const updates: Update[] = [];

export const initWebSocket = (server: HTTPServer, allowedOrigins: string[]) => {
  io = new Server(server, {
    cors: { origin: allowedOrigins, credentials: true },
  });
};

export const emitUpdate = (update: Omit<Update, "id" | "timestamp">) => {
  const finalUpdate: Update = {
    id: Date.now().toString(),
    timestamp: new Date(),
    importance: "normal",
    ...update,
  };
  updates.push(finalUpdate);
  if (updates.length > 50) updates.shift();
  io?.emit("update", finalUpdate);
};

/**
 * Returns recent updates in reverse chronological order.
 * When `importance` is set to `"high"`, only high-importance updates are returned.
 */
export const getRecentUpdates = (importance?: "high" | "normal") => {
  const filtered =
    importance === "high"
      ? updates.filter((u) => u.importance === "high")
      : updates;
  return filtered.slice().reverse();
};
