import { html, nothing } from 'lit';

import type { TsInput } from '@tuvsud/design-system/input';
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

import '@tuvsud/design-system/input';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

type InputArgs = StoryContext<WebComponentsRenderer>['args'];

type InputEvents = {
    'ts-change': unknown;
    'ts-input': unknown;
    'ts-focus': unknown;
    'ts-blur': unknown;
    'ts-clear': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Input',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'The Input component allows users to enter and edit text or numeric values. It is a fundamental element for forms, search bars, and data entry interfaces.',
            },
        },
    },
    argTypes: {
        // Properties category
        type: {
            control: 'select',
            options: ['email', 'number', 'password', 'search', 'tel', 'text', 'time', 'url'],
            description: 'The type of input. Only a subset of native types is supported.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'text' },
                category: 'Properties',
            },
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'The input\u2019s size.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'medium' },
                category: 'Properties',
            },
        },
        filled: {
            control: 'boolean',
            description: 'Draws a filled input.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
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
        placeholder: {
            control: 'text',
            description: 'Placeholder text shown when empty.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
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
        passwordToggle: {
            control: 'boolean',
            description: 'Adds a button to toggle password visibility. Applies to password type.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        passwordVisible: {
            control: 'boolean',
            description: 'Whether the password is currently visible. Applies to password type.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        noSpinButtons: {
            control: 'boolean',
            description: 'Hides native spin buttons for number inputs.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        min: {
            control: 'text',
            description: 'Minimum value. Applies to date and number types.',
            table: { type: { summary: 'string' }, category: 'Properties' },
        },
        max: {
            control: 'text',
            description: 'Maximum value. Applies to date and number types.',
            table: { type: { summary: 'string' }, category: 'Properties' },
        },
        step: {
            control: 'text',
            description:
                'Granularity the value must adhere to, or "any" for no stepping. Applies to date and number types.',
            table: { type: { summary: 'string' }, category: 'Properties' },
        },
        autocapitalize: {
            control: 'select',
            options: ['off', 'none', 'on', 'sentences', 'words', 'characters'],
            description: 'Controls automatic capitalization.',
            table: {
                type: { summary: 'enum' },
                category: 'Properties',
            },
        },
        autocorrect: {
            control: 'boolean',
            description: 'Toggles browser autocorrect.',
            table: { type: { summary: 'boolean' }, category: 'Properties' },
        },
        autocomplete: {
            control: 'text',
            description: 'Autocomplete hint to the browser (see MDN for valid values).',
            table: { type: { summary: 'string' }, category: 'Properties' },
        },
        autofocus: {
            control: 'boolean',
            description: 'Focus the input on page load.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        enterkeyhint: {
            control: 'select',
            options: ['enter', 'done', 'go', 'next', 'previous', 'search', 'send'],
            description: 'Customize the Enter key label on virtual keyboards.',
            table: { type: { summary: 'enum' }, category: 'Properties' },
        },
        spellcheck: {
            control: 'boolean',
            description: 'Enables spell checking on the input.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        inputmode: {
            control: 'select',
            options: ['none', 'text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url'],
            description: 'Hints the expected type of data for virtual keyboards.',
            table: {
                type: { summary: 'enum' },
                category: 'Properties',
            },
        },
        valueAsDate: {
            control: false,
            table: { disable: false, category: 'Properties' },
            description:
                'Gets/sets the current value as a Date. Uses the native input implementation and may throw for invalid conversions.',
        },
        valueAsNumber: {
            control: false,
            table: { disable: false, category: 'Properties' },
            description: 'Gets/sets the current value as a number. Returns NaN if it cannot be converted.',
        },
        // Form category
        value: {
            control: 'text',
            description: 'The current value, submitted with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        defaultValue: {
            control: 'text',
            description: 'Default value of the control, useful for form resets.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        name: {
            control: 'text',
            description: 'The name of the input, submitted with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description:
                'Associates the control with a form by ID when placed outside a form. Must be in the same document or shadow root.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Marks the input as required.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        pattern: {
            control: 'text',
            description: 'Regex pattern to validate input against.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        minlength: {
            control: 'number',
            description: 'Minimum length of input that will be considered valid.',
            table: { type: { summary: 'number' }, category: 'Form' },
        },
        maxlength: {
            control: 'number',
            description: 'Maximum length of input that will be considered valid.',
            table: { type: { summary: 'number' }, category: 'Form' },
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
        success: {
            control: 'boolean',
            description: 'Shows the input in a success state with a green border and a check icon.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        warning: {
            control: 'boolean',
            description: 'Shows the input in an error state with a red border and a check icon.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        validity: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validity state object. Native browser validation state',
        },
        validationMessage: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validation message. Human-readable error string generated by browser',
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'The input\u2019s label. Use the `label` slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        ariaLabel: {
            control: 'text',
            description: 'The aria-label attribute provides an accessible name for the input.',
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
            description: 'Emitted when an alteration to the control\u2019s value is committed by the user.',
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
                'Emitted when the form control has been checked for validity and its constraints aren\u2019t satisfied.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        type: 'text',
        name: '',
        value: '',
        defaultValue: '',
        size: 'medium',
        filled: false,
        pill: false,
        label: 'Label',
        helpText: '',
        clearable: false,
        disabled: false,
        placeholder: '',
        readonly: false,
        lock: true,
        passwordToggle: false,
        passwordVisible: false,
        noSpinButtons: false,
        form: '',
        required: false,
        pattern: undefined,
        minlength: undefined,
        maxlength: undefined,
        min: undefined,
        max: undefined,
        step: undefined,
        autocapitalize: undefined,
        autocorrect: undefined,
        autocomplete: undefined,
        autofocus: false,
        enterkeyhint: undefined,
        spellcheck: true,
        inputmode: undefined,
        error: false,
        errorMessage: '',
        success: false,
        warning: false,
        ariaLabel: '',
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
    },
    render: args => html`
        <ts-input
            type=${args.type || nothing}
            name=${args.name || nothing}
            value=${args.value || nothing}
            default-value=${args.defaultValue || nothing}
            size=${args.size || nothing}
            .filled=${args.filled}
            ?filled=${args.filled}
            .pill=${args.pill}
            ?pill=${args.pill}
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            .clearable=${args.clearable}
            ?clearable=${args.clearable}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            placeholder=${args.placeholder || nothing}
            .readonly=${args.readonly}
            ?readonly=${args.readonly}
            .lock=${args.lock}
            ?lock=${args.lock}
            .passwordToggle=${args.passwordToggle}
            ?password-toggle=${args.passwordToggle}
            .passwordVisible=${args.passwordVisible}
            ?password-visible=${args.passwordVisible}
            .noSpinButtons=${args.noSpinButtons}
            ?no-spin-buttons=${args.noSpinButtons}
            form=${args.form || nothing}
            .required=${args.required}
            ?required=${args.required}
            pattern=${args.pattern || nothing}
            minlength=${args.minlength ?? nothing}
            maxlength=${args.maxlength ?? nothing}
            min=${args.min || nothing}
            max=${args.max || nothing}
            step=${args.step || nothing}
            autocapitalize=${args.autocapitalize || nothing}
            autocorrect=${args.autocorrect || nothing}
            autocomplete=${args.autocomplete || nothing}
            .autofocus=${args.autofocus}
            ?autofocus=${args.autofocus}
            enterkeyhint=${args.enterkeyhint || nothing}
            spellcheck=${String(args.spellcheck)}
            inputmode=${args.inputmode || nothing}
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
        ></ts-input>
    `,
} satisfies MetaWithLabel<TsInput & InputEvents>;

export default meta;
type Story = StoryObjWithLabel<TsInput>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default input is a basic text input with a label and help text.',
            },
        },
    },
    args: {
        label: 'Default Input',
        helpText: 'This is a basic text input',
    },
};

