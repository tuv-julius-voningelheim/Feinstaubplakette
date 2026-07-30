import { html, nothing } from 'lit';

import type { TsDateRange } from '@tuvsud/design-system/date-range';
import type { StoryContext } from 'storybook/internal/types';

import type {
    TsBlurEvent,
    TsDateRangeApplyEvent,
    TsDateRangeCancelEvent,
    TsDateRangeChangeEvent,
    TsNextMonthClickEvent,
    TsPrevMonthClickEvent,
    TsShortcutSelectEvent,
} from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/date-range';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

type DateRangeArgs = StoryContext<WebComponentsRenderer>['args'];

type DateRangeEvents = {
    'ts-date-change': unknown;
    'ts-date-apply': unknown;
    'ts-date-cancel': unknown;
    'ts-shortcut-select': unknown;
    'ts-prev-month-click': unknown;
    'ts-next-month-click': unknown;
    'ts-blur': unknown;
};

const renderRange = (args: DateRangeArgs) => html`
    <ts-date-range
        locale=${args.locale || nothing}
        value-start=${args.valueStart || nothing}
        value-end=${args.valueEnd || nothing}
        name-start=${args.nameStart || nothing}
        name-end=${args.nameEnd || nothing}
        label-start=${args.labelStart || nothing}
        label-end=${args.labelEnd || nothing}
        placeholder-start=${args.placeholderStart || nothing}
        placeholder-end=${args.placeholderEnd || nothing}
        size=${args.size || nothing}
        .disabled=${args.disabled}
        ?disabled=${args.disabled}
        .readonly=${args.readonly}
        ?readonly=${args.readonly}
        .lock=${args.lock}
        ?lock=${args.lock}
        .required=${args.required}
        ?required=${args.required}
        .helpText=${args.helpText}
        help-text=${args.helpText || nothing}
        .pill=${args.pill}
        ?pill=${args.pill}
        .filled=${args.filled}
        ?filled=${args.filled}
        .closeOnSelect=${args.closeOnSelect}
        ?close-on-select=${args.closeOnSelect}
        .inputsDirection=${args.inputsDirection}
        inputs-direction=${args.inputsDirection || nothing}
        .shortcuts=${args.shortcuts}
        error-message-start=${args.errorMessageStart || nothing}
        error-message-end=${args.errorMessageEnd || nothing}
        ?error-start=${args.errorStart}
        ?error-end=${args.errorEnd}
        .labelVisuallyHidden=${args.labelVisuallyHidden}
        ?label-visually-hidden=${args.labelVisuallyHidden}
        .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
        ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
        aria-label-start=${args.ariaLabelStart || nothing}
        aria-label-end=${args.ariaLabelEnd || nothing}
        .footerAction=${args.footerAction}
        ?footer-action=${args.footerAction}
        .firstDayOfWeek=${args.firstDayOfWeek}
        first-day-of-week=${args.firstDayOfWeek ?? nothing}
    ></ts-date-range>
`;

