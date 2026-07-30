import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import type { TsTag } from '@components/tag/index.js';

import '@tuvsud/design-system/tag';

describe('<ts-tag>', () => {
    it('should render default tag', async () => {
        const el = await fixture<TsTag>(html`<ts-tag>Test</ts-tag>`);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        expect(el.getAttribute('size')).to.equal('medium');
        expect(base.className).to.include('tag--neutral');
        expect(base.className).to.include('tag--medium');
    });

    it('should set variant by attribute', async () => {
        const el = await fixture<TsTag>(html`<ts-tag variant="danger">Test</ts-tag>`);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        expect(base.className).to.include('tag--danger');
    });

    it('should set size by attribute', async () => {
        const el = await fixture<TsTag>(html`<ts-tag size="large">Test</ts-tag>`);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        expect(base.className).to.include('tag--large');
    });

    it('should set pill attribute', async () => {
        const el = await fixture<TsTag>(html`<ts-tag pill>Test</ts-tag>`);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        expect(base.className).to.include('tag--pill');
    });

    it('should set removable attribute', async () => {
        const el = await fixture<TsTag>(html`<ts-tag removable>Test</ts-tag>`);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const removeButton = el.shadowRoot!.querySelector('[part~="remove-button"]');
        expect(base.className).to.include('tag--removable');
        expect(removeButton).to.not.be.null;
    });

    describe('removable', () => {
        it('should emit remove event when clicked', async () => {
            const el = await fixture<TsTag>(html`<ts-tag removable>Test</ts-tag>`);
            const removeButton = el.shadowRoot!.querySelector<HTMLButtonElement>('[part~="remove-button"]')!;
            const spy = sinon.spy();
            el.addEventListener('ts-remove', spy, { once: true });
            removeButton.click();
            expect(spy.called).to.equal(true);
        });
    });

    describe('hasBorder', () => {
        it('should disable border via class', async () => {
            const el = await fixture<TsTag>(html`<ts-tag>Test</ts-tag>`);
            el.hasBorder = false;
            await el.updateComplete;
            const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
            expect(base.className).to.include('tag--no-border');
        });

        it('should show border by default', async () => {
            const el = await fixture<TsTag>(html`<ts-tag>Test</ts-tag>`);
            const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
            expect(base.className).to.not.include('tag--no-border');
        });
    });

    describe('custom colors', () => {
        it('should apply custom color class when colors are provided', async () => {
            const el = await fixture<TsTag>(html`<ts-tag color="#0ea5e9" font-color="#001b26">Test</ts-tag>`);
            const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
            expect(base.className).to.include('tag--custom');
        });

        it('should not apply custom color class when values are empty', async () => {
            const el = await fixture<TsTag>(html`<ts-tag color="" font-color="">Test</ts-tag>`);
            const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
            expect(base.className).to.not.include('tag--custom');
        });
    });

    describe('border color', () => {
        it('should apply custom class when border-color is provided', async () => {
            const el = await fixture<TsTag>(html`<ts-tag border-color="#ff0000">Test</ts-tag>`);
            const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
            expect(base.className).to.include('tag--custom');
        });

        it('should still hide border when hasBorder is false', async () => {
            const el = await fixture<TsTag>(html`<ts-tag border-color="#ff0000">Test</ts-tag>`);
            el.hasBorder = false;
            await el.updateComplete;
            const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
            expect(base.className).to.include('tag--no-border');
        });
    });

    describe('remove button color', () => {
        it('should inherit font color via computed style', async () => {
            const el = await fixture<TsTag>(html`<ts-tag removable font-color="rebeccapurple">Test</ts-tag>`);
            const removeButton = el.shadowRoot!.querySelector<HTMLElement>('[part~="remove-button"]')!;
            const styles = getComputedStyle(removeButton);
            expect(styles.color).to.not.equal('');
        });
    });
});
