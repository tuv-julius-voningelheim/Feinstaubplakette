import { html, nothing } from 'lit';

import type { TsSwitch } from '@tuvsud/design-system/switch';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/switch';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

type SwitchArgs = StoryContext<WebComponentsRenderer>['args'];

type SwitchEvents = {
    'ts-change': unknown;
    'ts-input': unknown;
    'ts-focus': unknown;
    'ts-blur': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Switch',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A switch is a toggle control that lets users turn an option on or off. It represents a binary state and is commonly used for settings or preferences.',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: "The switch's size. Small: 20px, Medium: 24px, Large: 32px.",
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        checked: {
            control: 'boolean',
            description: 'Draws the switch in a checked (on) state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the switch.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Help text displayed below the switch. Use the `help-text` slot for HTML content.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        // Form category
        name: {
            control: 'text',
            description: 'The name of the switch, submitted as a name/value pair with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        value: {
            control: 'text',
            description: 'The value submitted with form data when the switch is checked.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        defaultChecked: {
            control: 'boolean',
            description: 'The default checked state used when the form is reset.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description: 'Associates the switch with a form by ID when placed outside the form element.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Makes the switch a required field.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        error: {
            control: 'boolean',
            description: 'Puts the switch in an error state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorMessage: {
            control: 'text',
            description: 'Custom error message displayed below the switch when in an error state.',
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
            description: 'The switch label. Use the default slot for HTML content.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        ariaLabel: {
            control: 'text',
            description: 'Accessible name for the switch when there is no visible label.',
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
            description: 'Emitted when the checked state changes.',
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
        'ts-invalid': {
            action: 'ts-invalid',
            description: "Emitted when the control's constraints aren't satisfied.",
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        size: 'medium',
        checked: false,
        defaultChecked: false,
        required: false,
        disabled: false,
        name: '',
        value: '',
        form: '',
        helpText: '',
        error: false,
        errorMessage: '',
        label: 'Switch',
        ariaLabel: '',
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
    },
    render: args => html`
        <ts-switch
            size=${args.size || nothing}
            .checked=${args.checked}
            ?checked=${args.checked}
            .defaultChecked=${args.defaultChecked}
            ?default-checked=${args.defaultChecked}
            .required=${args.required}
            ?required=${args.required}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            name=${args.name || nothing}
            value=${args.value || nothing}
            form=${args.form || nothing}
            help-text=${args.helpText || nothing}
            .error=${args.error}
            ?error=${args.error}
            error-message=${args.errorMessage || nothing}
            aria-label=${args.ariaLabel || nothing}
            .labelVisuallyHidden=${args.labelVisuallyHidden}
            ?label-visually-hidden=${args.labelVisuallyHidden}
            .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
            ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
        >
            Switch
        </ts-switch>
    `,
} satisfies MetaWithLabel<TsSwitch & SwitchEvents>;

export default meta;
type Story = StoryObjWithLabel<TsSwitch>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the switch is unchecked and enabled.',
            },
        },
    },
};

export const Checked: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `checked` property to render the switch in the on state.',
            },
        },
    },
    args: { checked: true },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `size` property to change the switch size. Available sizes are `small` (20px), `medium` (24px, default), and `large` (32px). The thumb always sits inside the track.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <ts-switch size="small">Small</ts-switch>
            <ts-switch size="medium" checked>Medium (checked)</ts-switch>
            <ts-switch size="large">Large</ts-switch>
        </div>
    `,
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` property to prevent interaction. Both on and off states can be disabled.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <ts-switch disabled>Disabled (off)</ts-switch>
            <ts-switch disabled checked>Disabled (on)</ts-switch>
        </div>
    `,
};

export const WithHelpText: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `help-text` property or `help-text` slot to provide additional context below the switch.',
            },
        },
    },
    args: { helpText: 'Enabling this will send you weekly digest emails.' },
};

export const HelpTextSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `help-text` slot when the help text contains HTML markup.',
            },
        },
    },
    render: () => html`
        <ts-switch>
            Marketing emails
            <span slot="help-text">You can unsubscribe at any time. See our <a href="#">privacy policy</a>.</span>
        </ts-switch>
    `,
};

export const Error: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `error` and `error-message` to put the switch in an error state with a descriptive message below.',
            },
        },
    },
    args: {
        error: true,
        errorMessage: 'You must accept the terms to continue.',
    },
};

export const ErrorWithoutMessage: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The `error` state can be used without an `error-message` when the error context is provided elsewhere.',
            },
        },
    },
    args: { error: true },
};

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `required` to mark the switch as mandatory. Submit the form without toggling it on to trigger the validation error.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const sw = (e.currentTarget as HTMLFormElement).querySelector('ts-switch') as TsSwitch;

                sw.error = false;
                sw.errorMessage = '';
                sw.setCustomValidity('');

                if (!sw.checkValidity()) {
                    sw.error = true;
                    sw.errorMessage = 'You must accept the terms to proceed.';
                }
            }}
        >
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <ts-switch required>
                    I accept the terms and conditions
                    <span slot="help-text">Required to create your account.</span>
                </ts-switch>

                <ts-button style="width: 100px; padding-top: 1rem" type="submit" variant="primary">Submit</ts-button>
            </div>
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
    args: { labelVisuallyHidden: true, ariaLabel: 'Toggle notifications' },
};

export const HelpTextHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `help-text-visually-hidden` to keep help text accessible to screen readers while hiding it visually.',
            },
        },
    },
    args: { helpText: 'Enabling this will send you weekly digest emails.', helpTextVisuallyHidden: true },
};

export const LabelWithIconSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the default slot for the label text together with the `label-icon` slot to add an icon next to the label without any extra wrapper markup or inline styles. The layout (flexbox + gap) is handled automatically by the component.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <ts-switch>
                Enable notifications
                <ts-tooltip content="You will receive email and push notifications" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/info.svg" alt="info" />
                    </ts-icon>
                </ts-tooltip>
            </ts-switch>

            <ts-switch checked>
                Dark mode
                <ts-tooltip content="Switch the interface to dark theme" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/info.svg" alt="info" />
                    </ts-icon>
                </ts-tooltip>
            </ts-switch>
        </div>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'switch-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'Checked state changes', detail: 'void' },
                { event: 'ts-input', firedWhen: 'Control receives input', detail: 'void' },
                { event: 'ts-focus', firedWhen: 'Control gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'Control loses focus', detail: 'void' },
                { event: 'ts-invalid', firedWhen: "Constraints aren't satisfied", detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: SwitchArgs) =>
                wrap(html`
                    <ts-switch
                        size=${args.size || nothing}
                        .checked=${args.checked}
                        ?checked=${args.checked}
                        help-text=${args.helpText || nothing}
                        @ts-change=${(e: CustomEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: CustomEvent) => log('ts-input', e.detail)}
                        @ts-focus=${(e: CustomEvent) => log('ts-focus', e.detail)}
                        @ts-blur=${(e: CustomEvent) => log('ts-blur', e.detail)}
                        @ts-invalid=${(e: CustomEvent) => log('ts-invalid', e.detail)}
                    >
                        Switch
                    </ts-switch>
                `),
        };
    })(),
};
