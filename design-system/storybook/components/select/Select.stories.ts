import { html, nothing } from 'lit';

import type { TsSelect } from '@tuvsud/design-system/select';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/select';
import '@tuvsud/design-system/option';
import '@tuvsud/design-system/divider';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tag';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/tooltip';

type SelectArgs = StoryContext<WebComponentsRenderer>['args'];

type SelectEvents = {
    'ts-change': unknown;
    'ts-input': unknown;
    'ts-focus': unknown;
    'ts-blur': unknown;
    'ts-clear': unknown;
    'ts-show': unknown;
    'ts-after-show': unknown;
    'ts-hide': unknown;
    'ts-after-hide': unknown;
};

const meta = {
    title: 'Components/Select',
    component: 'ts-select',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Select component allows users to choose one option from a list in a dropdown menu. It is commonly used in forms, filters, and settings where a predefined set of choices is required.',
            },
            story: {
                height: '200px',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: "The select's size.",
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        placeholder: {
            control: 'text',
            description: 'Hint text shown when the select is empty.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        multiple: {
            control: 'boolean',
            description: 'Allows more than one option to be selected.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        maxOptionsVisible: {
            control: 'number',
            description:
                'Max selected options to display when multiple=true. 0 removes the limit, showing all selected.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '3' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the select control.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        readonly: {
            control: 'boolean',
            description:
                'Makes the select readonly. The dropdown can still be opened and browsed, but no value can be selected. When `readonly` is true, `lock` defaults to `true` and a lock icon is shown. Set `lock=false` to suppress the icon.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        lock: {
            control: 'boolean',
            description:
                'Only effective when `readonly` is true. When `readonly` is true, `lock` defaults to `true` and displays a lock icon. Set to `false` to suppress the icon while keeping the readonly style. Has no effect when `readonly` is false.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        clearable: {
            control: 'boolean',
            description: 'Adds a clear button when the select is not empty.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        open: {
            control: 'boolean',
            description: 'Controls whether the menu is open.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        hoist: {
            control: 'boolean',
            description: 'Prevents clipping in scrollable containers by using a fixed positioning strategy.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        filled: {
            control: 'boolean',
            description: 'Draws a filled select.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        pill: {
            control: 'boolean',
            description: 'Draws a pill-style select with rounded edges.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        placement: {
            control: 'select',
            options: ['top', 'bottom'],
            description: 'Preferred placement of the menu; may adjust to stay in view.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'bottom' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Help text. Use the `help-text` slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        getTag: {
            control: false,
            description:
                'Custom tag renderer for multiple=true: (option, index) => TemplateResult | string | HTMLElement.',
            table: {
                type: { summary: '(option: TsOption, index: number) => TemplateResult | string | HTMLElement' },
                category: 'Properties',
            },
        },
        // Form category
        name: {
            control: 'text',
            description: 'The name of the select, submitted with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        value: {
            control: 'object',
            description:
                'Current value. String for single select; array when multiple=true. Attribute uses space-delimited values.',
            table: { type: { summary: 'string | string[]' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        defaultValue: {
            control: 'object',
            description: 'Default value for form resets. String or string[] when multiple=true.',
            table: { type: { summary: 'string | string[]' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description: 'Associate with a form by id when the control is outside a form (same document/shadow root).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Marks the control as required.',
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
            description: 'Gets the validity state object.',
        },
        validationMessage: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validation message.',
        },
        // Accessibility category
        label: {
            control: 'text',
            description: "The select's label. Use the `label` slot for HTML.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        ariaLabel: {
            control: 'text',
            description: 'The aria-label attribute provides an accessible name for the input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        helpTextVisuallyHidden: {
            control: 'boolean',
            description: 'Visually hides the help text but keeps it accessible to screen readers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Accessibility' },
        },
        labelVisuallyHidden: {
            control: 'boolean',
            description: 'Visually hides the label but keeps it accessible to screen readers.',
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
            description: 'Emitted when the clear button is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-show': {
            action: 'ts-show',
            description: 'Emitted when the dropdown opens.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-show': {
            action: 'ts-after-show',
            description: 'Emitted after the dropdown opens and animations complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-hide': {
            action: 'ts-hide',
            description: 'Emitted when the dropdown closes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-hide': {
            action: 'ts-after-hide',
            description: 'Emitted after the dropdown closes and animations complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        size: 'medium',
        helpText: '',
        placeholder: 'Choose an option',
        multiple: false,
        clearable: false,
        disabled: false,
        readonly: false,
        lock: true,
        required: false,
        placement: 'bottom',
        hoist: false,
        maxOptionsVisible: 3,
        open: false,
        filled: false,
        pill: false,
        name: '',
        value: '',
        defaultValue: '',
        form: '',
        getTag: undefined,
        error: false,
        errorMessage: '',
        label: 'Select',
        ariaLabel: '',
        helpTextVisuallyHidden: false,
        labelVisuallyHidden: false,
    },
    render: args => {
        const {
            label,
            helpText,
            placeholder,
            size,
            multiple,
            clearable,
            disabled,
            lock,
            required,
            placement,
            hoist,
            maxOptionsVisible,
            open,
            filled,
            pill,
            name,
            value,
            defaultValue,
            form,
            getTag,
        } = args;
        const readonly = args.readonly;
        return html`
            <ts-select
                .label=${label}
                label=${label || nothing}
                .helpText=${helpText}
                help-text=${helpText || nothing}
                .placeholder=${placeholder}
                placeholder=${placeholder || nothing}
                .size=${size}
                size=${size || nothing}
                .multiple=${multiple}
                ?multiple=${multiple}
                .clearable=${clearable}
                ?clearable=${clearable}
                .disabled=${disabled}
                ?disabled=${disabled}
                .readonly=${readonly}
                ?readonly=${readonly}
                .lock=${lock}
                ?lock=${lock}
                .required=${required}
                placement=${placement || nothing}
                .hoist=${hoist}
                ?hoist=${hoist}
                .maxOptionsVisible=${maxOptionsVisible}
                max-options-visible=${maxOptionsVisible ?? nothing}
                .open=${open}
                ?open=${open}
                .filled=${filled}
                ?filled=${filled}
                .pill=${pill}
                ?pill=${pill}
                .name=${name}
                name=${name || nothing}
                .value=${value}
                value=${Array.isArray(value) ? value.join(' ') : value || nothing}
                .defaultValue=${defaultValue}
                default-value=${Array.isArray(defaultValue) ? defaultValue.join(' ') : defaultValue || nothing}
                .form=${form}
                form=${form || nothing}
                .getTag=${getTag}
                .error=${args.error}
                ?error=${args.error}
                .errorMessage=${args.errorMessage}
                error-message=${args.errorMessage || nothing}
                aria-label=${args.ariaLabel || nothing}
                .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
                ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
                .labelVisuallyHidden=${args.labelVisuallyHidden}
                ?label-visually-hidden=${args.labelVisuallyHidden}
                style="height: 180px"
            >
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-select>
        `;
    },
} satisfies MetaWithLabel<TsSelect & SelectEvents>;

export default meta;
type Story = StoryObjWithLabel<TsSelect>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default select component.',
            },
        },
    },
    args: {
        label: 'Default Select',
        helpText: 'Choose from the available options',
    },
};

export const Multiple: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To allow multiple options to be selected, use the multiple attribute. It’s a good practice to use clearable when this option is enabled. To set multiple values at once, set value to a space-delimited list of values.',
            },
        },
    },
    render: () => {
        return html`
            <ts-select label="Select a Few" value="option-1 option-2 option-3" multiple clearable>
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
                <ts-option value="option-4">Option 4</ts-option>
                <ts-option value="option-5">Option 5</ts-option>
                <ts-option value="option-6">Option 6</ts-option>
            </ts-select>
        `;
    },
};

