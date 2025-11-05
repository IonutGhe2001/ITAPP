import '@testing-library/jest-dom';

class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

type GlobalWithResizeObserver = typeof globalThis & {
  ResizeObserver?: typeof ResizeObserver;
};

const globalWithResizeObserver = globalThis as GlobalWithResizeObserver;

globalWithResizeObserver.ResizeObserver = globalWithResizeObserver.ResizeObserver ?? ResizeObserver;
