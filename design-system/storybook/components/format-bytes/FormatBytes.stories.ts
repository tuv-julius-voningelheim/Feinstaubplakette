import { html, nothing } from 'lit';

import type { TsFormatBytes } from '@tuvsud/design-system/format-bytes';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/format-bytes';

const meta = {
    title: 'Components/Format Bytes',
    component: 'ts-format-bytes',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Converts a numeric value into a human‑readable byte format (e.g., KB, MB, GB).',
            },
        },
    },
    argTypes: {
        // Properties category
        value: {
            control: { type: 'number', min: 0, step: 1 },
            description: 'The number to format in bytes.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        unit: {
            control: 'select',
            options: ['byte', 'bit'],
            description: 'The unit to display.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'byte' }, category: 'Properties' },
        },
        display: {
            control: 'select',
            options: ['long', 'short', 'narrow'],
            description: 'How the result is displayed.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'short' }, category: 'Properties' },
        },
        lang: {
            control: 'select',
            description: 'Sets the language via the standard HTML lang attribute.',
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
        value: 0,
        unit: 'byte',
        display: 'short',
        lang: 'en',
    },
    render: args => html`
        <ts-format-bytes
            value=${args.value ?? nothing}
            unit=${args.unit || nothing}
            display=${args.display || nothing}
            lang=${args.lang || nothing}
        ></ts-format-bytes>
    `,
} satisfies MetaWithLabel<TsFormatBytes>;

export default meta;
type Story = StoryObjWithLabel<TsFormatBytes>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the component formats the number as bytes in short display format.',
            },
        },
    },
};

export const FormattingBytes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `value` property to a number to get the value in bytes.',
            },
        },
    },
    render: () => html`
        <ts-format-bytes value="12"></ts-format-bytes><br />
        <ts-format-bytes value="1200"></ts-format-bytes><br />
        <ts-format-bytes value="1200000"></ts-format-bytes><br />
        <ts-format-bytes value="1200000000"></ts-format-bytes>
    `,
};

export const FormattingBits: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To get the value in bits, set the `unit` property to bit',
            },
        },
    },
    render: () => html`
        <ts-format-bytes value="12" unit="bit"></ts-format-bytes><br />
        <ts-format-bytes value="1200" unit="bit"></ts-format-bytes><br />
        <ts-format-bytes value="1200000" unit="bit"></ts-format-bytes><br />
        <ts-format-bytes value="1200000000" unit="bit"></ts-format-bytes>
    `,
};

export const Localization: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `lang` property to set the number formatting locale.',
            },
        },
    },
    render: () => html`
        <ts-format-bytes value="12" lang="de"></ts-format-bytes><br />
        <ts-format-bytes value="1200" lang="de"></ts-format-bytes><br />
        <ts-format-bytes value="1200000" lang="de"></ts-format-bytes><br />
        <ts-format-bytes value="1200000000" lang="de"></ts-format-bytes>
    `,
};