export const WithGroups: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use <ts-divider> to group listbox items visually. You can also use <small> to provide labels, but they won’t be announced by most assistive devices.',
            },
        },
    },
    render: args => {
        const { label, helpText, placeholder, clearable } = args;
        return html`
            <ts-select
                .label=${label}
                label=${label || nothing}
                .placeholder=${placeholder}
                placeholder=${placeholder || nothing}
                .helpText=${helpText}
                help-text=${helpText || nothing}
                .clearable=${clearable}
                ?clearable=${clearable}
            >
                <small>Section 1</small>
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-divider></ts-divider>
                <small>Section 2</small>
                <ts-option value="option-3">Option 3</ts-option>
                <ts-option value="option-4">Option 4</ts-option>
            </ts-select>
        `;
    },
    args: {
        label: 'Grouped Select',
        helpText: 'Options are organized in groups',
        clearable: true,
    },
};

export const PrefixAndSuffix: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the prefix and suffix slots to add presentational icons and text. Avoid slotting in interactive elements, such as buttons, links, etc.',
            },
        },
    },
    render: args => {
        const { label, helpText, placeholder, clearable } = args;
        return html`
            <ts-select
                .label=${label}
                label=${label || nothing}
                .placeholder=${placeholder}
                placeholder=${placeholder || nothing}
                .helpText=${helpText}
                help-text=${helpText || nothing}
                .clearable=${clearable}
                ?clearable=${clearable}
            >
                <ts-option value="option-1">
                    <ts-icon slot="prefix" src="/assets/svg/image.svg"></ts-icon>
                    Images
                </ts-option>

                <ts-option value="option-2">
                    <ts-icon slot="prefix" src="/assets/svg/settings.svg"></ts-icon>
                    Settings
                </ts-option>

                <ts-option value="option-3">
                    <ts-icon slot="prefix" src="/assets/svg/logout.svg"></ts-icon>
                    Logout
                </ts-option>
            </ts-select>
        `;
    },
    args: {
        label: 'Select with Icons',
        helpText: 'Options with prefix icons',
        clearable: true,
    },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` property to disable a select. A disabled select appears at reduced opacity and cannot be interacted with.',
            },
        },
    },
    render: args => {
        const { label, helpText, disabled } = args;
        return html`
            <ts-select
                .label=${label}
                label=${label || nothing}
                .helpText=${helpText}
                help-text=${helpText || nothing}
                .disabled=${disabled}
                ?disabled=${disabled}
            >
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2" disabled>Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-select>
        `;
    },
    args: {
        label: 'Disabled Select',
        disabled: true,
        helpText: 'This select is disabled',
    },
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `readonly` attribute to make a select readonly. It applies a locked visual style (gray background) without a lock icon. The dropdown can still be opened and browsed, but no value can be selected.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper--column">
            <ts-select label="Readonly Select" value="option-2" readonly lock=${false} style="height: 180px">
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-select>
        </div>
    `,
};

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `required` property to make a select required.',
            },
        },
    },
    args: {
        label: 'Required Select',
        required: true,
        helpText: 'This field is required',
    },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `size` property to change a select’s size. Note that size does not apply to listbox options.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper--column">
            <ts-select size="small" label="Small">
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-select>
            <ts-select size="medium" label="Medium">
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-select>
            <ts-select size="large" label="Large" style="height: 180px">
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-select>
        </div>
    `,
};

export const WithValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates required validation for the select on form submit.',
            },
        },
    },
    args: {
        label: 'Select an Option',
        required: true,
        helpText: 'Please select an option from the list.',
        error: false,
        errorMessage: '',
    },
    render: args => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();

                const form = e.currentTarget as HTMLFormElement;
                const select = form.querySelector('ts-select') as TsSelect;

                // Reset error state
                select.error = false;
                select.errorMessage = '';
                select.setCustomValidity('');

                const valid = select.checkValidity();

                if (!valid) {
                    select.error = true;
                    select.errorMessage = 'Please select an option.';
                    select.setCustomValidity('Please select an option.');
                }
            }}
        >
            <ts-select
                label=${args.label || nothing}
                help-text=${args.helpText || nothing}
                .required=${args.required}
                ?required=${args.required}
                .error=${args.error}
                ?error=${args.error}
                error-message=${args.errorMessage || nothing}
                style="height: 220px"
            >
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-select>

            <ts-button style="margin-top: 1rem" type="submit" variant="primary">Submit</ts-button>
        </form>
    `,
};

