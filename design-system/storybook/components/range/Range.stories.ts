import { html, nothing } from 'lit';

import type { TsRange } from '@tuvsud/design-system/range';
import type { StoryContext } from 'storybook/internal/types';

import type { TsBlurEvent, TsFocusEvent, TsRangeChangeEvent, TsRangeInputEvent } from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/range';
import '@tuvsud/design-system/button';

type RangeArgs = StoryContext<WebComponentsRenderer>['args'];

type RangeEvents = {
    'ts-change': unknown;
    'ts-input': unknown;
    'ts-focus': unknown;
    'ts-blur': unknown;
};

const meta = {
    title: 'Components/Range Slider',
    component: 'ts-range',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Ranges allow the user to select a single value within a given range using a slider.',
            },
        },
    },
    argTypes: {
        // Properties category
        disabled: {
            control: 'boolean',
            description: 'Disables the range.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        min: {
            control: 'number',
            description: 'Minimum acceptable value.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        max: {
            control: 'number',
            description: 'Maximum acceptable value.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '100' }, category: 'Properties' },
        },
        step: {
            control: 'number',
            description: 'Increment/decrement interval.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        tooltip: {
            control: 'select',
            options: ['top', 'bottom', 'none'],
            description: 'Preferred placement of the tooltip.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'top' },
                category: 'Properties',
            },
        },
        tooltipFormatter: {
            control: false,
            description: 'Function to format the tooltip value: (value: number) => string.',
            table: { type: { summary: '(value: number) => string' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Help text. Use the `help-text` slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        // Form category
        name: {
            control: 'text',
            description: 'The name of the range, submitted with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        value: {
            control: 'number',
            description: 'The current value as a number.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Form' },
        },
        defaultValue: {
            control: 'number',
            description: 'Default value for form resets.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description:
                'Associate with a form by id when outside a form (must be in the same document or shadow root).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
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
            description: "The range's label. Use the `label` slot for HTML.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        ariaLabel: {
            control: 'text',
            description:
                'The aria-label attribute provides an accessible name for the range when there is no visible label.',
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
    },
    args: {
        helpText: '',
        name: '',
        value: 50,
        label: 'Range Slider',
        disabled: false,
        min: 0,
        max: 100,
        step: 1,
        tooltip: 'top',
        tooltipFormatter: (v: number) => `${v}`,
        form: '',
        defaultValue: 50,
        error: false,
        errorMessage: '',
        ariaLabel: '',
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
    },
    render: args => html`
        <ts-range
            value=${args.value ?? nothing}
            min=${args.min ?? nothing}
            max=${args.max ?? nothing}
            step=${args.step ?? nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            tooltip=${args.tooltip || nothing}
            .tooltipFormatter=${args.tooltipFormatter}
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            name=${args.name || nothing}
            form=${args.form || nothing}
            default-value=${args.defaultValue ?? nothing}
            .error=${args.error}
            ?error=${args.error}
            error-message=${args.errorMessage || nothing}
            aria-label=${args.ariaLabel || nothing}
            .labelVisuallyHidden=${args.labelVisuallyHidden}
            ?label-visually-hidden=${args.labelVisuallyHidden}
            .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
            ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
        ></ts-range>
    `,
} satisfies MetaWithLabel<TsRange & RangeEvents>;

export default meta;
type Story = StoryObjWithLabel<TsRange>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the range slider allows selection between 0 and 100.',
            },
        },
    },
    args: { label: 'Default Range', helpText: 'Drag the slider to adjust the value' },
};

export const WithSteps: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the step attribute to define the increment between allowed values within the range. This ensures that users can only select values that align with the specified step size.',
            },
        },
    },
    args: { label: 'Step Range', min: 0, max: 100, step: 20, helpText: 'This slider moves in steps of 20' },
};

