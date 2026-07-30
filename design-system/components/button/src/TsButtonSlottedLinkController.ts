import type { ReactiveController, ReactiveControllerHost } from 'lit';

type ButtonClasses = Record<string, boolean>;

type ButtonLinkHost = ReactiveControllerHost & {
    href: string;
    target?: '_blank' | '_parent' | '_self' | '_top';
    rel: string;
    download?: string;
    title: string;
    disabled: boolean;
    loading: boolean;
    preventAnchorTag: boolean;

    requestUpdate(): void;
};

type ButtonLinkControllerOptions = {
    getDefaultSlot: () => HTMLSlotElement | undefined;
    getButtonClasses: () => ButtonClasses;
    onClick: (event: MouseEvent) => void;
    onFocus: () => void;
    onBlur: () => void;
    isLink: () => boolean;
};

export class TsButtonSlottedLinkController implements ReactiveController {
    private host: ButtonLinkHost;
    private options: ButtonLinkControllerOptions;
    private currentAnchor?: HTMLAnchorElement;

    hasSlottedAnchor = false;

    constructor(host: ButtonLinkHost, options: ButtonLinkControllerOptions) {
        this.host = host;
        this.options = options;
        host.addController(this);
    }

    /**
     * Runs BEFORE each render. We compute `hasSlottedAnchor` here so any
     * change is part of the current update cycle and doesn't require a
     * follow-up `requestUpdate()` from `hostUpdated()` — which would trigger
     * Lit's "change-in-update" warning.
     */
    hostUpdate() {
        if (!this.options.isLink()) {
            this.hasSlottedAnchor = false;
            return;
        }

        const anchor = this.peekSlottedAnchor();
        this.hasSlottedAnchor = !!anchor;
    }

    hostUpdated() {
        if (!this.options.isLink()) {
            this.cleanup();
            return;
        }

        const anchor = this.getSlottedAnchor();

        if (!anchor) {
            if (this.currentAnchor) {
                this.cleanup();
            }
            return;
        }

        if (this.currentAnchor !== anchor) {
            this.cleanup();
            this.currentAnchor = anchor;
            this.bindAnchor(anchor);
        }

        this.decorate(anchor);
    }

    hostDisconnected() {
        this.cleanup();
    }

    handleSlotChange = () => {
        const nextAnchor = this.options.isLink() ? this.getSlottedAnchor() : undefined;

        if (this.currentAnchor && this.currentAnchor !== nextAnchor) {
            this.cleanup();
        }

        this.currentAnchor = nextAnchor;

        if (nextAnchor) {
            this.bindAnchor(nextAnchor);
            this.decorate(nextAnchor);
        }

        const nextHasSlottedAnchor = !!nextAnchor;
        if (this.hasSlottedAnchor !== nextHasSlottedAnchor) {
            this.hasSlottedAnchor = nextHasSlottedAnchor;
            this.host.requestUpdate();
        }
    };

    getAnchor() {
        return this.currentAnchor ?? this.getSlottedAnchor();
    }

    private getSlottedAnchor(): HTMLAnchorElement | undefined {
        const slot = this.options.getDefaultSlot();
        const assigned = slot?.assignedElements({ flatten: true }) ?? [];
        return assigned.find(el => el.tagName.toLowerCase() === 'a') as HTMLAnchorElement | undefined;
    }

    /**
     * Returns a slotted anchor for use during `hostUpdate()`. Before the
     * first render the shadow `<slot>` does not exist yet, so fall back to
     * scanning the host's light-DOM children.
     */
    private peekSlottedAnchor(): HTMLAnchorElement | undefined {
        const slotAnchor = this.getSlottedAnchor();
        if (slotAnchor) return slotAnchor;

        const hostEl = this.host as unknown as Element;
        if (typeof hostEl.querySelector !== 'function') return undefined;
        return (hostEl.querySelector(':scope > a') as HTMLAnchorElement | null) ?? undefined;
    }

    private bindAnchor(anchor: HTMLAnchorElement) {
        anchor.removeEventListener('click', this.options.onClick);
        anchor.removeEventListener('focus', this.options.onFocus);
        anchor.removeEventListener('blur', this.options.onBlur);

        anchor.addEventListener('click', this.options.onClick);
        anchor.addEventListener('focus', this.options.onFocus);
        anchor.addEventListener('blur', this.options.onBlur);
    }

    private cleanup() {
        if (!this.currentAnchor) return;

        this.currentAnchor.removeEventListener('click', this.options.onClick);
        this.currentAnchor.removeEventListener('focus', this.options.onFocus);
        this.currentAnchor.removeEventListener('blur', this.options.onBlur);
        this.currentAnchor = undefined;
    }

    private decorate(anchor: HTMLAnchorElement) {
        const classes = this.options.getButtonClasses();

        for (const [className, enabled] of Object.entries(classes)) {
            anchor.classList.toggle(className, enabled);
        }

        anchor.setAttribute('part', 'base');
        anchor.title = this.host.title;

        if (!anchor.getAttribute('href') && this.host.href) {
            anchor.setAttribute('href', this.host.href);
        }

        if (this.host.target) anchor.setAttribute('target', this.host.target);
        else anchor.removeAttribute('target');

        if (this.host.download) anchor.setAttribute('download', this.host.download);
        else anchor.removeAttribute('download');

        if (this.host.rel) anchor.setAttribute('rel', this.host.rel);
        else anchor.removeAttribute('rel');

        anchor.removeAttribute('type');
        anchor.removeAttribute('name');
        anchor.removeAttribute('value');
        anchor.removeAttribute('disabled');
        anchor.removeAttribute('role');

        if (this.host.disabled) {
            anchor.removeAttribute('href');
            anchor.setAttribute('aria-disabled', 'true');
            anchor.setAttribute('tabindex', '-1');
        } else {
            if (!anchor.getAttribute('href') && this.host.href) {
                anchor.setAttribute('href', this.host.href);
            }
            anchor.setAttribute('aria-disabled', 'false');
            anchor.setAttribute('tabindex', '0');
        }
    }
}