export const Password: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add the password-toggle property to add a toggle button that will show the password when activated.',
            },
        },
    },
    args: { type: 'password', label: 'Password', passwordToggle: true, helpText: 'Enter your password' },
};

export const WithPrefix: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `prefix` slots to add icons.',
            },
        },
    },
    args: { label: 'Username', placeholder: 'Enter your username' },
    render: args => html`
        <ts-input
            type=${args.type || nothing}
            size=${args.size || nothing}
            value=${args.value || nothing}
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            placeholder=${args.placeholder || nothing}
            .error=${args.error}
            ?error=${args.error}
        >
            <ts-icon slot="prefix" library="system" name="person"></ts-icon>
        </ts-input>
    `,
};

export const WithSuffix: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `suffix` slots to add icons.',
            },
        },
    },
    args: { type: 'email', label: 'Email', placeholder: 'Enter your email' },
    render: args => html`
        <ts-input
            type=${args.type || nothing}
            size=${args.size || nothing}
            value=${args.value || nothing}
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            placeholder=${args.placeholder || nothing}
            .error=${args.error}
            ?error=${args.error}
        >
            <ts-icon slot="suffix" library="system" name="mail"></ts-icon>
        </ts-input>
    `,
};

export const Clearable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add the `clearable` attribute to add a clear button when the input has content.',
            },
        },
    },
    args: { label: 'Clearable Input', clearable: true, value: 'Clear me!' },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` attribute to disable an input.',
            },
        },
    },
    args: { label: 'Disabled Input', disabled: true, value: 'You cannot edit this' },
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `readonly` attribute to make an input readonly. It applies a locked visual style (gray background) but without a lock icon. The value remains focusable, selectable, and copyable.',
            },
        },
    },
    args: { label: 'Readonly Input', readonly: true, value: 'You cannot edit this' },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `size` property to change an input’s size.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ts-input size="small" label="Small" placeholder="Small input"></ts-input>
            <ts-input size="medium" label="Medium" placeholder="Medium input"></ts-input>
            <ts-input size="large" label="Large" placeholder="Large input"></ts-input>
        </div>
    `,
};

