import { formatDateByLocale } from './date-format.js';

const addDays = (d: Date, days: number): Date => {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    x.setHours(0, 0, 0, 0);
    return x;
};

const startOfWeek = (base: Date): Date => {
    const day = base.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
};

const endOfWeek = (monday: Date): Date => addDays(monday, 6);

export function rangeThisWeek(base: Date, locale?: string) {
    const monday = startOfWeek(base);
    const sunday = endOfWeek(monday);
    return {
        start: formatDateByLocale(monday, locale),
        end: formatDateByLocale(sunday, locale),
    };
}

export function rangeNextWeek(base: Date, locale?: string) {
    const thisMonday = startOfWeek(base);
    const nextMonday = addDays(thisMonday, 7);
    const nextSunday = endOfWeek(nextMonday);
    return {
        start: formatDateByLocale(nextMonday, locale),
        end: formatDateByLocale(nextSunday, locale),
    };
}

export function rangeNextNWeeksBlock(base: Date, weeks: number, locale?: string) {
    const thisMonday = startOfWeek(base);
    const nextMonday = addDays(thisMonday, 7);
    const end = addDays(nextMonday, weeks * 7 - 1);
    return {
        start: formatDateByLocale(nextMonday, locale),
        end: formatDateByLocale(end, locale),
    };
}

const startOfMonth = (base: Date) => new Date(base.getFullYear(), base.getMonth(), 1);

const endOfMonth = (base: Date) => new Date(base.getFullYear(), base.getMonth() + 1, 0);

export function rangeThisMonth(base: Date, locale?: string) {
    const start = startOfMonth(base);
    const end = endOfMonth(base);
    return {
        start: formatDateByLocale(start, locale),
        end: formatDateByLocale(end, locale),
    };
}

export function rangeNextMonth(base: Date, locale?: string) {
    const start = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    const end = new Date(base.getFullYear(), base.getMonth() + 2, 0);
    return {
        start: formatDateByLocale(start, locale),
        end: formatDateByLocale(end, locale),
    };
}

export function getShortcutRange(index: number, locale?: string) {
    const base = new Date();

    switch (index) {
        case 0:
            return rangeThisWeek(base, locale);

        case 1:
            return rangeNextWeek(base, locale);

        case 2:
            return rangeNextNWeeksBlock(base, 2, locale);

        case 3:
            return rangeNextNWeeksBlock(base, 3, locale);

        case 4:
            return rangeNextNWeeksBlock(base, 4, locale);

        case 5:
            return rangeThisMonth(base, locale);

        case 6:
            return rangeNextMonth(base, locale);

        default:
            return { start: '', end: '' };
    }
}
