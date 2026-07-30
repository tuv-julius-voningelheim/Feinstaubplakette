import { html, nothing } from 'lit';

import type { TsDatePicker } from '@tuvsud/design-system/date-picker';
import type { StoryContext } from 'storybook/internal/types';

import type {
    TsDateApplyEvent,
    TsDateCancelEvent,
    TsDateChangeEvent,
    TsDateChangeMonth,
    TsDateChangeYearEvent,
    TsDatePickerBlurEvent,
    TsDateSelectEvent,
    TsMonthChangeEvent,
    TsYearChangeEvent,
} from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { Meta } from '@storybook/web-components';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/date-picker';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/tooltip';

type DatePickerArgs = StoryContext<WebComponentsRenderer>['args'];

type DatePickerEvents = {
    'ts-date-change': unknown;
    'ts-date-select': unknown;
    'ts-blur': unknown;
    'ts-date-change-month': unknown;
    'ts-date-change-year': unknown;
    'ts-year-change': unknown;
    'ts-month-change': unknown;
    'ts-date-apply': unknown;
    'ts-date-cancel': unknown;
};

const renderDatePicker = (args: DatePickerArgs) => html`
    <ts-date-picker
        locale=${args.locale || nothing}
        value=${args.value || nothing}
        name=${args.name || nothing}
        label=${args.label || nothing}
        placeholder=${args.placeholder || nothing}
        size=${args.size || nothing}
        .disabled=${args.disabled}
        ?disabled=${args.disabled}
        .readonly=${args.readonly}
        ?readonly=${args.readonly}
        .lock=${args.lock}
        ?lock=${args.lock}
        .required=${args.required}
        ?required=${args.required}
        .autofocus=${args.autofocus}
        ?autofocus=${args.autofocus}
        .helpText=${args.helpText}
        help-text=${args.helpText || nothing}
        .clearable=${args.clearable}
        ?clearable=${args.clearable}
        .pill=${args.pill}
        ?pill=${args.pill}
        .filled=${args.filled}
        ?filled=${args.filled}
        .minYear=${args.minYear}
        min-year=${args.minYear ?? nothing}
        .maxYear=${args.maxYear}
        max-year=${args.maxYear ?? nothing}
        .disablePast=${args.disablePast}
        ?disable-past=${args.disablePast}
        .disableFuture=${args.disableFuture}
        ?disable-future=${args.disableFuture}
        .disableWeekend=${args.disableWeekend}
        ?disable-weekend=${args.disableWeekend}
        .disableDates=${args.disableDates}
        .minDate=${args.minDate}
        min-date=${args.minDate || nothing}
        .maxDate=${args.maxDate}
        max-date=${args.maxDate || nothing}
        .dateError=${args.dateError}
        ?date-error=${args.dateError}
        .dateErrorMessage=${args.dateErrorMessage}
        date-error-message=${args.dateErrorMessage || nothing}
        .labelVisuallyHidden=${args.labelVisuallyHidden}
        ?label-visually-hidden=${args.labelVisuallyHidden}
        .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
        ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
        aria-label=${args.ariaLabel || nothing}
        .footerAction=${args.footerAction}
        ?footer-action=${args.footerAction}
        .closeOnSelect=${args.closeOnSelect}
        ?close-on-select=${args.closeOnSelect}
        .firstDayOfWeek=${args.firstDayOfWeek}
        first-day-of-week=${args.firstDayOfWeek ?? nothing}
    ></ts-date-picker>
`;

