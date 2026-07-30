import { html, nothing } from 'lit';

import type { TsCalendarStatic } from '@tuvsud/design-system/calendar-static';
import type { StoryContext } from 'storybook/internal/types';

import type {
    TsCalendarStaticSelectEvent,
    TsDateApplyEvent,
    TsDateCancelEvent,
    TsDateChangeMonth,
    TsMonthChangeEvent,
    TsYearChangeEvent,
} from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/calendar-static';
import '@tuvsud/design-system/date-picker';

type CalendarStaticArgs = StoryContext<WebComponentsRenderer>['args'];

type CalendarStaticEvents = {
    'ts-date-select': unknown;
    'ts-date-apply': unknown;
    'ts-date-cancel': unknown;
    'ts-date-change-month': unknown;
    'ts-year-change': unknown;
    'ts-month-change': unknown;
};

const renderCalendar = (args: CalendarStaticArgs) => html`
    <ts-calendar-static
        locale=${args.locale || nothing}
        .value=${args.value || undefined}
        .focusedDate=${args.focusedDate || undefined}
        .minYear=${args.minYear}
        min-year=${args.minYear ?? nothing}
        .maxYear=${args.maxYear}
        max-year=${args.maxYear ?? nothing}
        ?utc=${args.utc}
        ?disable-past=${args.disablePast}
        ?disable-future=${args.disableFuture}
        .minDate=${args.minDate || undefined}
        .maxDate=${args.maxDate || undefined}
        ?disable-weekend=${args.disableWeekend}
        .disableDates=${args.disableDates || []}
        ?footer-action=${args.footerAction}
        .firstDayOfWeek=${args.firstDayOfWeek}
        first-day-of-week=${args.firstDayOfWeek ?? nothing}
    ></ts-calendar-static>
`;

const meta = {
    title: 'Components/Calendar Static',
    component: 'ts-calendar-static',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A standalone calendar component that allows users to select a single date. It includes OK/Cancel footer actions. The selection is only confirmed when the user clicks "OK".',
            },
        },
    },
    argTypes: {
        locale: {
            control: 'text',
            type: 'string',
            description:
                'BCP 47 locale tag used for month/day names and button labels. See (<a href="/?path=/docs/foundation-localization--docs" target="_top">Foundation/Localization</a>).',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'en' }, category: 'Properties' },
        },
        value: {
            control: 'text',
            type: 'string',
            description: 'The currently selected date in `YYYY-MM-DD` format.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        focusedDate: {
            control: 'text',
            type: 'string',
            description:
                'The month/year currently in view in `YYYY-MM-DD` format. If not set, defaults to the selected date or today.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        minYear: {
            control: 'number',
            type: 'number',
            description: 'Minimum selectable year in the year picker.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1900' }, category: 'Properties' },
        },
        maxYear: {
            control: 'number',
            type: 'number',
            description: 'Maximum selectable year in the year picker.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '2100' }, category: 'Properties' },
        },
        utc: {
            control: 'boolean',
            type: 'boolean',
            description: 'When `true`, dates are handled in UTC rather than the local timezone.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        disablePast: {
            control: 'boolean',
            type: 'boolean',
            description: 'Disables selection of past dates.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disableFuture: {
            control: 'boolean',
            type: 'boolean',
            description: 'Disables selection of future dates.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        minDate: {
            control: 'text',
            type: 'string',
            description: 'The minimum selectable date as a `YYYY-MM-DD` string.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        maxDate: {
            control: 'text',
            type: 'string',
            description: 'The maximum selectable date as a `YYYY-MM-DD` string.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        disableWeekend: {
            control: 'boolean',
            type: 'boolean',
            description: 'Disables selection of weekend dates (Saturday and Sunday).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disableDates: {
            control: 'object',
            description: 'An array of specific dates to disable, each in `YYYY-MM-DD` format.',
            table: { type: { summary: 'string[]' }, defaultValue: { summary: '[]' }, category: 'Properties' },
        },
        footerAction: {
            control: 'boolean',
            type: 'boolean',
            description: 'Shows OK/Cancel footer actions. When `true`, the selection is only confirmed on OK click.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        firstDayOfWeek: {
            control: 'select',
            options: [0, 1],
            type: { name: 'enum', value: [0, 1] },
            description: 'The first day of the week. `0` = Monday (default), `1` = Sunday.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        'ts-date-select': {
            action: 'ts-date-select',
            description: 'Emitted when a date is picked from the calendar.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-apply': {
            action: 'ts-date-apply',
            description: 'Emitted when the OK button is clicked (footer-action mode).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-cancel': {
            action: 'ts-date-cancel',
            description: 'Emitted when the Cancel button is clicked (footer-action mode).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-date-change-month': {
            action: 'ts-date-change-month',
            description: 'Emitted when the visible month changes.',
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
    },
    args: {
        locale: 'en',
        value: '',
        focusedDate: '',
        minYear: 1900,
        maxYear: 2100,
        utc: true,
        disablePast: false,
        disableFuture: false,
        minDate: '',
        maxDate: '',
        disableWeekend: false,
        disableDates: [],
        footerAction: true,
        firstDayOfWeek: 0,
    },
    render: args => renderCalendar(args),
} satisfies MetaWithLabel<TsCalendarStatic & CalendarStaticEvents>;

export default meta;
type Story = StoryObjWithLabel<TsCalendarStatic>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default calendar with no preset selection. Today is highlighted. Click a day to select it, then confirm with "OK" or revert with "Cancel".',
            },
        },
    },
};

