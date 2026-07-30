import { html, nothing } from 'lit';

import type { TsIban } from '@tuvsud/design-system/iban';
import type { StoryContext } from 'storybook/internal/types';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsChangeEvent } from '@utils/events/ts-change.js';
import type { TsClearEvent } from '@utils/events/ts-clear.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';
import type { TsInputEvent } from '@utils/events/ts-input.js';
import type { TsInvalidEvent } from '@utils/events/ts-invalid.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/iban';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

type IbanArgs = StoryContext<WebComponentsRenderer>['args'];

type IbanEvents = {
    'ts-change': unknown;
    'ts-input': unknown;
    'ts-focus': unknown;
    'ts-blur': unknown;
    'ts-clear': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Iban',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Formats the input value into the standard IBAN format.',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: "The input's size.",
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'medium' },
                category: 'Properties',
            },
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text shown when empty.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        clearable: {
            control: 'boolean',
            description: 'Adds a clear button when the input is not empty.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the input.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        readonly: {
            control: 'boolean',
            description:
                'Makes the input readonly. When `readonly` is true, `lock` defaults to `true` and a lock icon is shown. Set `lock=false` to suppress the icon.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        lock: {
            control: 'boolean',
            description:
                'Only effective when `readonly` is true. When `readonly` is true, `lock` defaults to `true` and displays a lock icon as a suffix. Set to `false` to suppress the icon while keeping the readonly style. Has no effect when `readonly` is false.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        pill: {
            control: 'boolean',
            description: 'Draws a pill-style input with rounded edges.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Help text. Use the `help-text` slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        // Form category
        value: {
            control: 'text',
            description: 'The current value, submitted with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Marks the input as required.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        error: {
            control: 'boolean',
            description: 'Shows the input in an error state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorMessage: {
            control: 'text',
            description: 'Error text shown below the input when provided.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        success: {
            control: 'boolean',
            description: 'Shows the input in a success state with a green border and a check icon.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        warning: {
            control: 'boolean',
            description:
                'Shows the input in a warning state with an amber border and a warning icon. Ignored when `error` or `success` is set.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: "The input's label. Use the `label` slot for HTML.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        ariaLabel: {
            control: 'text',
            description:
                'The aria-label attribute provides an accessible name for the input when there is no visible label.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        labelVisuallyHidden: {
            control: 'boolean',
            description: 'Visually hides the label but keeps it accessible to screen readers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Accessibility' },
        },
        helpTextVisuallyHidden: {
            control: 'boolean',
            description: 'Visually hides the help text but keeps it accessible to screen readers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Accessibility' },
        },
        // Events category
        'ts-change': {
            action: 'ts-change',
            description: "Emitted when an alteration to the control's value is committed by the user.",
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-input': {
            action: 'ts-input',
            description: 'Emitted when the control receives input.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-focus': {
            action: 'ts-focus',
            description: 'Emitted when the control gains focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the control loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-clear': {
            action: 'ts-clear',
            description: 'Emitted when the clear button is activated.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-invalid': {
            action: 'ts-invalid',
            description:
                "Emitted when the form control has been checked for validity and its constraints aren't satisfied.",
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        size: 'medium',
        value: '',
        label: 'Your account number',
        helpText: '',
        placeholder: 'Type something',
        clearable: false,
        disabled: false,
        readonly: false,
        lock: true,
        required: false,
        pill: false,
        error: false,
        errorMessage: '',
        success: false,
        warning: false,
        ariaLabel: '',
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
    },
    render: args => html`
        <ts-iban
            value=${args.value || nothing}
            label=${args.label || nothing}
            size=${args.size || nothing}
            help-text=${args.helpText || nothing}
            placeholder=${args.placeholder || nothing}
            .clearable=${args.clearable}
            ?clearable=${args.clearable}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .readonly=${args.readonly}
            ?readonly=${args.readonly}
            .lock=${args.lock}
            ?lock=${args.lock}
            .required=${args.required}
            ?required=${args.required}
            .pill=${args.pill}
            ?pill=${args.pill}
            .error=${args.error}
            ?error=${args.error}
            error-message=${args.errorMessage || nothing}
            .success=${args.success}
            ?success=${args.success}
            .warning=${args.warning}
            ?warning=${args.warning}
            aria-label=${args.ariaLabel || nothing}
            .labelVisuallyHidden=${args.labelVisuallyHidden}
            ?label-visually-hidden=${args.labelVisuallyHidden}
            .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
            ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
        ></ts-iban>
    `,
} satisfies MetaWithLabel<TsIban & IbanEvents>;

export default meta;
type Story = StoryObjWithLabel<TsIban>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the IBAN input is empty and ready for user input.',
            },
        },
    },
    args: {},
};