const meta = {
    title: 'Components/Date Picker',
    component: 'ts-date-picker',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A Date Picker allows users to select a single date from a calendar interface. It simplifies date input and ensures consistency in formatting.',
            },
            story: {
                height: '450px',
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
            description: 'Visual size of the input.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text shown when no value is selected.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the input and prevents interaction.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        readonly: {
            control: 'boolean',
            description:
                'Makes the input read-only. When `readonly` is true, `lock` defaults to `true` and a lock icon is shown. Set `lock=false` to suppress the icon.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        lock: {
            control: 'boolean',
            description:
                'Only effective when `readonly` is true. When `readonly` is true, `lock` defaults to `true` and displays a lock icon. Set to `false` to suppress the icon while keeping the readonly style. Has no effect when `readonly` is false.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        autofocus: {
            control: 'boolean',
            description: 'Automatically focuses the input on load.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Helper text displayed below the input.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        clearable: {
            control: 'boolean',
            description: 'Shows a clear button to reset the selected date.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
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
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        minYear: {
            control: 'number',
            description: 'Minimum year selectable in the calendar.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1900' }, category: 'Properties' },
        },
        maxYear: {
            control: 'number',
            description: 'Maximum year selectable in the calendar.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '2100' }, category: 'Properties' },
        },
        disablePast: {
            control: 'boolean',
            description: 'Disables dates before today.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disableFuture: {
            control: 'boolean',
            description: 'Disables dates after today.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disableWeekend: {
            control: 'boolean',
            description: 'Disables Saturdays and Sundays.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disableDates: {
            control: 'object',
            description: 'List of specific dates to disable (e.g. ["2025-10-24"]).',
            table: { type: { summary: 'string[]' }, defaultValue: { summary: '[]' }, category: 'Properties' },
        },
        minDate: {
            control: 'text',
            description: 'Minimum selectable date (typically YYYY-MM-DD).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        maxDate: {
            control: 'text',
            description: 'Maximum selectable date (typically YYYY-MM-DD).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        footerAction: {
            control: 'boolean',
            description:
                'Shows OK/Cancel footer buttons. When true, the dropdown stays open until the user confirms with OK or reverts with Cancel.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        closeOnSelect: {
            control: 'boolean',
            description:
                'Closes the dropdown immediately when a date is selected. Only applies when `footer-action` is false. Default is true.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        firstDayOfWeek: {
            control: 'select',
            options: [0, 1],
            description: 'The first day of the week shown in the calendar. `0` = Monday (default), `1` = Sunday.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        // Form category
        value: {
            control: 'text',
            description: 'Selected date value (typically ISO string like YYYY-MM-DD).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        name: {
            control: 'text',
            description: 'Form field name attribute.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Marks the field as required for form validation.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        dateError: {
            control: 'boolean',
            description: 'Forces the component into an error state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        dateErrorMessage: {
            control: 'text',
            description: 'Error message shown when dateError is true.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'Visible label for the date picker.',
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
        ariaLabel: {
            control: 'text',
            description: 'Accessible name for the input when no visible label is provided.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-date-change': {
            action: 'ts-date-change',
            description: 'Emitted whenever the selected date changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-select': {
            action: 'ts-date-select',
            description: 'Emitted when a date is picked from the calendar.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the input loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-change-month': {
            action: 'ts-date-change-month',
            description: 'Emitted when the visible month changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-change-year': {
            action: 'ts-date-change-year',
            description: 'Emitted when the visible year changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-year-change': {
            action: 'ts-year-change',
            description: 'Emitted when the user navigates to a different year.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-month-change': {
            action: 'ts-month-change',
            description: 'Emitted when the user navigates to a different month.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-apply': {
            action: 'ts-date-apply',
            description: 'Emitted when the user confirms a selection (footer-action mode).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-cancel': {
            action: 'ts-date-cancel',
            description: 'Emitted when the user cancels a selection (footer-action mode).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        locale: 'en',
        value: '',
        name: 'date',
        label: 'Date',
        placeholder: '',
        size: 'medium',
        disabled: false,
        readonly: false,
        lock: true,
        required: false,
        autofocus: false,
        helpText: '',
        clearable: false,
        pill: false,
        filled: false,
        utc: true,
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
        ariaLabel: '',
        minYear: 1900,
        maxYear: 2100,
        footerAction: false,
        closeOnSelect: true,
        firstDayOfWeek: 0,
        disablePast: false,
        disableFuture: false,
        disableWeekend: false,
        disableDates: ['2025-10-25', '2025-10-24'],
        minDate: '',
        maxDate: '',
        dateError: false,
        dateErrorMessage: '',
    },
    render: args => renderDatePicker(args),
} satisfies Meta<TsDatePicker & DatePickerEvents>;

export default meta;
type Story = StoryObjWithLabel<TsDatePicker>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default date picker with no preset value.',
            },
        },
    },
};

export const Localization: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Defines the `locale` property used to format dates and labels.',
            },
        },
    },
    args: { locale: 'de' },
    render: args => renderDatePicker(args),
};

export const Placeholder: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `placeholder` property to define your own text. If no custom placeholder is provided, the component will display a default placeholder based on the date format for the current locale.',
            },
        },
    },
    args: { placeholder: 'Please select a date', locale: 'en-gb' },
    render: args => renderDatePicker(args),
};

export const DateValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `date-error` and `date-error-message` properties to display a static error state. This is useful when you need to control the error externally (e.g. from server-side validation).',
            },
        },
    },
    args: {
        value: '2025-02-28',
        locale: 'en-gb',
        dateError: true,
        dateErrorMessage: 'Please provide a valid date',
    },
    render: args => renderDatePicker(args),
};

