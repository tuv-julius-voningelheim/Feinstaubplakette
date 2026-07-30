import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type NormalizeSlotTextOptions = {
    trim?: boolean;
    collapse?: boolean;
};

function normalizeSlotText(slot: HTMLSlotElement, options: NormalizeSlotTextOptions = {}) {
    const { trim = true, collapse = true } = options;

    const assigned = slot.assignedNodes({ flatten: true });

    for (const node of assigned) {
        if (node.nodeType !== Node.TEXT_NODE) continue;

        const original = node.textContent ?? '';
        const isWhitespaceOnly = original.trim().length === 0;

        if (isWhitespaceOnly) {
            if (original !== '') {
                node.textContent = '';
            }
            continue;
        }

        let next = original;
        if (trim) next = next.trim();
        if (collapse) next = next.replace(/\s+/g, ' ');

        // Only update if the text actually changed to avoid triggering re-renders
        if (next !== original) node.textContent = next;
    }
}

export class SlotTextNormalizeController implements ReactiveController {
    private host: ReactiveControllerHost & HTMLElement;
    private selector: string;
    private options: NormalizeSlotTextOptions;
    private slotEl: HTMLSlotElement | null = null;
    private initialized = false;

    constructor(
        host: ReactiveControllerHost & HTMLElement,
        selector: string,
        options: NormalizeSlotTextOptions = { trim: true, collapse: true },
    ) {
        this.host = host;
        this.selector = selector;
        this.options = options;
        host.addController(this);
    }

    hostUpdated() {
        const root = (this.host as HTMLElement).shadowRoot;
        if (!root) return;

        const slot = root.querySelector(this.selector) as HTMLSlotElement | null;
        if (!slot) return;

        // Only attach listener once per slot element
        if (this.slotEl !== slot) {
            this.slotEl?.removeEventListener('slotchange', this.onSlotChange);
            this.slotEl = slot;
            this.slotEl.addEventListener('slotchange', this.onSlotChange);
        }

        // Only normalize on first initialization to avoid loops
        // Subsequent normalizations happen via slotchange event
        if (!this.initialized) {
            this.initialized = true;
            normalizeSlotText(slot, this.options);
        }
    }

    hostDisconnected() {
        this.slotEl?.removeEventListener('slotchange', this.onSlotChange);
        this.initialized = false;
    }

    private onSlotChange = (event: Event) => {
        normalizeSlotText(event.target as HTMLSlotElement, this.options);
    };
}
