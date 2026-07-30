import { formatCalendarError } from './calendar-i18n.js';
import { parseByLocale } from './date-format.js';
import type { DateValidationError, DateValidationOptions, DateValidationResult, DateValidationRule } from './model.js';

const toStartOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const parse = (value: string, locale: string): Date | undefined => {
    const parsed = parseByLocale(value, locale);
    if (!parsed || Number.isNaN(parsed.getTime())) return undefined;
    const y = parsed.getFullYear();
    const m = parsed.getMonth();
    const day = parsed.getDate();
    const re = new Date(y, m, day);
    if (re.getFullYear() !== y || re.getMonth() !== m || re.getDate() !== day) return undefined;
    return re;
};

const makeError = (
    locale: string,
    rule: DateValidationRule,
    params?: Record<string, string | number>,
): DateValidationError => ({
    rule,
    message: formatCalendarError(locale, rule, params),
});

/**
 * Validate a single date value against the given constraints.
 * Returns an aggregated result with every failing rule and a localized message.
 */
export async function validateDateValue(
    value: string | undefined,
    opts: DateValidationOptions,
): Promise<DateValidationResult> {
    const v = (value ?? '').trim();
    const errors: DateValidationError[] = [];

    if (opts.required && v === '') {
        errors.push(makeError(opts.locale, 'required'));
        return { valid: false, errors };
    }
    if (v === '') return { valid: true, errors: [] };

    const date = parse(v, opts.locale);
    if (!date) {
        errors.push(makeError(opts.locale, 'invalidDate'));
        return { valid: false, errors };
    }

    const dayStart = toStartOfDay(date);
    const y = date.getFullYear();

    if (typeof opts.minYear === 'number' && y < opts.minYear) {
        errors.push(makeError(opts.locale, 'minYear', { minYear: opts.minYear }));
    }
    if (typeof opts.maxYear === 'number' && y > opts.maxYear) {
        errors.push(makeError(opts.locale, 'maxYear', { maxYear: opts.maxYear }));
    }

    if (opts.minDate) {
        const minParsed = parse(opts.minDate, opts.locale);
        if (minParsed && dayStart.getTime() < toStartOfDay(minParsed).getTime()) {
            errors.push(makeError(opts.locale, 'minDate', { minDate: opts.minDate }));
        }
    }

    if (opts.maxDate) {
        const maxParsed = parse(opts.maxDate, opts.locale);
        if (maxParsed && dayStart.getTime() > toStartOfDay(maxParsed).getTime()) {
            errors.push(makeError(opts.locale, 'maxDate', { maxDate: opts.maxDate }));
        }
    }

    if (opts.disablePast || opts.disableFuture) {
        const today = toStartOfDay(new Date());
        if (opts.disablePast && dayStart.getTime() < today.getTime()) {
            errors.push(makeError(opts.locale, 'disablePast'));
        }
        if (opts.disableFuture && dayStart.getTime() > today.getTime()) {
            errors.push(makeError(opts.locale, 'disableFuture'));
        }
    }

    if (opts.disableWeekend && (date.getDay() === 0 || date.getDay() === 6)) {
        errors.push(makeError(opts.locale, 'disabledDate'));
    }

    if (opts.disableDates && opts.disableDates.length > 0) {
        const target = dayStart.getTime();
        const hit = opts.disableDates
            .map(s => parse(s, opts.locale))
            .some(d => d && toStartOfDay(d).getTime() === target);
        if (hit) errors.push(makeError(opts.locale, 'disabledDate'));
    }

    return { valid: errors.length === 0, errors, date };
}

export async function validateDateRangeField(
    value: string | undefined,
    otherValue: string | undefined,
    side: 'start' | 'end',
    opts: DateValidationOptions,
): Promise<DateValidationResult> {
    const result = await validateDateValue(value, opts);
    if (!result.valid || !result.date || !otherValue) return result;

    const other = parse(otherValue, opts.locale);
    if (!other) return result;

    const self = toStartOfDay(result.date).getTime();
    const peer = toStartOfDay(other).getTime();

    if (side === 'start' && self > peer) {
        const errors = [...result.errors, makeError(opts.locale, 'startAfterEnd')];
        return { valid: false, errors, date: result.date };
    }
    if (side === 'end' && self < peer) {
        const errors = [...result.errors, makeError(opts.locale, 'endBeforeStart')];
        return { valid: false, errors, date: result.date };
    }

    return result;
}