export const RequiredValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `required` property to mark the date picker as required. When the form is submitted without a value, a validation error is displayed. The error clears automatically when the user starts typing.',
            },
        },
    },
    args: {
        label: 'Appointment date',
        required: true,
        helpText: 'Please select a date for your appointment',
    },
    render: args => html`
        <form
            novalidate
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const picker = form.querySelector('ts-date-picker') as TsDatePicker;

                if (!picker.value || picker.value.trim() === '') {
                    picker.dateError = true;
                    picker.dateErrorMessage = 'This field is required';
                } else {
                    picker.dateError = false;
                    picker.dateErrorMessage = '';
                    console.log('[submit]', picker.value);
                }
            }}
        >
            ${renderDatePicker(args)}
            <ts-button style="float: right; padding-top: 1rem" type="submit" variant="primary">Submit</ts-button>
        </form>
    `,
};

export const BlurValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The date picker validates the input automatically when the field loses focus (blur). If the entered text is not a valid date, an error is shown below the input. Type an invalid value such as `99/99/9999` and click outside to see the error.',
            },
        },
    },
    args: {
        label: 'Date of birth',
        locale: 'en',
        helpText: 'Enter your date of birth',
    },
    render: args => renderDatePicker(args),
};

export const HelpTextWithError: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When both `help-text` and an error are present, the error message takes precedence and replaces the help text. The dropdown positioning adjusts automatically so it does not overlap the error text.',
            },
        },
    },
    args: {
        helpText: 'Select your preferred date',
        dateError: true,
        dateErrorMessage: 'The selected date is not available',
        value: '2025-12-25',
    },
    render: args => renderDatePicker(args),
};

export const DisablePastValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When `disable-past` is enabled, selecting or typing a past date triggers a validation error on blur. Past dates are also visually disabled in the calendar.',
            },
        },
    },
    args: {
        disablePast: true,
        label: 'Future date only',
    },
    render: args => renderDatePicker(args),
};

export const MinMaxDateValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `min-date` and `max-date` to restrict the selectable date range. Dates outside the range are disabled in the calendar and trigger a validation error on blur.',
            },
        },
    },
    args: {
        minDate: '2025-03-01',
        maxDate: '2025-03-31',
        label: 'March 2025 only',
        helpText: 'Select a date in March 2025',
    },
    render: args => renderDatePicker(args),
};

export const Pill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `pill` property to true to render the input with a pill-shaped style.',
            },
        },
    },
    args: { pill: true },
    render: args => renderDatePicker(args),
};

export const Size: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The component supports three size options: small medium large. Use the size property to set the desired size.',
            },
        },
    },
    render: args => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${renderDatePicker({ ...args, size: 'small' })} ${renderDatePicker({ ...args, size: 'medium' })}
            ${renderDatePicker({ ...args, size: 'large' })}
        </div>
    `,
};

export const Clearable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Enable the `clearable` property to allow users to clear the selected date using a clear icon within the input field.',
            },
        },
    },
    args: { clearable: true, value: '2022-01-01' },
    render: args => renderDatePicker(args),
};

export const Disable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `disabled` property to true to make the input non-editable. When disabled, users cannot select or modify the date.',
            },
        },
    },
    args: { disabled: true },
    render: args => renderDatePicker(args),
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `readonly` attribute to make the date picker readonly. It applies a locked visual style (gray background) without a lock icon. The value remains visible and copyable but cannot be changed.',
            },
        },
    },
    args: { readonly: true, value: '12/25/2025' },
    render: args => renderDatePicker(args),
};

export const HelpText: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `help-Text` property to display additional guidance or information below the input field. This is useful for clarifying expected input or providing contextual hints.',
            },
        },
    },
    args: { helpText: 'Please provide a valid date' },
    render: args => renderDatePicker(args),
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
    render: args => renderDatePicker(args),
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
        <ts-date-picker label="Appointment Date">
            <ts-tooltip content="Pick your preferred appointment date" slot="label-icon">
                <ts-icon>
                    <img src="/assets/svg/info.svg" alt="info" />
                </ts-icon>
            </ts-tooltip>
        </ts-date-picker>
    `,
};

export const AriaLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `ariaLabel` property to provide an accessible name when no visible label is present.',
            },
        },
    },
    args: { label: undefined, ariaLabel: 'Select a date', helpText: 'Please select a date' },
    render: args => renderDatePicker(args),
};

export const DisablePastDate: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `disable-past-dates` property to true to prevent users from selecting dates that occur before the current day.',
            },
        },
    },
    args: { disablePast: true },
    render: args => renderDatePicker(args),
};

export const DisableFutureDate: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `disable-future-dates` property to true to prevent users from selecting dates that occur after the current day.',
            },
        },
    },
    args: { disableFuture: true },
    render: args => renderDatePicker(args),
};

export const MaxYear: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `max-year` property to set the maximum year that can be selected in the date picker.',
            },
        },
    },
    args: { maxYear: 2030 },
    render: args => renderDatePicker(args),
};

