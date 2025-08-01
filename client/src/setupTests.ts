import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

interface GlobalWithResizeObserver {
  ResizeObserver: typeof ResizeObserver;
}

(globalThis as GlobalWithResizeObserver).ResizeObserver =
  (globalThis as GlobalWithResizeObserver).ResizeObserver || ResizeObserver;