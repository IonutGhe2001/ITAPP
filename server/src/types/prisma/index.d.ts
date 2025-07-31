declare module '@prisma/client' {
  export class PrismaClient {
    [key: string]: any;
    constructor(options?: any);
    $transaction?: any;
  }

  export namespace Prisma {}

  export enum ProcesVerbalTip {
    PREDARE_PRIMIRE = 'PREDARE_PRIMIRE',
    RESTITUIRE = 'RESTITUIRE',
    SCHIMB = 'SCHIMB',
  }
}