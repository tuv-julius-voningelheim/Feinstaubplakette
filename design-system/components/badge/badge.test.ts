import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsBadge } from '@components/badge/index.js';

import '@tuvsud/design-system/badge';

const ignoredRules = ['color-contrast'];

describe('badge component <ts-badge>', () => {
    let el: TsBadge;

    describe('when provided no parameters', () => {
        before(async () => {
            el = await fixture<TsBadge>(html` <ts-badge>Badge</ts-badge> `);
        });

        it('should pass accessibility tests with a role of status on the base part.', async () => {
            await expect(el).to.be.accessible({ ignoredRules });

            const part = el.shadowRoot!.querySelector('[part~="base"]')!;
            expect(part.getAttribute('role')).to.eq('status');
        });

        it('should render the child content provided', () => {
            expect(el.innerText).to.eq('Badge');
        });

        it('should default to square styling, with the primary color', () => {
            const part = el.shadowRoot!.querySelector('[part~="base"]')!;
            expect(part.classList.value.trim()).to.eq('badge badge--primary badge--medium');
        });
    });

    describe('when provided a pill parameter', () => {
        before(async () => {
            el = await fixture<TsBadge>(html` <ts-badge pill>Badge</ts-badge> `);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible({ ignoredRules });
        });

        it('should append the pill class to the classlist to render a pill', () => {
            const part = el.shadowRoot!.querySelector('[part~="base"]')!;
            expect(part.classList.value.trim()).to.eq('badge badge--primary badge--medium badge--pill');
        });
    });

    describe('when provided a pulse parameter', () => {
        before(async () => {
            el = await fixture<TsBadge>(html` <ts-badge pulse>Badge</ts-badge> `);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible({ ignoredRules });
        });

        it('should append the pulse class to the classlist to render a pulse', () => {
            const part = el.shadowRoot!.querySelector('[part~="base"]')!;
            expect(part.classList.value.trim()).to.eq('badge badge--primary badge--medium badge--pulse');
        });
    });

    ['primary', 'success', 'neutral', 'warning', 'danger'].forEach(variant => {
        describe(`when passed a variant attribute ${variant}`, () => {
            before(async () => {
                el = await fixture<TsBadge>(html`<ts-badge variant="${variant}">Badge</ts-badge>`);
            });

            it('should pass accessibility tests', async () => {
                await expect(el).to.be.accessible({ ignoredRules });
            });

            it('should default to square styling, with the primary color', () => {
                const part = el.shadowRoot!.querySelector('[part~="base"]')!;
                expect(part.classList.value.trim()).to.eq(`badge badge--${variant} badge--medium`);
            });
        });
    });

    describe('css Style variables', () => {
        it('uses the expected CSS in styles', async () => {
            const el = await fixture<TsBadge>(html`<ts-badge>badge</ts-badge>`);
            const cssText = getCssText(el);

            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-medium);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.satisfy(
                (t: string) =>
                    t.includes(
                        'padding: var(--ts-semantic-size-space-200, 6px) var(--ts-semantic-size-space-400, 12px);',
                    ) || t.includes('padding: 0.35em 0.6em;'),
            );

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-inverted-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-success-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-warning-default);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-pill);');
            expect(cssText).to.include('--pulse-color: var(--ts-semantic-color-background-primary-default);');
            expect(cssText).to.include('--pulse-color: var(--ts-semantic-color-background-success-default);');
            expect(cssText).to.include('--pulse-color: var(--ts-semantic-color-background-neutral-default);');
            expect(cssText).to.include('--pulse-color: var(--ts-semantic-color-background-warning-default);');
            expect(cssText).to.include('--pulse-color: var(--ts-semantic-color-background-danger-default);');
        });
    });
});
