import { describe, it, expect } from 'vitest';
import { handleApiError } from './apiError';

describe('handleApiError', () => {
  it('returns API message when present', () => {
    const err = { response: { data: { message: 'server says hi' } } };
    expect(handleApiError(err, 'fallback')).toBe('server says hi');
  });

  it('falls back to error field', () => {
    const err = { response: { data: { error: 'bad request' } } };
    expect(handleApiError(err, 'fallback')).toBe('bad request');
  });

  it('uses fallback when no response message', () => {
    const err = { response: { data: {} } };
    expect(handleApiError(err, 'fallback')).toBe('fallback');
  });
});
