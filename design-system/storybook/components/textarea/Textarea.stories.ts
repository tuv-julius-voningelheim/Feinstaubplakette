import { html, nothing } from 'lit';

import type { TsTextarea } from '@tuvsud/design-system/textarea';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/textarea';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

type TextareaArgs = StoryContext<WebComponentsRenderer>['args'];

type TextareaEvents = {
    'ts-blur': unknown;
    'ts-change': unknown;
    'ts-focus': unknown;
    'ts-input': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Textarea',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Textareas provide a flexible, multi‑line input field that lets users express more detailed information with ease.',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Textarea size.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        filled: {
            control: 'boolean',
            description: 'Draws a filled textarea.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Help text; use slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        placeholder: {
            control: 'text',
            description: 'Hint text when empty.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        rows: {
            control: 'number',
            description: 'Default visible row count.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '4' }, category: 'Properties' },
        },
        resize: {
            control: 'select',
            options: ['none', 'vertical', 'auto'],
            description: 'Resize behavior.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'auto' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the textarea.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        readonly: {
            control: 'boolean',
            description:
                'Makes the textarea readonly. When `readonly` is true, `lock` defaults to `true` and a lock icon is shown. Set `lock=false` to suppress the icon.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        lock: {
            control: 'boolean',
            description:
                'Only effective when `readonly` is true. When `readonly` is true, `lock` defaults to `true` and displays a lock icon. Set to `false` to suppress the icon while keeping the readonly style. Has no effect when `readonly` is false.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        autocapitalize: {
            control: 'select',
            options: ['off', 'none', 'on', 'sentences', 'words', 'characters'],
            description: 'Automatic capitalization mode.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'off' }, category: 'Properties' },
        },
        autocorrect: {
            control: 'select',
            options: ['off', 'on'],
            description: 'Browser autocorrect setting.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'off' }, category: 'Properties' },
        },
        autocomplete: {
            control: 'text',
            description: 'Autocomplete hint (MDN keywords).',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'off' }, category: 'Properties' },
        },
        autofocus: {
            control: 'boolean',
            description: 'Focus on page load.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        enterkeyhint: {
            control: 'select',
            options: ['enter', 'done', 'go', 'next', 'previous', 'search', 'send', undefined],
            description: 'Virtual keyboard Enter key hint.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'undefined' }, category: 'Properties' },
        },
        spellcheck: {
            control: 'boolean',
            description: 'Enable spell checking.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        inputmode: {
            control: 'select',
            options: ['none', 'text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url'],
            description: 'Intended data type for virtual keyboards.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'text' }, category: 'Properties' },
        },
        // Form category
        name: {
            control: 'text',
            description: 'Name for form submission.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        value: {
            control: 'text',
            description: 'Current value of the textarea.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        defaultValue: {
            control: 'text',
            description: 'Default value for form resets.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description: 'ID of associated form element.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Marks the textarea as required.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        minlength: {
            control: 'number',
            description: 'Minimum input length.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Form' },
        },
        maxlength: {
            control: 'number',
            description: 'Maximum input length.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '200' }, category: 'Form' },
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
        // Accessibility category
        label: {
            control: 'text',
            description: 'Accessible label; use slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'Label' }, category: 'Accessibility' },
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
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the control loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-change': {
            action: 'ts-change',
            description: 'Emitted when an alteration to the value is committed.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-focus': {
            action: 'ts-focus',
            description: 'Emitted when the control gains focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-input': {
            action: 'ts-input',
            description: 'Emitted when the control receives input.',
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
        name: '',
        value: '',
        filled: false,
        label: 'Label',
        helpText: '',
        placeholder: 'Type something',
        rows: 4,
        resize: 'auto',
        disabled: false,
        readonly: false,
        lock: true,
        required: false,
        minlength: 0,
        maxlength: 200,
        autocapitalize: 'off',
        autocomplete: 'off',
        autofocus: false,
        enterkeyhint: undefined,
        spellcheck: false,
        inputmode: 'text',
        form: '',
        defaultValue: '',
        error: false,
        errorMessage: '',
        ariaLabel: '',
        helpTextVisuallyHidden: false,
        labelVisuallyHidden: false,
    },
    render: args => html`
        <ts-textarea
            name=${args.name || nothing}
            value=${args.value || nothing}
            size=${args.size || nothing}
            .filled=${args.filled}
            ?filled=${args.filled}
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            placeholder=${args.placeholder || nothing}
            rows=${args.rows ?? nothing}
            resize=${args.resize || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .readonly=${args.readonly}
            ?readonly=${args.readonly}
            .lock=${args.lock}
            ?lock=${args.lock}
            .required=${args.required}
            ?required=${args.required}
            minlength=${args.minlength ?? nothing}
            maxlength=${args.maxlength ?? nothing}
            autocapitalize=${args.autocapitalize || nothing}
            autocorrect=${args.autocorrect || nothing}
            autocomplete=${args.autocomplete || nothing}
            .autofocus=${args.autofocus}
            ?autofocus=${args.autofocus}
            enterkeyhint=${args.enterkeyhint || nothing}
            spellcheck=${String(args.spellcheck)}
            inputmode=${args.inputmode || nothing}
            form=${args.form || nothing}
            default-value=${args.defaultValue || nothing}
            .error=${args.error}
            ?error=${args.error}
            error-message=${args.errorMessage || nothing}
            aria-label=${args.ariaLabel || nothing}
            .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
            ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
            .labelVisuallyHidden=${args.labelVisuallyHidden}
            ?label-visually-hidden=${args.labelVisuallyHidden}
        ></ts-textarea>
    `,
} satisfies MetaWithLabel<TsTextarea & TextareaEvents>;

export default meta;
type Story = StoryObjWithLabel<TsTextarea>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the textarea is empty and ready for user input.',
            },
        },
    },
    args: {
        label: 'Comments',
        helpText: 'Please enter your comments',
        placeholder: 'Type your comments here',
    },
};

