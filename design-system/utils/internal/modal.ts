import { activeElements, getDeepestActiveElement } from './active-elements.js';
import { getTabbableElements } from './tabbable.js';

let activeModals: HTMLElement[] = [];

export default class Modal {
    element: HTMLElement;
    isExternalActivated: boolean = false;
    tabDirection: 'forward' | 'backward' = 'forward';
    currentFocus: HTMLElement | null = null;
    previousFocus: HTMLElement | null = null;
    elementsWithTabbableControls: string[];

    constructor(element: HTMLElement) {
        this.element = element;
        this.elementsWithTabbableControls = ['iframe'];
    }

    activate() {
        activeModals.push(this.element);
        document.addEventListener('focusin', this.handleFocusIn);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    deactivate() {
        activeModals = activeModals.filter(modal => modal !== this.element);
        this.currentFocus = null;
        document.removeEventListener('focusin', this.handleFocusIn);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    isActive() {
        return activeModals[activeModals.length - 1] === this.element;
    }

    activateExternal() {
        this.isExternalActivated = true;
    }

    deactivateExternal() {
        this.isExternalActivated = false;
    }

    private checkFocus() {
        if (this.isActive() && !this.isExternalActivated) {
            const tabbableElements = getTabbableElements(this.element);
            if (tabbableElements.length === 0) return;
            if (!this.element.matches(':focus-within')) {
                const start = tabbableElements[0];
                const end = tabbableElements[tabbableElements.length - 1];
                const target = this.tabDirection === 'forward' ? start : end;
                if (typeof target?.focus === 'function') {
                    this.currentFocus = target ?? null;
                    target.focus({ preventScroll: false });
                }
            }
        }
    }

    private handleFocusIn = () => {
        if (!this.isActive()) return;
        this.checkFocus();
    };

    private possiblyHasTabbableChildren(element: HTMLElement) {
        return (
            this.elementsWithTabbableControls.includes(element.tagName.toLowerCase()) ||
            element.hasAttribute('controls')
        );
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab' || this.isExternalActivated) return;
        if (!this.isActive()) return;

        const currentActiveElement = getDeepestActiveElement();
        this.previousFocus = currentActiveElement as HTMLElement | null;

        if (this.previousFocus && this.possiblyHasTabbableChildren(this.previousFocus)) {
            return;
        }

        this.tabDirection = event.shiftKey ? 'backward' : 'forward';

        const tabbableElements = getTabbableElements(this.element);
        if (tabbableElements.length === 0) return;

        let currentFocusIndex = tabbableElements.findIndex(el => el === currentActiveElement);

        this.previousFocus = this.currentFocus;

        const addition = this.tabDirection === 'forward' ? 1 : -1;

        while (true) {
            if (currentFocusIndex + addition >= tabbableElements.length) {
                currentFocusIndex = 0;
            } else if (currentFocusIndex + addition < 0) {
                currentFocusIndex = tabbableElements.length - 1;
            } else {
                currentFocusIndex += addition;
            }

            this.previousFocus = this.currentFocus;
            const nextFocus = tabbableElements[currentFocusIndex] as HTMLElement | undefined;

            if (this.tabDirection === 'backward') {
                if (this.previousFocus && this.possiblyHasTabbableChildren(this.previousFocus)) {
                    return;
                }
            }

            if (nextFocus && this.possiblyHasTabbableChildren(nextFocus)) {
                return;
            }

            event.preventDefault();
            this.currentFocus = nextFocus ?? null;
            this.currentFocus?.focus({ preventScroll: false });

            const allActiveEls = [...activeElements()];
            if (
                (this.currentFocus && allActiveEls.includes(this.currentFocus)) ||
                (this.previousFocus && !allActiveEls.includes(this.previousFocus))
            ) {
                break;
            }
        }

        setTimeout(() => this.checkFocus());
    };

    private handleKeyUp = () => {
        this.tabDirection = 'forward';
    };
}
