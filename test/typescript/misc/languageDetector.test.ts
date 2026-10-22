import { describe, it } from 'vitest';
import { createInstance, LanguageDetectorAsyncModule, LanguageDetectorModule } from 'i18next';

describe('languageDetector', () => {
  it('accepts sync and async detectors', () => {
    let i18n = createInstance();
    i18n
      .use<LanguageDetectorModule>({
        type: 'languageDetector',
        detect: () => 'en',
      })
      .init();

    i18n = createInstance();
    i18n
      .use<LanguageDetectorAsyncModule>({
        type: 'languageDetector',
        async: true,
        detect: (clb) => clb('en'),
      })
      .init();

    i18n = createInstance();
    i18n
      .use<LanguageDetectorAsyncModule>({
        type: 'languageDetector',
        async: true,
        detect: async () => 'en',
      })
      .init();

    i18n = createInstance();
    i18n
      .use({
        type: 'languageDetector',
        async: true,
        detect: (clb: (lng: string) => void) => clb('en'),
      })
      .init();
  });
});
