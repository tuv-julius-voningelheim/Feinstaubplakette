import { aTimeout, expect, fixture, html, waitUntil } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsAvatar } from '@components/avatar/index.js';

import '@tuvsud/design-system/avatar';

const ignoredRules = ['color-contrast'];

describe('avatar component <ts-avatar>', () => {
    let el: TsAvatar;

    describe('when provided no parameters', () => {
        before(async () => {
            el = await fixture<TsAvatar>(html` <ts-avatar label="Avatar"></ts-avatar> `);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible({ ignoredRules });
        });

        it('should default to circle styling', () => {
            const part = el.shadowRoot!.querySelector('[part~="base"]')!;
            expect(el.getAttribute('shape')).to.eq('circle');
            expect(part.classList.value.trim()).to.eq('avatar avatar--circle');
        });
    });

    describe('when provided an image and label parameter', () => {
        const image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const label = 'Small transparent square';
        before(async () => {
            el = await fixture<TsAvatar>(html`<ts-avatar image="${image}" label="${label}"></ts-avatar>`);
        });

        it('should pass accessibility tests', async () => {
            /**
             * The image element itself is ancillary, because it's parent container contains the
             * aria-label which dictates what "ts-avatar" is. This also implies that label text will
             * resolve to "" when not provided and ignored by readers. This is why we use alt="" on
             * the image element to pass accessibility.
             * https://html.spec.whatwg.org/multipage/images.html#ancillary-images
             */
            await expect(el).to.be.accessible({ ignoredRules });
        });

        it('renders "image" part, with src and a role of presentation', () => {
            const part = el.shadowRoot!.querySelector('[part~="image"]')!;

            expect(part.getAttribute('src')).to.eq(image);
        });

        it('renders the label attribute in the "base" part', () => {
            const part = el.shadowRoot!.querySelector('[part~="base"]')!;

            expect(part.getAttribute('aria-label')).to.eq(label);
        });
    });

    describe('when provided initials parameter', () => {
        const initials = 'SL';
        before(async () => {
            el = await fixture<TsAvatar>(html`<ts-avatar initials="${initials}" label="Avatar"></ts-avatar>`);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible({ ignoredRules });
        });

        it('renders "initials" part, with initials as the text node', () => {
            const part = el.shadowRoot!.querySelector<HTMLElement>('[part~="initials"]')!;

            expect(part.innerText).to.eq(initials);
        });
    });

    describe('when image is present, the initials or icon part should not render', () => {
        const initials = 'SL';
        const image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const label = 'Small transparent square';
        before(async () => {
            el = await fixture<TsAvatar>(
                html`<ts-avatar image="${image}" label="${label}" initials="${initials}"></ts-avatar>`,
            );
        });

        it('should pass accessibility tests', async () => {
            /**
             * The image element itself is ancillary, because it's parent container contains the
             * aria-label which dictates what "ts-avatar" is. This also implies that label text will
             * resolve to "" when not provided and ignored by readers. This is why we use alt="" on
             * the image element to pass accessibility.
             * https://html.spec.whatwg.org/multipage/images.html#ancillary-images
             */
            await expect(el).to.be.accessible({ ignoredRules });
        });

        it('renders "image" part, with src and a role of presentation', () => {
            const part = el.shadowRoot!.querySelector('[part~="image"]')!;

            expect(part.getAttribute('src')).to.eq(image);
        });

        it('should not render the initials part', () => {
            const part = el.shadowRoot!.querySelector<HTMLElement>('[part~="initials"]')!;

            expect(part).to.not.exist;
        });

        it('should not render the icon part', () => {
            const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=icon]')!;

            expect(slot).to.not.exist;
        });
    });

    ['square', 'rounded', 'circle'].forEach(shape => {
        describe(`when passed a shape attribute ${shape}`, () => {
            before(async () => {
                el = await fixture<TsAvatar>(html`<ts-avatar shape="${shape}" label="Shaped avatar"></ts-avatar>`);
            });

            it('should pass accessibility tests', async () => {
                await expect(el).to.be.accessible({ ignoredRules });
            });

            it('appends the appropriate class on the "base" part', () => {
                const part = el.shadowRoot!.querySelector('[part~="base"]')!;

                expect(el.getAttribute('shape')).to.eq(shape);
                expect(part.classList.value.trim()).to.eq(`avatar avatar--${shape}`);
            });
        });
    });

    describe('when passed a <span>, on slot "icon"', () => {
        before(async () => {
            el = await fixture<TsAvatar>(
                html`<ts-avatar label="Avatar"><span slot="icon">random content</span></ts-avatar>`,
            );
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible({ ignoredRules });
        });

        it('should accept as an assigned child in the shadow root', () => {
            const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=icon]')!;
            const childNodes = slot.assignedNodes({ flatten: true }) as HTMLElement[];

            expect(childNodes.length).to.eq(1);

            const span = childNodes[0];
            expect(span!.innerHTML).to.eq('random content');
        });
    });

    describe('render image', () => {
        it('should not render the image when the image fails to load', async () => {
            const OriginalImage: typeof Image = globalThis.Image;

            class FakeImage {
                onload: ((e: Event) => void) | null = null;
                onerror: ((e: Event) => void) | null = null;

                set src(_: string) {
                    setTimeout(() => this.onerror?.(new Event('error')));
                }
            }

            globalThis.Image = FakeImage as unknown as typeof Image;

            const el = await fixture<TsAvatar>(html`<ts-avatar label="Avatar"></ts-avatar>`);
            el.image = 'bad_image';
            await el.updateComplete;

            await waitUntil(
                () => el.shadowRoot!.querySelector('img') === null,
                'expected <img> to be removed after error',
                { timeout: 5000 },
            );

            globalThis.Image = OriginalImage;
            expect(el.shadowRoot!.querySelector('img')).to.equal(null);
        });

        it('should show a valid image after being passed an invalid image initially', async () => {
            el = await fixture<TsAvatar>(html`<ts-avatar></ts-avatar>`);

            await aTimeout(0);
            await waitUntil(() => el.shadowRoot!.querySelector('img') === null);

            el.image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            await el.updateComplete;

            expect(el.shadowRoot?.querySelector('img')).to.exist;
        });
    });

    describe('css Style variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsAvatar>(html`<ts-avatar>avatar</ts-avatar>`);
            const cssText = getCssText(el);

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-default);');
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-inverted-default);');

            expect(cssText).to.include('.avatar--circle, .avatar--circle .avatar__image {');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-pill);');

            expect(cssText).to.include('.avatar--rounded, .avatar--rounded .avatar__image {');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
        });
    });
});
