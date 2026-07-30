import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsBreadcrumbItem } from '@components/breadcrumb-item/index.js';

import '@tuvsud/design-system/breadcrumb-item';
import '@tuvsud/design-system/button';

const waitForUpdate = async (el: Element) => {
    const u = (el as unknown as { updateComplete?: Promise<unknown> }).updateComplete;
    if (u) await u;
};

describe('<ts-breadcrumb-item>', () => {
    let el: TsBreadcrumbItem;

    afterEach(() => {
        fixtureCleanup();
    });

    describe('when not provided a href attribute', () => {
        before(async () => {
            el = await fixture<TsBreadcrumbItem>(html`<ts-breadcrumb-item>Home</ts-breadcrumb-item>`);
            await waitForUpdate(el);
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible();
        });

        it('should hide the separator from screen readers', () => {
            const separator = el.shadowRoot!.querySelector<HTMLSpanElement>('[part~="separator"]');
            expect(separator).to.have.attribute('aria-hidden', 'true');
        });

        it('should render a HTMLButtonElement as the part "label", with a set type "button"', () => {
            const button = el.shadowRoot!.querySelector<HTMLButtonElement>('[part~="label"]');
            expect(button).to.exist;
            expect(button).to.have.attribute('type', 'button');
        });
    });

    describe('when provided a href attribute', () => {
        describe('and no target', () => {
            before(async () => {
                el = await fixture<TsBreadcrumbItem>(html`
                    <ts-breadcrumb-item href="https://jsonplaceholder.typicode.com/">Home</ts-breadcrumb-item>
                `);
                await waitForUpdate(el);
            });

            it('should pass accessibility tests', async () => {
                await expect(document.body).to.be.accessible();
            });

            it('should render a HTMLAnchorElement as the part "label", with the supplied href value', () => {
                const hyperlink = el.shadowRoot!.querySelector<HTMLAnchorElement>('[part~="label"]');
                expect(hyperlink).to.have.attribute('href', 'https://jsonplaceholder.typicode.com/');
            });
        });

        describe('and target, without rel', () => {
            before(async () => {
                el = await fixture<TsBreadcrumbItem>(html`
                    <ts-breadcrumb-item href="https://jsonplaceholder.typicode.com/" target="_blank">
                        Help
                    </ts-breadcrumb-item>
                `);
                await waitForUpdate(el);
            });

            it('should pass accessibility tests', async () => {
                await expect(document.body).to.be.accessible();
            });

            describe('should render a HTMLAnchorElement as the part "label"', () => {
                let hyperlink: HTMLAnchorElement | null;

                before(() => {
                    hyperlink = el.shadowRoot!.querySelector<HTMLAnchorElement>('[part~="label"]');
                });

                it('should use the supplied href value, as the href attribute value', () => {
                    expect(hyperlink).to.have.attribute('href', 'https://jsonplaceholder.typicode.com/');
                });

                it('should default rel attribute to "noreferrer noopener"', () => {
                    expect(hyperlink).to.have.attribute('rel', 'noreferrer noopener');
                });
            });
        });

        describe('and target, with rel', () => {
            before(async () => {
                el = await fixture<TsBreadcrumbItem>(html`
                    <ts-breadcrumb-item href="https://jsonplaceholder.typicode.com/" target="_blank" rel="alternate">
                        Help
                    </ts-breadcrumb-item>
                `);
                await waitForUpdate(el);
            });

            it('should pass accessibility tests', async () => {
                await expect(document.body).to.be.accessible();
            });

            describe('should render a HTMLAnchorElement', () => {
                let hyperlink: HTMLAnchorElement | null;

                before(() => {
                    hyperlink = el.shadowRoot!.querySelector<HTMLAnchorElement>('a');
                });

                it('should use the supplied href value, as the href attribute value', () => {
                    expect(hyperlink).to.have.attribute('href', 'https://jsonplaceholder.typicode.com/');
                });

                it('should use the supplied rel value, as the rel attribute value', () => {
                    expect(hyperlink).to.have.attribute('rel', 'alternate');
                });
            });
        });
    });

    describe('when provided an element in the slot "prefix" to support prefix icons', () => {
        before(async () => {
            el = await fixture<TsBreadcrumbItem>(html`
                <ts-breadcrumb-item>
                    <span class="prefix-example" slot="prefix">/</span>
                    Home
                </ts-breadcrumb-item>
            `);
            await waitForUpdate(el);
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible();
        });

        it('should accept as an assigned child in the shadow root', () => {
            const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=prefix]')!;
            const childNodes = slot.assignedNodes({ flatten: true });
            expect(childNodes.length).to.eq(1);
        });

        it('should append class "breadcrumb-item--has-prefix" to "base" part', () => {
            const part = el.shadowRoot!.querySelector('[part~="base"]')!;
            expect((part as HTMLElement).classList.value.trim()).to.equal(
                'breadcrumb-item breadcrumb-item--has-prefix',
            );
        });
    });

    describe('when provided an element in the slot "suffix" to support suffix icons', () => {
        before(async () => {
            el = await fixture<TsBreadcrumbItem>(html`
                <ts-breadcrumb-item>
                    <span class="prefix-example" slot="suffix">/</span>
                    Security
                </ts-breadcrumb-item>
            `);
            await waitForUpdate(el);
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible();
        });

        it('should accept as an assigned child in the shadow root', () => {
            const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=suffix]')!;
            const childNodes = slot.assignedNodes({ flatten: true });
            expect(childNodes.length).to.eq(1);
        });

        it('should append class "breadcrumb-item--has-suffix" to "base" part', () => {
            const part = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
            expect(part.classList.value.trim()).to.equal('breadcrumb-item breadcrumb-item--has-suffix');
        });
    });

    describe('css Style variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el2 = await fixture<TsBreadcrumbItem>(html`<ts-breadcrumb-item>breadcrumb item</ts-breadcrumb-item>`);
            const cssText = getCssText(el2);
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-medium);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-primary-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-primary-hover);');
            expect(cssText).to.include('outline: solid 2px var(--ts-semantic-color-border-primary-focused);');
            expect(cssText).to.include('color: var(--ts-semantic-color-icon-base-default);');
            expect(cssText).to.include('line-height: var(--ts-line-height-300);');
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-fast) --color;');
            expect(cssText).to.include('margin-inline-end: var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('margin-inline-start: var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('margin: 0 var(--ts-semantic-size-space-200);');
        });
    });
});
