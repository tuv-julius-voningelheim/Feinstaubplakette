import { html } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';

import type { CSSResultGroup, PropertyValueMap } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsAvatar } from '@components/avatar/index.js';

import styles from './TsAvatarGroupStyle.js';

/**
 * @summary Avatar Group are used to represent a person or object.
 * @documentation https://create.tuvsud.com/latest/components/avatar/develop-noEc9UZw
 * @status stable
 * @since 1.0
 *
 * @dependency ts-avatar
 *
 * @cssproperty --size - The size of the avatar.
 * @cssproperty --overlap - The overlap distance between avatars.
 * @cssproperty --avatar-group-ring-width - The width of the ring around each avatar in the group.
 * @cssproperty --avatar-group-ring-color - The color of the ring around each avatar in the group.
 *
 */
export default class TsAvatarComponentGroup extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = {
        'ts-avatar': TsAvatar,
    };

    /** The shape of the avatars in the group. */
    @property({ reflect: true }) shape: 'circle' | 'square' | 'rounded' = 'circle';

    /** The maximum number of avatars to display. Excess avatars will be hidden and represented by a "+X" avatar. Set to 0 to show all avatars. */
    @property({ type: Number, reflect: true }) max = 0;

    /** The overlap distance between avatars. */
    @property({ reflect: true }) overlap = '0.75rem';

    @state() private hiddenCount = 0;

    @queryAssignedElements({ flatten: true, selector: 'ts-avatar' }) private avatars!: HTMLElement[];

    /** Counts <ts-avatar> children. Uses light DOM before the first render
     * because `queryAssignedElements` is only populated after the slot exists. */
    private getAvatarCount(): number {
        if (this.hasUpdated && this.avatars) {
            return this.avatars.length;
        }
        let count = 0;
        for (const c of Array.from(this.children)) {
            if (c.tagName.toLowerCase() === 'ts-avatar') count++;
        }
        return count;
    }

    private computeHiddenCount() {
        const itemCount = this.getAvatarCount();
        const limit = this.max > 0 ? this.max : itemCount;
        const next = Math.max(0, itemCount - limit);
        if (this.hiddenCount !== next) {
            this.hiddenCount = next;
        }
    }

    /** Applies side-effect styles/attributes to slotted avatars. Does not
     * touch reactive state, so it is safe to call from updated()/slotchange. */
    private applyAvatarStyles() {
        const items = this.avatars ?? [];
        const limit = this.max > 0 ? this.max : items.length;

        items.forEach((a, i) => {
            a.setAttribute('shape', this.shape);
            a.style.display = i < limit ? '' : 'none';
            a.style.setProperty('--ts-avatar-ring-width', 'var(--avatar-group-ring-width)');
            a.style.setProperty('--ts-avatar-ring-color', 'var(--avatar-group-ring-color)');
            a.style.zIndex = String(i + 1);
        });
    }

    private handleSlotChange = () => {
        this.applyAvatarStyles();
        this.computeHiddenCount();
    };

    protected override willUpdate(changed: PropertyValueMap<this> | Map<PropertyKey, unknown>) {
        // Compute hiddenCount before render so we don't have to mutate
        // reactive state from firstUpdated()/updated(), which would trigger
        // Lit's "change-in-update" warning.
        if (!this.hasUpdated || changed.has('max') || changed.has('shape')) {
            this.computeHiddenCount();
        }
    }

    protected override firstUpdated() {
        this.style.setProperty('--overlap', this.overlap);
        this.applyAvatarStyles();
    }

    protected override updated(changed: Map<string, unknown>) {
        if (changed.has('overlap')) this.style.setProperty('--overlap', this.overlap);
        if (changed.has('shape') || changed.has('max') || changed.has('overlap')) {
            this.applyAvatarStyles();
        }
    }

    override render() {
        return html`
            <div part="base" class="group" role="group">
                <slot @slotchange=${this.handleSlotChange}></slot>
                ${
                    this.hiddenCount > 0
                        ? html`<ts-avatar
                              class="overflow"
                              shape=${this.shape}
                              initials="+${this.hiddenCount}"
                              label="${this.hiddenCount} more"
                              style="z-index: ${String(this.getAvatarCount() + 1)};"
                          ></ts-avatar>`
                        : null
                }
            </div>
        `;
    }
}
