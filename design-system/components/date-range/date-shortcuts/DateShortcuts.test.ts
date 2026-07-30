import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import './date-shortcuts.component.js';
import '@tuvsud/design-system/date-range';
import '@tuvsud/design-system/tag';

describe('<ts-date-shortcuts>', () => {
    it('renders items in component', async () => {
        const el = await fixture(html`<ts-date-shortcuts .shortcuts=${[0, 1, 2]}></ts-date-shortcuts>`);
        await (el as LitElement).updateComplete;
        const tags = el.shadowRoot!.querySelectorAll('ts-tag');
        expect(tags.length).to.equal(3);
    });

    it('renders correct labels', async () => {
        const el = await fixture(html`<ts-date-shortcuts locale="en" .shortcuts=${[0]}></ts-date-shortcuts>`);
        await (el as LitElement).updateComplete;
        const tag = el.shadowRoot!.querySelector('ts-tag')!;
        expect(tag.textContent?.trim().length).to.be.greaterThan(0);
    });

    it('emits event on click', async () => {
        const el = await fixture(html`<ts-date-shortcuts .shortcuts=${[0]}></ts-date-shortcuts>`);
        await (el as LitElement).updateComplete;
        const tag = el.shadowRoot!.querySelector('ts-tag') as HTMLElement;
        setTimeout(() => tag.click());
        const e = await oneEvent(el, 'ts-shortcut-select');
        expect(e.detail.index).to.equal(0);
    });
});
