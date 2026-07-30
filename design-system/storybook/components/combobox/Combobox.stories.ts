import { html, nothing } from 'lit';

import type { TsCombobox } from '@tuvsud/design-system/combobox';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/combobox';
import '@tuvsud/design-system/option';
import '@tuvsud/design-system/divider';
import '@tuvsud/design-system/icon';

type ComboboxArgs = StoryContext<WebComponentsRenderer>['args'];

type ComboboxEvents = {
    'ts-change': unknown;
    'ts-input': unknown;
    'ts-combobox-filter': unknown;
    'ts-combobox-select': unknown;
    'ts-focus': unknown;
    'ts-blur': unknown;
    'ts-clear': unknown;
    'ts-show': unknown;
    'ts-after-show': unknown;
    'ts-hide': unknown;
    'ts-after-hide': unknown;
};

const meta = {
    title: 'Components/Combobox',
    component: 'ts-combobox',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Combobox combines a text input with a filterable dropdown list. Users can type to narrow down the options or pick directly from the list. It is ideal for large option sets where free-text search improves usability.',
            },
            story: {
                height: '220px',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: "The combobox's size.",
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        placeholder: {
            control: 'text',
            description: 'Hint text shown when the combobox is empty.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the combobox control.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        readonly: {
            control: 'boolean',
            description:
                'Makes the combobox readonly. The dropdown can still be opened and browsed, but no value can be selected. When `readonly` is true, `lock` defaults to `true` and a lock icon is shown. Set `lock=false` to suppress the icon.',
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
            description: 'Adds a clear button when the combobox is not empty.',
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
            description: 'Draws a filled combobox.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        pill: {
            control: 'boolean',
            description: 'Draws a pill-style combobox with rounded edges.',
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
        noOptionsText: {
            control: 'text',
            description: 'Text shown when no options match the current filter query.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'No matching options' },
                category: 'Properties',
            },
        },
        loading: {
            control: 'boolean',
            description:
                'Puts the combobox in a loading state: shows a spinner in the input suffix and a loading indicator in the listbox when no options are present.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        loadingText: {
            control: 'text',
            description:
                'Text displayed next to the spinner in the listbox while `loading` is true. Defaults to the locale "Loading" string.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        // Form category
        name: {
            control: 'text',
            description: 'The name of the combobox, submitted with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        value: {
            control: 'text',
            description: 'The current value. Must match the `value` attribute of a `<ts-option>`.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        defaultValue: {
            control: 'text',
            description: 'Default value for form resets.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description: 'Associate with a form by id when the control is outside a form.',
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
            description: 'Error text shown below the input when `error` is true and text is provided.',
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
            description: "The combobox's label. Use the `label` slot for HTML.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        ariaLabel: {
            control: 'text',
            description: 'The aria-label attribute, used when no visible label is provided.',
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
            description: 'Emitted when the user types in the input field.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-combobox-filter': {
            action: 'ts-combobox-filter',
            description: 'Emitted when the filter query changes. Detail: `{ value: string }`.',
            table: { category: 'Events', type: { summary: 'CustomEvent<{ value: string }>' } },
        },
        'ts-combobox-select': {
            action: 'ts-combobox-select',
            description: 'Emitted when the user selects an option. Detail: `{ value: string; label: string }`.',
            table: { category: 'Events', type: { summary: 'CustomEvent<{ value: string; label: string }>' } },
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
        placeholder: 'Type to filter…',
        clearable: false,
        disabled: false,
        readonly: false,
        lock: true,
        required: false,
        placement: 'bottom',
        hoist: false,
        open: false,
        filled: false,
        pill: false,
        name: '',
        value: '',
        defaultValue: '',
        form: '',
        error: false,
        errorMessage: '',
        label: 'Combobox',
        ariaLabel: '',
        helpTextVisuallyHidden: false,
        labelVisuallyHidden: false,
        noOptionsText: 'No matching options',
        loading: false,
        loadingText: '',
    },
    render: (args: ComboboxArgs) => {
        const {
            label,
            helpText,
            placeholder,
            size,
            clearable,
            disabled,
            lock,
            required,
            placement,
            hoist,
            open,
            filled,
            pill,
            name,
            value,
            defaultValue,
            form,
            noOptionsText,
        } = args;
        const readonly = args.readonly;
        return html`
            <ts-combobox
                .label=${label}
                label=${label || nothing}
                .helpText=${helpText}
                help-text=${helpText || nothing}
                .placeholder=${placeholder}
                placeholder=${placeholder || nothing}
                .size=${size}
                size=${size || nothing}
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
                .open=${open}
                ?open=${open}
                .filled=${filled}
                ?filled=${filled}
                .pill=${pill}
                ?pill=${pill}
                .name=${name}
                name=${name || nothing}
                .value=${value}
                value=${value || nothing}
                .defaultValue=${defaultValue}
                default-value=${defaultValue || nothing}
                .form=${form}
                form=${form || nothing}
                .error=${args.error}
                ?error=${args.error}
                .errorMessage=${args.errorMessage}
                error-message=${args.errorMessage || nothing}
                aria-label=${args.ariaLabel || nothing}
                .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
                ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
                .labelVisuallyHidden=${args.labelVisuallyHidden}
                ?label-visually-hidden=${args.labelVisuallyHidden}
                .noOptionsText=${noOptionsText}
                no-options-text=${noOptionsText || nothing}
                .loading=${args.loading}
                ?loading=${args.loading}
                .loadingText=${args.loadingText}
                loading-text=${args.loadingText || nothing}
                style="height: 200px"
            >
                <ts-option value="apple">Apple</ts-option>
                <ts-option value="banana">Banana</ts-option>
                <ts-option value="cherry">Cherry</ts-option>
                <ts-option value="grape">Grape</ts-option>
                <ts-option value="mango">Mango</ts-option>
                <ts-option value="orange">Orange</ts-option>
                <ts-option value="pear">Pear</ts-option>
                <ts-option value="pineapple">Pineapple</ts-option>
                <ts-option value="strawberry">Strawberry</ts-option>
            </ts-combobox>
        `;
    },
} satisfies MetaWithLabel<TsCombobox & ComboboxEvents>;

export default meta;
type Story = StoryObjWithLabel<TsCombobox>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default combobox. Type to filter the available options.',
            },
        },
    },
    args: {
        label: 'Fruit',
        placeholder: 'Search fruits…',
        helpText: 'Start typing to filter the list.',
    },
};

