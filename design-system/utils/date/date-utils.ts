import { DaysOfWeek } from './model.js';

export function isEqual(a?: Date | null, b?: Date | null): boolean {
    if (a == null || b == null) return false;
    return isEqualMonth(a, b) && a.getDate() === b.getDate();
}

export function isEqualMonth(a?: Date | null, b?: Date | null): boolean {
    if (a == null || b == null) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addDays(date: Date, days: number): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + days);
    return d;
}

export function addMonths(date: Date | undefined, amount: number) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return new Date();
    }

    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfWeek(date: Date, firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;
    d.setDate(d.getDate() - diff);
    return d;
}

export function endOfWeek(date: Date, firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day < firstDayOfWeek ? -7 : 0) + 6 - (day - firstDayOfWeek);
    d.setDate(d.getDate() + diff);
    return d;
}

export function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function inRange(date: Date, min?: Date, max?: Date): boolean {
    return clamp(date, min, max) === date;
}

export function clamp(date: Date, min?: Date, max?: Date): Date {
    const time = date.getTime();
    if (min && min instanceof Date && time < min.getTime()) return min;
    if (max && max instanceof Date && time > max.getTime()) return max;
    return date;
}

function getDaysInRange(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    let current = start;
    while (!isEqual(current, end)) {
        days.push(current);
        current = addDays(current, 1);
    }
    days.push(current);
    return days;
}

export function getViewOfMonth(date: Date, firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday): Date[] {
    const start = startOfWeek(startOfMonth(date), firstDayOfWeek);
    const end = endOfWeek(endOfMonth(date), firstDayOfWeek);
    return getDaysInRange(start, end);
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return d >= Math.min(s, e) && d <= Math.max(s, e);
}