export const WithValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates validation for the IBAN input on form submit. The IBAN format is validated when the form is submitted.',
            },
        },
    },
    args: {
        label: 'Bank Account',
        helpText: 'Enter a valid IBAN (e.g., DE89 3704 0044 0532 0130 00)',
        required: true,
    },
    render: args => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();

                const form = e.currentTarget as HTMLFormElement;
                const iban = form.querySelector('ts-iban') as TsIban;

                // Reset error state
                iban.error = false;
                iban.errorMessage = '';
                iban.setCustomValidity('');

                const valid = iban.checkValidity();

                if (!valid) {
                    iban.error = true;
                    iban.errorMessage = 'Please enter a valid IBAN.';
                }
            }}
        >
            <ts-iban
                label=${args.label || nothing}
                help-text=${args.helpText || nothing}
                .required=${args.required}
                ?required=${args.required}
            ></ts-iban>

            <ts-button style="float: right; padding-top: 1rem" variant="primary" type="submit">Submit</ts-button>
        </form>
    `,
};

export const Success: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `success` attribute to indicate that the IBAN has been validated successfully. A green border and a check icon are displayed. The `success` state is ignored when `error` is also set.',
            },
        },
    },
    args: {
        label: 'Bank Account',
        value: 'DE89 3704 0044 0532 0130 00',
        helpText: 'IBAN looks valid!',
        success: true,
    },
};

export const Warning: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `warning` attribute to indicate that the IBAN value needs attention. An amber border and a warning icon are displayed. The `warning` state is ignored when `error` or `success` is also set.',
            },
        },
    },
    args: {
        label: 'Bank Account',
        value: 'DE89 3704 0044 0532 0130 00',
        helpText: 'Please double-check your IBAN.',
        warning: true,
    },
};

export const LabelHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `labelVisuallyHidden` property to visually hide the label while keeping it accessible to screen readers.',
            },
        },
    },
    args: { labelVisuallyHidden: true },
};

export const HelpTextHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `helpTextVisuallyHidden` property to visually hide the help text while keeping it accessible to screen readers.',
            },
        },
    },
    args: {
        label: 'Bank Account',
        helpText: 'This help text is visually hidden but still accessible to screen readers.',
        helpTextVisuallyHidden: true,
    },
};

export const LabelWithIconSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label` attribute together with the `label-icon` slot to add an icon next to the label without any extra wrapper markup or inline styles. The layout (flexbox + gap) is handled automatically by the component.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <ts-iban label="Bank Account" placeholder="e.g. DE89 3704 0044 0532 0130 00">
                <ts-tooltip content="Your International Bank Account Number (IBAN)" slot="label-icon">
                    <ts-icon name="info" src="/assets/svg/info.svg"></ts-icon>
                </ts-tooltip>
            </ts-iban>
        </div>
    `,
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `readonly` attribute to make the IBAN input readonly. It applies a locked visual style (gray background) without a lock icon. The value remains focusable, selectable, and copyable.',
            },
        },
    },
    args: {
        label: 'Bank Account',
        readonly: true,
        value: 'DE89 3704 0044 0532 0130 00',
        helpText: 'This IBAN is readonly and cannot be changed.',
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'iban-event-log',
            entries: [
                {
                    event: 'ts-change',
                    firedWhen: 'An alteration to the value is committed by the user',
                    detail: 'void',
                },
                { event: 'ts-input', firedWhen: 'The control receives input', detail: 'void' },
                { event: 'ts-focus', firedWhen: 'The control gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'The control loses focus', detail: 'void' },
                { event: 'ts-clear', firedWhen: 'The clear button is activated', detail: 'void' },
                {
                    event: 'ts-invalid',
                    firedWhen: 'Validity is checked and constraints are not satisfied',
                    detail: 'void',
                },
            ],
        });
        return {
            parameters,
            render: (args: IbanArgs) =>
                wrap(html`
                    <ts-iban
                        value=${args.value || nothing}
                        label=${args.label || nothing}
                        size=${args.size || nothing}
                        help-text=${args.helpText || nothing}
                        placeholder=${args.placeholder || nothing}
                        .clearable=${args.clearable}
                        ?clearable=${args.clearable}
                        .disabled=${args.disabled}
                        ?disabled=${args.disabled}
                        .readonly=${args.readonly}
                        ?readonly=${args.readonly}
                        .required=${args.required}
                        ?required=${args.required}
                        @ts-change=${(e: TsChangeEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: TsInputEvent) => log('ts-input', e.detail)}
                        @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                        @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                        @ts-clear=${(e: TsClearEvent) => log('ts-clear', e.detail)}
                        @ts-invalid=${(e: TsInvalidEvent) => log('ts-invalid', e.detail)}
                    ></ts-iban>
                `),
        };
    })(),
};