export const Pill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add the `pill` attribute to create a pill-style input with rounded edges.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ts-input size="small" label="Small" placeholder="Small input" pill></ts-input>
            <ts-input size="medium" label="Medium" placeholder="Medium input" pill></ts-input>
            <ts-input size="large" label="Large" placeholder="Large input" pill></ts-input>
        </div>
    `,
};

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add the `required` attribute to mark an input as required.',
            },
        },
    },
    args: { label: 'Required Input', required: true, helpText: 'Some help text', placeholder: 'some placeholder' },
    render: args => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();

                const form = e.currentTarget as HTMLFormElement;
                const input = form.querySelector('ts-input') as TsInput;

                input.error = false;
                input.errorMessage = '';
                input.setCustomValidity('');

                const valid = input.checkValidity();

                if (!valid) {
                    input.error = true;
                    input.errorMessage = 'This field is required';
                }
            }}
        >
            <ts-input
                label=${args.label || nothing}
                help-text=${args.helpText || nothing}
                .required=${args.required}
                ?required=${args.required}
                placeholder=${args.placeholder || nothing}
            ></ts-input>

            <ts-button style="float: right; padding-top: 1rem" variant="primary" type="submit">Submit</ts-button>
        </form>
    `,
};

export const WithValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `pattern` property to add custom validation to an input. In this example, the input requires exactly 4 digits.',
            },
        },
    },
    args: {
        label: 'Pattern Validation',
        pattern: '[0-9]{4}',
        helpText: 'Please enter your birth year',
        required: true,
        placeholder: 'YYYY',
    },
    render: args => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();

                const form = e.currentTarget as HTMLFormElement;
                const input = form.querySelector('ts-input') as TsInput;

                input.error = false;
                input.errorMessage = '';
                input.setCustomValidity('');

                const valid = input.checkValidity();

                if (!valid) {
                    input.error = true;
                    input.errorMessage = 'Enter exactly 4 digits.';
                }
            }}
        >
            <ts-input
                pattern=${args.pattern || nothing}
                label=${args.label || nothing}
                help-text=${args.helpText || nothing}
                .required=${args.required}
                ?required=${args.required}
                placeholder=${args.placeholder || nothing}
            ></ts-input>

            <ts-button style="float: right; padding-top: 1rem" variant="primary" type="submit">Submit</ts-button>
        </form>
    `,
};

export const LabelWithIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label` slot to pass a custom label alongside an icon. When a `<label>` element is provided inside the slot, its `for` attribute is automatically set to point to the internal input — ensuring full accessibility even without an explicit `for` attribute.',
            },
        },
    },
    render: () => html`
        <ts-input placeholder="Enter your email" type="email">
            <div slot="label" style="display: flex; align-items: center; gap: 0.25rem;">
                <label>Email address</label>
                <ts-icon name="info" size="16" library="system" style="display: flex;"></ts-icon>
            </div>
        </ts-input>
    `,
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
            <ts-input label="Email address" placeholder="Enter your email" type="email">
                <ts-tooltip content="This is tooltip info label" slot="label-icon">
                    <ts-icon style="--icon-color: #1d4fd7">
                        <img src="/assets/svg/info.svg" alt="filter" />
                    </ts-icon>
                </ts-tooltip>
            </ts-input>

            <ts-input label="Email address" placeholder="Enter your email" type="email">
                <ts-tooltip content="This is tooltip info label" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/drafts.svg" alt="filter" />
                    </ts-icon>
                </ts-tooltip>
            </ts-input>

            <ts-input label="Password" placeholder="Enter your password" type="password" password-toggle>
                <ts-tooltip content="This is tooltip password" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/lock.svg" alt="filter" />
                    </ts-icon>
                </ts-tooltip>
            </ts-input>
        </div>
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