export const PreselectedDate: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A calendar with a preselected date. The selected day is highlighted with a primary background.',
            },
        },
    },
    args: {
        value: '2026-03-15',
    },
};

export const Localization: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `locale` property to change month/day names and button labels. This example uses German (`de`).',
            },
        },
    },
    args: {
        locale: 'de',
        value: '2026-03-15',
    },
};

export const MinAndMaxDate: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `min-date` and `max-date` to restrict the selectable date range. Days outside the range are disabled.',
            },
        },
    },
    args: {
        minDate: '2026-03-05',
        maxDate: '2026-03-25',
        focusedDate: '2026-03-01',
    },
};

export const MinAndMaxYear: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `minYear` and `maxYear` to restrict the year picker range.',
            },
        },
    },
    args: {
        minYear: 2020,
        maxYear: 2030,
    },
};

export const FocusedMonth: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set `focused-date` to control which month/year is initially displayed without preselecting a date.',
            },
        },
    },
    args: {
        focusedDate: '2027-06-01',
    },
};

export const LocaleFrench: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Calendar with French locale (`fr`). Month names, weekday abbreviations, and button labels are localized.',
            },
        },
    },
    args: {
        locale: 'fr',
        value: '2026-07-14',
    },
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
                ${renderCalendar({ ...args, firstDayOfWeek: 0 })}
            </div>
            <div>
                <p style="margin-bottom: 0.5rem; font-weight: 600;">Sunday first</p>
                ${renderCalendar({ ...args, firstDayOfWeek: 1 })}
            </div>
        </div>
    `,
};

export const DisableWeekends: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `disable-weekend` to prevent selection of Saturdays and Sundays.',
            },
        },
    },
    args: {
        disableWeekend: true,
        value: '2026-03-16',
    },
};

export const DisableSpecificDates: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `disable-dates` to disable specific dates. Pass an array of dates in `YYYY-MM-DD` format.',
            },
        },
    },
    args: {
        disableDates: ['2026-03-10', '2026-03-15', '2026-03-20'],
        focusedDate: '2026-03-01',
    },
};

export const DisablePast: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `disable-past` to prevent selection of dates before today.',
            },
        },
    },
    args: {
        disablePast: true,
    },
};

export const DisableFuture: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `disable-future` to prevent selection of dates after today.',
            },
        },
    },
    args: {
        disableFuture: true,
    },
};

export const MinMaxDateString: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `min-date` and `max-date` properties with `YYYY-MM-DD` format strings to restrict the selectable range.',
            },
        },
    },
    args: {
        minDate: '2026-03-10',
        maxDate: '2026-03-25',
        focusedDate: '2026-03-01',
    },
};

export const UTCMode: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, `utc` is `true`. Set it to `false` to use local timezone instead of UTC.',
            },
        },
    },
    args: {
        utc: false,
        value: '2026-03-15',
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'calendar-static-event-log',
            entries: [
                {
                    event: 'ts-date-select',
                    firedWhen: 'A date is picked from the calendar',
                    detail: 'TsCalendarStaticSelectDetail',
                },
                {
                    event: 'ts-date-apply',
                    firedWhen: 'The OK button is clicked (footer-action mode)',
                    detail: 'TsDateApplyDetail',
                },
                {
                    event: 'ts-date-cancel',
                    firedWhen: 'The Cancel button is clicked (footer-action mode)',
                    detail: 'TsDateCancelDetail',
                },
                {
                    event: 'ts-date-change-month',
                    firedWhen: 'The visible month changes',
                    detail: 'TsDateChangeMonthDetail',
                },
                {
                    event: 'ts-year-change',
                    firedWhen: 'The user navigates to a different year',
                    detail: 'TsYearChangeDetail',
                },
                {
                    event: 'ts-month-change',
                    firedWhen: 'The user navigates to a different month',
                    detail: 'TsMonthChangeDetail',
                },
            ],
        });
        return {
            parameters,
            render: (args: CalendarStaticArgs) =>
                wrap(html`
                    <ts-calendar-static
                        locale=${args.locale || nothing}
                        .value=${args.value || undefined}
                        .focusedDate=${args.focusedDate || undefined}
                        .firstDayOfWeek=${args.firstDayOfWeek}
                        first-day-of-week=${args.firstDayOfWeek ?? nothing}
                        ?footer-action=${args.footerAction}
                        @ts-date-select=${(e: TsCalendarStaticSelectEvent) => log('ts-date-select', e.detail)}
                        @ts-date-apply=${(e: TsDateApplyEvent) => log('ts-date-apply', e.detail)}
                        @ts-date-cancel=${(e: TsDateCancelEvent) => log('ts-date-cancel', e.detail)}
                        @ts-date-change-month=${(e: TsDateChangeMonth) => log('ts-date-change-month', e.detail)}
                        @ts-year-change=${(e: TsYearChangeEvent) => log('ts-year-change', e.detail)}
                        @ts-month-change=${(e: TsMonthChangeEvent) => log('ts-month-change', e.detail)}
                    ></ts-calendar-static>
                `),
        };
    })(),
};
