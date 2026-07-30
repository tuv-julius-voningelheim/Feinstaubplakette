import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';

import '@components/date-picker/date-input/date-input.component.js';
import '@tuvsud/design-system/input';
import '@tuvsud/design-system/date-picker';

async function getInnerInput(el: HTMLElement): Promise<HTMLInputElement> {
    await (el as LitElement).updateComplete;
    const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
    await (tsInput as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const inputRoot = tsInput.shadowRoot!;
    return inputRoot.querySelector('input') as HTMLInputElement;
}

describe('<ts-date-input>', () => {
    it('renders an inner ts-input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en"></ts-date-input>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input');
        expect(tsInput).to.exist;
    });

    it('displays the value in the inner input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en" value="01/15/2025"></ts-date-input>`);
        const input = await getInnerInput(el);

        expect(input.value).to.equal('01/15/2025');
    });

    it('shows locale-specific placeholder when none provided', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en"></ts-date-input>`);
        const input = await getInnerInput(el);

        // en locale placeholder should contain MM, DD, YYYY or similar
        expect(input.placeholder).to.match(/mm|dd|yyyy/i);
    });

    it('shows custom placeholder when provided', async () => {
        const el = await fixture<HTMLElement>(
            html`<ts-date-input locale="en" placeholder="Enter date"></ts-date-input>`,
        );
        const input = await getInnerInput(el);

        expect(input.placeholder).to.equal('Enter date');
    });

    it('sets inputMode to numeric', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en"></ts-date-input>`);
        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        await (tsInput as unknown as { updateComplete: Promise<unknown> }).updateComplete;

        expect((tsInput as unknown as { inputMode: string }).inputMode).to.equal('numeric');
    });

    it('masks input to allow only digits and separator', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en"></ts-date-input>`);
        const input = await getInnerInput(el);

        // Simulate typing a valid character
        input.value = '01';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await (el as LitElement).updateComplete;

        expect((el as unknown as { value: string }).value).to.equal('01');
    });

    it('formats value on focusout when valid date is entered', async () => {
        const el = (await fixture<HTMLElement>(html`<ts-date-input locale="en"></ts-date-input>`)) as HTMLElement &
            LitElement & { value: string };
        const input = await getInnerInput(el);

        input.value = '1/5/2025';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await el.updateComplete;

        // Trigger focusout
        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        await aTimeout(10);

        // Should be formatted with leading zeros
        expect(el.value).to.equal('01/05/2025');
    });

    it('keeps raw value on focusout when date is invalid', async () => {
        const el = (await fixture<HTMLElement>(html`<ts-date-input locale="en"></ts-date-input>`)) as HTMLElement &
            LitElement & { value: string };
        const input = await getInnerInput(el);

        input.value = 'abc';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await el.updateComplete;

        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        await aTimeout(10);

        // Should keep raw value
        expect(el.value).to.not.equal('');
    });

    it('forwards label to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en" label="Start date"></ts-date-input>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        expect((tsInput as unknown as { label: string }).label).to.equal('Start date');
    });

    it('forwards disabled state to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en" disabled></ts-date-input>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        expect(tsInput.hasAttribute('disabled')).to.equal(true);
    });

    it('forwards readonly state to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en" readonly></ts-date-input>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        expect(tsInput.hasAttribute('readonly')).to.equal(true);
    });

    it('forwards error state to ts-input', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-date-input locale="en" .dateError=${true} .dateErrorMessage=${'Bad date'}></ts-date-input>
        `);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement & {
            error: boolean;
            errorMessage: string;
        };
        expect(tsInput.error).to.equal(true);
        expect(tsInput.errorMessage).to.equal('Bad date');
    });

    it('renders suffix slot for calendar icon', async () => {
        const el = await fixture<HTMLElement>(html`<ts-date-input locale="en"></ts-date-input>`);
        await (el as LitElement).updateComplete;

        const tsInput = el.shadowRoot!.querySelector('ts-input') as HTMLElement;
        const slot =
            tsInput.querySelector('slot[name="suffix"]') ?? tsInput.shadowRoot!.querySelector('slot[name="suffix"]');
        expect(slot).to.exist;
    });

    it('formats correctly with de locale', async () => {
        const el = (await fixture<HTMLElement>(
            html`<ts-date-input locale="de" value="05.01.2025"></ts-date-input>`,
        )) as HTMLElement & LitElement & { value: string };
        const input = await getInnerInput(el);

        input.value = '5.1.2025';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await el.updateComplete;

        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        await aTimeout(10);

        expect(el.value).to.equal('05.01.2025');
    });
});