export const HelpTextHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `helpTextVisuallyHidden` property to visually hide the help text while keeping it accessible to screen readers.',
            },
        },
    },
    args: {
        label: 'Input with Hidden Help Text',
        helpText: 'This help text is visually hidden but still accessible to screen readers.',
        helpTextVisuallyHidden: true,
    },
};

export const Success: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `success` attribute to indicate that the input value has been validated successfully. A green border and a check icon are displayed. The `success` state is ignored when `error` is also set.',
            },
        },
    },
    args: {
        label: 'Email Address',
        value: 'user@example.com',
        helpText: 'Your email address looks good!',
        success: true,
    },
};

export const Warning: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `warning` attribute to indicate that the input value needs attention. An amber border and a warning icon are displayed. The `warning` state is ignored when `error` or `success` is also set.',
            },
        },
    },
    args: {
        label: 'Username',
        value: 'john_doe_123',
        helpText: 'This username may already be taken.',
        warning: true,
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'input-event-log',
            entries: [
                {
                    event: 'ts-change',
                    firedWhen: "An alteration to the control's value is committed by the user",
                    detail: 'void',
                },
                { event: 'ts-input', firedWhen: 'The control receives input', detail: 'void' },
                { event: 'ts-focus', firedWhen: 'The control gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'The control loses focus', detail: 'void' },
                { event: 'ts-clear', firedWhen: 'The clear button is activated', detail: 'void' },
                {
                    event: 'ts-invalid',
                    firedWhen: "Validity is checked and constraints aren't satisfied",
                    detail: 'void',
                },
            ],
        });
        return {
            parameters,
            render: (args: InputArgs) =>
                wrap(html`
                    <ts-input
                        type=${args.type || nothing}
                        label=${args.label || nothing}
                        value=${args.value || nothing}
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
                    ></ts-input>
                `),
        };
    })(),
};
