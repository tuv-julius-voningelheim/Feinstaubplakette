import { DateTime } from 'luxon';

import { formatToISO, parseByLocale } from '@utils/date/date-format.js';

export const fire = (el: HTMLElement, name: string, start?: string, end?: string, locale?: string, isUtc = false) =>
    el.dispatchEvent(
        new CustomEvent(name, {
            detail: {
                start: buildValue(start, locale),
                end: buildValue(end, locale),
                locale,
                meta: {
                    start: buildMeta(start, locale, isUtc),
                    end: buildMeta(end, locale, isUtc),
                },
            },
            bubbles: true,
            composed: true,
        }),
    );

function buildValue(value: string | undefined, locale?: string) {
    const v = (value ?? '').trim();
    if (!v) return '';

    const parsed = parseByLocale(v, locale);
    if (!parsed) return '';

    const y = parsed.getFullYear();
    const m = parsed.getMonth() + 1;
    const d = parsed.getDate();

    return DateTime.utc(y, m, d).toISODate() || '';
}

function buildMeta(value: string | undefined, locale?: string, isUtc = false) {
    const v = (value ?? '').trim();
    if (!v) return null;

    if (isUtc) {
        const parsed = parseByLocale(v, locale);
        if (!parsed)
            return {
                iso: '',
                timestamp: 0,
                weekday: 0,
                weekNumber: 0,
                month: 0,
                year: 0,
                isValid: false,
                luxon: null,
                utc: isUtc,
                timezone: '',
                offsetNameShort: '',
                daysInYear: '',
                daysInMonth: '',
                isInLeapYear: '',
            };

        const y = parsed.getFullYear();
        const m = parsed.getMonth() + 1;
        const d = parsed.getDate();

        const dt = DateTime.utc(y, m, d).setLocale(locale || 'en');
        const iso = dt.toISODate() || '';

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

    const iso = formatToISO(v, locale);
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

export const internalStartInput = 'ts-internal-start-input';
export const internalEndInput = 'ts-internal-end-input';
export const internalMonthChange = 'ts-internal-month-change';
export const internalSelect = 'ts-internal-select';
export const internalShortcut = 'ts-internal-shortcut';
export const internalTrigger = 'ts-internal-trigger';

export const dateChange = 'ts-date-change';
export const dateRangeChange = 'ts-date-range-change';
export const dateStartChange = 'ts-date-start-change';
export const dateEndChange = 'ts-date-end-change';
export const dateApply = 'ts-date-apply';
export const dateCancel = 'ts-date-cancel';
export const datePreset = 'ts-date-preset-select';
export const dateShow = 'ts-show';
export const dateAfterShow = 'ts-after-show';
export const dateHide = 'ts-hide';
export const dateAfterHide = 'ts-after-hide';
export const dateMonthChange = 'ts-date-change-month';
export const dateBlur = 'ts-blur';
export const dateSelect = 'ts-date-select';
