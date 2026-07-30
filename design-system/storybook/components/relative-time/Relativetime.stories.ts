import { html, nothing } from 'lit';

import type { TsRelativeTime } from '@tuvsud/design-system/relative-time';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/relative-time';

const meta = {
    title: 'Components/Relative Time',
    component: 'ts-relative-time',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Generates a human‑friendly, localized time phrase based on how the given date relates to the current moment.',
            },
        },
    },
    argTypes: {
        // Properties category
        date: {
            control: 'text',
            description: 'The date to calculate from. Prefer ISO 8601 strings.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'new Date().toISOString()' },
                category: 'Properties',
            },
        },
        format: {
            control: 'select',
            options: ['long', 'short', 'narrow'],
            description: 'Formatting style.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'long' }, category: 'Properties' },
        },
        numeric: {
            control: 'select',
            options: ['auto', 'always'],
            description: 'Use words like "yesterday" or numeric values.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'auto' }, category: 'Properties' },
        },
        sync: {
            control: 'boolean',
            description: 'Keeps the value updated as time passes.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        lang: {
            control: 'select',
            description: 'Sets the language via the standard HTML lang attribute (BCP-47).',
            options: [
                'en',
                'de',
                'fr',
                'es',
                'it',
                'pt',
                'nl',
                'pl',
                'ru',
                'tr',
                'ar',
                'he',
                'zh-CN',
                'zh-TW',
                'ja',
                'ko',
                'hi',
                'th',
            ],
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'en' }, category: 'Properties' },
        },
    },
    args: {
        date: new Date().toISOString(),
        format: 'long',
        numeric: 'auto',
        sync: false,
        lang: 'en',
    },
    render: args => {
        const { format, numeric, sync } = args;
        return html`
            <ts-relative-time
                .date=${args.date}
                date=${args.date || nothing}
                .format=${format}
                format=${format || nothing}
                .numeric=${numeric}
                numeric=${numeric || nothing}
                .sync=${sync}
                ?sync=${sync}
                .lang=${args.lang}
                lang=${args.lang || nothing}
            ></ts-relative-time>
        `;
    },
} satisfies MetaWithLabel<TsRelativeTime>;

export default meta;
type Story = StoryObjWithLabel<TsRelativeTime>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default relative time component.',
            },
        },
    },
};

export const FormattingStyles: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `sync` property to update the displayed value automatically as time passes.',
            },
        },
    },
    render: () => {
        return html`
            <ts-relative-time date="2020-07-15T09:17:00-04:00" format="narrow"></ts-relative-time><br />
            <ts-relative-time date="2020-07-15T09:17:00-04:00" format="short"></ts-relative-time><br />
            <ts-relative-time date="2020-07-15T09:17:00-04:00" format="long"></ts-relative-time>
        `;
    },
};

export const Localization: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `lang` property to set the desired locale.',
            },
        },
    },
    render: () => {
        return html`
            <ts-relative-time date="2020-07-15T09:17:00-04:00" lang="de"></ts-relative-time><br />
            <ts-relative-time date="2020-07-15T09:17:00-04:00" lang="en-US"></ts-relative-time><br />
        `;
    },
};
