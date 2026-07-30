import { expect, fixture, html } from '@open-wc/testing';

import { activeElements, getDeepestActiveElement } from '../active-elements.js';
import { animateTo, parseDuration, prefersReducedMotion, shimKeyframesHeightAuto, stopAnimations } from '../animate.js';

describe('active-elements helpers', () => {
    it('returns empty when no active element', () => {
        const result = [...activeElements(null)];
        expect(result).to.deep.equal([]);
    });

    it('returns document.activeElement when set', async () => {
        const el = await fixture(html`<button id="btn">Click me</button>`);
        (el as HTMLElement).focus();

        const result = [...activeElements()];
        expect(result[0]).to.equal(el);
        expect(getDeepestActiveElement()).to.equal(el);
    });

    it('walks into open shadow roots', async () => {
        class ShadowEl extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.shadowRoot!.innerHTML = `<input id="inner" />`;
            }
        }
        customElements.define('shadow-el', ShadowEl);

        const host = await fixture<ShadowEl>(html`<shadow-el></shadow-el>`);
        const inner = host.shadowRoot!.querySelector<HTMLInputElement>('#inner')!;
        inner.focus();

        const result = [...activeElements()];
        expect(result).to.include(host);
        expect(result).to.include(inner);
        expect(getDeepestActiveElement()).to.equal(inner);
    });
});

describe('animation helpers', () => {
    it('parseDuration converts correctly', () => {
        expect(parseDuration('200ms')).to.equal(200);
        expect(parseDuration('2s')).to.equal(2000);
        expect(parseDuration(300)).to.equal(300);
    });

    it('shimKeyframesHeightAuto replaces auto with px', () => {
        const keyframes = [{ height: 'auto' }, { height: '100px' }];
        // eslint-disable-next-line
        const shimmed = shimKeyframesHeightAuto(keyframes as any, 250);
        expect(shimmed[0]!.height).to.equal('250px');
        expect(shimmed[1]!.height).to.equal('100px');
    });

    it('animateTo resolves after animation finishes', async () => {
        const el = await fixture<HTMLDivElement>(html`<div></div>`);
        const keyframes = [{ opacity: 0 }, { opacity: 1 }];
        await animateTo(el, keyframes, { duration: 50 });
        expect(true).to.be.true; // reached here = success
    });

    it('animateTo rejects on infinite duration', async () => {
        const el = await fixture<HTMLDivElement>(html`<div></div>`);
        const keyframes = [{ opacity: 0 }, { opacity: 1 }];

        try {
            await animateTo(el, keyframes, { duration: Infinity });
            throw new Error('Expected rejection, but resolved');
        } catch (err) {
            expect((err as Error).message).to.equal('Promise-based animations must be finite.');
        }
    });

    it('stopAnimations cancels active animations', async () => {
        const el = await fixture<HTMLDivElement>(html`<div></div>`);
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000 });
        await stopAnimations(el);
        expect(el.getAnimations().length).to.equal(0);
    });

    it('prefersReducedMotion returns a boolean', () => {
        const result = prefersReducedMotion();
        expect(result === true || result === false).to.be.true;
    });
});
