import { html } from 'lit';
import { nothing } from 'lit';

import type { TsRadioGroup } from '@tuvsud/design-system/radio-group';
import type { StoryContext } from 'storybook/internal/types';

import type { TsChangeEvent } from '@utils/events/ts-change.js';
import type { TsInputEvent } from '@utils/events/ts-input.js';
import type { TsInvalidEvent } from '@utils/events/ts-invalid.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/radio';
import '@tuvsud/design-system/radio-button';
import '@tuvsud/design-system/radio-group';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

type RadioGroupArgs = StoryContext<WebComponentsRenderer>['args'];

type RadioGroupEvents = {
    'ts-change': unknown;
    'ts-input': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Radio Group',
    component: 'ts-radio-group',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A radio group organizes related radio options into a single form control, ensuring only one option can be selected at a time.',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: "The group's size. Applied to all child radios and radio buttons.",
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'medium' },
                category: 'Properties',
            },
        },
        helpText: {
            control: 'text',
            description: 'Help text shown below the group. Use the `help-text` slot for HTML content.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        direction: {
            control: 'select',
            options: ['vertical', 'horizontal'],
            description: 'Controls whether radios are stacked vertically or arranged in a row.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'vertical' },
                category: 'Properties',
            },
        },
        // Form category
        name: {
            control: 'text',
            description: "The group's name, submitted as a name/value pair with form data.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        value: {
            control: 'text',
            description: "The group's currently selected value.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description: 'Associates the group with a form by ID, allowing it to be placed outside the form element.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Requires a child radio to be checked before the containing form can be submitted.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        error: {
            control: 'boolean',
            description: 'Puts the radio group in an error state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorMessage: {
            control: 'text',
            description: 'Custom error message displayed below the group when in an error state.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        validity: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validity state object (read-only).',
        },
        validationMessage: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validation message (read-only).',
        },
        // Accessibility category
        label: {
            control: 'text',
            description: "The radio group's label. Use the `label` slot for HTML content.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        ariaLabel: {
            control: 'text',
            description:
                'Provides an accessible name for the group when there is no visible label. Ignored when a label is present.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        labelVisuallyHidden: {
            control: 'boolean',
            description: 'Visually hides the label while keeping it accessible to screen readers.',
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
            description: 'Emitted when the selected value changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-input': {
            action: 'ts-input',
            description: 'Emitted when a radio option is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-invalid': {
            action: 'ts-invalid',
            description:
                'Emitted when the form control has been checked for validity and its constraints are not satisfied.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        size: 'medium',
        helpText: '',
        name: 'option',
        value: '',
        form: '',
        required: false,
        label: 'Select an option',
        error: false,
        errorMessage: '',
        direction: 'vertical',
        ariaLabel: '',
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
    },
    render: args => html`
        <ts-radio-group
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            name=${args.name || nothing}
            value=${args.value || nothing}
            size=${args.size || nothing}
            form=${args.form || nothing}
            .required=${args.required}
            ?required=${args.required}
            .error=${args.error}
            ?error=${args.error}
            error-message=${args.errorMessage || nothing}
            direction=${args.direction || nothing}
            aria-label=${args.ariaLabel || nothing}
            .labelVisuallyHidden=${args.labelVisuallyHidden}
            ?label-visually-hidden=${args.labelVisuallyHidden}
            .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
            ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
        >
            <ts-radio value="1">Option 1</ts-radio>
            <ts-radio value="2">Option 2</ts-radio>
            <ts-radio value="3">Option 3</ts-radio>
        </ts-radio-group>
    `,
} satisfies MetaWithLabel<TsRadioGroup & RadioGroupEvents>;

export default meta;
type Story = StoryObjWithLabel<TsRadioGroup>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default radio group with a label and three options, none pre-selected.',
            },
        },
    },
};

export const InitialValue: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `value` property to pre-select an option on render.',
            },
        },
    },
    args: { value: '2' },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `size` property to control the size of all radios in the group. Available sizes are `small`, `medium` (default), and `large`.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 32px;">
            <ts-radio-group label="Small" size="small" value="1">
                <ts-radio value="1">Option 1</ts-radio>
                <ts-radio value="2">Option 2</ts-radio>
                <ts-radio value="3">Option 3</ts-radio>
            </ts-radio-group>

            <ts-radio-group label="Medium" size="medium" value="1">
                <ts-radio value="1">Option 1</ts-radio>
                <ts-radio value="2">Option 2</ts-radio>
                <ts-radio value="3">Option 3</ts-radio>
            </ts-radio-group>

            <ts-radio-group label="Large" size="large" value="1">
                <ts-radio value="1">Option 1</ts-radio>
                <ts-radio value="2">Option 2</ts-radio>
                <ts-radio value="3">Option 3</ts-radio>
            </ts-radio-group>
        </div>
    `,
};

export const Horizontal: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `direction="horizontal"` to arrange the radios in a row instead of a column.',
            },
        },
    },
    args: { direction: 'horizontal' },
};

export const WithHelpText: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `help-text` property to provide additional context below the group.',
            },
        },
    },
    args: { helpText: 'Choose the option that best describes your preference.' },
};

export const DisabledOptions: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Individual radios within a group can be disabled independently while others remain interactive.',
            },
        },
    },
    render: () => html`
        <ts-radio-group label="Notification preference" value="important">
            <ts-radio value="all">All notifications</ts-radio>
            <ts-radio value="important">Important only</ts-radio>
            <ts-radio value="none" disabled>None (unavailable)</ts-radio>
        </ts-radio-group>
    `,
};

export const Error: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `error` and `error-message` to display a validation error. The error state is propagated to all child radios.',
            },
        },
    },
    args: {
        error: true,
        errorMessage: 'Please select an option to continue.',
    },
};

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `required` to mark the group as mandatory. A red asterisk appears next to the label. Submit the form without selecting an option to see the validation error.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const radioGroup = (e.currentTarget as HTMLFormElement).querySelector('ts-radio-group') as TsRadioGroup;

                radioGroup.error = false;
                radioGroup.errorMessage = '';
                radioGroup.setCustomValidity('');

                if (!radioGroup.checkValidity()) {
                    radioGroup.error = true;
                    radioGroup.errorMessage = 'Please select an option to continue.';
                    radioGroup.setCustomValidity('Please select an option to continue.');
                }
            }}
        >
            <ts-radio-group label="Favourite pet" name="pet" required>
                <ts-radio value="cats">Cats</ts-radio>
                <ts-radio value="dogs">Dogs</ts-radio>
                <ts-radio value="birds">Birds</ts-radio>
            </ts-radio-group>
            <ts-button style="margin-top: 1rem" type="submit" variant="primary">Submit</ts-button>
        </form>
    `,
};

