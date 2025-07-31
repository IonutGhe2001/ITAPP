declare module '@prisma/client' {
  export class PrismaClient {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export type Prisma = any;
  export enum ProcesVerbalTip {
    PREDARE_PRIMIRE = 'PREDARE_PRIMIRE',
    RESTITUIRE = 'RESTITUIRE',
    SCHIMB = 'SCHIMB',
  }
}