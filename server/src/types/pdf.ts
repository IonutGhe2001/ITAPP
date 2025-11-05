export interface PdfGenerationInput {
  /** Optional Base64 digital signature image */
  digitalSignature?: string;
  /** Additional template data */
  [key: string]: unknown;
}