export const LabelHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `label-visually-hidden` to hide the label visually while keeping it accessible to screen readers.',
            },
        },
    },
    args: { labelVisuallyHidden: true },
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
        <ts-radio-group label="Payment Method">
            <ts-tooltip content="Select your preferred payment method" slot="label-icon">
                <ts-icon>
                    <img src="/assets/svg/info.svg" alt="info" />
                </ts-icon>
            </ts-tooltip>
            <ts-radio value="credit">Credit Card</ts-radio>
            <ts-radio value="debit">Debit Card</ts-radio>
            <ts-radio value="paypal">PayPal</ts-radio>
        </ts-radio-group>
    `,
};

export const HelpTextHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `help-text-visually-hidden` to keep help text accessible to screen readers while hiding it visually.',
            },
        },
    },
    args: {
        helpText: 'Choose the option that best describes your preference.',
        helpTextVisuallyHidden: true,
    },
};

export const WithHelpTextOnOptions: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Individual radios can carry their own `help-text` to give each option extra context.',
            },
        },
    },
    render: () => html`
        <ts-radio-group label="Notification frequency">
            <ts-radio value="all" help-text="You will be notified about every activity.">All</ts-radio>
            <ts-radio value="important" help-text="Only critical alerts will reach you.">Important only</ts-radio>
            <ts-radio value="none" help-text="You will not receive any notifications.">None</ts-radio>
        </ts-radio-group>
    `,
};

export const PaymentMethod: Story = {
    parameters: {
        docs: {
            description: {
                story: "Use the default slot of each `ts-radio` to compose rich content — icons and multi-line labels — inside a horizontal radio group. The group's `label` attribute provides the accessible group name.",
            },
        },
    },
    render: () => html`
        <style>
            .payment-option {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 8px;
            }
            .payment-option__icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 48px;
                height: 32px;
                border: 1px solid var(--ts-semantic-color-border-base-default);
                border-radius: 4px;
                overflow: hidden;
                background: var(--ts-semantic-color-background-base-default);
                flex-shrink: 0;
            }
            .payment-option__icon img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .payment-option__icon--bank {
                font-size: 11px;
                font-weight: 700;
                letter-spacing: -0.5px;
                color: var(--ts-semantic-color-text-base-default);
            }
            .payment-option__name {
                font-size: var(--ts-font-size-100);
                font-weight: var(--ts-semantic-typography-font-weight-medium);
                color: var(--ts-semantic-color-text-base-default);
            }
        </style>

        <ts-radio-group label="Payment method" direction="horizontal" name="payment" value="visa" style="width: 600px">
            <ts-radio value="visa">
                <div class="payment-option">
                    <div class="payment-option__icon">
                        <img src="/assets/payment/visa.png" alt="Visa" />
                    </div>
                    <span class="payment-option__name">Visa</span>
                </div>
            </ts-radio>

            <ts-radio value="mastercard">
                <div class="payment-option">
                    <div class="payment-option__icon">
                        <img src="/assets/payment/master.jpg" alt="Mastercard" />
                    </div>
                    <span class="payment-option__name">Mastercard</span>
                </div>
            </ts-radio>

            <ts-radio value="paypal">
                <div class="payment-option">
                    <div class="payment-option__icon">
                        <img src="/assets/payment/paypal.jpg" alt="PayPal" />
                    </div>
                    <span class="payment-option__name">PayPal</span>
                </div>
            </ts-radio>

            <ts-radio value="bank">
                <div class="payment-option">
                    <div class="payment-option__icon payment-option__icon--bank">IBAN</div>
                    <span class="payment-option__name">Bank transfer</span>
                </div>
            </ts-radio>
        </ts-radio-group>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'radio-group-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'The selected value changes', detail: 'void' },
                { event: 'ts-input', firedWhen: 'A radio option is clicked', detail: 'void' },
                { event: 'ts-invalid', firedWhen: 'Form control validation fails', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: RadioGroupArgs) =>
                wrap(html`
                    <ts-radio-group
                        label=${args.label || nothing}
                        name=${args.name || nothing}
                        value=${args.value || nothing}
                        size=${args.size || nothing}
                        @ts-change=${(e: TsChangeEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: TsInputEvent) => log('ts-input', e.detail)}
                        @ts-invalid=${(e: TsInvalidEvent) => log('ts-invalid', e.detail)}
                    >
                        <ts-radio value="1">Option 1</ts-radio>
                        <ts-radio value="2">Option 2</ts-radio>
                        <ts-radio value="3">Option 3</ts-radio>
                    </ts-radio-group>
                `),
        };
    })(),
};
