import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { clickOnElement, getCssText } from '@utils/internal/test.js';

import type { TsRating } from '@components/rating/index.js';

import '@tuvsud/design-system/rating';

describe('rating component <ts-rating>', () => {
    it('should pass accessibility tests', async () => {
        const el = await fixture<TsRating>(html` <ts-rating label="Test"></ts-rating> `);
        await expect(el).to.be.accessible();

        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.getAttribute('role')).to.equal('slider');
        expect(base.getAttribute('aria-disabled')).to.equal('false');
        expect(base.getAttribute('aria-readonly')).to.equal('false');
        expect(base.getAttribute('aria-valuenow')).to.equal('0');
        expect(base.getAttribute('aria-valuemin')).to.equal('0');
        expect(base.getAttribute('aria-valuemax')).to.equal('5');
        expect(base.getAttribute('tabindex')).to.equal('0');
        expect(base.getAttribute('class')).to.equal(' rating ');
    });

    it('should be readonly with the readonly attribute', async () => {
        const el = await fixture<TsRating>(html` <ts-rating label="Test" readonly></ts-rating> `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.getAttribute('aria-readonly')).to.equal('true');
        expect(base.getAttribute('class')).to.equal(' rating rating--readonly ');
    });

    it('should be disabled with the disabled attribute', async () => {
        const el = await fixture<TsRating>(html` <ts-rating label="Test" disabled></ts-rating> `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.getAttribute('aria-disabled')).to.equal('true');
        expect(base.getAttribute('class')).to.equal(' rating rating--disabled ');
    });

    it('should set max value by attribute', async () => {
        const el = await fixture<TsRating>(html` <ts-rating label="Test" max="12"></ts-rating> `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.getAttribute('aria-valuemax')).to.equal('12');
    });

    it('should set selected value by attribute', async () => {
        const el = await fixture<TsRating>(html` <ts-rating label="Test" value="3"></ts-rating> `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.getAttribute('aria-valuenow')).to.equal('3');
    });

    it('should emit ts-change when clicked', async () => {
        const el = await fixture<TsRating>(html` <ts-rating></ts-rating> `);
        const lastSymbol = el.shadowRoot!.querySelector<HTMLSpanElement>('.rating__symbol:last-child')!;
        const changeHandler = sinon.spy();

        el.addEventListener('ts-change', changeHandler);

        await clickOnElement(lastSymbol);
        await el.updateComplete;

        expect(changeHandler).to.have.been.calledOnce;
        expect(el.value).to.equal(5);
    });

    it('should emit ts-change when the value is changed with the keyboard', async () => {
        const el = await fixture<TsRating>(html` <ts-rating></ts-rating> `);
        const changeHandler = sinon.spy();

        el.addEventListener('ts-change', changeHandler);
        el.focus();
        await el.updateComplete;
        await sendKeys({ press: 'ArrowRight' });
        await el.updateComplete;

        expect(changeHandler).to.have.been.calledOnce;
        expect(el.value).to.equal(1);
    });

    it('should not emit ts-change when disabled', async () => {
        const el = await fixture<TsRating>(html` <ts-rating value="5" disabled></ts-rating> `);
        const lastSymbol = el.shadowRoot!.querySelector<HTMLSpanElement>('.rating__symbol:last-child')!;
        const changeHandler = sinon.spy();

        el.addEventListener('ts-change', changeHandler);

        await clickOnElement(lastSymbol);
        await el.updateComplete;

        expect(changeHandler).to.not.have.been.called;
        expect(el.value).to.equal(5);
    });

    it('should not emit ts-change when the value is changed programmatically', async () => {
        const el = await fixture<TsRating>(html` <ts-rating label="Test" value="1"></ts-rating> `);
        el.addEventListener('ts-change', () => expect.fail('ts-change incorrectly emitted'));
        el.value = 5;
        await el.updateComplete;
    });

    describe('focus', () => {
        it('should focus inner div', async () => {
            const el = await fixture<TsRating>(html` <ts-rating label="Test"></ts-rating> `);

            const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

            el.focus();
            await el.updateComplete;

            expect(el.shadowRoot!.activeElement).to.equal(base);
        });
    });

    describe('blur', () => {
        it('should blur inner div', async () => {
            const el = await fixture<TsRating>(html` <ts-rating label="Test"></ts-rating> `);

            el.focus();
            await el.updateComplete;

            el.blur();
            await el.updateComplete;

            expect(el.shadowRoot!.activeElement).to.equal(null);
        });
    });

    describe('<ts-rating> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsRating>(html`<ts-rating></ts-rating>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--symbol-color: var(--ts-semantic-color-icon-neutral-default);');
            expect(cssText).to.include('--symbol-color-active: var(--ts-semantic-color-charts-amber-400);');
            expect(cssText).to.include('--symbol-size: 1.2rem;');
            expect(cssText).to.include('--symbol-spacing: var(--ts-semantic-size-space-100);');

            // symbols
            expect(cssText).to.include('color: var(--symbol-color);');
            expect(cssText).to.include('color: var(--symbol-color-active);');

            // spacing
            expect(cssText).to.include('padding: var(--symbol-spacing);');

            // focus
            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');

            // transition
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-fast) scale;');
        });
    });
});
