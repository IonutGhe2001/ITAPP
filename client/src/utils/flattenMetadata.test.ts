import { describe, it, expect } from 'vitest';
import flattenMetadata from './flattenMetadata';

describe('flattenMetadata', () => {
  it('flattens nested objects', () => {
    const data = { a: { b: 1, c: { d: 2 } }, e: 3 };
    expect(flattenMetadata(data)).toEqual([
      ['a.b', '1'],
      ['a.c.d', '2'],
      ['e', '3'],
    ]);
  });

  it('handles arrays', () => {
    const data = { arr: [1, { nested: 2 }, 'three'] };
    expect(flattenMetadata(data)).toEqual([['arr', '1, {"nested":2}, three']]);
  });
});