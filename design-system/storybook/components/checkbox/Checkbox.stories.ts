import { html, nothing } from 'lit';

import type { TsCheckbox } from '@tuvsud/design-system/checkbox';
import type { StoryContext } from 'storybook/internal/types';

import type {
    TsBlurEvent,
    TsCheckboxChangeEvent,
    TsFocusEvent,
    TsInputEvent,
    TsInvalidEvent,
} from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { Meta } from '@storybook/web-components';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/checkbox';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

type CheckboxArgs = StoryContext<WebComponentsRenderer>['args'];

type CheckboxEvents = {
    'ts-blur': unknown;
    'ts-change': unknown;
    'ts-focus': unknown;
    'ts-input': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Checkbox',
    component: 'ts-checkbox',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Checkboxes are used when there are multiple items to select in a list. Users can select zero, one, or any number of items.',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'The checkbox\u2019s size.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the checkbox.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        checked: {
            control: 'boolean',
            description: 'Draws the checkbox in a checked state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        indeterminate: {
            control: 'boolean',
            description:
                'Draws the checkbox in an indeterminate state, usually for "select all/none" behavior when children are mixed.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Help text for the checkbox. For HTML content, use the `help-text` slot instead.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        // Form category
        name: {
            control: 'text',
            description: 'The name of the checkbox, submitted as a name/value pair with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        value: {
            control: 'text',
            description: 'The current value of the checkbox, submitted with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        defaultChecked: {
            control: 'boolean',
            description: 'The default value of the form control (used for resets).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description:
                'Associates the checkbox with a form by ID. Allows the checkbox to be placed outside the form element.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Makes the checkbox a required field.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        error: {
            control: 'boolean',
            description: 'Shows the input in an error state with a red border.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorMessage: {
            control: 'text',
            description: 'Error text shown below the input when provided.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        validity: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validity state object (read-only).',
            category: 'Form',
        },
        validationMessage: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validation message (read-only).',
            category: 'Form',
        },
        // Accessibility category
        ariaLabel: {
            control: 'text',
            description:
                'Accessible name for the checkbox when no visible label is provided (e.g. when `labelVisuallyHidden` is true or the default slot is empty).',
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
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the checkbox loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-change': {
            action: 'ts-change',
            description: 'Emitted when the checked state changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-focus': {
            action: 'ts-focus',
            description: 'Emitted when the checkbox gains focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-input': {
            action: 'ts-input',
            description: 'Emitted when the checkbox receives input.',
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
        name: '',
        value: '',
        disabled: false,
        checked: false,
        indeterminate: false,
        defaultChecked: false,
        form: '',
        required: false,
        helpText: '',
        error: false,
        errorMessage: '',
        ariaLabel: '',
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
    },
    render: args => html`
        <ts-checkbox
            .name=${args.name}
            name=${args.name || nothing}
            .value=${args.value}
            value=${args.value || nothing}
            .size=${args.size}
            size=${args.size || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .checked=${args.checked}
            ?checked=${args.checked}
            .indeterminate=${args.indeterminate}
            ?indeterminate=${args.indeterminate}
            .defaultChecked=${args.defaultChecked}
            ?defaultChecked=${args.defaultChecked}
            .form=${args.form}
            form=${args.form || nothing}
            .required=${args.required}
            ?required=${args.required}
            .helpText=${args.helpText}
            help-text=${args.helpText || nothing}
            .error=${args.error}
            ?error=${args.error}
            .errorMessage=${args.errorMessage}
            error-message=${args.errorMessage || nothing}
            .ariaLabel=${args.ariaLabel}
            aria-label=${args.ariaLabel || nothing}
            .labelVisuallyHidden=${args.labelVisuallyHidden}
            ?label-visually-hidden=${args.labelVisuallyHidden}
            .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
            ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
        >
            Checkbox
        </ts-checkbox>
    `,
} satisfies Meta<TsCheckbox & CheckboxEvents>;

export default meta;
type Story = StoryObjWithLabel<TsCheckbox>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default checkbox state is unchecked and enabled.',
            },
        },
    },
};

