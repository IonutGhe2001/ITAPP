const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const puppeteer = { launch: jest.fn() };
jest.mock('puppeteer', () => ({ __esModule: true, default: puppeteer }));
const { genereazaPDFProcesVerbal } = require('../src/utils/pdfGenerator');

let setContentHtml = null;

beforeEach(() => {
  puppeteer.launch.mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setContent: jest.fn((html) => {
        setContentHtml = html;
        return Promise.resolve();
      }),
      pdf: jest.fn().mockResolvedValue(Buffer.from('PDF')),
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