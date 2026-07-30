import { DateTime } from 'luxon';

import { formatToISO } from '@utils/date/date-format.js';
import { formatDateByLocale } from '@utils/date/date-format.js';

export function buildMeta(value: Date | undefined, locale?: string, isUtc = false) {
    if (!value) return null;

    if (isUtc) {
        const y = value.getFullYear();
        const m = value.getMonth() + 1;
        const d = value.getDate();

        const dt = DateTime.utc(y, m, d).setLocale(locale || 'en');
        const iso = dt.toISODate();

        return {
            iso,
            timestamp: dt.toMillis(),
            weekday: dt.weekday,
            weekNumber: dt.weekNumber,
            month: dt.month,
            year: dt.year,
            isValid: dt.isValid,
            luxon: dt,
            utc: isUtc,
            timezone: dt.zoneName,
            offsetNameShort: dt.offsetNameShort,
            daysInYear: dt.daysInYear,
            daysInMonth: dt.daysInMonth,
            isInLeapYear: dt.isInLeapYear,
        };
    }

    const localString = formatDateByLocale(value, locale);
    const iso = formatToISO(localString, locale);
    const dt = DateTime.fromISO(iso).setLocale(locale || 'en');

    return {
        iso,
        timestamp: dt.toMillis(),
        weekday: dt.weekday,
        weekNumber: dt.weekNumber,
        month: dt.month,
        year: dt.year,
        isValid: dt.isValid,
        luxon: dt,
        utc: isUtc,
        timezone: dt.zoneName,
        offsetNameShort: dt.offsetNameShort,
        daysInYear: dt.daysInYear,
        daysInMonth: dt.daysInMonth,
        isInLeapYear: dt.isInLeapYear,
    };
}

export function buildDateValue(value: Date | undefined): string {
    if (!value) return '';

    return DateTime.utc(value.getFullYear(), value.getMonth() + 1, value.getDate()).toISODate()!;
}
