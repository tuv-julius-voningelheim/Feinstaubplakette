import { expect, fixture, html, waitUntil } from '@open-wc/testing';

import '@tuvsud/design-system/accordion';
import '@tuvsud/design-system/accordion-item';

type AccordionItemEl = HTMLElement & { open: boolean; show: () => Promise<unknown>; hide: () => Promise<unknown> };
type AccordionEl = HTMLElement & {
    label: string;
    behavior: 'single' | 'multiple';
    variant: 'primary' | 'secondary';
    updateComplete: Promise<void>;
};

describe('<ts-accordion>', () => {
    it('is accessible with items', async () => {
        const el = await fixture<AccordionEl>(html`
            <ts-accordion>
                <ts-accordion-item summary="One">A</ts-accordion-item>
                <ts-accordion-item summary="Two">B</ts-accordion-item>
            </ts-accordion>
        `);
        await expect(el).to.be.accessible();
    });

    it('closes other items in "single" behavior', async () => {
        const el = await fixture<AccordionEl>(html`
            <ts-accordion behavior="single">
                <ts-accordion-item summary="One">A</ts-accordion-item>
                <ts-accordion-item summary="Two">B</ts-accordion-item>
            </ts-accordion>
        `);
        const items = Array.from(el.querySelectorAll<AccordionItemEl>('ts-accordion-item'));
        expect(items.length).to.equal(2);
        const [first, second] = items as [AccordionItemEl, AccordionItemEl];
        await first.show();
        await waitUntil(() => first.open === true);
        await second.show();
        await waitUntil(() => second.open === true);
        expect(first.open).to.equal(false);
        expect(second.open).to.equal(true);
    });

    it('allows multiple items open in "multiple" behavior', async () => {
        const el = await fixture<AccordionEl>(html`
            <ts-accordion behavior="multiple">
                <ts-accordion-item summary="One">A</ts-accordion-item>
                <ts-accordion-item summary="Two">B</ts-accordion-item>
            </ts-accordion>
        `);
        const items = Array.from(el.querySelectorAll<AccordionItemEl>('ts-accordion-item'));
        expect(items.length).to.equal(2);
        const [first, second] = items as [AccordionItemEl, AccordionItemEl];
        await first.show();
        await second.show();
        await waitUntil(() => first.open && second.open);
        expect(first.open).to.equal(true);
        expect(second.open).to.equal(true);
    });

    it('propagates variant to all items on initial render', async () => {
        const el = await fixture<AccordionEl>(html`
            <ts-accordion variant="secondary">
                <ts-accordion-item summary="One">A</ts-accordion-item>
                <ts-accordion-item summary="Two">B</ts-accordion-item>
            </ts-accordion>
        `);
        const items = Array.from(el.querySelectorAll<AccordionItemEl>('ts-accordion-item'));
        await waitUntil(() => items.every((item: AccordionItemEl) => item.getAttribute('variant') === 'secondary'));
        items.forEach((item: AccordionItemEl) => expect(item.getAttribute('variant')).to.equal('secondary'));
    });

    it('updates items when variant changes after render', async () => {
        const el = await fixture<AccordionEl>(html`
            <ts-accordion>
                <ts-accordion-item summary="One">A</ts-accordion-item>
                <ts-accordion-item summary="Two">B</ts-accordion-item>
            </ts-accordion>
        `);
        const items = Array.from(el.querySelectorAll<AccordionItemEl>('ts-accordion-item'));
        el.variant = 'secondary';
        await el.updateComplete;
        await waitUntil(() => items.every((item: AccordionItemEl) => item.getAttribute('variant') === 'secondary'));
        items.forEach((item: AccordionItemEl) => expect(item.getAttribute('variant')).to.equal('secondary'));
    });

    it('sets aria-label from label prop, defaults to "Accordion"', async () => {
        const el1 = await fixture<AccordionEl>(html`
            <ts-accordion>
                <ts-accordion-item summary="One">A</ts-accordion-item>
            </ts-accordion>
        `);
        const base1 = el1.shadowRoot!.querySelector('.accordion') as HTMLElement;
        expect(base1.getAttribute('aria-label')).to.equal('Accordion');

        const el2 = await fixture<AccordionEl>(html`
            <ts-accordion label="FAQ">
                <ts-accordion-item summary="One">A</ts-accordion-item>
            </ts-accordion>
        `);
        const base2 = el2.shadowRoot!.querySelector('.accordion') as HTMLElement;
        expect(base2.getAttribute('aria-label')).to.equal('FAQ');
    });
});
