import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsProgressRing } from '@components/progress-ring/index.js';

import '@tuvsud/design-system/progress-ring';

describe('progress ring component <ts-progress-ring>', () => {
    let el: TsProgressRing;

    describe('when provided just a value parameter', () => {
        before(async () => {
            el = await fixture<TsProgressRing>(html`<ts-progress-ring value="25"></ts-progress-ring>`);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });

        it('should show 0% as an empty ring (dashoffset = full circumference)', async () => {
            const ring = await fixture<TsProgressRing>(html`<ts-progress-ring value="0"></ts-progress-ring>`);
            const indicator = ring.shadowRoot!.querySelector('.progress-ring__indicator')!;
            const dashoffset = parseFloat(indicator.getAttribute('stroke-dashoffset')!);
            const circumference = 2 * Math.PI * 46;
            expect(dashoffset).to.be.closeTo(circumference, 0.01);
        });

        it('should show 100% as a full ring (dashoffset = 0)', async () => {
            const ring = await fixture<TsProgressRing>(html`<ts-progress-ring value="100"></ts-progress-ring>`);
            const indicator = ring.shadowRoot!.querySelector('.progress-ring__indicator')!;
            const dashoffset = parseFloat(indicator.getAttribute('stroke-dashoffset')!);
            expect(dashoffset).to.be.closeTo(0, 0.01);
        });

        it('should show 50% as a half ring', async () => {
            const ring = await fixture<TsProgressRing>(html`<ts-progress-ring value="50"></ts-progress-ring>`);
            const indicator = ring.shadowRoot!.querySelector('.progress-ring__indicator')!;
            const dashoffset = parseFloat(indicator.getAttribute('stroke-dashoffset')!);
            const circumference = 2 * Math.PI * 46;
            expect(dashoffset).to.be.closeTo(circumference / 2, 0.01);
        });
    });

    describe('when provided a title, and value parameter', () => {
        let base: HTMLDivElement;

        before(async () => {
            el = await fixture<TsProgressRing>(
                html`<ts-progress-ring title="Titled Progress Ring" value="25"></ts-progress-ring>`,
            );
            base = el.shadowRoot!.querySelector('[part~="base"]')!;
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });

        it('uses the value parameter on the base, as aria-valuenow', () => {
            expect(base).attribute('aria-valuenow', '25');
        });
    });

    describe('when provided a ariaLabel, and value parameter', () => {
        before(async () => {
            el = await fixture<TsProgressRing>(
                html`<ts-progress-ring ariaLabel="Labelled Progress Ring" value="25"></ts-progress-ring>`,
            );
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });
    });

    describe('when provided a ariaLabelledBy, and value parameter', () => {
        before(async () => {
            el = await fixture<TsProgressRing>(html`
                <label id="labelledby">Progress Ring Label</label>
                <ts-progress-ring ariaLabelledBy="labelledby" value="25"></ts-progress-ring>
            `);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });
    });

    describe('<ts-progress-ring> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsProgressRing>(html`<ts-progress-ring></ts-progress-ring>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--size: 128px;');
            expect(cssText).to.include('--track-color: var(--ts-semantic-color-border-base-default);');
            expect(cssText).to.include('--indicator-color: var(--ts-semantic-color-border-primary-default);');
            expect(cssText).to.include('--indicator-transition-duration: 0.35s;');

            // track
            expect(cssText).to.include('stroke: var(--track-color);');

            // indicator
            expect(cssText).to.include('stroke: var(--indicator-color);');
            expect(cssText).to.include('transition: stroke-dashoffset var(--indicator-transition-duration) ease;');
        });
    });
});