export const MinYear: Story = {
    parameters: {
        docs: {
            description: {
                story: '',
            },
        },
    },
    args: { minYear: 2010 },
    render: args => renderDatePicker(args),
};

export const DisableWeekend: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `disable-weekends` property to true to prevent users from selecting Saturdays and Sundays.',
            },
        },
    },
    args: { disableWeekend: true },
    render: args => renderDatePicker(args),
};

export const DisableSpecificDates: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled-dates` property to provide an array of dates that should be disabled. Users will not be able to select any date included in this array.',
            },
        },
    },
    args: {
        disableDates: ['2025-10-24', '2025-10-25', '2025-10-30'],
        value: '2025-10-22',
    },
    render: args => renderDatePicker(args),
};

export const DisableWeekendAndSpecificDates: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Combine the `disable-weekends` and `disabled-dates` properties to restrict date selection on weekends as well as specific dates you want to disable.',
            },
        },
    },
    args: {
        disableWeekend: true,
        disableDates: ['2025-10-29', '2025-10-27'],
    },
    render: args => renderDatePicker(args),
};

export const FooterAction: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `footer-action` property to true to show OK/Cancel footer buttons. The dropdown stays open until the user clicks OK (confirm) or Cancel (revert). Selecting a date previews it in the input, but only OK commits the value.',
            },
        },
    },
    args: { footerAction: true },
    render: args => renderDatePicker(args),
};

export const CloseOnSelectDisabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `close-on-select` property to false to keep the dropdown open after selecting a date. The user can click outside or use the calendar icon to close it. This is useful when combined with other interactions.',
            },
        },
    },
    args: { closeOnSelect: false },
    render: args => renderDatePicker(args),
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'dp-event-log',
            entries: [
                {
                    event: 'ts-date-change',
                    firedWhen: 'Selected date changes (typing or picking)',
                    detail: 'TsDateChangeDetail',
                },
                { event: 'ts-date-select', firedWhen: 'Date picked from the calendar', detail: 'TsDateSelectDetail' },
                { event: 'ts-blur', firedWhen: 'Input loses focus', detail: 'TsDatePickerBlurDetail' },
                {
                    event: 'ts-date-change-month',
                    firedWhen: 'Visible month changes in calendar',
                    detail: 'TsDateChangeMonthDetail',
                },
                {
                    event: 'ts-date-change-year',
                    firedWhen: 'Visible year changes in calendar',
                    detail: 'TsDateChangeYearDetail',
                },
                {
                    event: 'ts-year-change',
                    firedWhen: 'User navigates to a different year',
                    detail: 'TsYearChangeDetail',
                },
                {
                    event: 'ts-month-change',
                    firedWhen: 'User navigates to a different month',
                    detail: 'TsMonthChangeDetail',
                },
                {
                    event: 'ts-date-apply',
                    firedWhen: 'User confirms selection (footer-action mode)',
                    detail: 'TsDateApplyDetail',
                },
                {
                    event: 'ts-date-cancel',
                    firedWhen: 'User cancels selection (footer-action mode)',
                    detail: 'TsDateCancelDetail',
                },
            ],
        });
        return {
            parameters,
            render: (args: DatePickerArgs) =>
                wrap(html`
                    <ts-date-picker
                        locale=${args.locale || nothing}
                        label=${args.label || nothing}
                        size=${args.size || nothing}
                        .footerAction=${args.footerAction}
                        ?footer-action=${args.footerAction}
                        .closeOnSelect=${args.closeOnSelect}
                        ?close-on-select=${args.closeOnSelect}
                        .firstDayOfWeek=${args.firstDayOfWeek}
                        first-day-of-week=${args.firstDayOfWeek ?? nothing}
                        @ts-date-change=${(e: TsDateChangeEvent) => log('ts-date-change', e.detail)}
                        @ts-date-select=${(e: TsDateSelectEvent) => log('ts-date-select', e.detail)}
                        @ts-blur=${(e: TsDatePickerBlurEvent) => log('ts-blur', e.detail)}
                        @ts-date-change-month=${(e: TsDateChangeMonth) => log('ts-date-change-month', e.detail)}
                        @ts-date-change-year=${(e: TsDateChangeYearEvent) => log('ts-date-change-year', e.detail)}
                        @ts-year-change=${(e: TsYearChangeEvent) => log('ts-year-change', e.detail)}
                        @ts-month-change=${(e: TsMonthChangeEvent) => log('ts-month-change', e.detail)}
                        @ts-date-apply=${(e: TsDateApplyEvent) => log('ts-date-apply', e.detail)}
                        @ts-date-cancel=${(e: TsDateCancelEvent) => log('ts-date-cancel', e.detail)}
                    ></ts-date-picker>
                `),
        };
    })(),
};
