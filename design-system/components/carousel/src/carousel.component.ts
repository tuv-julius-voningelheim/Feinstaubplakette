import { html } from 'lit';
import { eventOptions, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';

import type { CSSResultGroup, PropertyValueMap } from 'lit';

import { prefersReducedMotion } from '@utils/internal/animate.js';
import ComponentElement from '@utils/internal/component-element.js';
import { waitForEvent } from '@utils/internal/event.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { clamp } from '@utils/internal/math.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import { AutoplayController } from '@components/carousel/src/autoplay-controller.js';
import { TsIconButton } from '@components/icon-button/index.js';
import type { TsCarouselItem } from '@components/carousel-item/index.js';

import styles from './TsCarouselStyles.js';

import '@utils/internal/scrollend-polyfill.js';

/**
 * @summary Carousels display an arbitrary number of content slides along a horizontal or vertical axis.
 * @documentation https://create.tuvsud.com/latest/components/carousel/develop-FIEg6jtw
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon
 *
 * @event {{ index: number, slide: TsCarouselItem }} ts-slide-change - Emitted when the active slide changes.
 * @event {{ index: number, slide: TsCarouselItem }} ts-next - Emitted when the next navigation button is clicked.
 * @event {{ index: number, slide: TsCarouselItem }} ts-previous - Emitted when the previous navigation button is clicked.
 *
 * @slot - The carousel's main content, one or more `<ts-carousel-item>` elements.
 * @slot next-icon - Optional next icon to use instead of the default. Works best with `<ts-icon>`.
 * @slot previous-icon - Optional previous icon to use instead of the default. Works best with `<ts-icon>`.
 *
 * @csspart base - The carousel's internal wrapper.
 * @csspart scroll-container - The scroll container that wraps the slides.
 * @csspart pagination - The pagination indicators wrapper.
 * @csspart pagination-item - The pagination indicator.
 * @csspart pagination-item--active - Applied when the item is active.
 * @csspart navigation - The navigation wrapper.
 * @csspart navigation-button - The navigation button.
 * @csspart navigation-button--previous - Applied to the previous button.
 * @csspart navigation-button--next - Applied to the next button.
 *
 * @cssproperty --slide-gap - The space between each slide.
 * @cssproperty [--aspect-ratio=16/9] - The aspect ratio of each slide.
 * @cssproperty --scroll-hint - The amount of padding to apply to the scroll area, allowing adjacent slides to become
 *  partially visible as a scroll hint.
 */
export default class TsCarouselComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon-button': TsIconButton };

    /** When set, allows the user to navigate the carousel in the same direction indefinitely. */
    @property({ type: Boolean, reflect: true }) loop = false;

    /** When set, show the carousel's navigation. */
    @property({ type: Boolean, reflect: true }) navigation = false;

    /** When set, show the carousel's pagination indicators. */
    @property({ type: Boolean, reflect: true }) pagination = false;

    /** When set, the slides will scroll automatically when the user is not interacting with them.  */
    @property({ type: Boolean, reflect: true }) autoplay = false;

    /** Specifies the amount of time, in milliseconds, between each automatic scroll.  */
    @property({ type: Number, attribute: 'autoplay-interval' }) autoplayInterval = 3000;

    /** Specifies how many slides should be shown at a given time.  */
    @property({ type: Number, attribute: 'slides-per-page' }) slidesPerPage = 1;

    /**
     * Specifies the number of slides the carousel will advance when scrolling, useful when specifying a `slides-per-page`
     * greater than one. It can't be higher than `slides-per-page`.
     */
    @property({ type: Number, attribute: 'slides-per-move' }) slidesPerMove = 1;

    /** Specifies the orientation in which the carousel will lay out.  */
    @property() orientation: 'horizontal' | 'vertical' = 'horizontal';

    /** When set, it is possible to scroll through the slides by dragging them with the mouse. */
    @property({ type: Boolean, reflect: true, attribute: 'mouse-dragging' }) mouseDragging = false;

    @query('.carousel__slides') scrollContainer!: HTMLElement;
    @query('.carousel__pagination') paginationContainer!: HTMLElement;

    // The index of the active slide
    @state() activeSlide = 0;

    @state() scrolling = false;

    @state() dragging = false;

    @state() private liveRegionMessage = '';

    @state() private maxVisiblePagination = 0;

    private autoplayController = new AutoplayController(this, () => this.next());
    private dragStartPosition: [number, number] = [-1, -1];
    private readonly localize = new LocalizeController(this);
    private mutationObserver!: MutationObserver;
    private visibilityObserver!: IntersectionObserver;
    private hasBeenVisible = false;
    private pendingSlideChange = false;
    /** Tracks the last slide index for which ts-slide-change was emitted. Prevents duplicate/spurious events. */
    private lastEmittedSlide = -1;

    override connectedCallback(): void {
        if (!this.dataset.uid) {
            this.dataset.uid = crypto.randomUUID();
        }

        super.connectedCallback();
        this.setAttribute('role', 'region');
        this.setAttribute('aria-label', this.localize.term('carousel'));
    }

    protected override firstUpdated(): void {
        this.initializeSlides();
        this.mutationObserver = new MutationObserver(this.handleSlotChange);
        this.mutationObserver.observe(this, {
            childList: true,
            subtree: true,
        });

        // Defer reactive-state writes (liveRegionMessage, maxVisiblePagination)
        // until after the first update has completed so we don't trigger Lit's
        // "change-in-update" warning by mutating @state from firstUpdated().
        // (initializeSlides() already defers its own liveRegionMessage write.)
        this.updateComplete.then(() => {
            this.calculateMaxVisiblePagination();
        });

        // Update pagination visibility on resize
        window.addEventListener('resize', this.handleResize);

        // Setup visibility observer to re-initialize when carousel becomes visible
        // This fixes issues when carousel is in a hidden tab panel
        // Only set it up if the carousel is not currently visible
        this.updateComplete.then(() => {
            const isVisible = this.offsetParent !== null && this.offsetWidth > 0 && this.offsetHeight > 0;

            if (!isVisible) {
                this.visibilityObserver = new IntersectionObserver(
                    entries => {
                        const entry = entries[0];
                        if (entry && entry.isIntersecting && !this.hasBeenVisible) {
                            this.hasBeenVisible = true;
                            // Re-initialize to fix scroll hint and clone positioning
                            requestAnimationFrame(() => {
                                this.initializeSlides();
                            });
                        }
                    },
                    {
                        root: null,
                        threshold: 0.01,
                    },
                );
                this.visibilityObserver.observe(this);
            } else {
                // Mark as visible immediately if already visible
                this.hasBeenVisible = true;
            }
        });
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.mutationObserver?.disconnect();
        this.visibilityObserver?.disconnect();
        window.removeEventListener('resize', this.handleResize);
    }

    private handleResize = () => {
        this.calculateMaxVisiblePagination();
    };

    private calculateMaxVisiblePagination() {
        if (!this.pagination || !this.paginationContainer) {
            this.maxVisiblePagination = 0;
            return;
        }

        this.updateComplete.then(() => {
            const container = this.paginationContainer;
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const containerSize = this.orientation === 'horizontal' ? containerRect.width : containerRect.height;

            // Each pagination item is approximately 12px + 16px gap
            const itemSize = 12;
            const gapSize = 16;
            const totalItemSize = itemSize + gapSize;

            // Calculate how many can fit, leave margin for safety
            const canFit = Math.floor((containerSize - 32) / totalItemSize);

            // Minimum 5, but always odd number for symmetry
            let maxVisible = Math.max(5, canFit);
            if (maxVisible % 2 === 0) maxVisible -= 1;

            this.maxVisiblePagination = maxVisible;
        });
    }

    /**
     * Determines which pagination items should be visible
     * Returns an array of page indices to render
     */
    private getVisiblePaginationIndices(totalPages: number, currentPage: number): number[] {
        // If total pages is less than max visible, show all
        if (totalPages <= this.maxVisiblePagination || this.maxVisiblePagination === 0) {
            return Array.from({ length: totalPages }, (_, i) => i);
        }

        // Calculate how many items to show on each side of current
        const sideCount = Math.floor(this.maxVisiblePagination / 2);

        let start = currentPage - sideCount;
        let end = currentPage + sideCount;

        // Adjust if we're near the beginning
        if (start < 0) {
            end += Math.abs(start);
            start = 0;
        }

        // Adjust if we're near the end
        if (end >= totalPages) {
            start -= end - totalPages + 1;
            end = totalPages - 1;
            start = Math.max(0, start);
        }

        // Generate array of visible indices
        const indices: number[] = [];
        for (let i = start; i <= end; i++) {
            indices.push(i);
        }

        return indices;
    }

    protected override willUpdate(
        changedProperties: PropertyValueMap<TsCarouselComponent> | Map<PropertyKey, unknown>,
    ): void {
        // Ensure the slidesPerMove is never higher than the slidesPerPage
        if (changedProperties.has('slidesPerMove') || changedProperties.has('slidesPerPage')) {
            this.slidesPerMove = Math.min(this.slidesPerMove, this.slidesPerPage);
        }
    }

    private getPageCount() {
        const slidesCount = this.getSlides().length;
        const { slidesPerPage, slidesPerMove, loop } = this;

        const pages = loop ? slidesCount / slidesPerMove : (slidesCount - slidesPerPage) / slidesPerMove + 1;

        return Math.ceil(pages);
    }

    private getCurrentPage() {
        return Math.floor(this.activeSlide / this.slidesPerMove);
    }

    private canScrollNext(): boolean {
        return this.loop || this.getCurrentPage() < this.getPageCount() - 1;
    }

    private canScrollPrev(): boolean {
        return this.loop || this.getCurrentPage() > 0;
    }

    /** @internal Gets all carousel items. */
    private getSlides({ excludeClones = true }: { excludeClones?: boolean } = {}) {
        const nodes = Array.from(this.children);
        return nodes.filter((el): el is TsCarouselItem => {
            if (!this.isCarouselItem(el)) return false;
            return !excludeClones || !el.hasAttribute('data-clone');
        });
    }

    private handleClick(event: MouseEvent) {
        if (this.dragging && this.dragStartPosition[0] > 0 && this.dragStartPosition[1] > 0) {
            const deltaX = Math.abs(this.dragStartPosition[0] - event.clientX);
            const deltaY = Math.abs(this.dragStartPosition[1] - event.clientY);
            const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Prevents clicks on interactive elements while dragging if the click is within a small range. This prevents
            // accidental drags from interfering with intentional clicks.
            if (delta >= 10) {
                event.preventDefault();
            }
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
            const target = event.target as HTMLElement;
            const isRtl = this.localize.dir() === 'rtl';
            const isFocusInPagination = target.closest('[part~="pagination-item"]') !== null;
            const isNext =
                event.key === 'ArrowDown' ||
                (!isRtl && event.key === 'ArrowRight') ||
                (isRtl && event.key === 'ArrowLeft');
            const isPrevious =
                event.key === 'ArrowUp' ||
                (!isRtl && event.key === 'ArrowLeft') ||
                (isRtl && event.key === 'ArrowRight');

            event.preventDefault();

            if (isPrevious) {
                this.previous();
            }

            if (isNext) {
                this.next();
            }

            if (event.key === 'Home') {
                this.goToSlide(0);
            }

            if (event.key === 'End') {
                this.goToSlide(this.getSlides().length - 1);
            }

            if (isFocusInPagination) {
                this.updateComplete.then(() => {
                    const activePaginationItem = this.shadowRoot?.querySelector<HTMLButtonElement>(
                        '[part~="pagination-item--active"]',
                    );

                    if (activePaginationItem) {
                        activePaginationItem.focus();
                    }
                });
            }
        }
    }

    private handleMouseDragStart(event: PointerEvent) {
        const canDrag = this.mouseDragging && event.button === 0;
        if (canDrag) {
            event.preventDefault();

            document.addEventListener('pointermove', this.handleMouseDrag, { capture: true, passive: true });
            document.addEventListener('pointerup', this.handleMouseDragEnd, { capture: true, once: true });
        }
    }

    private handleMouseDrag = (event: PointerEvent) => {
        if (!this.dragging) {
            // Start dragging if it hasn't yet
            this.scrollContainer.style.setProperty('scroll-snap-type', 'none');
            this.dragging = true;
            this.dragStartPosition = [event.clientX, event.clientY];
        }

        this.scrollContainer.scrollBy({
            left: -event.movementX,
            top: -event.movementY,
            behavior: 'instant',
        });
    };

    private handleMouseDragEnd = () => {
        const scrollContainer = this.scrollContainer;

        document.removeEventListener('pointermove', this.handleMouseDrag, { capture: true });

        // get the current scroll position
        const startLeft = scrollContainer.scrollLeft;
        const startTop = scrollContainer.scrollTop;

        // remove the scroll-snap-type property so that the browser will snap the slide to the correct position
        scrollContainer.style.removeProperty('scroll-snap-type');

        // fix(safari): forcing a style recalculation doesn't seem to immediately update the scroll
        // position in Safari. Setting "overflow" to "hidden" should force this behavior.
        scrollContainer.style.setProperty('overflow', 'hidden');

        // get the final scroll position to the slide snapped by the browser
        const finalLeft = scrollContainer.scrollLeft;
        const finalTop = scrollContainer.scrollTop;

        // restore the scroll position to the original one, so that it can be smoothly animated if needed
        scrollContainer.style.removeProperty('overflow');
        scrollContainer.style.setProperty('scroll-snap-type', 'none');
        scrollContainer.scrollTo({ left: startLeft, top: startTop, behavior: 'instant' });

        requestAnimationFrame(async () => {
            if (startLeft !== finalLeft || startTop !== finalTop) {
                scrollContainer.scrollTo({
                    left: finalLeft,
                    top: finalTop,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                });
                await waitForEvent(scrollContainer, 'scrollend');
            }

            scrollContainer.style.removeProperty('scroll-snap-type');

            this.dragging = false;
            this.dragStartPosition = [-1, -1];
            this.handleScrollEnd();
        });
    };

    private emitNext(index: number) {
        const slides = this.getSlides();
        this.dispatchEvent(
            new CustomEvent('ts-click-next', {
                detail: { index, slide: slides[index] },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private emitPrevious(index: number) {
        const slides = this.getSlides();
        this.dispatchEvent(
            new CustomEvent('ts-click-previous', {
                detail: { index, slide: slides[index] },
                bubbles: true,
                composed: true,
            }),
        );
    }

    @eventOptions({ passive: true })
    private handleScroll() {
        // Guard: only assign (and trigger re-render) when value changes
        if (!this.scrolling) {
            this.scrolling = true;
        }
        if (!this.pendingSlideChange) {
            this.synchronizeSlides();
        }
    }

    /** @internal Synchronizes the slides with the IntersectionObserver API. */
    private synchronizeSlides() {
        const io = new IntersectionObserver(
            entries => {
                io.disconnect();

                for (const entry of entries) {
                    const slide = entry.target;
                    slide.toggleAttribute('inert', !entry.isIntersecting);
                    slide.classList.toggle('--in-view', entry.isIntersecting);
                    slide.setAttribute('aria-hidden', entry.isIntersecting ? 'false' : 'true');
                }

                const firstIntersecting = entries.find(entry => entry.isIntersecting);
                if (!firstIntersecting) {
                    return;
                }

                const slidesWithClones = this.getSlides({ excludeClones: false });
                const slidesCount = this.getSlides().length;

                // Update the current index based on the first visible slide
                const slideIndex = slidesWithClones.indexOf(firstIntersecting.target as TsCarouselItem);
                // Normalize the index to ignore clones
                const normalizedIndex = this.loop ? slideIndex - this.slidesPerPage : slideIndex;

                // Set the index to the closest "snappable" slide
                this.activeSlide =
                    (Math.ceil(normalizedIndex / this.slidesPerMove) * this.slidesPerMove + slidesCount) % slidesCount;
            },
            {
                root: this.scrollContainer,
                threshold: 0.6,
            },
        );

        this.getSlides({ excludeClones: false }).forEach(slide => {
            io.observe(slide);
        });
    }

    private handleScrollEnd() {
        if (!this.scrolling || this.dragging) return;
        this.scrolling = false;

        // Check if we're on a clone and need to jump to the real slide
        if (this.loop) {
            const slidesWithClones = this.getSlides({ excludeClones: false });
            const io = new IntersectionObserver(
                entries => {
                    io.disconnect();

                    const firstIntersecting = entries.find(entry => entry.isIntersecting);
                    if (firstIntersecting && firstIntersecting.target.hasAttribute('data-clone')) {
                        const clonePosition = Number(firstIntersecting.target.getAttribute('data-clone'));
                        // Jump to the real slide without animation, then emit once settled
                        this.pendingSlideChange = false;
                        this.goToSlide(clonePosition, 'instant');
                        // goToSlide with 'instant' does not re-enter handleScrollEnd
                        // (scrolling is already false), so emit after the rAF in scrollToSlide completes.
                        requestAnimationFrame(() => this.emitSlideChange());
                        return;
                    }

                    this.pendingSlideChange = false;
                    this.synchronizeSlides();
                    this.emitSlideChange();
                },
                {
                    root: this.scrollContainer,
                    threshold: 0.6,
                },
            );

            slidesWithClones.forEach(slide => io.observe(slide));
        } else {
            this.pendingSlideChange = false;
            this.synchronizeSlides();
            this.emitSlideChange();
        }
    }

    private emitSlideChange() {
        if (!this.hasUpdated) return;
        // Only emit if the active slide actually changed since the last emission.
        // This prevents spurious events on initial load, redundant scrollend firings,
        // and focus-loss scroll events triggered by clicking outside the carousel.
        if (this.activeSlide === this.lastEmittedSlide) return;
        this.lastEmittedSlide = this.activeSlide;
        const slides = this.getSlides();
        this.dispatchEvent(
            new CustomEvent('ts-slide-change', {
                detail: {
                    index: this.activeSlide,
                    slide: slides[this.activeSlide],
                },
                bubbles: true,
                composed: true,
            }),
        );
        this.updateLiveRegionForSlideChange();
    }

    private isCarouselItem(node: Node): node is TsCarouselItem {
        return node instanceof Element && node.tagName === 'TS-CAROUSEL-ITEM';
    }

    private handleSlotChange = (mutations: MutationRecord[]) => {
        let needsInitialization = false;
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (this.isCarouselItem(node) && !(node as Element).hasAttribute('data-clone')) {
                    needsInitialization = true;
                    break;
                }
            }
            if (needsInitialization) break;
            for (const node of mutation.removedNodes) {
                if (this.isCarouselItem(node) && !(node as Element).hasAttribute('data-clone')) {
                    needsInitialization = true;
                    break;
                }
            }
            if (needsInitialization) break;
        }

        // Reinitialize the carousel if a carousel item has been added or removed
        // initializeSlides calls requestUpdate internally via @state property changes
        if (needsInitialization) {
            this.initializeSlides();
        }
    };

    @watch('loop', { waitUntilFirstUpdate: true })
    @watch('slidesPerPage', { waitUntilFirstUpdate: true })
    initializeSlides() {
        this.getSlides({ excludeClones: false }).forEach((slide, index) => {
            slide.classList.remove('--in-view');
            slide.classList.remove('--is-active');
            slide.setAttribute('aria-label', this.localize.term('slideNum', index + 1));
            slide.setAttribute('id', `slide-${index + 1}`);
            slide.setAttribute('role', 'listitem');
            slide.removeAttribute('aria-labelledby');

            if (slide.hasAttribute('data-clone')) {
                slide.remove();
            }
        });

        this.updateSlidesSnap();

        if (this.loop) {
            this.createClones();
        }

        // Reset the last emitted index so re-initialization does not cause spurious events.
        this.lastEmittedSlide = this.activeSlide;

        this.goToSlide(this.activeSlide, 'auto');
        this.synchronizeSlides();
        // Defer the live-region update — it sets a reactive @state and may be
        // called from update-cycle contexts (firstUpdated / @watch handlers).
        // Running it after updateComplete avoids the "change-in-update" warning.
        this.updateComplete.then(() => this.updateLiveRegionForSlideChange());
    }

    /**
     * Copies Lit reactive property values from a source subtree to a cloned subtree.
     *
     * This fixes loop-mode cloning for custom elements whose important runtime state
     * is stored in properties rather than reflected attributes.
     */
    private syncReactiveProperties(sourceRoot: Element, cloneRoot: Element) {
        const sourceElements = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll('*'))];
        const cloneElements = [cloneRoot, ...Array.from(cloneRoot.querySelectorAll('*'))];

        const pairCount = Math.min(sourceElements.length, cloneElements.length);

        for (let i = 0; i < pairCount; i++) {
            const sourceEl = sourceElements[i];
            const cloneEl = cloneElements[i];

            if (!sourceEl || !cloneEl) continue;
            if (sourceEl.tagName !== cloneEl.tagName) continue;

            const ctor = sourceEl.constructor as {
                elementProperties?: Map<PropertyKey, unknown>;
            };

            const elementProperties = ctor.elementProperties;
            if (!elementProperties || !(elementProperties instanceof Map)) continue;

            for (const propName of elementProperties.keys()) {
                if (typeof propName !== 'string') continue;

                try {
                    const sourceRecord = sourceEl as unknown as Record<string, unknown>;
                    const cloneRecord = cloneEl as unknown as Record<string, unknown>;
                    cloneRecord[propName] = sourceRecord[propName];
                } catch {
                    // Ignore non-writable or incompatible properties.
                }
            }
        }
    }

    private cloneSlideWithState(slide: TsCarouselItem): HTMLElement {
        const clone = slide.cloneNode(true) as HTMLElement;
        this.syncReactiveProperties(slide, clone);
        return clone;
    }

    private createClones() {
        const slides = this.getSlides();

        const slidesPerPage = this.slidesPerPage;
        const lastSlides = slides.slice(-slidesPerPage);
        const firstSlides = slides.slice(0, slidesPerPage);

        lastSlides.reverse().forEach((slide, i) => {
            const clone = this.cloneSlideWithState(slide);
            clone.setAttribute('data-clone', String(slides.length - i - 1));
            this.prepend(clone);
        });

        firstSlides.forEach((slide, i) => {
            const clone = this.cloneSlideWithState(slide);
            clone.setAttribute('data-clone', String(i));
            this.append(clone);
        });
    }

    @watch('activeSlide')
    handleSlideChange() {
        const slides = this.getSlides();
        slides.forEach((slide, i) => {
            slide.classList.toggle('--is-active', i === this.activeSlide);
        });
        // Event emission and live region update are handled exclusively by emitSlideChange()
        // which is called from handleScrollEnd() once the scroll has fully settled.
        // This prevents duplicate ts-slide-change events caused by activeSlide being set
        // both here (via @watch) and by synchronizeSlides() inside handleScrollEnd().
    }

    @watch('slidesPerMove')
    updateSlidesSnap() {
        const slides = this.getSlides();

        const slidesPerMove = this.slidesPerMove;
        slides.forEach((slide, i) => {
            const shouldSnap = (i + slidesPerMove) % slidesPerMove === 0;
            if (shouldSnap) {
                slide.style.removeProperty('scroll-snap-align');
            } else {
                slide.style.setProperty('scroll-snap-align', 'none');
            }
        });
    }

    @watch('autoplay')
    handleAutoplayChange() {
        this.autoplayController.stop();
        // Defer the liveRegionMessage write so it never happens from inside
        // updated()/@watch (which would trigger Lit's "change-in-update"
        // warning on the initial render). Functional behavior matches the
        // original — the message is set on every autoplay toggle, including
        // the initial one — only the timing shifts by one microtask.
        if (this.autoplay) {
            this.autoplayController.start(this.autoplayInterval);
            this.updateComplete.then(() => {
                this.liveRegionMessage = 'Carousel autoplay started.';
            });
        } else {
            this.updateComplete.then(() => {
                this.liveRegionMessage = 'Carousel autoplay paused.';
            });
        }
    }

    /**
     * Move the carousel backward by `slides-per-move` slides.
     *
     * @param behavior - The behavior used for scrolling.
     */
    previous(behavior: ScrollBehavior = 'smooth') {
        if (!this.canScrollPrev()) return;

        const slidesCount = this.getSlides().length;
        let target: number;

        if (this.loop) {
            // Calculate the previous target slide index
            target = (this.activeSlide - this.slidesPerMove + slidesCount) % slidesCount;

            // If we're wrapping around (going from first to last), we need to scroll to the clone
            // that appears before the real slides, then jump back to the real last slide
            if (this.activeSlide - this.slidesPerMove < 0) {
                // Scroll to the clone at the beginning (which represents the end slides)
                this.scrollToCloneAndWrap(target, behavior, 'backward');
                this.emitPrevious(target);
                return;
            }
        } else {
            target = clamp(this.activeSlide - this.slidesPerMove, 0, slidesCount - this.slidesPerPage);
        }

        this.emitPrevious(target);
        this.goToSlide(target, behavior);
    }

    /**
     * Move the carousel forward by `slides-per-move` slides.
     *
     * @param behavior - The behavior used for scrolling.
     */
    next(behavior: ScrollBehavior = 'smooth') {
        if (!this.canScrollNext()) return;

        const slidesCount = this.getSlides().length;
        let target: number;

        if (this.loop) {
            // Calculate the next target slide index
            target = (this.activeSlide + this.slidesPerMove) % slidesCount;

            // If we're wrapping around (going from last to first), we need to scroll to the clone
            // that appears after the real slides, then jump back to the real first slide
            if (this.activeSlide + this.slidesPerMove >= slidesCount) {
                // Scroll to the clone at the end (which represents the beginning slides)
                this.scrollToCloneAndWrap(target, behavior, 'forward');
                this.emitNext(target);
                return;
            }
        } else {
            target = clamp(this.activeSlide + this.slidesPerMove, 0, slidesCount - this.slidesPerPage);
        }

        this.emitNext(target);
        this.goToSlide(target, behavior);
    }

    /**
     * Scrolls the carousel to the slide specified by `index`.
     *
     * @param index - The slide index.
     * @param behavior - The behavior used for scrolling.
     */
    goToSlide(index: number, behavior: ScrollBehavior = 'smooth') {
        const { slidesPerPage, loop } = this;

        const slides = this.getSlides();
        const slidesWithClones = this.getSlides({ excludeClones: false });

        // No need to do anything in case there are no items in the carousel
        if (!slides.length) {
            return;
        }

        // Sets the next index without taking into account clones, if any.
        const newActiveSlide = loop
            ? (index + slides.length) % slides.length
            : clamp(index, 0, slides.length - slidesPerPage);
        this.activeSlide = newActiveSlide;

        const isRtl = this.localize.dir() === 'rtl';

        // Get the index of the next slide. For looping carousel it adds `slidesPerPage`
        // to normalize the starting index in order to ignore the first nth clones.
        // For RTL it needs to scroll to the last slide of the page.
        const nextSlideIndex = clamp(
            index + (loop ? slidesPerPage : 0) + (isRtl ? slidesPerPage - 1 : 0),
            0,
            slidesWithClones.length - 1,
        );

        const nextSlide = slidesWithClones[nextSlideIndex];

        this.scrollToSlide(nextSlide!, prefersReducedMotion() ? 'auto' : behavior);
    }

    /**
     * Handles scrolling to a clone slide and then wrapping to the real slide
     * This creates the infinite loop effect
     */
    private scrollToCloneAndWrap(targetIndex: number, behavior: ScrollBehavior, direction: 'forward' | 'backward') {
        const { slidesPerPage } = this;
        const slides = this.getSlides();
        const slidesWithClones = this.getSlides({ excludeClones: false });

        if (!slides.length) return;

        const isRtl = this.localize.dir() === 'rtl';

        // Find the clone to scroll to
        let cloneIndex: number;
        if (direction === 'forward') {
            // Scroll to the clone after all real slides (clone of first slides)
            cloneIndex = slides.length + slidesPerPage + (isRtl ? slidesPerPage - 1 : 0);
        } else {
            // Scroll to the clone before all real slides (clone of last slides)
            cloneIndex = isRtl ? slidesPerPage - 1 : 0;
        }

        cloneIndex = clamp(cloneIndex, 0, slidesWithClones.length - 1);
        const cloneSlide = slidesWithClones[cloneIndex];

        if (!cloneSlide) return;

        // Scroll to the clone with animation
        // activeSlide is already set by the caller (next/previous) before invoking this method.
        // handleScrollEnd will handle the jump to the real slide via the data-clone attribute.
        this.scrollToSlide(cloneSlide, prefersReducedMotion() ? 'auto' : behavior);
    }

    private scrollToSlide(slide: HTMLElement, behavior: ScrollBehavior = 'smooth') {
        // Since the geometry doesn't happen until rAF, we don't know if we'll be scrolling or not...
        // It's best to assume that we will and cleanup in the else case below if we didn't need to
        this.pendingSlideChange = true;
        window.requestAnimationFrame(() => {
            // This can happen if goToSlide is called before the scroll container is rendered
            // We will have correctly set the activeSlide in goToSlide which will get picked up when initializeSlides is called.
            if (!this.scrollContainer) {
                return;
            }

            const scrollContainer = this.scrollContainer;
            const scrollContainerRect = scrollContainer.getBoundingClientRect();
            const nextSlideRect = slide.getBoundingClientRect();

            const nextLeft = nextSlideRect.left - scrollContainerRect.left;
            const nextTop = nextSlideRect.top - scrollContainerRect.top;

            if (nextLeft || nextTop) {
                // This is here just in case someone set it back to false
                // between rAF being requested and the callback actually running
                this.pendingSlideChange = true;
                scrollContainer.scrollTo({
                    left: nextLeft + scrollContainer.scrollLeft,
                    top: nextTop + scrollContainer.scrollTop,
                    behavior,
                });
            } else {
                this.pendingSlideChange = false;
            }
        });
    }

    private updateLiveRegionForSlideChange() {
        const slides = this.getSlides();
        if (!slides.length) {
            this.liveRegionMessage = '';
            return;
        }
        const slideNumber = this.activeSlide + 1;
        const totalSlides = slides.length;
        const currentPage = this.getCurrentPage() + 1;
        const pagesCount = this.getPageCount();
        this.liveRegionMessage = `Slide ${slideNumber} of ${totalSlides}, page ${currentPage} of ${pagesCount}.`;
    }

    override render() {
        const { slidesPerMove, scrolling } = this;
        const pagesCount = this.getPageCount();
        const currentPage = this.getCurrentPage();
        const prevEnabled = this.canScrollPrev();
        const nextEnabled = this.canScrollNext();
        const isLtr = this.localize.dir() === 'ltr';
        const showNavigation = this.navigation && this.orientation === 'horizontal';

        return html`
            <div part="base" class="carousel">
                <div
                    role="list"
                    aria-roledescription="carousel"
                    aria-label="${this.localize.term('carousel')} ${this.id || this.dataset.uid}"
                    id="scroll-container"
                    part="scroll-container"
                    class="${classMap({
                        carousel__slides: true,
                        'carousel__slides--horizontal': this.orientation === 'horizontal',
                        'carousel__slides--vertical': this.orientation === 'vertical',
                        'carousel__slides--dragging': this.dragging,
                    })}"
                    style="--slides-per-page: ${this.slidesPerPage};"
                    aria-busy="${scrolling ? 'true' : 'false'}"
                    aria-atomic="true"
                    tabindex="0"
                    @keydown=${this.handleKeyDown}
                    @mousedown="${this.handleMouseDragStart}"
                    @scroll="${this.handleScroll}"
                    @scrollend=${this.handleScrollEnd}
                    @click=${this.handleClick}
                >
                    <slot></slot>
                </div>

                <div
                    class="carousel__status"
                    aria-live="polite"
                    aria-atomic="true"
                    style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); border: 0; white-space: nowrap;"
                >
                    ${this.liveRegionMessage}
                </div>

                ${
                    showNavigation
                        ? html`
                              <div part="navigation" class="carousel__navigation">
                                  <ts-icon-button
                                      part="navigation-button navigation-button--previous"
                                      class="${classMap({
                                          'carousel__navigation-button': true,
                                          'carousel__navigation-button--previous': true,
                                          'carousel__navigation-button--disabled': !prevEnabled,
                                      })}"
                                      library="system"
                                      size="20"
                                      circle
                                      name="${isLtr ? 'arrow_back_ios' : 'arrow_forward_ios'}"
                                      aria-label="${this.localize.term('previousSlide')}"
                                      aria-disabled="${prevEnabled ? 'false' : 'true'}"
                                      @click=${prevEnabled ? () => this.previous() : null}
                                  >
                                  </ts-icon-button>

                                  <ts-icon-button
                                      part="navigation-button navigation-button--next"
                                      class=${classMap({
                                          'carousel__navigation-button': true,
                                          'carousel__navigation-button--next': true,
                                          'carousel__navigation-button--disabled': !nextEnabled,
                                      })}
                                      library="system"
                                      size="20"
                                      circle
                                      name="${isLtr ? 'arrow_forward_ios' : 'arrow_back_ios'}"
                                      aria-label="${this.localize.term('nextSlide')}"
                                      aria-disabled="${nextEnabled ? 'false' : 'true'}"
                                      @click=${nextEnabled ? () => this.next() : null}
                                  >
                                  </ts-icon-button>
                              </div>
                          `
                        : ''
                }
                ${
                    this.pagination
                        ? html`
                              <div
                                  part="pagination"
                                  class="${classMap({
                                      carousel__pagination: true,
                                      'carousel__pagination--vertical': this.orientation === 'vertical',
                                  })}"
                              >
                                  ${map(this.getVisiblePaginationIndices(pagesCount, currentPage), index => {
                                      const isActive = index === currentPage;
                                      return html`
                                          <button
                                              id="tab-${index + 1}"
                                              part="pagination-item ${isActive ? 'pagination-item--active' : ''}"
                                              class="${classMap({
                                                  'carousel__pagination-item': true,
                                                  'carousel__pagination-item--active': isActive,
                                              })}"
                                              aria-label="${
                                                  isActive
                                                      ? this.localize.term('slideNum', index + 1)
                                                      : this.localize.term('goToSlide', index + 1, pagesCount)
                                              }"
                                              aria-current="${isActive ? 'true' : 'false'}"
                                              tabindex=${isActive ? '0' : '-1'}
                                              @click=${() => this.goToSlide(index * slidesPerMove)}
                                              @keydown=${this.handleKeyDown}
                                          ></button>
                                      `;
                                  })}
                              </div>
                          `
                        : ''
                }
            </div>
        `;
    }
}
