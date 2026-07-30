import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIcon } from '@components/icon/index.js';

import styles from './TsAvatarStyle.js';

/**
 * @summary Avatars are used to represent a person or object.
 * @documentation https://create.tuvsud.com/latest/components/avatar/develop-noEc9UZw
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon
 *
 * @event ts-error - The image could not be loaded. This may because of an invalid URL, a temporary network condition, or some
 * unknown cause.
 *
 * @slot icon - The default icon to use when no image or initials are present. Works best with `<ts-icon>`.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the avatar's icon.
 * @csspart initials - The container that wraps the avatar's initials.
 * @csspart image - The avatar image. Only shown when the `image` attribute is set.
 *
 * @cssproperty --size - The size of the avatar.
 */
export default class TsAvatarComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = {
        'ts-icon': TsIcon,
    };

    @state() private hasError = false;

    /** The image source to use for the avatar. */
    @property() image = '';

    /** A label to use to describe the avatar to assistive devices. */
    @property() label = '';

    /** Initials to use as a fallback when no image is available (1-2 characters max recommended). */
    @property() initials = '';

    /** Indicates how the browser should load the image. */
    @property() loading: 'eager' | 'lazy' = 'eager';

    /** The shape of the avatar. */
    @property({ reflect: true }) shape: 'circle' | 'square' | 'rounded' = 'circle';

    @watch('image')
    handleImageChange() {
        // Reset the error when a new image is provided
        this.hasError = false;
    }

    private handleImageLoadError() {
        this.hasError = true;
        this.emit('ts-error');
    }

    override render() {
        const avatarWithImage = html`
            <img
                part="image"
                class="avatar__image"
                src="${this.image}"
                loading="${this.loading}"
                alt=""
                @error="${this.handleImageLoadError}"
            />
        `;

        const avatarWithoutImage = this.initials
            ? html`<div part="initials" class="avatar__initials">${this.initials}</div>`
            : html`
                  <div part="icon" class="avatar__icon" aria-hidden="true">
                      <slot name="icon">
                          <ts-icon library="system" name="person" size="28"></ts-icon>
                      </slot>
                  </div>
              `;

        return html`
            <div
                part="base"
                class=${classMap({
                    avatar: true,
                    'avatar--circle': this.shape === 'circle',
                    'avatar--rounded': this.shape === 'rounded',
                    'avatar--square': this.shape === 'square',
                    'avatar--has-image': this.image && !this.hasError,
                })}
                role="img"
                aria-label=${this.label}
            >
                ${this.image && !this.hasError ? avatarWithImage : avatarWithoutImage}
            </div>
        `;
    }
}
