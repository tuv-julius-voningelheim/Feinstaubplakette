import { LANG, languageOf } from '@utils/date/locale.js';

import type { TableLangData } from './model.js';

export type { TableLangData };

let enTable: TableLangData | undefined;

const registry = new Map<string, TableLangData>();
const pendingLoads = new Map<string, Promise<unknown>>();

function getEnTable(): TableLangData {
    if (!enTable) {
        // Inline English so the module is self-contained and has no circular dep.
        enTable = {
            searchPlaceholder: 'Search…',
            searchAriaLabel: 'Search',
            pageSizeLabel: 'Show',
            pageSizeSuffix: 'entries',
            pageSizeAriaLabel: 'Items per page',
            showingEntries: (from, to, total) => `Showing ${from} to ${to} of ${total} entries`,
            noData: 'No data',
        };
        registry.set(LANG.EN, enTable);
    }
    return enTable;
}

export function registerTableLocale(lang: string, data: TableLangData): void {
    registry.set(lang, data);
}

/**
 * Each entry is a literal `import()` so Vite / Rollup can statically analyze
 * the graph and emit a separate lazy-loaded chunk per locale.
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

export async function loadTableLocale(locale?: string): Promise<void> {
    const lang = languageOf(locale);
    if (lang === LANG.EN || registry.has(lang)) return;

    const pending = pendingLoads.get(lang);
    if (pending) {
        await pending;
        return;
    }

    const loader = LANG_LOADERS[lang];
    if (!loader) return;

    const p = loader().catch(() => {
        /* locale not yet translated – fall back to English */
    });
    pendingLoads.set(lang, p);
    await p;
}

export function getTableLocale(locale?: string): TableLangData {
    const lang = languageOf(locale);
    return registry.get(lang) ?? getEnTable();
}
