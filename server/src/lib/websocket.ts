import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

export interface Update {
  id: string;
  type: 'Echipament' | 'Coleg' | 'SIM';
  message: string;
  timestamp: Date;
}

let io: Server | null = null;
const updates: Update[] = [];

export const initWebSocket = (server: HTTPServer, allowedOrigins: string[]) => {
  io = new Server(server, {
    cors: { origin: allowedOrigins, credentials: true },
  });
};

export const emitUpdate = (update: Omit<Update, 'id' | 'timestamp'>) => {
  const finalUpdate: Update = {
    id: Date.now().toString(),
    timestamp: new Date(),
    ...update,
  };
  updates.push(finalUpdate);
  if (updates.length > 50) updates.shift();
  io?.emit('update', finalUpdate);
};

export const getRecentUpdates = () => updates.slice().reverse();