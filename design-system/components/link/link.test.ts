import { expect, fixture, html } from '@open-wc/testing';

import type { TsLink as TsLinkComponent } from '@components/link/index.js';

import '@tuvsud/design-system/link';

describe('link component <ts-link>', () => {
    let el: TsLinkComponent;

    describe('when provided no parameters', () => {
        before(async () => {
            el = await fixture(html`<ts-link href="https://example.com">Link</ts-link>`);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });
    });

    describe('disabled behavior', () => {
        it('removes href, sets aria-disabled, and sets tabindex=-1 when disabled', async () => {
            const el = await fixture<TsLinkComponent>(
                html`<ts-link href="https://example.com" disabled>Link</ts-link>`,
            );

            const a = el.shadowRoot!.querySelector('a')!;
            expect(a.getAttribute('href')).to.equal(null);
            expect(a.getAttribute('aria-disabled')).to.equal('true');
            expect(a.getAttribute('tabindex')).to.equal('-1');
        });

        it('prevents default click when disabled', async () => {
            const el = await fixture<TsLinkComponent>(
                html`<ts-link href="https://example.com" disabled>Link</ts-link>`,
            );

            const a = el.shadowRoot!.querySelector('a')!;
            const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
            a.dispatchEvent(ev);

            expect(ev.defaultPrevented).to.equal(true);
        });
    });

    describe('target and rel', () => {
        it('adds noopener noreferrer when target=_blank and rel is not provided', async () => {
            const el = await fixture<TsLinkComponent>(
                html`<ts-link href="https://example.com" target="_blank">Link</ts-link>`,
            );

            const a = el.shadowRoot!.querySelector('a')!;
            expect(a.getAttribute('rel')).to.include('noopener');
            expect(a.getAttribute('rel')).to.include('noreferrer');
        });

        it('preserves rel tokens and adds noopener noreferrer when target=_blank', async () => {
            const el = await fixture<TsLinkComponent>(
                html`<ts-link href="https://example.com" target="_blank" rel="external">Link</ts-link>`,
            );

            const a = el.shadowRoot!.querySelector('a')!;
            expect(a.getAttribute('rel')).to.include('external');
            expect(a.getAttribute('rel')).to.include('noopener');
            expect(a.getAttribute('rel')).to.include('noreferrer');
        });
    });

    describe('external indicator', () => {
        it('adds link--external class when target=_blank', async () => {
            const el = await fixture<TsLinkComponent>(
                html`<ts-link href="https://example.com" target="_blank">Link</ts-link>`,
            );

            const a = el.shadowRoot!.querySelector('a')!;
            expect(a.classList.contains('link--external')).to.equal(true);
        });

        it('does not add link--external class when target is not _blank', async () => {
            const el = await fixture<TsLinkComponent>(
                html`<ts-link href="https://example.com" target="_self">Link</ts-link>`,
            );

            const a = el.shadowRoot!.querySelector('a')!;
            expect(a.classList.contains('link--external')).to.equal(false);
        });
    });
});
