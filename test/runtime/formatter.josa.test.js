import { describe, it, expect, beforeAll } from 'vitest';
import i18next from '../../src/i18next.js';

describe('josa formatter (한국어 조사)', () => {
  let i18n;

  beforeAll(async () => {
    i18n = i18next.createInstance();
    await i18n.init({
      lng: 'ko',
      resources: {
        ko: {
          translation: {
            topic: '{{word, josa}}',
            subject: '{{word, josa(pair: 이/가)}}',
            direction: '{{word, josa(pair: 으로/로)}}',
          },
        },
      },
    });
  });

  it.each([
    ['사과', '사과는'],
    ['수박', '수박은'],
    ['가', '가는'],
    ['힣', '힣은'],
    ['ힰ', 'ힰ는'],
    ['Apple', 'Apple는'],
    ['🍎', '🍎는'],
    ['🍉', '🍉은'],
    [3, '3는'],
  ])('은/는: %s → %s', (word, expected) => {
    expect(i18n.t('topic', { word })).toBe(expected);
  });

  it.each([
    ['물', '물이'],
    ['바다', '바다가'],
  ])('이/가: %s → %s', (word, expected) => {
    expect(i18n.t('subject', { word })).toBe(expected);
  });

  it.each([
    ['물', '물로'],
    ['집', '집으로'],
    ['바다', '바다로'],
  ])('으로/로: %s → %s', (word, expected) => {
    expect(i18n.t('direction', { word })).toBe(expected);
  });
});
