import { expect, fixture, html } from '@open-wc/testing';

import '@tuvsud/design-system/breadcrumb';
import '@tuvsud/design-system/breadcrumb-item';

const ignoredRules = ['color-contrast'];

describe('breadcrumb component <ts-breadcrumb>', () => {
    let el: HTMLElement;

    describe('standard list without params', () => {
        before(async () => {
            el = await fixture(html`
                <ts-breadcrumb>
                    <ts-breadcrumb-item>Catalog</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Clothing</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Women’s</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Shirts &amp; Tops</ts-breadcrumb-item>
                </ts-breadcrumb>
            `);
            await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible({ ignoredRules });
        });

        it('should render ts-icon as separator', () => {
            expect(el.querySelectorAll('ts-icon').length).to.eq(4);
        });

        it('should attach aria-current "page" on the last breadcrumb item', () => {
            const items = el.querySelectorAll('ts-breadcrumb-item');
            const last = items[items.length - 1];
            expect(last).to.have.attribute('aria-current', 'page');
        });
    });

    describe('custom separator via "separator" slot', () => {
        before(async () => {
            el = await fixture(html`
                <ts-breadcrumb>
                    <span class="replacement-separator" slot="separator">/</span>
                    <ts-breadcrumb-item>First</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Second</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Third</ts-breadcrumb-item>
                </ts-breadcrumb>
            `);
            await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible({ ignoredRules });
        });

        it('should accept "separator" as an assigned child in the shadow root', () => {
            const slot = (el.shadowRoot as ShadowRoot).querySelector<HTMLSlotElement>('slot[name=separator]')!;
            const nodes = slot.assignedNodes({ flatten: true });
            expect(nodes.length).to.eq(1);
        });

        it('should replace the ts-icon separator with the provided separator', () => {
            expect(el.querySelectorAll('.replacement-separator').length).to.eq(4);
            expect(el.querySelectorAll('ts-icon').length).to.eq(0);
        });
    });

    describe('prefix element via "prefix" slot', () => {
        before(async () => {
            el = await fixture(html`
                <ts-breadcrumb>
                    <ts-breadcrumb-item>
                        <span class="prefix-example" slot="prefix">/</span>
                        Home
                    </ts-breadcrumb-item>
                    <ts-breadcrumb-item>First</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Second</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Third</ts-breadcrumb-item>
                </ts-breadcrumb>
            `);
            await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible({ ignoredRules });
        });
    });

    describe('suffix element via "suffix" slot', () => {
        before(async () => {
            el = await fixture(html`
                <ts-breadcrumb>
                    <ts-breadcrumb-item>First</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Second</ts-breadcrumb-item>
                    <ts-breadcrumb-item>Third</ts-breadcrumb-item>
                    <ts-breadcrumb-item>
                        <span class="suffix-example" slot="suffix">/</span>
                        Security
                    </ts-breadcrumb-item>
                </ts-breadcrumb>
            `);
            await (el as HTMLElement & { updateComplete: Promise<void> }).updateComplete;
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible({ ignoredRules });
        });
    });
});
