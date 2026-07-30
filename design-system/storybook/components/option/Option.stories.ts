import { html, nothing } from 'lit';

import type { TsOption } from '@tuvsud/design-system/option';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/select';
import '@tuvsud/design-system/option';
import '@tuvsud/design-system/icon';

const meta = {
    title: 'Components/Option',
    component: 'ts-option',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Options specify the selectable entries contained within form controls, including select elements.',
            },
            story: {
                height: '200px',
            },
        },
    },
    argTypes: {
        // Properties category
        value: {
            control: 'text',
            description: 'The option value. String for single select; attribute uses space-delimited values.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the option.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
    },
    args: {
        disabled: true,
        value: 'option-1',
    },
    render: args => html`
        <ts-select label="Select an option">
            <ts-option value=${args.value || nothing}>Option 1</ts-option>
            <ts-option value="option-2" ?disabled=${args.disabled}>Option 2</ts-option>
            <ts-option value="option-3">Option 3</ts-option>
        </ts-select>
    `,
} satisfies MetaWithLabel<TsOption>;

export default meta;
type Story = StoryObjWithLabel<TsOption>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the option component is used within a select component to provide selectable options.',
            },
        },
    },
};

export const Prefix: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Options can include icons as prefixes to enhance visual identification.',
            },
        },
    },
    render: () => {
        return html`
            <ts-select label="Select one">
                <ts-option value="option-1">
                    <ts-icon slot="prefix" src="/assets/svg/image.svg"></ts-icon>
                    Images
                </ts-option>

                <ts-option value="option-2">
                    <ts-icon slot="prefix" src="/assets/svg/settings.svg"></ts-icon>
                    Settings
                </ts-option>

                <ts-option value="option-3">
                    <ts-icon slot="prefix" src="/assets/svg/logout.svg"></ts-icon>
                    Logout
                </ts-option>
            </ts-select>
        `;
    },
};

export const Suffix: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Options can also include icons as suffixes for additional context or actions.',
            },
        },
    },
    render: () => {
        return html`
            <ts-select label="Select one">
                <ts-option value="option-1">
                    Option 1
                    <ts-icon slot="suffix" library="system" name="check"></ts-icon>
                </ts-option>

                <ts-option value="option-2">
                    Option 2
                    <ts-icon slot="suffix" library="system" name="check"></ts-icon>
                </ts-option>

                <ts-option value="option-3">
                    Option 3
                    <ts-icon slot="suffix" library="system" name="check"></ts-icon>
                </ts-option>
            </ts-select>
        `;
    },
};
