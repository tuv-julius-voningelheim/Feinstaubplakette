import { LANG, languageOf, normalizeLocale } from '@utils/date/locale.js';

import { enDropzone } from '../translations/en.js';
import type { DropzoneErrorRule, DropzoneLangData, DropzoneLocale, DropzoneTitles } from './model.js';

export type { DropzoneErrorRule, DropzoneLangData, DropzoneLocale, DropzoneTitles };

export function normalizeKey(locale?: string): DropzoneLocale {
    return normalizeLocale(locale);
}

const registry = new Map<string, DropzoneLangData>([[LANG.EN, enDropzone]]);
const pendingLoads = new Map<string, Promise<unknown>>();

export function registerDropzoneLocale(lang: string, data: DropzoneLangData): void {
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

export async function loadDropzoneLocale(locale?: string): Promise<void> {
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

function getLangData(locale?: string): DropzoneLangData {
    return registry.get(languageOf(locale)) ?? enDropzone;
}

export function getDropzoneTitles(locale?: string): DropzoneTitles {
    return getLangData(locale).titles;
}

export function formatDropzoneError(
    locale: string,
    rule: DropzoneErrorRule,
    params?: Record<string, string | number>,
): string {
    return getLangData(locale).error[rule](params);
}

export function formatFileSize(locale: string, bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';

    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
    const value = bytes / Math.pow(k, i);

    const nf = new Intl.NumberFormat(normalizeLocale(locale), {
        maximumFractionDigits: i === 0 ? 0 : 2,
        minimumFractionDigits: 0,
    });

    return `${nf.format(value)} ${units[i]}`;
}
