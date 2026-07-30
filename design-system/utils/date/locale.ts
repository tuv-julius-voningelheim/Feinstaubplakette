import type { Language, Locale } from './model.js';

export const LANG = {
    EN: 'en',
    DE: 'de',
    ES: 'es',
    FR: 'fr',
    IT: 'it',
    ZH: 'zh',
    RU: 'ru',
    TR: 'tr',
    DA: 'da',
} as const;

export const LANGUAGES: readonly Language[] = Object.values(LANG);

export const LOCALE = {
    DE_DE: 'de-DE',
    DE_AT: 'de-AT',
    DE_CH: 'de-CH',
    EN_US: 'en-US',
    EN_GB: 'en-GB',
    EN_CH: 'en-CH',
    EN_IN: 'en-IN',
    EN_SG: 'en-SG',
    ES_ES: 'es-ES',
    FR_FR: 'fr-FR',
    FR_CH: 'fr-CH',
    IT_IT: 'it-IT',
    IT_CH: 'it-CH',
    ZH_CN: 'zh-CN',
    RU_RU: 'ru-RU',
    TR_TR: 'tr-TR',
    DA_DK: 'da-DK',
} as const;

export const DEFAULT_LOCALE: Locale = LOCALE.EN_US;

const DEFAULT_LOCALE_BY_LANG: Record<Language, Locale> = {
    [LANG.EN]: LOCALE.EN_US,
    [LANG.DE]: LOCALE.DE_DE,
    [LANG.ES]: LOCALE.ES_ES,
    [LANG.FR]: LOCALE.FR_FR,
    [LANG.IT]: LOCALE.IT_IT,
    [LANG.ZH]: LOCALE.ZH_CN,
    [LANG.RU]: LOCALE.RU_RU,
    [LANG.TR]: LOCALE.TR_TR,
    [LANG.DA]: LOCALE.DA_DK,
};

const CANONICAL: Record<string, Locale> = {
    ...Object.fromEntries(Object.values(LOCALE).map(loc => [loc.toLowerCase(), loc])),
    ...DEFAULT_LOCALE_BY_LANG,
};

export function normalizeLocale(loc?: string): Locale {
    if (!loc) return DEFAULT_LOCALE;
    const key = loc.trim().replace(/\s+/g, '').replace(/_/g, '-').toLowerCase();
    return CANONICAL[key] || DEFAULT_LOCALE;
}

export function languageOf(locale?: string): Language {
    const lang = normalizeLocale(locale).split('-')[0] as Language;
    return LANGUAGES.includes(lang) ? lang : LANG.EN;
}
