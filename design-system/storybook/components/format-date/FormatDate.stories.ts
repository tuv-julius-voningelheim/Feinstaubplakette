import { html, nothing } from 'lit';

import type { TsFormatDate } from '@tuvsud/design-system/format-date';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/format-date';

/**
 * this component is hidden in the storybook docs
 * because it still needs confirmation about the locale handling
 * */

const meta = {
    title: 'Components/Format Date',
    component: 'ts-format-date',
    tags: ['autodocs', 'hidden'],
    excludeStories: /.*/,
    parameters: {
        description: {
            component: 'Formats a date/time using the specified locale and options.',
        },
        docs: { disable: true },
    },
    argTypes: {
        date: {
            control: 'text',
            description: 'The date/time to format. Accepts any value parseable by the Date constructor.',
            table: { type: { summary: 'string' } },
        },
        weekday: {
            control: 'select',
            options: [undefined, 'narrow', 'short', 'long'],
            description: 'Format for the weekday.',
            table: { type: { summary: 'narrow | short | long' } },
        },
        era: {
            control: 'select',
            options: [undefined, 'narrow', 'short', 'long'],
            description: 'Format for the era.',
            table: { type: { summary: 'narrow | short | long' } },
        },
        year: {
            control: 'select',
            options: [undefined, 'numeric', '2-digit'],
            description: 'Format for the year.',
            table: { type: { summary: 'numeric | 2-digit' } },
        },
        month: {
            control: 'select',
            options: [undefined, 'numeric', '2-digit', 'narrow', 'short', 'long'],
            description: 'Format for the month.',
            table: { type: { summary: 'numeric | 2-digit | narrow | short | long' } },
        },
        day: {
            control: 'select',
            options: [undefined, 'numeric', '2-digit'],
            description: 'Format for the day.',
            table: { type: { summary: 'numeric | 2-digit' } },
        },
        hour: {
            control: 'select',
            options: [undefined, 'numeric', '2-digit'],
            description: 'Format for the hour.',
            table: { type: { summary: 'numeric | 2-digit' } },
        },
        minute: {
            control: 'select',
            options: [undefined, 'numeric', '2-digit'],
            description: 'Format for the minute.',
            table: { type: { summary: 'numeric | 2-digit' } },
        },
        second: {
            control: 'select',
            options: [undefined, 'numeric', '2-digit'],
            description: 'Format for the second.',
            table: { type: { summary: 'numeric | 2-digit' } },
        },
        timeZoneName: {
            control: 'select',
            options: [undefined, 'short', 'long'],
            description: 'Format for the time zone name.',
            table: { type: { summary: 'short | long' } },
        },
        timeZone: {
            control: 'text',
            description: 'The time zone to use (IANA time zone identifier).',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'UTC' } },
        },
        hourFormat: {
            control: 'select',
            options: ['auto', '12', '24'],
            description: 'The hour cycle to use.',
            table: { type: { summary: 'auto | 12 | 24' }, defaultValue: { summary: 'auto' } },
        },
    },
    args: {
        date: new Date().toISOString(),
        weekday: 'long',
        era: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        timeZone: 'UTC',
        hourFormat: 'auto',
    },
    render: args => html`
        <ts-format-date
            .date=${args.date}
            date=${args.date || nothing}
            .weekday=${args.weekday}
            weekday=${args.weekday || nothing}
            .era=${args.era}
            era=${args.era || nothing}
            .year=${args.year}
            year=${args.year || nothing}
            .month=${args.month}
            month=${args.month || nothing}
            .day=${args.day}
            day=${args.day || nothing}
            .hour=${args.hour}
            hour=${args.hour || nothing}
            .minute=${args.minute}
            minute=${args.minute || nothing}
            .second=${args.second}
            second=${args.second || nothing}
            .timeZoneName=${args.timeZoneName}
            time-zone-name=${args.timeZoneName || nothing}
            .timeZone=${args.timeZone}
            time-zone=${args.timeZone || nothing}
            .hourFormat=${args.hourFormat}
            hour-format=${args.hourFormat || nothing}
        ></ts-format-date>
    `,
} satisfies MetaWithLabel<TsFormatDate>;

export default meta;
type Story = StoryObjWithLabel<TsFormatDate>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the component formats the current date and time in UTC timezone with long weekday and month names, numeric year, day, hour, minute, and second, along with a short time zone name.',
            },
        },
    },
};