export const LabelWithIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label` attribute together with the `label-icon` slot to add an icon next to the label without any extra wrapper markup or inline styles. The layout (flexbox + gap) is handled automatically by the component.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <ts-select label="Country">
                <ts-tooltip content="Select your country of residence" slot="label-icon">
                    <ts-icon style="--icon-color: #1d4fd7">
                        <img src="/assets/svg/info.svg" alt="info" />
                    </ts-icon>
                </ts-tooltip>
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-select>
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
        label: 'Select an option',
        helpText: 'This help text is visually hidden but readable by screen readers.',
        helpTextVisuallyHidden: true,
    },
};

export const AriaLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `ariaLabel` property to provide an accessible name when no visible label is present.',
            },
        },
    },
    args: { label: '', ariaLabel: 'Choose an option', helpText: 'Select one of the available options' },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'select-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'Selected value changes', detail: 'void' },
                { event: 'ts-input', firedWhen: 'Control receives input', detail: 'void' },
                { event: 'ts-focus', firedWhen: 'Control gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'Control loses focus', detail: 'void' },
                { event: 'ts-clear', firedWhen: 'Clear button is clicked', detail: 'void' },
                { event: 'ts-show', firedWhen: 'Dropdown opens', detail: 'void' },
                { event: 'ts-after-show', firedWhen: 'Dropdown open animation completes', detail: 'void' },
                { event: 'ts-hide', firedWhen: 'Dropdown closes', detail: 'void' },
                { event: 'ts-after-hide', firedWhen: 'Dropdown close animation completes', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: SelectArgs) =>
                wrap(html`
                    <ts-select
                        label=${args.label || nothing}
                        size=${args.size || nothing}
                        ?clearable=${args.clearable}
                        ?multiple=${args.multiple}
                        style="height: 180px"
                        @ts-change=${(e: CustomEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: CustomEvent) => log('ts-input', e.detail)}
                        @ts-focus=${(e: CustomEvent) => log('ts-focus', e.detail)}
                        @ts-blur=${(e: CustomEvent) => log('ts-blur', e.detail)}
                        @ts-clear=${(e: CustomEvent) => log('ts-clear', e.detail)}
                        @ts-show=${(e: CustomEvent) => log('ts-show', e.detail)}
                        @ts-after-show=${(e: CustomEvent) => log('ts-after-show', e.detail)}
                        @ts-hide=${(e: CustomEvent) => log('ts-hide', e.detail)}
                        @ts-after-hide=${(e: CustomEvent) => log('ts-after-hide', e.detail)}
                    >
                        <ts-option value="option-1">Option 1</ts-option>
                        <ts-option value="option-2">Option 2</ts-option>
                        <ts-option value="option-3">Option 3</ts-option>
                    </ts-select>
                `),
        };
    })(),
};
