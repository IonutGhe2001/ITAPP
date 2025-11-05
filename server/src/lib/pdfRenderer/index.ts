import puppeteer, { Browser, Page } from "puppeteer";
import { logger } from "@lib/logger";

let browserPromise: Promise<Browser> | null = null;

const launchBrowser = async (): Promise<Browser> => {
  const launchArgs = process.env.PUPPETEER_ARGS
    ? process.env.PUPPETEER_ARGS.split(" ").filter(Boolean)
    : undefined;
  const browser = await puppeteer.launch({
    headless: true,
    args: launchArgs,
  });
  return browser;
};

export const initPdfRenderer = () => {
  if (!browserPromise) {
    browserPromise = launchBrowser().catch((error) => {
      browserPromise = null;
      logger.error("Failed to launch Puppeteer for PDF exports", { error });
      throw error;
    });
  }
  return browserPromise;
};

export const withPdfPage = async <T>(handler: (page: Page) => Promise<T>) => {
  const browser = await initPdfRenderer();
  const page = await browser.newPage();
  try {
    return await handler(page);
  } finally {
    try {
      await page.close();
    } catch (error) {
      logger.warn("Failed to close Puppeteer page", { error });
    }
  }
};

export const closePdfRenderer = async () => {
  if (!browserPromise) {
    return;
  }
  try {
    const browser = await browserPromise;
    await browser.close();
  } catch (error) {
    logger.warn("Failed to close Puppeteer browser", { error });
  } finally {
    browserPromise = null;
  }
};
