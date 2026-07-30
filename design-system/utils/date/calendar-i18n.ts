import { enCalendar } from '../translations/en.js';
import { LANG, languageOf } from './locale.js';
import type { DateOrder, DateValidationRule, LangData } from './model.js';

const registry = new Map<string, LangData>([[LANG.EN, enCalendar]]);
const pendingLoads = new Map<string, Promise<unknown>>();

export function registerCalendarLocale(lang: string, data: LangData): void {
    registry.set(lang, data);
}

/**
 * Each entry is an explicit `import()` with a literal path so both Vite and
 * Rollup can statically analyze the graph and emit a separate lazy-loaded
 * chunk per locale.
 */
const LANG_LOADERS: Record<string, () => Promise<unknown>> = {
    [LANG.DE]: () => import('../translations/de.js'),
    [LANG.ES]: () => import('../translations/es.js'),
    [LANG.FR]: () => import('../translations/fr.js'),
    [LANG.IT]: () => import('../translations/it.js'),
    [LANG.ZH]: () => import('../translations/zh-cn.js'),
    [LANG.RU]: () => import('../translations/ru.js'),
    [LANG.TR]: () => import('../translations/tr.js'),
    [LANG.DA]: () => import('../translations/da.js'),
};

export async function loadCalendarLocale(locale?: string): Promise<void> {
    const lang = languageOf(locale);
    if (lang === LANG.EN || registry.has(lang)) return;

    const pending = pendingLoads.get(lang);
    if (pending) {
        await pending;
        return;
    }

    const loader = LANG_LOADERS[lang];
    if (!loader) return;

    const p = loader().catch();
    pendingLoads.set(lang, p);
    await p;
}

function getLangData(locale?: string): LangData {
    return registry.get(languageOf(locale)) ?? enCalendar;
}

export function getCalendarLocale(locale?: string) {
    return getLangData(locale).calendarText;
}

export function formatCalendarError(
    locale: string | undefined,
    rule: DateValidationRule,
    params?: Record<string, string | number>,
) {
    return getLangData(locale).error[rule](params);
}

export function getCalendarButtons(locale?: string) {
    return getLangData(locale).buttons;
}

export function getCalendarAriaLabels(locale?: string) {
    return getLangData(locale).aria;
}

export function getRangeDialogLabels(locale?: string) {
    return getLangData(locale).rangeDialog;
}

export function getCalendarShortcuts(locale?: string): Record<number, string> {
    return getLangData(locale).shortcuts;
}

export function getCalendarDatePlaceholder(locale: string | undefined, order: DateOrder): string {
    return getLangData(locale).datePlaceholders?.[order] ?? enCalendar.datePlaceholders![order]!;
}

export const fallbackLabels = new Proxy({} as Record<string, { start: string; end: string }>, {
    get(_target, lang: string) {
        return getLangData(lang).fallback;
    },
});

export function getShortcutLabel(locale: string | undefined, index: number): string | undefined {
    return getCalendarShortcuts(locale)[index];
}

export function getFallbackLabels(locale?: string): { start: string; end: string } {
    return getLangData(locale).fallback;
}
