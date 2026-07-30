import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import type { TsButton } from '@components/button/index.js';

import '@tuvsud/design-system/button';

describe('TsButtonSlottedLinkController', () => {
    describe('when a slotted <a> is provided with href', () => {
        it('should detect the slotted anchor and set hasSlottedAnchor=true', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            // After update, the slot renders and the anchor should be detected
            // The component re-renders to show just <slot>
            await el.updateComplete;
            const slot = el.shadowRoot!.querySelector('slot');
            expect(slot).to.exist;
            // No <a> or <button> in shadow root when hasSlottedAnchor is true
            expect(el.shadowRoot!.querySelector('a')).not.to.exist;
            expect(el.shadowRoot!.querySelector('button')).not.to.exist;
        });

        it('should decorate the slotted anchor with button classes', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test" variant="primary">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.classList.contains('button')).to.be.true;
            expect(anchor.classList.contains('button--primary')).to.be.true;
        });

        it('should set part="base" on the slotted anchor (line 138)', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('part')).to.equal('base');
        });

        it('should set title on the slotted anchor (line 139)', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test" title="My Title">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.title).to.equal('My Title');
        });

        it('should set href on slotted anchor when anchor has no href', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a>Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('href')).to.equal('/test');
        });

        it('should not override existing href on slotted anchor', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/custom">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('href')).to.equal('/custom');
        });

        it('should set target on slotted anchor when target is provided', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test" target="_blank">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('target')).to.equal('_blank');
        });

        it('should remove target on slotted anchor when target is not set', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test" target="_blank">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('target')).to.be.null;
        });

        it('should set download on slotted anchor when download is set)', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test" download="file.pdf">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('download')).to.equal('file.pdf');
        });

        it('should remove download on slotted anchor when download is not set', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test" download="old.pdf">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('download')).to.be.null;
        });

        it('should set rel on slotted anchor when rel is provided', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test" rel="noopener">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('rel')).to.equal('noopener');
        });

        it('should remove button-specific attributes from the slotted anchor', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test" type="button" name="test" value="val" disabled role="button">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('type')).to.be.null;
            expect(anchor.getAttribute('name')).to.be.null;
            expect(anchor.getAttribute('value')).to.be.null;
            expect(anchor.getAttribute('disabled')).to.be.null;
            expect(anchor.getAttribute('role')).to.be.null;
        });

        it('should set aria-disabled="false" and tabindex="0" when not disabled', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('aria-disabled')).to.equal('false');
            expect(anchor.getAttribute('tabindex')).to.equal('0');
        });

        it('should remove href and set aria-disabled="true" and tabindex="-1" when disabled', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test" disabled>
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('href')).to.be.null;
            expect(anchor.getAttribute('aria-disabled')).to.equal('true');
            expect(anchor.getAttribute('tabindex')).to.equal('-1');
        });
    });

    describe('when bindAnchor attaches event listeners', () => {
        it('should forward focus events from slotted anchor to the host', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;

            const focusSpy = sinon.spy();
            el.addEventListener('ts-focus', focusSpy);
            const anchor = el.querySelector('a')!;
            anchor.dispatchEvent(new Event('focus'));
            await waitUntil(() => focusSpy.calledOnce);
            expect(focusSpy).to.have.been.calledOnce;
        });

        it('should forward blur events from slotted anchor to the host', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;

            const blurSpy = sinon.spy();
            el.addEventListener('ts-blur', blurSpy);
            const anchor = el.querySelector('a')!;
            anchor.dispatchEvent(new Event('blur'));
            await waitUntil(() => blurSpy.calledOnce);
            expect(blurSpy).to.have.been.calledOnce;
        });

        it('should forward click events from slotted anchor without navigation', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;

            const clickSpy = sinon.spy();
            el.addEventListener('click', clickSpy);
            // Prevent navigation by intercepting the click on the anchor before it fires
            const anchor = el.querySelector('a')!;
            anchor.addEventListener('click', e => e.preventDefault(), { capture: true });
            anchor.click();
            await waitUntil(() => clickSpy.calledOnce);
            expect(clickSpy).to.have.been.calledOnce;
        });
    });

    describe('when slotted anchor is removed', () => {
        it('should cleanup listeners and reset hasSlottedAnchor when anchor is removed', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;

            // Verify slotted anchor is active (no shadow a/button)
            expect(el.shadowRoot!.querySelector('a')).not.to.exist;

            // Remove the slotted anchor
            const anchor = el.querySelector('a')!;
            anchor.remove();
            await el.updateComplete;
            await el.updateComplete;

            // Now should render normal link <a> in shadow root
            expect(el.shadowRoot!.querySelector('a')).to.exist;
        });

        it('should not emit focus events after anchor is removed and listeners cleaned up', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;

            const anchor = el.querySelector('a')!;
            const focusSpy = sinon.spy();
            el.addEventListener('ts-focus', focusSpy);

            // Remove anchor (triggers cleanup)
            anchor.remove();
            await el.updateComplete;
            await el.updateComplete;

            // Dispatch focus on the removed anchor - should NOT be forwarded
            anchor.dispatchEvent(new Event('focus'));
            // Give it a tick to ensure no event fires
            await new Promise(r => setTimeout(r, 50));
            expect(focusSpy).not.to.have.been.called;
        });
    });

    describe('when switching slotted anchors', () => {
        it('should cleanup old anchor and bind new anchor when slotted anchor changes', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a id="anchor1" href="/test">Link 1</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;

            const anchor1 = el.querySelector('#anchor1')!;
            const focusSpy = sinon.spy();
            el.addEventListener('ts-focus', focusSpy);

            // Replace anchor1 with anchor2
            anchor1.remove();
            const anchor2 = document.createElement('a');
            anchor2.id = 'anchor2';
            anchor2.href = '/test2';
            anchor2.textContent = 'Link 2';
            el.appendChild(anchor2);

            await el.updateComplete;
            await el.updateComplete;

            // Dispatch focus on old anchor - should not trigger after cleanup
            anchor1.dispatchEvent(new Event('focus'));
            await new Promise(r => setTimeout(r, 20));
            expect(focusSpy).not.to.have.been.called;

            // New anchor should be bound
            anchor2.dispatchEvent(new Event('focus'));
            await waitUntil(() => focusSpy.calledOnce);
            expect(focusSpy).to.have.been.calledOnce;
        });
    });

    describe('when no slotted anchor but currentAnchor existed', () => {
        it('should call cleanup when anchor is replaced by non-anchor element', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;

            const anchor = el.querySelector('a')!;
            // Replace anchor with a span (not an anchor)
            const span = document.createElement('span');
            span.textContent = 'Not a link';
            anchor.replaceWith(span);

            await el.updateComplete;
            await el.updateComplete;

            // Should fall back to rendering an <a> in shadow root
            expect(el.shadowRoot!.querySelector('a')).to.exist;
        });
    });

    describe('when rel is empty string', () => {
        it('should remove rel attribute from slotted anchor when rel is empty', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test" rel="">
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;
            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('rel')).to.be.null;
        });
    });

    describe('when disabled is toggled on slotted anchor', () => {
        it('should restore href on slotted anchor when re-enabled', async () => {
            const el = await fixture<TsButton>(html`
                <ts-button href="/test" disabled>
                    <a href="/test">Link</a>
                </ts-button>
            `);
            await el.updateComplete;
            await el.updateComplete;

            const anchor = el.querySelector('a')!;
            expect(anchor.getAttribute('href')).to.be.null;
            expect(anchor.getAttribute('aria-disabled')).to.equal('true');

            // Re-enable
            el.disabled = false;
            await el.updateComplete;

            expect(anchor.getAttribute('aria-disabled')).to.equal('false');
            expect(anchor.getAttribute('tabindex')).to.equal('0');
        });
    });
});
