import { friendlyFormatIBAN, isValidIBAN } from 'ibantools';

import type { CSSResultGroup } from 'lit';

import { TsInput } from '@components/input/index.js';

import TsIbanStyle from './TsIbanStyle.js';

/**
 * @summary A component for inputting and validating IBANs.
 * @documentation https://create.tuvsud.com/latest/components/iban/develop-6oMcWrz3
 * @status stable
 * @since 1.0
 *
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 * @slot label-icon - An icon (or any element) placed inline after the label text.
 * @slot prefix - Used to prepend a presentational icon or similar element to the input.
 * @slot suffix - Used to append a presentational icon or similar element to the input.
 * @slot clear-icon - An icon to use in lieu of the default clear icon.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @event ts-blur - Emitted when the control loses focus.
 * @event ts-change - Emitted when an alteration to the control's value is committed by the user.
 * @event ts-clear - Emitted when the clear button is activated.
 * @event ts-focus - Emitted when the control gains focus.
 * @event ts-input - Emitted when the control receives input.
 * @event ts-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The input's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The component's base wrapper.
 * @csspart input - The internal `<input>` control.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart clear-button - The clear button.
 * @csspart suffix - The container that wraps the suffix.
 */
export class TsIban extends TsInput {
    static override get styles(): CSSResultGroup {
        return [super.styles, TsIbanStyle];
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('ts-change', this.handleIbanChange.bind(this));
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('ts-change', this.handleIbanChange.bind(this));
    }

    private handleIbanChange(): void {
        this.value = friendlyFormatIBAN(this.value) as string;
    }

    /** Returns `true` if the current value is a valid IBAN, `false` otherwise. */
    validateIban(): boolean {
        return isValidIBAN(this.value.replace(/ /g, '').toUpperCase());
    }

    /**
     * Checks for validity including IBAN format validation.
     * Returns `true` when valid and `false` when invalid.
     */
    override checkValidity(): boolean {
        if (this.value.length > 0 && !this.validateIban()) {
            this.setCustomValidity('Invalid IBAN');
            return false;
        }
        this.setCustomValidity('');
        return super.checkValidity();
    }
}
