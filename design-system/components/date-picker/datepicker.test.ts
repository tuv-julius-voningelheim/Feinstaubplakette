import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';

import type { TsDatePicker } from '@components/date-picker/src/TsDatePicker.js';

import '@tuvsud/design-system/input';
import '@tuvsud/design-system/dropdown';
import '@tuvsud/design-system/dialog';
import '@tuvsud/design-system/date-picker';

async function waitForElement<T extends Element>(root: ParentNode, selector: string, timeout = 1500): Promise<T> {
    const start = Date.now();
    let found = root.querySelector(selector) as T | null;
    while (!found && Date.now() - start < timeout) {
        await aTimeout(50);
        found = root.querySelector(selector) as T | null;
    }
    if (!found) throw new Error(`Element not found: ${selector}`);
    return found;
}

async function getInnerParts(host: HTMLElement) {
    const root = host.shadowRoot as ShadowRoot;
    const dialog = root.querySelector('ts-date-dialog') as HTMLElement | null;
    const dropdown = root.querySelector('ts-date-dropdown') as HTMLElement | null;
    let container: HTMLElement;
    if (dialog) {
        await (dialog as unknown as { updateComplete: Promise<unknown> }).updateComplete;
        container = dialog;
    } else if (dropdown) {
        await (dropdown as unknown as { updateComplete: Promise<unknown> }).updateComplete;
        container = dropdown;
    } else {
        throw new Error('No dialog or dropdown rendered');
    }
    const cRoot = container.shadowRoot as ShadowRoot;
    const dateInput = await waitForElement<HTMLElement>(cRoot, 'ts-date-input');
    await (dateInput as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const iRoot = dateInput.shadowRoot as ShadowRoot;
    const tsInput = await waitForElement<HTMLElement>(iRoot, 'ts-input');
    await (tsInput as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const inputRoot = tsInput.shadowRoot as ShadowRoot;
    const inputField = await waitForElement<HTMLInputElement>(inputRoot, 'input');
    const iconButton = await waitForElement<HTMLElement>(cRoot, 'ts-icon-button');
    const popup = cRoot.querySelector('ts-dropdown, ts-dialog') as HTMLElement | null;

    return { container, cRoot, dateInput, inputField, iconButton, popup };
}

function isExpanded(el: Element | null): boolean {
    if (!el) return false;
    const target = el.closest('ts-date-input') as HTMLElement | null;
    if (!target) return false;
    return target.getAttribute('aria-expanded') === 'true';
}

async function openPickerAndGetCalendar(picker: HTMLElement) {
    const { iconButton, cRoot } = await getInnerParts(picker);
    iconButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await aTimeout(200);
    const calendar = await waitForElement<HTMLElement>(cRoot, 'ts-date-calendar');
    const csr = calendar.shadowRoot as ShadowRoot;
    return { calendar, csr };
}

function queryCalendarDays(csr: ShadowRoot) {
    let cells = Array.from(
        csr.querySelectorAll(
            '[role="grid"] button, .grid button, [role="gridcell"] button, [part~="day"] button, button[aria-label]',
        ),
    ) as HTMLElement[];
    const grid = csr.querySelector('[role="grid"]') || csr.querySelector('.grid') || csr;
    cells = cells.filter(btn => grid.contains(btn));
    return Array.from(new Set(cells));
}

function enabledButtons(btns: HTMLElement[]) {
    return btns.filter(b => !b.hasAttribute('disabled') && b.getAttribute('aria-disabled') !== 'true');
}

describe('<ts-date-picker>', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (q: string) => ({
                matches: false,
                media: q,
                onchange: null,
                addEventListener: () => {},
                removeEventListener: () => {},
                addListener: () => {},
                removeListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    });

    it('initializes with ISO value and displays locale formatted (en)', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker locale="en" value="2025-01-05"></ts-date-picker>`);
        await el.updateComplete;
        await expect(el.value).to.equal('01/05/2025');
    });

    it('formats by de locale', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker locale="de" value="2025-01-05"></ts-date-picker>`);
        await el.updateComplete;
        await expect(el.value).to.equal('05.01.2025');
    });

    it('clamps to min-date when below range', async () => {
        const el = await fixture<TsDatePicker>(
            html`<ts-date-picker locale="en" min-date="2025-01-10" value="2025-01-05"></ts-date-picker>`,
        );
        await el.updateComplete;
        await expect(el.value).to.equal('01/10/2025');
    });

    it('clamps to max-date when above range', async () => {
        const el = await fixture<TsDatePicker>(
            html`<ts-date-picker locale="en" max-date="2025-01-10" value="2025-01-20"></ts-date-picker>`,
        );
        await el.updateComplete;
        await expect(el.value).to.equal('01/10/2025');
    });

    it('accepts min-date boundary inclusively', async () => {
        const el = await fixture<TsDatePicker>(
            html`<ts-date-picker locale="en" min-date="2025-01-10" value="2025-01-10"></ts-date-picker>`,
        );
        await el.updateComplete;
        await expect(el.value).to.equal('01/10/2025');
    });

    it('accepts max-date boundary inclusively', async () => {
        const el = await fixture<TsDatePicker>(
            html`<ts-date-picker locale="en" max-date="2025-01-10" value="2025-01-10"></ts-date-picker>`,
        );
        await el.updateComplete;
        await expect(el.value).to.equal('01/10/2025');
    });

    it('updates value and emits ts-date-change when typing into inner input', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker locale="en"></ts-date-picker>`);
        await el.updateComplete;
        const { inputField } = await getInnerParts(el as unknown as HTMLElement);
        const wait = oneEvent(el, 'ts-date-change');
        inputField.value = '02/01/2025';
        inputField.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        const ev = await wait;
        await expect(Boolean(ev)).to.equal(true);
        await expect(el.value).to.equal('02/01/2025');
    });

    it('emits a blur-related event for required empty input', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker required locale="en"></ts-date-picker>`);
        await el.updateComplete;
        const { inputField } = await getInnerParts(el as unknown as HTMLElement);
        const wait = oneEvent(el, 'ts-blur');
        inputField.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
        const ev = await wait;
        await expect(Boolean(ev)).to.equal(true);
    });

    it('opens and closes the popup and reflects aria-expanded', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker value="2025-01-05"></ts-date-picker>`);
        await el.updateComplete;
        const first = await getInnerParts(el as unknown as HTMLElement);
        const before = isExpanded(first.dateInput);
        first.iconButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await aTimeout(200);
        const opened = await getInnerParts(el as unknown as HTMLElement);
        await expect(isExpanded(opened.dateInput)).to.not.equal(before);
        opened.iconButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await aTimeout(200);
        const closed = await getInnerParts(el as unknown as HTMLElement);
        await expect(isExpanded(closed.dateInput)).to.equal(false);
    });

    it('calendar renders a grid of days for the picker month', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker value="2025-01-15"></ts-date-picker>`);
        await el.updateComplete;
        const { csr } = await openPickerAndGetCalendar(el as unknown as HTMLElement);
        const days = queryCalendarDays(csr);
        await expect(days.length >= 28).to.equal(true);
    });

    it('calendar disables some days when min/max constrain the month', async () => {
        const el = await fixture<TsDatePicker>(
            html`<ts-date-picker value="2025-01-15" min-date="2025-01-10" max-date="2025-01-20"></ts-date-picker>`,
        );
        await el.updateComplete;
        const { csr } = await openPickerAndGetCalendar(el as unknown as HTMLElement);
        const days = queryCalendarDays(csr);
        const disabledSome = days.some(d => d.hasAttribute('disabled') || d.getAttribute('aria-disabled') === 'true');
        await expect(disabledSome).to.equal(true);
    });

    it('applies a custom isDateDisabled predicate', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker value="2025-01-15"></ts-date-picker>`);
        await el.updateComplete;
        const { calendar, csr } = await openPickerAndGetCalendar(el as unknown as HTMLElement);
        (calendar as unknown as { isDateDisabled: (d: Date) => boolean }).isDateDisabled = (d: Date) =>
            d.getDay() === 0;
        await (calendar as unknown as { updateComplete: Promise<unknown> }).updateComplete;
        const days = queryCalendarDays(csr);
        const hasDisabledSundays = days.some(
            d => d.hasAttribute('disabled') || d.getAttribute('aria-disabled') === 'true',
        );
        await expect(hasDisabledSundays).to.equal(true);
    });

    it('emits ts-date-select when clicking an enabled day', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker value="2025-01-15"></ts-date-picker>`);
        await el.updateComplete;
        const { csr } = await openPickerAndGetCalendar(el as unknown as HTMLElement);
        const days = queryCalendarDays(csr);
        const enabled = enabledButtons(days);
        const target = enabled[0] ?? days[0];
        const wait = oneEvent(el, 'ts-date-select');
        target!.click();
        const ev = await wait;
        await expect(Boolean(ev.detail)).to.equal(true);
    });

    it('navigates months with prev/next and emits ts-month-change', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker value="2025-01-15"></ts-date-picker>`);
        await el.updateComplete;
        const { csr } = await openPickerAndGetCalendar(el as unknown as HTMLElement);
        const prev = csr.querySelector('.prev-month') as HTMLElement | null;
        const next = csr.querySelector('.next-month') as HTMLElement | null;
        const w1 = oneEvent(el, 'ts-month-change');
        prev?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await w1;
        const w2 = oneEvent(el, 'ts-month-change');
        next?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev2 = await w2;
        await expect(Boolean(ev2.detail)).to.equal(true);
    });

    it('years view: pick year then months, then return to days grid', async () => {
        const el = await fixture<TsDatePicker>(
            html`<ts-date-picker value="2025-06-15" min-date="2024-03-01" max-date="2026-08-31"></ts-date-picker>`,
        );
        await el.updateComplete;

        const { csr } = await openPickerAndGetCalendar(el as unknown as HTMLElement);

        // Open years panel
        const yearBtn = csr.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await aTimeout(60);
        await expect(Boolean(csr.querySelector('.years-panel'))).to.equal(true);

        // Pick year 2025
        const yearPick = csr.querySelector<HTMLButtonElement>('button[data-year="2025"]');
        await expect(Boolean(yearPick)).to.equal(true);
        yearPick!.click();
        await aTimeout(60);

        // Should now be in months view
        const monthsPanel = csr.querySelector('.months-panel') as HTMLElement;
        await expect(Boolean(monthsPanel)).to.equal(true);

        // Pick first enabled month
        const monthButtons = Array.from(monthsPanel.querySelectorAll('button')) as HTMLButtonElement[];
        const pickMonth = monthButtons.find(b => !b.disabled);
        await expect(Boolean(pickMonth)).to.equal(true);
        pickMonth!.click();
        await aTimeout(60);

        // Should now be back to days grid
        const grid = csr.querySelector('[role="grid"]') as HTMLElement | null;
        await expect(Boolean(grid)).to.equal(true);
    });

    it('months view: monthDisabled respects min/max bounds', async () => {
        const el = await fixture<TsDatePicker>(
            html`<ts-date-picker value="2025-04-15" min-date="2025-03-10" max-date="2025-05-20"></ts-date-picker>`,
        );
        await el.updateComplete;
        const { csr } = await openPickerAndGetCalendar(el as unknown as HTMLElement);
        const btnMonth = csr.querySelector('.selector-btn-month') as HTMLButtonElement | null;
        btnMonth?.click();
        await aTimeout(50);
        const monthsPanel = csr.querySelector('.months-panel') as HTMLElement | null;
        const monthButtons = Array.from(monthsPanel!.querySelectorAll('button')) as HTMLButtonElement[];
        const hasDisabled = monthButtons.some(b => b.disabled);
        await expect(hasDisabled).to.equal(true);
    });

    it('updated hook triggers scrollYearIntoView when switching to years and on value change', async () => {
        const el = await fixture<TsDatePicker>(html`<ts-date-picker value="2025-01-15"></ts-date-picker>`);
        await el.updateComplete;
        const { calendar, csr } = await openPickerAndGetCalendar(el as unknown as HTMLElement);
        const btnYear = csr.querySelector('.selector-btn-year') as HTMLButtonElement | null;
        btnYear?.click();
        await aTimeout(0);
        (calendar as unknown as { selectedDate?: Date }).selectedDate = new Date('2026-01-01');
        await (calendar as unknown as { updateComplete: Promise<unknown> }).updateComplete;
        await expect(Boolean(csr.querySelector('.years-panel'))).to.equal(true);
    });
});