export const WithClearButton: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Enable `clearable` to show a button that resets the selected value.',
            },
        },
    },
    args: {
        label: 'Fruit',
        clearable: true,
        value: 'banana',
    },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Disabled combobox is non-interactive.',
            },
        },
    },
    args: {
        label: 'Fruit',
        disabled: true,
        value: 'apple',
    },
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `readonly` attribute to make a combobox readonly. It applies a locked visual style (gray background) without a lock icon. The dropdown can still be opened and browsed, but no value can be selected.',
            },
        },
    },
    render: () => html`
        <ts-combobox label="Readonly Combobox" value="banana" readonly lock=${false} style="height: 220px">
            <ts-option value="apple">Apple</ts-option>
            <ts-option value="banana">Banana</ts-option>
            <ts-option value="cherry">Cherry</ts-option>
            <ts-option value="grape">Grape</ts-option>
            <ts-option value="mango">Mango</ts-option>
        </ts-combobox>
    `,
};

export const ErrorState: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `error` and `error-message` to display validation errors.',
            },
        },
    },
    args: {
        label: 'Fruit',
        error: true,
        errorMessage: 'Please select a valid option.',
    },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Comboboxes are available in three sizes: small, medium (default), and large.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem; height: 220px">
            <ts-combobox size="small" label="Small" placeholder="Search…">
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-combobox>
            <ts-combobox size="medium" label="Medium" placeholder="Search…">
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-combobox>
            <ts-combobox size="large" label="Large" placeholder="Search…">
                <ts-option value="option-1">Option 1</ts-option>
                <ts-option value="option-2">Option 2</ts-option>
                <ts-option value="option-3">Option 3</ts-option>
            </ts-combobox>
        </div>
    `,
};

export const WithGroups: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `<ts-divider>` and `<small>` to group and label options visually.',
            },
        },
    },
    render: () => html`
        <ts-combobox label="Country" placeholder="Search countries…" clearable style="height: 220px">
            <small>Europe</small>
            <ts-option value="de">
                <img src="/assets/flags/germany.png" width="16" alt="filter" />
                Germany
            </ts-option>
            <ts-option value="fr"> <img src="/assets/flags/france.png" width="16" alt="filter" /> France</ts-option>
            <ts-option value="es"> <img src="/assets/flags/spain.png" width="16" alt="filter" /> Spain</ts-option>
            <ts-divider></ts-divider>
            <small>Americas</small>
            <ts-option value="us">
                <img src="/assets/flags/united-states.png" width="16" alt="filter" /> United States</ts-option
            >
            <ts-option value="ca"> <img src="/assets/flags/canada.png" width="16" alt="filter" /> Canada</ts-option>
            <ts-option value="br"> <img src="/assets/flags/brazil.png" width="16" alt="filter" /> Brazil</ts-option>
            <ts-divider></ts-divider>
            <small>Asia</small>
            <ts-option value="jp"> <img src="/assets/flags/japan.png" width="16" alt="filter" /> Japan</ts-option>
            <ts-option value="cn"> <img src="/assets/flags/china.png" width="16" alt="filter" /> China</ts-option>
            <ts-option value="in"> <img src="/assets/flags/india.png" width="16" alt="filter" /> India</ts-option>
        </ts-combobox>
    `,
};

export const NoMatchingOptions: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When no options match the filter query, a customisable empty state is shown. Override the text with `no-options-text` or use the `no-options` slot for rich content.',
            },
        },
    },
    render: () => html`
        <ts-combobox
            label="Fruit"
            placeholder="Try typing 'xyz'…"
            no-options-text="No fruits match your search"
            style="height: 220px"
        >
            <ts-option value="apple">Apple</ts-option>
            <ts-option value="banana">Banana</ts-option>
            <ts-option value="cherry">Cherry</ts-option>
        </ts-combobox>
    `,
};

export const Pill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `pill` attribute for a pill-shaped combobox.',
            },
        },
    },
    args: {
        label: 'Fruit',
        pill: true,
        placeholder: 'Search…',
    },
};

export const AsyncRequests: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates server-side / async option loading using the `loading` and `loading-text` properties. Opening the dropdown sets `loading=true`, showing a spinner in the input suffix and a loading indicator in the listbox. Options populate after a simulated 1.5 s request. Close and reopen to repeat the fetch.',
            },
            story: { height: '300px' },
        },
    },
    render: () => {
        return html`
            <ts-combobox
                label="Fruit"
                placeholder="Open to load options…"
                loading-text="Fetching options…"
                clearable
                loading
                style="height: 220px"
            ></ts-combobox>
        `;
    },
};

export const EventsLogger: Story = {
    render: () => {
        const { log, wrap } = createEventLogger({
            id: 'combobox-events-log',
            description:
                'Interact with the combobox below to see all emitted custom events and their detail payloads logged in the panel.',
            entries: [
                { event: 'ts-change', firedWhen: 'Selected value changes', detail: '—' },
                { event: 'ts-input', firedWhen: 'User types in the input field', detail: '—' },
                {
                    event: 'ts-combobox-filter',
                    firedWhen: 'Filter query changes (use for server-side filtering)',
                    detail: '{ value: string }',
                },
                {
                    event: 'ts-combobox-select',
                    firedWhen: 'User clicks or keyboards an option',
                    detail: '{ value: string; label: string }',
                },
                { event: 'ts-focus', firedWhen: 'Control gains focus', detail: '—' },
                { event: 'ts-blur', firedWhen: 'Control loses focus', detail: '—' },
                { event: 'ts-clear', firedWhen: 'Clear button is clicked', detail: '—' },
                { event: 'ts-show', firedWhen: 'Dropdown starts opening', detail: '—' },
                { event: 'ts-after-show', firedWhen: 'Dropdown is fully open (animation complete)', detail: '—' },
                { event: 'ts-hide', firedWhen: 'Dropdown starts closing', detail: '—' },
                { event: 'ts-after-hide', firedWhen: 'Dropdown is fully closed (animation complete)', detail: '—' },
            ],
        });
        return wrap(html`
            <ts-combobox
                label="Fruit"
                placeholder="Search fruits…"
                clearable
                style="height: 220px"
                @ts-change=${(e: CustomEvent) => log('ts-change', e.detail)}
                @ts-input=${(e: CustomEvent) => log('ts-input', e.detail)}
                @ts-combobox-filter=${(e: CustomEvent) => log('ts-combobox-filter', e.detail)}
                @ts-combobox-select=${(e: CustomEvent) => log('ts-combobox-select', e.detail)}
                @ts-focus=${(e: CustomEvent) => log('ts-focus', e.detail)}
                @ts-blur=${(e: CustomEvent) => log('ts-blur', e.detail)}
                @ts-clear=${(e: CustomEvent) => log('ts-clear', e.detail)}
                @ts-show=${(e: CustomEvent) => log('ts-show', e.detail)}
                @ts-after-show=${(e: CustomEvent) => log('ts-after-show', e.detail)}
                @ts-hide=${(e: CustomEvent) => log('ts-hide', e.detail)}
                @ts-after-hide=${(e: CustomEvent) => log('ts-after-hide', e.detail)}
            >
                <ts-option value="apple">Apple</ts-option>
                <ts-option value="banana">Banana</ts-option>
                <ts-option value="cherry">Cherry</ts-option>
                <ts-option value="grape">Grape</ts-option>
                <ts-option value="mango">Mango</ts-option>
                <ts-option value="orange">Orange</ts-option>
                <ts-option value="pear">Pear</ts-option>
                <ts-option value="pineapple">Pineapple</ts-option>
                <ts-option value="strawberry">Strawberry</ts-option>
            </ts-combobox>
        `);
    },
};
