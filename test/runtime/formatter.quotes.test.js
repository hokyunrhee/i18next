import { describe, it, expect } from 'vitest';
import i18next from '../../src/i18next.js';

describe('formatter options', () => {
  it('accepts double-quoted option values', async () => {
    const i18n = i18next.createInstance();
    await i18n.init({
      lng: 'en',
      resources: {
        en: { translation: { items: 'Items: {{items, list(style: "short"; type: "unit")}}' } },
      },
    });

    expect(typeof i18n.t('items', { items: ['a', 'b'] })).toBe('string');
  });
});
