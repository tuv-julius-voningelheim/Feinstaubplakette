import { html } from 'lit';
import { property } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsResizeObserverStyles.js';

/**
 * @summary The Resize Observer component offers a thin, declarative interface to the [`ResizeObserver API`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).
 * @documentation https://xxx.style/components/resize-observer
 * @status stable
 * @since 1.0
 *
 * @slot - One or more elements to watch for resizing.
 *
 * @event {{ entries: ResizeObserverEntry[] }} ts-resize - Emitted when the element is resized.
 */
export default class TsResizeObserverComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    private resizeObserver!: ResizeObserver;
    private observedElements: HTMLElement[] = [];

    /** Disables the observer. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    override connectedCallback() {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            this.emit('ts-resize', { detail: { entries } });
        });

        if (!this.disabled) {
            this.startObserver();
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.stopObserver();
    }

    private handleSlotChange() {
        if (!this.disabled) {
            this.startObserver();
        }
    }

    private startObserver() {
        const slot = this.shadowRoot!.querySelector('slot');

        if (slot !== null) {
            const elements = slot.assignedElements({
                flatten: true,
            }) as HTMLElement[];

            // Unwatch previous elements
            this.observedElements.forEach(el => this.resizeObserver.unobserve(el));
            this.observedElements = [];

            // Watch new elements
            elements.forEach(el => {
                this.resizeObserver.observe(el);
                this.observedElements.push(el);
            });
        }
    }

    private stopObserver() {
        this.resizeObserver.disconnect();
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        if (this.disabled) {
            this.stopObserver();
        } else {
            this.startObserver();
        }
    }

    override render() {
        return html` <slot @slotchange=${this.handleSlotChange}></slot> `;
    }
}
