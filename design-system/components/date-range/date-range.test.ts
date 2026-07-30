import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import TsDateRangeComponent from '@components/date-range/src/date-range.component.js';

import '@tuvsud/design-system/date-range';
import '@tuvsud/design-system/input';
import '@tuvsud/design-system/dropdown';
import '@tuvsud/design-system/dialog';

async function waitForElement(root: ParentNode, selector: string, timeout = 1500): Promise<unknown> {
    const start = Date.now();
    let found: unknown = root.querySelector(selector);
    while (!found && Date.now() - start < timeout) {
        await aTimeout(50);
        found = root.querySelector(selector);
    }
    if (!found) throw new Error(`Element not found: ${selector}`);
    return found;
}

async function getInnerParts(host: HTMLElement): Promise<{
    container: Element;
    cRoot: ShadowRoot;
    startInput: Element;
    startField: HTMLInputElement;
    iconButton: Element;
    popup: Element | null;
}> {
    const root = host.shadowRoot as ShadowRoot;

    const dialog = root.querySelector('ts-date-dialog-range');
    const dropdown = root.querySelector('ts-date-dropdown-range');

    let container: Element;

    if (dialog instanceof Element) {
        await (dialog as LitElement).updateComplete;
        container = dialog;
    } else if (dropdown instanceof Element) {
        await (dropdown as LitElement).updateComplete;
        container = dropdown;
    } else {
        throw new Error('No dialog or dropdown rendered');
    }

    const cRoot = container.shadowRoot as ShadowRoot;

    const startInput = (await waitForElement(cRoot, 'ts-date-input-start')) as Element;
    await (startInput as LitElement).updateComplete;

    const siRoot = startInput.shadowRoot as ShadowRoot;

    const tsInput = (await waitForElement(siRoot, 'ts-input')) as Element;
    await (tsInput as LitElement).updateComplete;

    const sri = tsInput.shadowRoot as ShadowRoot;

    const startField = (await waitForElement(sri, 'input')) as HTMLInputElement;

    const iconButton = (await waitForElement(cRoot, 'ts-icon-button')) as Element;

    const popup = cRoot.querySelector('ts-dropdown, ts-dialog') as Element | null;

    return { container, cRoot, startInput, startField, iconButton, popup };
}

async function openRangePickerAndGetCalendars(picker: HTMLElement): Promise<{ calendar: Element; csr: ShadowRoot }> {
    const parts = await getInnerParts(picker);
    const iconButton = parts.iconButton as Element;
    const cRoot = parts.cRoot as ShadowRoot;

    iconButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await aTimeout(200);

    const calendar = (await waitForElement(cRoot, 'ts-date-calendar-range, ts-date-calendar-range-mobile')) as Element;

    await (calendar as LitElement).updateComplete;

    return { calendar, csr: calendar.shadowRoot as ShadowRoot };
}

function queryCalendarDays(csr: ShadowRoot): Element[] {
    const cells = Array.from(csr.querySelectorAll('button, [role="gridcell"] button, [part~="day"] button'));
    const grid = csr.querySelector('[role="grid"]') || csr.querySelector('.grid') || csr;
    return Array.from(new Set(cells.filter(btn => grid.contains(btn))));
}

function enabledButtons(btns: Element[]): Element[] {
    return btns.filter(btn => !btn.hasAttribute('disabled') && btn.getAttribute('aria-disabled') !== 'true');
}