const meta = {
    title: 'Components/Date Range Picker',
    component: 'ts-date-range',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Date Range Picker allows users to select a start and end date within a calendar interface. It is commonly used for filtering data, booking periods, or scheduling events.',
            },
            story: {
                height: '500px',
            },
        },
    },
    argTypes: {
        // Properties category
        locale: {
            control: 'text',
            description:
                'Locale used for labels, month/day names, and formatting. See how dates are formatted for different locales (<a href="/?path=/docs/foundation-localization--docs" target="_top">Foundation/Localization</a>).',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'en' }, category: 'Properties' },
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Visual size of the inputs.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        placeholderStart: {
            control: 'text',
            description: 'Placeholder text for the start date input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        placeholderEnd: {
            control: 'text',
            description: 'Placeholder text for the end date input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables both inputs and prevents interaction.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        readonly: {
            control: 'boolean',
            description:
                'Makes both inputs read-only. When `readonly` is true, `lock` defaults to `true` and a lock icon is shown. Set `lock=false` to suppress the icon.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        lock: {
            control: 'boolean',
            description:
                'Only effective when `readonly` is true. When `readonly` is true, `lock` defaults to `true` and displays a lock icon. Set to `false` to suppress the icon while keeping the readonly style. Has no effect when `readonly` is false.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Helper text displayed below the inputs.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        pill: {
            control: 'boolean',
            description: 'Applies pill-shaped styling.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        filled: {
            control: 'boolean',
            description: 'Applies filled input styling variant.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        utc: {
            control: 'boolean',
            description: 'If false, interpret/emit dates in locale time instead of UTC. Default is true.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        inputsDirection: {
            control: 'inline-radio',
            options: ['horizontal', 'vertical'],
            description: 'Layout direction of the start/end inputs.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'horizontal' }, category: 'Properties' },
        },
        shortcuts: {
            control: 'object',
            description: 'Preset shortcuts shown in the picker (component-specific format).',
            table: { type: { summary: 'number[]' }, defaultValue: { summary: '[]' }, category: 'Properties' },
        },
        footerAction: {
            control: 'boolean',
            description: 'Shows OK/Cancel footer actions in the calendar. Selection is only confirmed on OK click.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        closeOnSelect: {
            control: 'boolean',
            description: 'Closes the calendar after selecting the end date.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        firstDayOfWeek: {
            control: 'select',
            options: [0, 1],
            description: 'The first day of the week shown in the calendar. `0` = Monday (default), `1` = Sunday.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        // Form category
        valueStart: {
            control: 'text',
            description: 'Start date value (typically ISO string like YYYY-MM-DD).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        valueEnd: {
            control: 'text',
            description: 'End date value (typically ISO string like YYYY-MM-DD).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        nameStart: {
            control: 'text',
            description: 'Form field name for the start date input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'date-start' }, category: 'Form' },
        },
        nameEnd: {
            control: 'text',
            description: 'Form field name for the end date input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'date-end' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Marks the range as required for form validation.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorStart: {
            control: 'boolean',
            description: 'Shows error state for the start date input.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorMessageStart: {
            control: 'text',
            description: 'Error message shown for the start date input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        errorEnd: {
            control: 'boolean',
            description: 'Shows error state for the end date input.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorMessageEnd: {
            control: 'text',
            description: 'Error message shown for the end date input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        // Accessibility category
        labelStart: {
            control: 'text',
            description: 'Visible label for the start date input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        labelEnd: {
            control: 'text',
            description: 'Visible label for the end date input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        labelVisuallyHidden: {
            control: 'boolean',
            description: 'Visually hides labels while keeping them accessible to screen readers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Accessibility' },
        },
        helpTextVisuallyHidden: {
            control: 'boolean',
            description: 'Visually hides the help text while keeping it accessible to screen readers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Accessibility' },
        },
        ariaLabelStart: {
            control: 'text',
            description: 'Accessible name for the start date input when no visible label is provided.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        ariaLabelEnd: {
            control: 'text',
            description: 'Accessible name for the end date input when no visible label is provided.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-date-change': {
            action: 'ts-date-change',
            description: 'Emitted whenever the start or end date changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-apply': {
            action: 'ts-date-apply',
            description: 'Emitted when the user confirms the selection (OK button or shortcut).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-cancel': {
            action: 'ts-date-cancel',
            description: 'Emitted when the user cancels the selection.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-shortcut-select': {
            action: 'ts-shortcut-select',
            description: 'Emitted when a date shortcut tag is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-prev-month-click': {
            action: 'ts-prev-month-click',
            description: 'Emitted when the previous month navigation button is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-next-month-click': {
            action: 'ts-next-month-click',
            description: 'Emitted when the next month navigation button is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the date range picker loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        locale: 'en',
        valueStart: '',
        valueEnd: '',
        nameStart: 'date-start',
        nameEnd: 'date-end',
        labelStart: '',
        labelEnd: '',
        placeholderStart: '',
        placeholderEnd: '',
        size: 'medium',
        disabled: false,
        readonly: false,
        lock: true,
        required: false,
        helpText: '',
        pill: false,
        filled: false,
        utc: false,
        closeOnSelect: true,
        footerAction: false,
        inputsDirection: 'horizontal',
        shortcuts: [],
        firstDayOfWeek: 0,
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
        ariaLabelStart: '',
        ariaLabelEnd: '',
        errorStart: false,
        errorMessageStart: '',
        errorEnd: false,
        errorMessageEnd: '',
    },
    render: args => renderRange(args),
} satisfies MetaWithLabel<TsDateRange & DateRangeEvents>;

export default meta;
type Story = StoryObjWithLabel<TsDateRange>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default date range picker with start and end date inputs.',
            },
        },
    },
};

export const Localization: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Defines the locale property used to format dates and labels.',
            },
        },
    },
    args: { locale: 'de' },
    render: args => renderRange(args),
};

export const Placeholder: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Sets `placeholder` text for both start and end date inputs.',
            },
        },
    },
    args: {
        placeholderStart: 'Select start date',
        placeholderEnd: 'Select end date',
        locale: 'en-gb',
        labelStart: 'Start',
        labelEnd: 'End',
    },
    render: args => renderRange(args),
};

export const ErrorMessage: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `error-start`, `error-message-start`, `error-end`, and `error-message-end` properties to display static error messages on the start and/or end inputs.',
            },
        },
    },
    args: {
        errorStart: true,
        errorMessageStart: 'Please provide valid dates',
        labelStart: 'Start',
        labelEnd: 'End',
    },
    render: args => renderRange(args),
};

