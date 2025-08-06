import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

const puppeteer = {
  launch: jest.fn<(...args: any[]) => Promise<any>>(),
};
jest.mock('puppeteer', () => ({ __esModule: true, default: puppeteer }));

const { genereazaPDFProcesVerbal } = require('../src/utils/pdfGenerator');

let setContentHtml: string | null = null;

beforeEach(() => {
  puppeteer.launch.mockResolvedValue({
    newPage: jest.fn<(...args: any[]) => Promise<any>>()
      .mockResolvedValue({
        setContent: jest.fn<(html: string) => Promise<void>>(
          (html: string) => {
            setContentHtml = html;
            return Promise.resolve();
          },
        ),
        pdf: jest.fn<(...args: any[]) => Promise<Buffer>>()
          .mockResolvedValue(Buffer.from('PDF')),
      }),
    close: jest.fn(),
  });
});

afterEach(() => {
  setContentHtml = null;
  jest.clearAllMocks();
});

describe('genereazaPDFProcesVerbal', () => {
  it('embeds digital signature data URL when provided', async () => {
    const sig = 'data:image/png;base64,test';
    await genereazaPDFProcesVerbal({ digitalSignature: sig });
    expect(setContentHtml).toContain(sig);
  });
});