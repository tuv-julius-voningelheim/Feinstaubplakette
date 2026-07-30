import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';

import './date-input-start.component.js';
import './date-input-end.component.js';
import '@tuvsud/design-system/date-range';
import '@tuvsud/design-system/input';

async function getInnerInput(el: HTMLElement): Promise<HTMLInputElement> {
    await (el as LitElement).updateComplete;
    const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
    await (tsInput as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const inputRoot = tsInput.shadowRoot!;
    return inputRoot.querySelector('input') as HTMLInputElement;
}

// ─────────────────────────────────────────────────
// ts-date-input-start
// ─────────────────────────────────────────────────
describe('<ts-date-input-start>', () => {
    it('renders an inner ts-input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input-start locale="en"></ts-date-input-start>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input');
        expect(tsInput).to.exist;
    });

    it('displays valueStart in the inner input', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input-start locale="en" .valueStart=${'01/15/2025'}></ts-date-input-start>
        `);
        const input = await getInnerInput(el);
        expect(input.value).to.equal('01/15/2025');
    });

    it('shows locale-specific placeholder when none provided', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input-start locale="en"></ts-date-input-start>`);
        const input = await getInnerInput(el);
        expect(input.placeholder).to.match(/mm|dd|yyyy/i);
    });

    it('shows custom placeholder when provided', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input-start locale="en" .placeholderStart=${'Start date'}></ts-date-input-start>
        `);
        const input = await getInnerInput(el);
        expect(input.placeholder).to.equal('Start date');
    });

    it('formats value on focusout when valid date is entered', async () => {
        const el = (await fixture<HTMLElement>(
            html`<ts-date-input-start locale="en"></ts-date-input-start>`,
        )) as HTMLElement &
            LitElement & {
                valueStart: string;
            };
        const input = await getInnerInput(el);

        input.value = '1/5/2025';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await el.updateComplete;

        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        await aTimeout(10);

        expect(el.valueStart).to.equal('01/05/2025');
    });

    it('keeps raw value on focusout when date is invalid', async () => {
        const el = (await fixture<HTMLElement>(
            html`<ts-date-input-start locale="en"></ts-date-input-start>`,
        )) as HTMLElement &
            LitElement & {
                valueStart: string;
            };
        const input = await getInnerInput(el);

        input.value = 'abc';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await el.updateComplete;

        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        await aTimeout(10);

        expect(el.valueStart).to.not.equal('');
    });

    it('forwards label-start to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input-start locale="en" .labelStart=${'Departure'}></ts-date-input-start>
        `);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement & { label: string };
        expect(tsInput.label).to.equal('Departure');
    });

    it('forwards disabled state to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input-start locale="en" disabled></ts-date-input-start>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        expect(tsInput.hasAttribute('disabled')).to.equal(true);
    });

    it('forwards error state to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input-start locale="en" .errorStart=${true} .errorMessageStart=${'Required'}></ts-date-input-start>
        `);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement & {
            error: boolean;
            errorMessage: string;
        };
        expect(tsInput.error).to.equal(true);
        expect(tsInput.errorMessage).to.equal('Required');
    });

    it('renders suffix slot for calendar icon', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input-start locale="en"></ts-date-input-start>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        const slot =
            tsInput.querySelector('slot[name="suffix"]') ?? tsInput.shadowRoot!.querySelector('slot[name="suffix"]');
        expect(slot).to.exist;
    });

    it('formats correctly with de locale', async () => {
        const el = (await fixture<HTMLElement>(html`
            <ts-date-input-start locale="de" .valueStart=${'05.01.2025'}></ts-date-input-start>
        `)) as HTMLElement & LitElement & { valueStart: string };
        const input = await getInnerInput(el);

        input.value = '5.1.2025';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await el.updateComplete;

        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        await aTimeout(10);

        expect(el.valueStart).to.equal('05.01.2025');
    });

    it('re-formats when locale changes', async () => {
        const el = (await fixture<HTMLElement>(html`
            <ts-date-input-start locale="en" .valueStart=${'01/05/2025'}></ts-date-input-start>
        `)) as HTMLElement & LitElement & { valueStart: string; locale: string };
        await el.updateComplete;

        el.locale = 'de';
        await el.updateComplete;

        expect(el.valueStart).to.equal('05.01.2025');
    });
});

// ─────────────────────────────────────────────────
// ts-date-input-end
// ─────────────────────────────────────────────────
describe('<ts-date-input-end>', () => {
    it('renders an inner ts-input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input-end locale="en"></ts-date-input-end>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input');
        expect(tsInput).to.exist;
    });

    it('displays valueEnd in the inner input', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input-end locale="en" .valueEnd=${'01/20/2025'}></ts-date-input-end>
        `);
        const input = await getInnerInput(el);
        expect(input.value).to.equal('01/20/2025');
    });

    it('shows locale-specific placeholder when none provided', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input-end locale="en"></ts-date-input-end>`);
        const input = await getInnerInput(el);
        expect(input.placeholder).to.match(/mm|dd|yyyy/i);
    });

    it('shows custom placeholder when provided', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input-end locale="en" .placeholderEnd=${'End date'}></ts-date-input-end>
        `);
        const input = await getInnerInput(el);
        expect(input.placeholder).to.equal('End date');
    });

    it('formats value on focusout when valid date is entered', async () => {
        const el = (await fixture<HTMLElement>(
            html`<ts-date-input-end locale="en"></ts-date-input-end>`,
        )) as HTMLElement &
            LitElement & {
                valueEnd: string;
            };
        const input = await getInnerInput(el);

        input.value = '1/5/2025';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await el.updateComplete;

        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        await aTimeout(10);

        expect(el.valueEnd).to.equal('01/05/2025');
    });

    it('forwards label-end to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input-end locale="en" .labelEnd=${'Return'}></ts-date-input-end>
        `);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement & { label: string };
        expect(tsInput.label).to.equal('Return');
    });

    it('forwards disabled state to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input-end locale="en" disabled></ts-date-input-end>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        expect(tsInput.hasAttribute('disabled')).to.equal(true);
    });

    it('forwards error state to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input-end locale="en" .errorEnd=${true} .errorMessageEnd=${'Required'}></ts-date-input-end>
        `);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement & {
            error: boolean;
            errorMessage: string;
        };
        expect(tsInput.error).to.equal(true);
        expect(tsInput.errorMessage).to.equal('Required');
    });

    it('renders suffix slot for calendar icon', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input-end locale="en"></ts-date-input-end>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        const slot =
            tsInput.querySelector('slot[name="suffix"]') ?? tsInput.shadowRoot!.querySelector('slot[name="suffix"]');
        expect(slot).to.exist;
    });

    it('formats correctly with de locale', async () => {
        const el = (await fixture<HTMLElement>(html`
            <ts-date-input-end locale="de" .valueEnd=${'05.01.2025'}></ts-date-input-end>
        `)) as HTMLElement & LitElement & { valueEnd: string };
        const input = await getInnerInput(el);

        input.value = '5.1.2025';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await el.updateComplete;

        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        await aTimeout(10);

        expect(el.valueEnd).to.equal('05.01.2025');
    });

    it('re-formats when locale changes', async () => {
        const el = (await fixture<HTMLElement>(html`
            <ts-date-input-end locale="en" .valueEnd=${'01/05/2025'}></ts-date-input-end>
        `)) as HTMLElement & LitElement & { valueEnd: string; locale: string };
        await el.updateComplete;

        el.locale = 'de';
        await el.updateComplete;

        expect(el.valueEnd).to.equal('05.01.2025');
    });
});
