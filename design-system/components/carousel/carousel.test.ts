import { expect, fixture, html, nextFrame, oneEvent, waitUntil } from '@open-wc/testing';
import { resetMouse } from '@web/test-runner-commands';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import sinon from 'sinon';

import type { SinonStub } from 'sinon';

import { clickOnElement, getCssText, moveMouseOnElement } from '@utils/internal/test.js';

import type { TsCarousel } from './index.js';

import '@tuvsud/design-system/carousel';
import '@tuvsud/design-system/carousel-item';
import '@tuvsud/design-system/button';

describe('carousel component <ts-carousel>', () => {
    const sandbox = sinon.createSandbox();
    const ioCallbacks = new Map<IntersectionObserver, SinonStub>();
    const intersectionObserverCallbacks = () => {
        const callbacks = [...ioCallbacks.values()];
        return waitUntil(() => callbacks.every(callback => callback.called));
    };
    const OriginalIntersectionObserver = globalThis.IntersectionObserver;

    beforeEach(() => {
        globalThis.IntersectionObserver = class IntersectionObserverMock extends OriginalIntersectionObserver {
            constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
                const stubCallback = sandbox.stub().callsFake(callback);

                super(stubCallback, options);

                ioCallbacks.set(this, stubCallback);
            }
        };
    });

    afterEach(async () => {
        await resetMouse();
        sandbox.restore();
        globalThis.IntersectionObserver = OriginalIntersectionObserver;
        ioCallbacks.clear();
    });

    it('should render a carousel with default configuration', async () => {
        const el = await fixture(html`
            <ts-carousel>
                <ts-carousel-item>Node 1</ts-carousel-item>
                <ts-carousel-item>Node 2</ts-carousel-item>
                <ts-carousel-item>Node 3</ts-carousel-item>
            </ts-carousel>
        `);

        expect(el).to.exist;
        expect(el).to.have.attribute('role', 'region');
        expect(el).to.have.attribute('aria-label', 'Carousel');
        expect(el.shadowRoot!.querySelector('.carousel__navigation')).not.to.exist;
        expect(el.shadowRoot!.querySelector('.carousel__pagination')).not.to.exist;
    });

    describe('when `autoplay` attribute is provided', () => {
        let clock: sinon.SinonFakeTimers;

        beforeEach(() => {
            clock = sandbox.useFakeTimers({
                now: new Date(),
            });
        });

        it('should pause the autoplay while the user is interacting', async () => {
            const el = await fixture<TsCarousel>(html`
                <ts-carousel autoplay autoplay-interval="10">
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                </ts-carousel>
            `);
            sandbox.stub(el, 'next');

            await el.updateComplete;

            el.dispatchEvent(new Event('mouseenter'));
            await el.updateComplete;
            clock.next();
            clock.next();

            expect(el.next).not.to.have.been.called;
        });

        it('should not resume if the user is still interacting', async () => {
            const el = await fixture<TsCarousel>(html`
                <ts-carousel autoplay autoplay-interval="10">
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                </ts-carousel>
            `);
            sandbox.stub(el, 'next');

            await el.updateComplete;

            el.dispatchEvent(new Event('mouseenter'));
            el.dispatchEvent(new Event('focusin'));
            await el.updateComplete;

            el.dispatchEvent(new Event('mouseleave'));
            await el.updateComplete;

            clock.next();
            clock.next();

            expect(el.next).not.to.have.been.called;
        });
    });

    describe('when `loop` attribute is provided', () => {
        it('should create clones of the first and last slides', async () => {
            const el = await fixture<TsCarousel>(html`
                <ts-carousel loop>
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                </ts-carousel>
            `);

            await el.updateComplete;

            expect(el.firstElementChild).to.have.attribute('data-clone', '2');
            expect(el.lastElementChild).to.have.attribute('data-clone', '0');
        });

        describe('and `slides-per-page` is provided', () => {
            it('should create multiple clones', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel loop slides-per-page="2">
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                        <ts-carousel-item>Node 3</ts-carousel-item>
                    </ts-carousel>
                `);

                await el.updateComplete;
                const clones = [...el.children].filter(child => child.hasAttribute('data-clone'));

                expect(clones).to.have.lengthOf(4);
            });
        });
    });

    describe('when `pagination` attribute is provided', () => {
        it('should render pagination controls', async () => {
            const el = await fixture(html`
                <ts-carousel pagination>
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                </ts-carousel>
            `);

            expect(el).to.exist;
            expect(el.shadowRoot!.querySelector('.carousel__navigation')).not.to.exist;
            expect(el.shadowRoot!.querySelector('.carousel__pagination')).to.exist;
        });

        describe('and user clicks on a pagination button', () => {
            it('should scroll the carousel to the nth slide', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel pagination>
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                        <ts-carousel-item>Node 3</ts-carousel-item>
                    </ts-carousel>
                `);
                sandbox.stub(el, 'goToSlide');
                await el.updateComplete;

                const paginationItem = el.shadowRoot!.querySelectorAll('.carousel__pagination-item')[2] as HTMLElement;
                await clickOnElement(paginationItem);

                expect(el.goToSlide).to.have.been.calledWith(2);
            });
        });
    });

    describe('when `navigation` attribute is provided', () => {
        it('should render navigation controls', async () => {
            const el = await fixture(html`
                <ts-carousel navigation>
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                </ts-carousel>
            `);

            expect(el).to.exist;
            expect(el.shadowRoot!.querySelector('.carousel__navigation')).to.exist;
            expect(el.shadowRoot!.querySelector('.carousel__pagination')).not.to.exist;
        });
    });

    describe('when `slides-per-page` attribute is provided', () => {
        it('should show multiple slides at a given time', async () => {
            const el = await fixture<TsCarousel>(html`
                <ts-carousel slides-per-page="2">
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                </ts-carousel>
            `);

            await el.updateComplete;

            expect(el.scrollContainer.style.getPropertyValue('--slides-per-page').trim()).to.be.equal('2');
        });

        [
            [7, 2, 1, false, 6],
            [5, 3, 3, false, 2],
            [10, 2, 2, false, 5],
            [7, 2, 1, true, 7],
            [5, 3, 3, true, 2],
            [10, 2, 2, true, 5],
        ].forEach((args: (number | boolean)[]) => {
            const [slides, slidesPerPage, slidesPerMove, loop, expected] = args as [
                number,
                number,
                number,
                boolean,
                number,
            ];
            it(`should display ${expected} pages for ${slides} slides grouped by ${slidesPerPage} and scrolled by ${slidesPerMove}${
                loop ? ' (loop)' : ''
            }`, async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel
                        pagination
                        navigation
                        slides-per-page="${slidesPerPage}"
                        slides-per-move="${slidesPerMove}"
                        ?loop=${loop}
                    >
                        ${map(range(slides), i => html`<ts-carousel-item>${i}</ts-carousel-item>`)}
                    </ts-carousel>
                `);

                const paginationItems = el.shadowRoot!.querySelectorAll('.carousel__pagination-item');
                expect(paginationItems.length).to.equal(expected);
            });
        });
    });

    describe('when `slides-per-move` attribute is provided', () => {
        it('should set the granularity of snapping', async () => {
            const expectedSnapGranularity = 2;
            const el = await fixture<TsCarousel>(html`
                <ts-carousel slides-per-page="${expectedSnapGranularity}" slides-per-move="${expectedSnapGranularity}">
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                    <ts-carousel-item>Node 4</ts-carousel-item>
                </ts-carousel>
            `);

            await el.updateComplete;

            for (let i = 0; i < el.children.length; i++) {
                const child = el.children[i] as HTMLElement;

                if (i % expectedSnapGranularity === 0) {
                    expect(child.style.getPropertyValue('scroll-snap-align')).to.be.equal('');
                } else {
                    expect(child.style.getPropertyValue('scroll-snap-align')).to.be.equal('none');
                }
            }
        });

        it('should be possible to move by the given number of slides at a time', async () => {
            const el = await fixture<TsCarousel>(html`
                <ts-carousel navigation slides-per-move="2" slides-per-page="2">
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item class="expected">Node 3</ts-carousel-item>
                    <ts-carousel-item class="expected">Node 4</ts-carousel-item>
                    <ts-carousel-item>Node 5</ts-carousel-item>
                    <ts-carousel-item>Node 6</ts-carousel-item>
                </ts-carousel>
            `);
            const expectedSlides = el.querySelectorAll('.expected')!;
            const nextButton: HTMLElement = el.shadowRoot!.querySelector('.carousel__navigation-button--next')!;

            await clickOnElement(nextButton);

            await oneEvent(el.scrollContainer, 'scrollend');
            await intersectionObserverCallbacks();
            await el.updateComplete;

            for (const expectedSlide of expectedSlides) {
                expect(expectedSlide).to.have.class('--in-view');
                expect(expectedSlide).to.be.visible;
            }
        });

        it('should not be possible to move by a number that is greater than the displayed number', async () => {
            const expectedSlidesPerMove = 2;
            const el = await fixture<TsCarousel>(html`
                <ts-carousel slides-per-page="${expectedSlidesPerMove}">
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                    <ts-carousel-item>Node 4</ts-carousel-item>
                    <ts-carousel-item>Node 5</ts-carousel-item>
                    <ts-carousel-item>Node 6</ts-carousel-item>
                </ts-carousel>
            `);

            el.slidesPerMove = 3;
            await el.updateComplete;

            expect(el.slidesPerMove).to.be.equal(expectedSlidesPerMove);
        });
    });

    describe('when `orientation` attribute is provided', () => {
        describe('and value is `vertical`', () => {
            it('should make the scrollable along the y-axis', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel orientation="vertical" style="height: 100px">
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                    </ts-carousel>
                `);

                await el.updateComplete;

                expect(el.scrollContainer.scrollWidth).to.be.equal(el.scrollContainer.clientWidth);
                expect(el.scrollContainer.scrollHeight).to.be.greaterThan(el.scrollContainer.clientHeight);
            });
        });

        describe('and value is `horizontal`', () => {
            it('should make the scrollable along the x-axis', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel orientation="horizontal" style="height: 100px">
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                    </ts-carousel>
                `);

                await el.updateComplete;

                expect(el.scrollContainer.scrollWidth).to.be.greaterThan(el.scrollContainer.clientWidth);
                expect(el.scrollContainer.scrollHeight).to.be.equal(el.scrollContainer.clientHeight);
            });
        });
    });

    describe('when `mouse-dragging` attribute is provided', () => {
        it('should be possible to interact with clickable elements', async () => {
            const el = await fixture<TsCarousel>(html`
                <ts-carousel mouse-dragging>
                    <ts-carousel-item><button>click me</button></ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                </ts-carousel>
            `);
            const button = el.querySelector('button')!;

            const clickSpy = sinon.spy();
            button.addEventListener('click', clickSpy);

            await moveMouseOnElement(button);
            await clickOnElement(button);

            expect(clickSpy).to.have.been.called;
        });
    });

    describe('Navigation controls', () => {
        describe('when the user clicks the next button', () => {
            it('should scroll to the next slide', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel navigation>
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                        <ts-carousel-item>Node 3</ts-carousel-item>
                    </ts-carousel>
                `);
                const nextButton: HTMLElement = el.shadowRoot!.querySelector('.carousel__navigation-button--next')!;
                sandbox.stub(el, 'next');

                await el.updateComplete;

                await clickOnElement(nextButton);
                await el.updateComplete;

                expect(el.next).to.have.been.calledOnce;
            });

            describe('and carousel is positioned on the last slide', () => {
                it('should not scroll', async () => {
                    const el = await fixture<TsCarousel>(html`
                        <ts-carousel navigation>
                            <ts-carousel-item>Node 1</ts-carousel-item>
                            <ts-carousel-item>Node 2</ts-carousel-item>
                            <ts-carousel-item>Node 3</ts-carousel-item>
                        </ts-carousel>
                    `);
                    const nextButton: HTMLElement = el.shadowRoot!.querySelector('.carousel__navigation-button--next')!;
                    sandbox.stub(el, 'next');

                    el.goToSlide(2, 'auto');
                    await oneEvent(el.scrollContainer, 'scrollend');
                    await intersectionObserverCallbacks();
                    await el.updateComplete;

                    await clickOnElement(nextButton);
                    await el.updateComplete;

                    expect(nextButton).to.have.attribute('aria-disabled', 'true');
                    expect(el.next).not.to.have.been.called;
                });

                describe('and `loop` attribute is provided', () => {
                    it('should scroll to the first slide', async () => {
                        const el = await fixture<TsCarousel>(html`
                            <ts-carousel navigation loop>
                                <ts-carousel-item>Node 1</ts-carousel-item>
                                <ts-carousel-item>Node 2</ts-carousel-item>
                                <ts-carousel-item>Node 3</ts-carousel-item>
                            </ts-carousel>
                        `);
                        const nextButton: HTMLElement = el.shadowRoot!.querySelector(
                            '.carousel__navigation-button--next',
                        )!;

                        el.goToSlide(2, 'auto');
                        await oneEvent(el.scrollContainer, 'scrollend');
                        await intersectionObserverCallbacks();
                        await el.updateComplete;

                        await clickOnElement(nextButton);

                        await oneEvent(el.scrollContainer, 'scrollend').catch(() => undefined);

                        await intersectionObserverCallbacks();
                        await el.updateComplete;

                        await waitUntil(() => el.activeSlide === 0);

                        expect(nextButton).to.have.attribute('aria-disabled', 'false');
                        expect(el.activeSlide).to.be.equal(0);
                    });
                });
            });
        });

        describe('and clicks the previous button', () => {
            it('should scroll to the previous slide', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel navigation>
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                        <ts-carousel-item>Node 3</ts-carousel-item>
                    </ts-carousel>
                `);

                el.goToSlide(1, 'auto');
                await oneEvent(el.scrollContainer, 'scrollend');
                await intersectionObserverCallbacks();
                await el.updateComplete;

                const previousButton: HTMLElement = el.shadowRoot!.querySelector(
                    '.carousel__navigation-button--previous',
                )!;
                sandbox.stub(el, 'previous');

                await el.updateComplete;

                await clickOnElement(previousButton);
                await el.updateComplete;

                expect(el.previous).to.have.been.calledOnce;
            });

            describe('and carousel is positioned on the first slide', () => {
                it('should not scroll', async () => {
                    const el = await fixture<TsCarousel>(html`
                        <ts-carousel navigation>
                            <ts-carousel-item>Node 1</ts-carousel-item>
                            <ts-carousel-item>Node 2</ts-carousel-item>
                            <ts-carousel-item>Node 3</ts-carousel-item>
                        </ts-carousel>
                    `);

                    const previousButton: HTMLElement = el.shadowRoot!.querySelector(
                        '.carousel__navigation-button--previous',
                    )!;
                    sandbox.stub(el, 'previous');
                    await el.updateComplete;

                    await clickOnElement(previousButton);
                    await el.updateComplete;

                    expect(previousButton).to.have.attribute('aria-disabled', 'true');
                    expect(el.previous).not.to.have.been.called;
                });

                describe('and `loop` attribute is provided', () => {
                    it('should scroll to the last slide', async () => {
                        const el = await fixture<TsCarousel>(html`
                            <ts-carousel navigation loop>
                                <ts-carousel-item>Node 1</ts-carousel-item>
                                <ts-carousel-item>Node 2</ts-carousel-item>
                                <ts-carousel-item>Node 3</ts-carousel-item>
                            </ts-carousel>
                        `);

                        const previousButton: HTMLElement = el.shadowRoot!.querySelector(
                            '.carousel__navigation-button--previous',
                        )!;
                        await el.updateComplete;

                        await clickOnElement(previousButton);

                        await oneEvent(el.scrollContainer, 'scrollend').catch(() => undefined);

                        await intersectionObserverCallbacks();
                        await el.updateComplete;

                        await waitUntil(() => el.activeSlide === 2);

                        expect(previousButton).to.have.attribute('aria-disabled', 'false');
                        expect(el.activeSlide).to.be.equal(2);
                    });
                });
            });
        });
    });

    describe('API', () => {
        describe('#next', () => {
            it('should scroll the carousel to the next slide', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel>
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                        <ts-carousel-item>Node 3</ts-carousel-item>
                    </ts-carousel>
                `);
                sandbox.spy(el, 'goToSlide');
                const expectedCarouselItem: HTMLElement = el.querySelector('ts-carousel-item:nth-child(2)')!;

                el.next();
                await oneEvent(el.scrollContainer, 'scrollend');
                await intersectionObserverCallbacks();
                await el.updateComplete;

                const containerRect = el.scrollContainer.getBoundingClientRect();
                const itemRect = expectedCarouselItem.getBoundingClientRect();

                expect(el.goToSlide).to.have.been.calledWith(1);
                expect(itemRect.top).to.be.equal(containerRect.top);
                expect(itemRect.left).to.be.equal(containerRect.left);
            });
        });

        describe('#previous', () => {
            it('should scroll the carousel to the previous slide', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel>
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                        <ts-carousel-item>Node 3</ts-carousel-item>
                    </ts-carousel>
                `);
                const expectedCarouselItem: HTMLElement = el.querySelector('ts-carousel-item:nth-child(1)')!;

                el.goToSlide(1);

                await oneEvent(el.scrollContainer, 'scrollend');
                await intersectionObserverCallbacks();
                await nextFrame();

                sandbox.spy(el, 'goToSlide');

                el.previous();
                await oneEvent(el.scrollContainer, 'scrollend');
                await intersectionObserverCallbacks();

                const containerRect = el.scrollContainer.getBoundingClientRect();
                const itemRect = expectedCarouselItem.getBoundingClientRect();

                expect(el.goToSlide).to.have.been.calledWith(0);
                expect(itemRect.top).to.be.equal(containerRect.top);
                expect(itemRect.left).to.be.equal(containerRect.left);
            });
        });

        describe('#goToSlide', () => {
            it('should scroll the carousel to the nth slide', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel>
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                        <ts-carousel-item>Node 3</ts-carousel-item>
                    </ts-carousel>
                `);
                await el.updateComplete;

                el.goToSlide(2);
                await oneEvent(el.scrollContainer, 'scrollend');
                await intersectionObserverCallbacks();
                await el.updateComplete;

                expect(el.activeSlide).to.be.equal(2);
            });
        });
    });

    describe('Accessibility', () => {
        it('should pass accessibility tests', async () => {
            const el = await fixture<TsCarousel>(html`
                <ts-carousel navigation pagination>
                    <ts-carousel-item>Node 1</ts-carousel-item>
                    <ts-carousel-item>Node 2</ts-carousel-item>
                    <ts-carousel-item>Node 3</ts-carousel-item>
                </ts-carousel>
            `);

            const pagination = el.shadowRoot!.querySelector('.carousel__pagination')!;
            const navigation = el.shadowRoot!.querySelector('.carousel__navigation')!;
            await el.updateComplete;

            expect(el.scrollContainer).to.have.attribute('aria-busy', 'false');
            expect(el.scrollContainer).to.have.attribute('aria-atomic', 'true');

            expect(pagination).to.exist;

            for (const paginationItem of pagination.querySelectorAll('.carousel__pagination-item')) {
                expect(paginationItem).to.have.attribute('aria-current');
                expect(paginationItem).to.have.attribute('aria-label');
                expect(paginationItem).to.have.attribute('tabindex');
            }

            for (const navigationItem of navigation.querySelectorAll('button')) {
                expect(navigationItem).to.have.attribute('aria-disabled');
                expect(navigationItem).to.have.attribute('aria-label');
            }

            await expect(el).to.be.accessible();
        });

        describe('when scrolling', () => {
            it('should update aria-busy attribute', async () => {
                const el = await fixture<TsCarousel>(html`
                    <ts-carousel autoplay>
                        <ts-carousel-item>Node 1</ts-carousel-item>
                        <ts-carousel-item>Node 2</ts-carousel-item>
                        <ts-carousel-item>Node 3</ts-carousel-item>
                    </ts-carousel>
                `);

                await el.updateComplete;

                el.goToSlide(2, 'smooth');
                await oneEvent(el.scrollContainer, 'scroll');
                await el.updateComplete;

                expect(el.scrollContainer).to.have.attribute('aria-busy', 'true');

                await oneEvent(el.scrollContainer, 'scrollend');
                await el.updateComplete;
                expect(el.scrollContainer).to.have.attribute('aria-busy', 'false');
            });
        });
    });

    describe('<ts-carousel> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsCarousel>(html` <ts-carousel></ts-carousel>`);
            const cssText = getCssText(el);

            expect(cssText).to.include('--slide-gap: var(--ts-semantic-size-space-500, 1rem);');
            expect(cssText).to.include('--aspect-ratio: 16 / 9;');
            expect(cssText).to.include('--scroll-hint: 0px;');

            expect(cssText).to.include('aspect-ratio: calc(var(--aspect-ratio) * var(--slides-per-page));');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include(
                '--slide-size: calc((100% - (var(--slides-per-page) - 1) * var(--slide-gap)) / var(--slides-per-page));',
            );

            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-xl);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('color: var(--ts-semantic-color-icon-base-default);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-medium) color;');

            expect(cssText).to.include('gap: var(--ts-semantic-size-space-400);');
            expect(cssText).to.include('width: var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('height: var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-dark-default);');

            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');
        });
    });
});