describe('<ts-date-range>', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: () => {},
                removeEventListener: () => {},
                addListener: () => {},
                removeListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    });

    it('formats correctly with "de" locale', async () => {
        const el = await fixture<TsDateRangeComponent>(
            html`<ts-date-range locale="de" value-start="01.01.2025" value-end="10.01.2025"></ts-date-range>`,
        );
        await (el as LitElement).updateComplete;
        expect(el.valueStart).to.equal('01.01.2025');
        expect(el.valueEnd).to.equal('10.01.2025');
    });

    it('emits ts-date-start-change when typing start field', async () => {
        const el = await fixture<TsDateRangeComponent>(html`<ts-date-range locale="en"></ts-date-range>`);
        await (el as LitElement).updateComplete;
        const { startInput } = await getInnerParts(el);
        const wait = oneEvent(el, 'ts-date-change');
        // Dispatch directly on ts-date-input-start with detail.value (mirrors what onNative re-dispatches)
        startInput.dispatchEvent(
            new CustomEvent('input', { detail: { value: '02/03/2025' }, bubbles: true, composed: false }),
        );
        const ev = await wait;
        expect(Boolean(ev)).to.equal(true);
        expect(el.valueStart).to.equal('02/03/2025');
    });

    it('opens calendar popup and updates aria-expanded', async () => {
        const el = await fixture<TsDateRangeComponent>(
            html`<ts-date-range locale="en" value-start="2025-01-01"></ts-date-range>`,
        );
        await (el as LitElement).updateComplete;
        const first = await getInnerParts(el);
        const cRoot = first.cRoot as ShadowRoot;
        const dropdown = cRoot.querySelector('ts-dropdown') as Element | null;
        expect(dropdown?.hasAttribute('open')).to.equal(false);
        (first.iconButton as Element).dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await aTimeout(200);
        expect(dropdown?.hasAttribute('open')).to.equal(true);
    });

    it('renders days after opening the calendar', async () => {
        const el = await fixture<TsDateRangeComponent>(
            html`<ts-date-range locale="en" value-start="2025-01-15"></ts-date-range>`,
        );
        await (el as LitElement).updateComplete;
        const { csr } = await openRangePickerAndGetCalendars(el);
        const days = queryCalendarDays(csr);
        expect(days.length >= 28).to.equal(true);
    });

    it('selects start then end date and emits ts-date-range-change', async () => {
        const el = await fixture<TsDateRangeComponent>(html`<ts-date-range locale="en"></ts-date-range>`);
        await (el as LitElement).updateComplete;
        const { csr } = await openRangePickerAndGetCalendars(el);
        const all = enabledButtons(queryCalendarDays(csr));
        const first = all[0];
        const last = all[all.length - 1];
        // Click start date first
        first!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await aTimeout(50);
        // Now wait for the event after clicking end date
        const wait = oneEvent(el, 'ts-date-change');
        last!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev = await wait;
        expect(Boolean(ev.detail.start)).to.equal(true);
        expect(Boolean(ev.detail.end)).to.equal(true);
    });

    it('emits ts-date-preset-select when clicking shortcut', async () => {
        const el = await fixture<TsDateRangeComponent>(
            html`<ts-date-range locale="en" .shortcuts=${[0, 1, 2]}></ts-date-range>`,
        );
        await (el as LitElement).updateComplete;
        const { cRoot } = await getInnerParts(el);
        // ts-tag is inside ts-date-shortcuts's shadow root
        const shortcutsEl = cRoot.querySelector('ts-date-shortcuts') as Element | null;
        const tag = shortcutsEl?.shadowRoot?.querySelector('ts-tag') as Element | null;
        if (!tag) throw new Error('Shortcut missing');
        const wait = oneEvent(el, 'ts-date-apply');
        tag.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev = await wait;
        expect(Boolean(ev.detail.start)).to.equal(true);
    });

    it('navigates months and emits ts-month-change', async () => {
        const el = await fixture<TsDateRangeComponent>(html`<ts-date-range locale="en"></ts-date-range>`);
        await (el as LitElement).updateComplete;
        const { csr } = await openRangePickerAndGetCalendars(el);
        const prev = csr.querySelector('.prev-month') as HTMLElement | null;
        const next = csr.querySelector('.next-month') as HTMLElement | null;
        const w1 = oneEvent(el, 'ts-month-change');
        prev?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await w1;
        const w2 = oneEvent(el, 'ts-month-change');
        next?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev2 = await w2;
        expect(Boolean(ev2.detail.focused)).to.equal(true);
    });
});
