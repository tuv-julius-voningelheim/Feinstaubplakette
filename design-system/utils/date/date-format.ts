import { getCalendarDatePlaceholder, getCalendarLocale } from './calendar-i18n.js';
import { LOCALE, normalizeLocale } from './locale.js';
import type { DateOrder, Locale } from './model.js';

function validYMD(y: number, m: number, d: number): boolean {
    if (y < 1900 || y > 2100) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export const DATE_ORDER = {
    DMY_DOT: 'DMY_DOT',
    DMY_SLASH: 'DMY_SLASH',
    MDY_SLASH: 'MDY_SLASH',
    YMD_SLASH: 'YMD_SLASH',
} as const;

const dateOrderByLocale: Record<Locale, DateOrder> = {
    [LOCALE.DE_DE]: DATE_ORDER.DMY_DOT,
    [LOCALE.DE_AT]: DATE_ORDER.DMY_DOT,
    [LOCALE.DE_CH]: DATE_ORDER.DMY_SLASH,

    [LOCALE.EN_US]: DATE_ORDER.MDY_SLASH,
    [LOCALE.EN_GB]: DATE_ORDER.DMY_SLASH,
    [LOCALE.EN_CH]: DATE_ORDER.DMY_SLASH,
    [LOCALE.EN_IN]: DATE_ORDER.DMY_SLASH,
    [LOCALE.EN_SG]: DATE_ORDER.DMY_SLASH,

    [LOCALE.ES_ES]: DATE_ORDER.DMY_SLASH,
    [LOCALE.FR_FR]: DATE_ORDER.DMY_SLASH,
    [LOCALE.FR_CH]: DATE_ORDER.DMY_SLASH,
    [LOCALE.IT_IT]: DATE_ORDER.DMY_SLASH,
    [LOCALE.IT_CH]: DATE_ORDER.DMY_SLASH,
    [LOCALE.DA_DK]: DATE_ORDER.DMY_SLASH,

    [LOCALE.ZH_CN]: DATE_ORDER.YMD_SLASH,
    [LOCALE.RU_RU]: DATE_ORDER.DMY_DOT,
    [LOCALE.TR_TR]: DATE_ORDER.DMY_DOT,
};

export function getDateOrder(locale?: string): DateOrder {
    return dateOrderByLocale[normalizeLocale(locale)];
}

export function getDateSeparator(locale?: string): '.' | '/' {
    return getDateOrder(locale) === DATE_ORDER.DMY_DOT ? '.' : '/';
}

export function formatDateByLocale(d: Date, locale?: string): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const order = getDateOrder(locale);

    if (order === DATE_ORDER.DMY_DOT) return `${dd}.${mm}.${yyyy}`;
    if (order === DATE_ORDER.DMY_SLASH) return `${dd}/${mm}/${yyyy}`;
    if (order === DATE_ORDER.YMD_SLASH) return `${yyyy}/${mm}/${dd}`;
    return `${mm}/${dd}/${yyyy}`;
}

export function parseByLocale(s: string | null | undefined, locale?: string): Date | undefined {
    if (!s) return undefined;
    const t = s.trim();
    if (!t) return undefined;

    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
        const [y, m, d] = t.split('-').map(Number);
        if (!validYMD(y!, m!, d!)) return undefined;
        return new Date(y!, m! - 1, d!);
    }

    const order = getDateOrder(locale);

    if (order === DATE_ORDER.DMY_DOT) {
        const m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        if (!m) return undefined;
        const dd = Number(m[1]),
            mm = Number(m[2]),
            yyyy = Number(m[3]);
        if (!validYMD(yyyy, mm, dd)) return undefined;
        return new Date(yyyy, mm - 1, dd);
    }

    if (order === DATE_ORDER.DMY_SLASH) {
        const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!m) return undefined;
        const dd = Number(m[1]),
            mm = Number(m[2]),
            yyyy = Number(m[3]);
        if (!validYMD(yyyy, mm, dd)) return undefined;
        return new Date(yyyy, mm - 1, dd);
    }

    if (order === DATE_ORDER.YMD_SLASH) {
        const m = t.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
        if (!m) return undefined;
        const yyyy = Number(m[1]),
            mm = Number(m[2]),
            dd = Number(m[3]);
        if (!validYMD(yyyy, mm, dd)) return undefined;
        return new Date(yyyy, mm - 1, dd);
    }

    {
        const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!m) return undefined;
        const mm = Number(m[1]),
            dd = Number(m[2]),
            yyyy = Number(m[3]);
        if (!validYMD(yyyy, mm, dd)) return undefined;
        return new Date(yyyy, mm - 1, dd);
    }
}

export function getDatePlaceholder(locale?: string): string {
    return getCalendarDatePlaceholder(locale, getDateOrder(locale));
}

export function getDatePattern(locale?: string): string {
    const year = '(19\\d{2}|20\\d{2}|2100)';
    const day = '(0[1-9]|[12][0-9]|3[01])';
    const month = '(0[1-9]|1[0-2])';
    const order = getDateOrder(locale);
    if (order === DATE_ORDER.DMY_DOT) return `^${day}\\.${month}\\.${year}$`;
    if (order === DATE_ORDER.DMY_SLASH) return `^${day}\\/${month}\\/${year}$`;
    if (order === DATE_ORDER.YMD_SLASH) return `^${year}\\/${month}\\/${day}$`;
    return `^${month}\\/${day}\\/${year}$`;
}

export function maskDateInput(value: string, locale?: string): string {
    const sep = getDateSeparator(locale);

    // normalize unicode digits etc.
    const raw = (value ?? '').normalize('NFKC');

    // keep only digits + locale separator
    const cleaned = raw.replace(new RegExp(`[^0-9\\${sep}]`, 'g'), '');

    // hard max length
    return cleaned.slice(0, 10);
}

export function formatShortRangeDate(d: Date, locale?: string): string {
    const m = getCalendarLocale(locale).monthsShort[d.getMonth()];
    return `${m} ${d.getDate()}`;
}

export function formatToISO(input: string, locale?: string): string {
    const d = parseByLocale(input, locale);
    if (!d) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
