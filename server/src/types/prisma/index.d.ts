declare module "@prisma/client" {
  export class PrismaClient {
    [key: string]: any;
    constructor(options?: any);
    $transaction?: any;
  }

  export enum EmailAccountStatus {
    PENDING = "PENDING",
    CREATED = "CREATED",
  }

  export namespace Prisma {
    export type AngajatSelect = Record<string, unknown>;
    export type AngajatWhereInput = Record<string, unknown>;
  }

  export enum ProcesVerbalTip {
    PREDARE_PRIMIRE = "PREDARE_PRIMIRE",
    RESTITUIRE = "RESTITUIRE",
    SCHIMB = "SCHIMB",
  }
}