export const ErrorOnBothInputs: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Both the start and end inputs can show error messages independently.',
            },
        },
    },
    args: {
        errorStart: true,
        errorMessageStart: 'Start date is required',
        errorEnd: true,
        errorMessageEnd: 'End date is required',
        labelStart: 'Check-in',
        labelEnd: 'Check-out',
    },
    render: args => renderRange(args),
};

export const RequiredValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `required` property to mark both range inputs as required. When the form is submitted without values, validation errors are displayed.',
            },
        },
    },
    args: {
        required: true,
        labelStart: 'Start date',
        labelEnd: 'End date',
        helpText: 'Please select a date range',
    },
    render: args => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const range = form.querySelector('ts-date-range') as TsDateRange;

                let hasError = false;

                if (!range.valueStart || range.valueStart.trim() === '') {
                    range.errorStart = true;
                    range.errorMessageStart = 'Start date is required';
                    hasError = true;
                } else {
                    range.errorStart = false;
                    range.errorMessageStart = '';
                }

                if (!range.valueEnd || range.valueEnd.trim() === '') {
                    range.errorEnd = true;
                    range.errorMessageEnd = 'End date is required';
                    hasError = true;
                } else {
                    range.errorEnd = false;
                    range.errorMessageEnd = '';
                }

                if (!hasError) {
                    console.log('[submit]', { start: range.valueStart, end: range.valueEnd });
                }
            }}
        >
            ${renderRange(args)}
            <ts-button style="float: right; padding-top: 1rem" variant="primary" type="submit">Submit</ts-button>
        </form>
    `,
};

export const BlurValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The date range picker validates each input automatically when the field loses focus (blur). Type an invalid value such as `99/99/9999` and click outside to see the error.',
            },
        },
    },
    args: {
        labelStart: 'Start date',
        labelEnd: 'End date',
        required: true,
    },
    render: args => renderRange(args),
};

export const HelpTextWithError: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When both `help-text` and an error are present, the error message takes precedence and replaces the help text.',
            },
        },
    },
    args: {
        helpText: 'Select your travel dates',
        errorStart: true,
        errorMessageStart: 'Departure date is not available',
        labelStart: 'Departure',
        labelEnd: 'Return',
        valueStart: '2025-12-25',
    },
    render: args => renderRange(args),
};

export const Pill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `pill` property to true to render the input with a pill-shaped style.',
            },
        },
    },
    args: { pill: true, labelStart: 'Start', labelEnd: 'End' },
    render: args => renderRange(args),
};

export const Size: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates the different `size` options for the date range picker inputs.',
            },
        },
    },
    render: args => html`
        <div style="display:flex;gap:1rem;flex-direction:column">
            ${renderRange({ ...args, size: 'small' })} ${renderRange({ ...args, size: 'medium' })}
            ${renderRange({ ...args, size: 'large' })}
        </div>
    `,
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Disables the date range picker, preventing user interaction.',
            },
        },
    },
    args: { disabled: true, labelStart: 'Start', labelEnd: 'End' },
    render: args => renderRange(args),
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `readonly` attribute to make the date range picker readonly. It applies a locked visual style (gray background) without a lock icon. Values remain visible and copyable but cannot be changed.',
            },
        },
    },
    args: { readonly: true, labelStart: 'Start', labelEnd: 'End', valueStart: '12/01/2025', valueEnd: '12/31/2025' },
    render: args => renderRange(args),
};

export const HelpText: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `help-Text` property to display additional guidance or information below the input field.',
            },
        },
    },
    args: { helpText: 'Please select valid dates', labelStart: 'Start', labelEnd: 'End' },
    render: args => renderRange(args),
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
        labelStart: 'Start',
        labelEnd: 'End',
    },
    render: args => renderRange(args),
};

export const LabelWithIconSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label-icon` slot to add an icon next to the start date label, `label-icon-end` slot for the end date label, or both. The layout is handled automatically by the component.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <div>
                <p style="margin: 0 0 0.5rem; font-weight: 600;">Start label icon only</p>
                <ts-date-range label-start="Start Date" label-end="End Date">
                    <ts-tooltip content="Select the start date of your booking" slot="label-icon">
                        <ts-icon>
                            <img src="/assets/svg/info.svg" alt="info" />
                        </ts-icon>
                    </ts-tooltip>
                </ts-date-range>
            </div>
            <div>
                <p style="margin: 0 0 0.5rem; font-weight: 600;">End label icon only</p>
                <ts-date-range label-start="Start Date" label-end="End Date">
                    <ts-tooltip content="Select the end date of your booking" slot="label-icon-end">
                        <ts-icon>
                            <img src="/assets/svg/info.svg" alt="info" />
                        </ts-icon>
                    </ts-tooltip>
                </ts-date-range>
            </div>
            <div>
                <p style="margin: 0 0 0.5rem; font-weight: 600;">Both labels with icons</p>
                <ts-date-range label-start="Start Date" label-end="End Date">
                    <ts-tooltip content="Select the start date of your booking" slot="label-icon">
                        <ts-icon>
                            <img src="/assets/svg/info.svg" alt="info" />
                        </ts-icon>
                    </ts-tooltip>
                    <ts-tooltip content="Select the end date of your booking" slot="label-icon-end">
                        <ts-icon>
                            <img src="/assets/svg/info.svg" alt="info" />
                        </ts-icon>
                    </ts-tooltip>
                </ts-date-range>
            </div>
        </div>
    `,
};

export const AriaLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `ariaLabelStart` and `ariaLabelEnd` to provide accessible names for the inputs when no visible labels are present.',
            },
        },
    },
    args: {
        labelStart: undefined,
        labelEnd: undefined,
        ariaLabelStart: 'Start date',
        ariaLabelEnd: 'End date',
        helpText: 'Please select a date range',
    },
    render: args => renderRange(args),
};

export const FirstDayOfWeek: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `first-day-of-week` property to control which day the calendar week starts on. Set `0` for Monday (default) or `1` for Sunday.',
            },
        },
    },
    render: args => html`
        <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
            <div>
                <p style="margin-bottom: 0.5rem; font-weight: 600;">Monday first (default)</p>
                ${renderRange({ ...args, firstDayOfWeek: 0, labelStart: 'Start', labelEnd: 'End' })}
            </div>
            <div>
                <p style="margin-bottom: 0.5rem; font-weight: 600;">Sunday first</p>
                ${renderRange({ ...args, firstDayOfWeek: 1, labelStart: 'Start', labelEnd: 'End' })}
            </div>
        </div>
    `,
};

export const DateShortcuts: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates preset date range shortcuts for quick selection.',
            },
        },
    },
    args: { shortcuts: [0, 1, 2, 3, 4, 5, 6], locale: 'de', labelStart: 'Start', labelEnd: 'End' },
    render: args => renderRange(args),
};

export const FooterActions: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `footer-action` to show OK/Cancel footer buttons. The selection is only confirmed when the user clicks OK.',
            },
        },
    },
    args: { labelStart: 'Start', labelEnd: 'End', locale: 'de-at', utc: false, footerAction: true },
    render: args => renderRange(args),
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'date-range-event-log',
            entries: [
                { event: 'ts-date-change', firedWhen: 'The start or end date changes', detail: 'TsDateRangeDetail' },
                {
                    event: 'ts-date-apply',
                    firedWhen: 'The user confirms the selection (OK or shortcut)',
                    detail: 'TsDateRangeDetail',
                },
                { event: 'ts-date-cancel', firedWhen: 'The user cancels the selection', detail: 'TsDateRangeDetail' },
                {
                    event: 'ts-shortcut-select',
                    firedWhen: 'A date shortcut is clicked',
                    detail: 'TsShortcutSelectDetail',
                },
                {
                    event: 'ts-prev-month-click',
                    firedWhen: 'Previous month button is clicked',
                    detail: 'TsMonthNavigationDetail',
                },
                {
                    event: 'ts-next-month-click',
                    firedWhen: 'Next month button is clicked',
                    detail: 'TsMonthNavigationDetail',
                },
                {
                    event: 'ts-blur',
                    firedWhen: 'The date range picker loses focus',
                    detail: 'void',
                },
            ],
        });
        return {
            parameters,
            render: (args: DateRangeArgs) =>
                wrap(html`
                    <ts-date-range
                        locale=${args.locale || nothing}
                        label-start=${args.labelStart || nothing}
                        label-end=${args.labelEnd || nothing}
                        .shortcuts=${args.shortcuts}
                        .footerAction=${args.footerAction}
                        ?footer-action=${args.footerAction}
                        .firstDayOfWeek=${args.firstDayOfWeek}
                        first-day-of-week=${args.firstDayOfWeek ?? nothing}
                        @ts-date-change=${(e: TsDateRangeChangeEvent) => log('ts-date-change', e.detail)}
                        @ts-date-apply=${(e: TsDateRangeApplyEvent) => log('ts-date-apply', e.detail)}
                        @ts-date-cancel=${(e: TsDateRangeCancelEvent) => log('ts-date-cancel', e.detail)}
                        @ts-shortcut-select=${(e: TsShortcutSelectEvent) => log('ts-shortcut-select', e.detail)}
                        @ts-prev-month-click=${(e: TsPrevMonthClickEvent) => log('ts-prev-month-click', e.detail)}
                        @ts-next-month-click=${(e: TsNextMonthClickEvent) => log('ts-next-month-click', e.detail)}
                        @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                    ></ts-date-range>
                `),
        };
    })(),
};
