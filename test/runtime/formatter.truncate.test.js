import { describe, it, expect } from 'vitest';
import i18next from '../../src/i18next.js';

describe('truncate formatter', () => {
  it('supports the truncate formatter', async () => {
    const i18n = i18next.createInstance();
    await i18n.init({
      lng: 'en',
      resources: {
        en: { translation: { title: 'Title: {{title, truncate(maxLength: 10)}}' } },
      },
    });

    const result = i18n.t('title', { title: 'A very long title that should be truncated' });

    expect(typeof result).toBe('string');
    expect(result).toBeTruthy();
  });
});