export const Checked: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `checked` property to activate the checkbox.',
            },
        },
    },
    args: { checked: true },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` property to disable the checkbox.',
            },
        },
    },
    args: { disabled: true },
};

export const Indeterminate: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `indeterminate` property to make the checkbox indeterminate.',
            },
        },
    },
    args: { indeterminate: true },
};

export const HelperText: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add descriptive help text to a switch with the `help-text` property. For help texts that contain HTML, use the help-text slot instead.',
            },
        },
    },
    args: { helpText: 'What should the user know about the checkbox?' },
};

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `required` attribute to make the checkbox required. The error state is shown after submit.',
            },
        },
    },
    args: {
        required: true,
        error: false,
        errorMessage: '',
        helpText: '',
    },
    render: args => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();

                const form = e.currentTarget as HTMLFormElement;
                const checkbox = form.querySelector('ts-checkbox') as TsCheckbox;

                checkbox.error = false;
                checkbox.errorMessage = '';
                checkbox.setCustomValidity('');

                const valid = checkbox.checkValidity();

                if (!valid) {
                    checkbox.error = true;
                    checkbox.errorMessage = 'This field is required.';
                    checkbox.setCustomValidity('This field is required.');
                }
            }}
        >
            <ts-checkbox
                .required=${args.required}
                ?required=${args.required}
                .helpText=${args.helpText}
                help-text=${args.helpText}
            >
                Accept terms
            </ts-checkbox>

            <ts-button style="float: right; padding-top: 1rem" variant="primary" type="submit">Submit</ts-button>
        </form>
    `,
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

export const LabelWithIconSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label-icon` slot to add an icon next to the checkbox label text. The layout (flexbox + gap) is handled automatically by the component.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ts-checkbox>
                I accept the terms and conditions
                <ts-tooltip content="Read our terms and conditions" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/info.svg" alt="info" />
                    </ts-icon>
                </ts-tooltip>
            </ts-checkbox>

            <ts-checkbox checked>
                Subscribe to newsletter
                <ts-tooltip content="Receive weekly updates" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/drafts.svg" alt="info" />
                    </ts-icon>
                </ts-tooltip>
            </ts-checkbox>
        </div>
    `,
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
        helpText: 'This help text is visually hidden but readable by screen readers.',
        helpTextVisuallyHidden: true,
    },
};

export const AriaLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `ariaLabel` property to provide an accessible name when the visible label is hidden or absent. This is announced by screen readers in place of label text.',
            },
        },
    },
    args: { ariaLabel: 'Accept terms and conditions', labelVisuallyHidden: true },
};

export const LongText: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Checkboxes can contain long text. The label will wrap to multiple lines as needed.',
            },
        },
    },
    render: args => html`
        <div class="sb-story-wrapper--column">
            <ts-checkbox size="medium" checked help-text="Subscription to expert insights.">
                Agreement to receive professional technical updates and digital newsletters.
            </ts-checkbox>

            <ts-checkbox size="medium" indeterminate help-text="Mandatory for application.">
                Acknowledgement of the global privacy policy and data processing terms.
            </ts-checkbox>

            <ts-checkbox size="medium" size=${args.size}>
                Acceptance of the General Terms and Conditions for Technical Inspections
            </ts-checkbox>

            <ts-checkbox size="medium" disabled size=${args.size}>
                Acceptance of the General Terms and Conditions for Technical Inspections
            </ts-checkbox>
        </div>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'checkbox-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'The checked state changes', detail: 'TsCheckboxChangeDetail' },
                { event: 'ts-input', firedWhen: 'The checkbox receives input', detail: 'void' },
                { event: 'ts-focus', firedWhen: 'The checkbox gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'The checkbox loses focus', detail: 'void' },
                { event: 'ts-invalid', firedWhen: 'Form validation fails', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: CheckboxArgs) =>
                wrap(html`
                    <ts-checkbox
                        .name=${args.name}
                        name=${args.name || nothing}
                        .value=${args.value}
                        value=${args.value || nothing}
                        .size=${args.size}
                        size=${args.size || nothing}
                        .disabled=${args.disabled}
                        ?disabled=${args.disabled}
                        .checked=${args.checked}
                        ?checked=${args.checked}
                        .indeterminate=${args.indeterminate}
                        ?indeterminate=${args.indeterminate}
                        .required=${args.required}
                        ?required=${args.required}
                        .helpText=${args.helpText}
                        help-text=${args.helpText || nothing}
                        @ts-change=${(e: TsCheckboxChangeEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: TsInputEvent) => log('ts-input', e.detail)}
                        @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                        @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                        @ts-invalid=${(e: TsInvalidEvent) => log('ts-invalid', e.detail)}
                    >
                        Checkbox
                    </ts-checkbox>
                `),
        };
    })(),
};