export const CustomMinMax: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the min and max attributes to set the range’s minimum and maximum values, respectively. The step attribute determines the value’s interval when increasing and decreasing.',
            },
        },
    },
    args: { label: 'Temperature', min: -20, max: 50, value: 25, helpText: 'Select temperature in Celsius' },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` attribute to disable the range slider. A disabled range appears at reduced opacity and cannot be interacted with.',
            },
        },
    },
    args: { label: 'Disabled Range', disabled: true, value: 70, helpText: 'This range slider is disabled' },
};

export const WithTooltipFormatter: Story = {
    parameters: {
        docs: {
            description: {
                story: `The \`tooltipFormatter\` property accepts a function \`(value: number) => string\` that lets you fully control what the tooltip displays. It is a **JavaScript property** (not an HTML attribute), so it must be set via \`.tooltipFormatter\`.

Some practical examples:
- **Percentage**: \`v => v + '%'\`
- **Currency**: \`v => '$' + v.toFixed(2)\`
- **Temperature**: \`v => v + ' °C'\`
- **Custom label**: \`v => v < 50 ? 'Low' : v < 80 ? 'Medium' : 'High'\``,
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <ts-range label="Percentage" value="40" .tooltipFormatter=${(v: number) => `${v}%`}></ts-range>

            <ts-range
                label="Currency"
                value="250"
                min="0"
                max="1000"
                step="10"
                .tooltipFormatter=${(v: number) => `$${v.toFixed(2)}`}
            ></ts-range>

            <ts-range
                label="Temperature"
                value="22"
                min="-20"
                max="50"
                .tooltipFormatter=${(v: number) => `${v} °C`}
            ></ts-range>

            <ts-range
                label="Level (custom label)"
                value="60"
                .tooltipFormatter=${(v: number) => (v < 34 ? 'Low' : v < 67 ? 'Medium' : 'High')}
            ></ts-range>
        </div>
    `,
};

export const WithoutTooltip: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To disable the tooltip, set tooltip to none.',
            },
        },
    },
    args: { label: 'No Tooltip', tooltip: 'none', helpText: 'This slider has no tooltip' },
};

export const CustomStyles: Story = {
    parameters: {
        docs: {
            description: {
                story: 'You can customize the active and inactive portions of the track using the `--track-color-active` and `--track-color-inactive` custom properties.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <ts-range
                label="Primary"
                value="50"
                style="--track-color-active: var(--ts-semantic-color-background-primary-default); 
                        --thumb-color: var(--ts-semantic-color-background-primary-default);
                        --thumb-color-hover: var(--ts-semantic-color-background-primary-hover);
                        --thumb-color-active: var(--ts-semantic-color-background-primary-active);
                        "
            ></ts-range>
            <ts-range
                label="Success"
                value="50"
                style="--track-color-active: var(--ts-semantic-color-background-success-default);
                --thumb-color: var(--ts-semantic-color-background-success-default);
                --thumb-color-hover: var(--ts-semantic-color-background-success-hover);
                --thumb-color-active: var(--ts-semantic-color-background-success-active);"
            ></ts-range>
            <ts-range
                label="Warning"
                value="50"
                style="--track-color-active: var(--ts-semantic-color-background-warning-default);
                --thumb-color: var(--ts-semantic-color-background-warning-default);
                --thumb-color-hover: var(--ts-semantic-color-background-warning-hover);
                --thumb-color-active: var(--ts-semantic-color-background-warning-active);"
            ></ts-range>
            <ts-range
                label="Danger"
                value="50"
                style="--track-color-active: var(--ts-semantic-color-background-danger-default);
                --thumb-color: var(--ts-semantic-color-background-danger-default);
                --thumb-color-hover: var(--ts-semantic-color-background-danger-hover);
                --thumb-color-active: var(--ts-semantic-color-background-danger-active);"
            ></ts-range>
        </div>
    `,
};

export const WithValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates validation for the range slider. In this example, the value must be at least 25.',
            },
        },
    },
    args: {
        label: 'Volume Level',
        helpText: 'Select a volume level of at least 25.',
        min: 0,
        max: 100,
        value: 10,
    },
    render: args => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();

                const form = e.currentTarget as HTMLFormElement;
                const range = form.querySelector('ts-range') as TsRange;

                range.error = false;
                range.errorMessage = '';
                range.setCustomValidity('');

                if (range.value < 25) {
                    range.error = true;
                    range.errorMessage = 'Volume must be at least 25.';
                    range.setCustomValidity('Volume must be at least 25.');
                }
            }}
        >
            <ts-range
                label=${args.label || nothing}
                help-text=${args.helpText || nothing}
                min=${args.min ?? nothing}
                max=${args.max ?? nothing}
                value=${args.value ?? nothing}
            ></ts-range>

            <ts-button style="float: right; padding-top: 1rem" type="submit" variant="primary">Submit</ts-button>
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

export const HelpTextHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `helpTextVisuallyHidden` property to visually hide the help text while keeping it accessible to screen readers.',
            },
        },
    },
    args: {
        label: 'Volume',
        helpText: 'This help text is visually hidden but readable by screen readers.',
        helpTextVisuallyHidden: true,
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'range-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'The value is committed by the user', detail: 'TsRangeChangeDetail' },
                {
                    event: 'ts-input',
                    firedWhen: 'The control receives input (while dragging)',
                    detail: 'TsRangeChangeDetail',
                },
                { event: 'ts-focus', firedWhen: 'The control gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'The control loses focus', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: RangeArgs) =>
                wrap(html`
                    <ts-range
                        label=${args.label || nothing}
                        help-text=${args.helpText || nothing}
                        min=${args.min ?? nothing}
                        max=${args.max ?? nothing}
                        value=${args.value ?? nothing}
                        @ts-change=${(e: TsRangeChangeEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: TsRangeInputEvent) => log('ts-input', e.detail)}
                        @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                        @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                    ></ts-range>
                `),
        };
    })(),
};
