import { html, nothing } from 'lit';

import type { TsFormatNumber } from '@tuvsud/design-system/format-number';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/format-number';

/**
 * this component is hidden in the storybook docs
 * because it still needs confirmation about the locale handling
 * */

const meta = {
    title: 'Components/Format Number',
    component: 'ts-format-number',
    tags: ['autodocs', 'hidden'],
    excludeStories: /.*/,
    parameters: {
        description: {
            component: 'Formats a number using the specified locale and options.',
        },
        docs: { disable: true },
    },
    argTypes: {
        value: {
            control: { type: 'number' },
            description: 'The number to format.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '12345.678' } },
        },
        type: {
            control: 'select',
            options: ['currency', 'decimal', 'percent'],
            description: 'Formatting style.',
            table: { type: { summary: '"currency" | "decimal" | "percent"' }, defaultValue: { summary: '"currency"' } },
        },
        noGrouping: {
            control: 'boolean',
            description: 'Turn off grouping separators.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
        },
        currency: {
            control: 'text',
            description: 'ISO 4217 currency code (used when type=currency).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '"EUR"' } },
        },
        currencyDisplay: {
            control: 'select',
            options: ['symbol', 'narrowSymbol', 'code', 'name'],
            description: 'How to display the currency.',
            table: {
                type: { summary: '"symbol" | "narrowSymbol" | "code" | "name"' },
                defaultValue: { summary: '"symbol"' },
            },
        },
        minimumIntegerDigits: {
            control: { type: 'number', min: 1, max: 21, step: 1 },
            description: 'Minimum integer digits.',
            table: { type: { summary: 'number' } },
        },
        minimumFractionDigits: {
            control: { type: 'number', min: 0, max: 20, step: 1 },
            description: 'Minimum fraction digits.',
            table: { type: { summary: 'number' } },
        },
        maximumFractionDigits: {
            control: { type: 'number', min: 0, max: 20, step: 1 },
            description: 'Maximum fraction digits.',
            table: { type: { summary: 'number' } },
        },
        minimumSignificantDigits: {
            control: { type: 'number', min: 1, max: 21, step: 1 },
            description: 'Minimum significant digits.',
            table: { type: { summary: 'number' } },
        },
        maximumSignificantDigits: {
            control: { type: 'number', min: 1, max: 21, step: 1 },
            description: 'Maximum significant digits.',
            table: { type: { summary: 'number' } },
        },
    },
    args: {
        value: 12345.678,
        type: 'currency',
        noGrouping: false,
        currency: 'EUR',
        currencyDisplay: 'symbol',
        minimumIntegerDigits: undefined,
        minimumFractionDigits: undefined,
        maximumFractionDigits: undefined,
        minimumSignificantDigits: undefined,
        maximumSignificantDigits: undefined,
    },
    render: args => html`
        <ts-format-number
            .value=${Number(args.value)}
            value=${args.value ?? nothing}
            .type=${args.type}
            type=${args.type || nothing}
            .noGrouping=${args.noGrouping}
            ?no-grouping=${args.noGrouping}
            .currency=${args.currency}
            currency=${args.currency || nothing}
            .currencyDisplay=${args.currencyDisplay}
            currency-display=${args.currencyDisplay || nothing}
            .minimumIntegerDigits=${args.minimumIntegerDigits ?? undefined}
            minimum-integer-digits=${args.minimumIntegerDigits ?? nothing}
            .minimumFractionDigits=${args.minimumFractionDigits ?? undefined}
            minimum-fraction-digits=${args.minimumFractionDigits ?? nothing}
            .maximumFractionDigits=${args.maximumFractionDigits ?? undefined}
            maximum-fraction-digits=${args.maximumFractionDigits ?? nothing}
            .minimumSignificantDigits=${args.minimumSignificantDigits ?? undefined}
            minimum-significant-digits=${args.minimumSignificantDigits ?? nothing}
            .maximumSignificantDigits=${args.maximumSignificantDigits ?? undefined}
            maximum-significant-digits=${args.maximumSignificantDigits ?? nothing}
        ></ts-format-number>
    `,
} satisfies MetaWithLabel<TsFormatNumber>;

export default meta;
type Story = StoryObjWithLabel<TsFormatNumber>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the component formats the number as currency in the specified locale.',
            },
        },
    },
};