export const WithCharacterCount: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `maxlength` property to set a character limit and display a character counter.',
            },
        },
    },
    args: {
        label: 'Limited Input',
        maxlength: 100,
        helpText: 'Maximum 100 characters',
        value: 'This textarea has a character counter that appears when you start typing.',
    },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: '',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper--column">
            <ts-textarea size="small" label="Small"></ts-textarea>
            <ts-textarea size="medium" label="Medium"></ts-textarea>
            <ts-textarea size="large" label="Large"></ts-textarea>
        </div>
    `,
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` property to disable a textarea.',
            },
        },
    },
    args: {
        label: 'Disabled Textarea',
        disabled: true,
        value: 'This textarea is disabled and cannot be edited.',
        helpText: 'This field is disabled',
    },
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `readonly` attribute to make a textarea readonly. It applies a locked visual style (gray background) without a lock icon. The value remains focusable, selectable, and copyable.',
            },
        },
    },
    args: {
        label: 'Readonly Textarea',
        readonly: true,
        value: 'This textarea is readonly and cannot be edited, but you can still copy the text.',
        helpText: 'This field is readonly',
    },
};

export const NoResize: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `resize` property to `none` to prevent users from resizing the textarea.',
            },
        },
    },
    args: {
        label: 'Fixed Size Textarea',
        resize: 'none',
        helpText: 'This textarea cannot be resized',
        rows: 3,
    },
};

export const WithCustomHeight: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `rows` property to increase the height of the textarea.',
            },
        },
    },
    args: {
        label: 'Taller Textarea',
        rows: 8,
        helpText: 'This textarea has 8 rows',
        placeholder: 'This textarea is taller than the default',
    },
};

export const Required: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `required` property to make a textarea required. The form will not submit until the field is filled out.',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();

                const form = e.currentTarget as HTMLFormElement;
                const input = form.querySelector('ts-textarea') as TsTextarea;

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
            <ts-textarea
                label="Feedback"
                required
                minlength="1"
                maxlength="200"
                help-text="Please provide feedback"
            ></ts-textarea>
            <ts-button type="submit" variant="primary" style="margin-top: 1rem;">Submit</ts-button>
        </form>
    `,
};

export const WithValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: '',
            },
        },
    },
    render: () => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();

                const form = e.currentTarget as HTMLFormElement;
                const input = form.querySelector('ts-textarea') as TsTextarea;

                input.error = false;
                input.errorMessage = '';
                input.setCustomValidity('');

                const valid = input.checkValidity();

                if (!valid) {
                    input.error = true;
                    input.errorMessage = 'Enter at lease 20 characters.';
                }
            }}
        >
            <ts-textarea
                label="Feedback"
                required
                minlength="10"
                maxlength="200"
                help-text="Please provide feedback (20-200 characters)"
            ></ts-textarea>
            <ts-button type="submit" variant="primary" style="margin-top: 1rem;">Submit</ts-button>
        </form>
    `,
};

export const LabelWithIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label` slot to pass a custom label alongside an icon. When a `<label>` element is provided inside the slot, its `for` attribute is automatically set to point to the internal textarea — ensuring full accessibility even without an explicit `for` attribute.',
            },
        },
    },
    render: () => html`
        <ts-textarea placeholder="Enter your feedback">
            <div slot="label" style="display: flex; align-items: center; gap: 0.25rem;">
                <label>Feedback</label>
                <ts-icon name="info" size="16" library="system" style="display: flex;"></ts-icon>
            </div>
        </ts-textarea>
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
            <ts-textarea label="Comments" placeholder="Enter your comments">
                <ts-tooltip content="Add any additional comments here" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/info.svg" alt="info" />
                    </ts-icon>
                </ts-tooltip>
            </ts-textarea>

            <ts-textarea label="Description" placeholder="Enter description">
                <ts-tooltip content="Describe the issue in detail" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/drafts.svg" alt="info" />
                    </ts-icon>
                </ts-tooltip>
            </ts-textarea>
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
    args: {
        label: 'Taller Textarea',
        labelVisuallyHidden: true,
        placeholder: 'This textarea has hidden label',
    },
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
        label: 'Comments',
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
    args: {
        label: '',
        ariaLabel: 'Enter your comments',
        placeholder: 'Type your comments here',
        helpText: 'This field requires a comment',
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'textarea-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'Value is committed by the user', detail: 'void' },
                { event: 'ts-input', firedWhen: 'Control receives input', detail: 'void' },
                { event: 'ts-focus', firedWhen: 'Control gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'Control loses focus', detail: 'void' },
                { event: 'ts-invalid', firedWhen: "Constraints aren't satisfied", detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: TextareaArgs) =>
                wrap(html`
                    <ts-textarea
                        label=${args.label || nothing}
                        placeholder=${args.placeholder || nothing}
                        rows=${args.rows ?? nothing}
                        @ts-change=${(e: CustomEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: CustomEvent) => log('ts-input', e.detail)}
                        @ts-focus=${(e: CustomEvent) => log('ts-focus', e.detail)}
                        @ts-blur=${(e: CustomEvent) => log('ts-blur', e.detail)}
                        @ts-invalid=${(e: CustomEvent) => log('ts-invalid', e.detail)}
                    ></ts-textarea>
                `),
        };
    })(),
};
