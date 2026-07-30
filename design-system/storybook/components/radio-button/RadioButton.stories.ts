import { html } from 'lit';
import { nothing } from 'lit';

import type { TsRadioButton } from '@tuvsud/design-system/radio-button';
import type { StoryContext } from 'storybook/internal/types';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/radio';
import '@tuvsud/design-system/radio-button';
import '@tuvsud/design-system/radio-group';
import '@tuvsud/design-system/icon';

type RadioButtonArgs = StoryContext<WebComponentsRenderer>['args'];

type RadioButtonEvents = {
    'ts-blur': unknown;
    'ts-focus': unknown;
};

const meta = {
    title: 'Components/Radio Button',
    component: 'ts-radio-button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A radio button is the interactive UI element that lets users pick exactly one option from a group.',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Radio button size (group size overrides inside a group).',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'medium' },
                category: 'Properties',
            },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the radio button(s).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        pill: {
            control: 'boolean',
            description: 'Draws pill-style radio button(s) with rounded edges.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Form category
        value: {
            control: 'text',
            description: 'Selected value of the radio group.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'Label of the radio button.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the radio button loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-focus': {
            action: 'ts-focus',
            description: 'Emitted when the radio button gains focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        size: 'medium',
        value: '1',
        disabled: false,
        pill: false,
        label: '',
    },
    render: args => html`
        <ts-radio-group label="Select an option" name="a" value=${args.value || nothing}>
            <ts-radio-button
                size=${args.size || nothing}
                .disabled=${args.disabled}
                ?disabled=${args.disabled}
                .pill=${args.pill}
                ?pill=${args.pill}
                value="1"
                >Option 1</ts-radio-button
            >
            <ts-radio-button
                size=${args.size || nothing}
                .disabled=${args.disabled}
                ?disabled=${args.disabled}
                .pill=${args.pill}
                ?pill=${args.pill}
                value="2"
                >Option 2</ts-radio-button
            >
            <ts-radio-button
                size=${args.size || nothing}
                .disabled=${args.disabled}
                ?disabled=${args.disabled}
                .pill=${args.pill}
                ?pill=${args.pill}
                value="3"
                >Option 3</ts-radio-button
            >
        </ts-radio-group>
    `,
} satisfies MetaWithLabel<TsRadioButton & RadioButtonEvents>;

export default meta;
type Story = StoryObjWithLabel<TsRadioButton>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the radio button is unselected.',
            },
        },
    },
    args: { label: 'Default Radio' },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `size` property to change a radio button’s size.',
            },
        },
    },
    render: () => html`
        <ts-radio-group size="small" label="Select an option" name="a" value="1">
            <ts-radio-button value="1">Option 1</ts-radio-button>
            <ts-radio-button value="2">Option 2</ts-radio-button>
            <ts-radio-button value="3">Option 3</ts-radio-button>
        </ts-radio-group>

        <br />

        <ts-radio-group size="medium" label="Select an option" name="a" value="1">
            <ts-radio-button value="1">Option 1</ts-radio-button>
            <ts-radio-button value="2">Option 2</ts-radio-button>
            <ts-radio-button value="3">Option 3</ts-radio-button>
        </ts-radio-group>

        <br />

        <ts-radio-group size="large" label="Select an option" name="a" value="1">
            <ts-radio-button value="1">Option 1</ts-radio-button>
            <ts-radio-button value="2">Option 2</ts-radio-button>
            <ts-radio-button value="3">Option 3</ts-radio-button>
        </ts-radio-group>
    `,
};

export const PillButtons: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `pill` property to give radio buttons rounded edges.',
            },
        },
    },
    render: () => html`
        <ts-radio-group size="small" label="Select an option" name="a" value="1">
            <ts-radio-button pill value="1">Option 1</ts-radio-button>
            <ts-radio-button pill value="2">Option 2</ts-radio-button>
            <ts-radio-button pill value="3">Option 3</ts-radio-button>
        </ts-radio-group>

        <br />

        <ts-radio-group size="medium" label="Select an option" name="a" value="1">
            <ts-radio-button pill value="1">Option 1</ts-radio-button>
            <ts-radio-button pill value="2">Option 2</ts-radio-button>
            <ts-radio-button pill value="3">Option 3</ts-radio-button>
        </ts-radio-group>

        <br />

        <ts-radio-group size="large" label="Select an option" name="a" value="1">
            <ts-radio-button pill value="1">Option 1</ts-radio-button>
            <ts-radio-button pill value="2">Option 2</ts-radio-button>
            <ts-radio-button pill value="3">Option 3</ts-radio-button>
        </ts-radio-group>
    `,
};

export const PrefixAndSuffixIcons: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `prefix` and `suffix` slots to add icons.',
            },
        },
    },
    render: () => html`
        <ts-radio-group label="Select an option" name="a" value="1">
            <ts-radio-button value="1">
                <ts-icon slot="prefix" library="system" name="calendar_month"></ts-icon>
                Option 1
            </ts-radio-button>

            <ts-radio-button value="2">
                <ts-icon slot="suffix" library="system" name="upload"></ts-icon>
                Option 2
            </ts-radio-button>

            <ts-radio-button value="3">
                <ts-icon slot="prefix" library="system" name="mail"></ts-icon>
                <ts-icon slot="suffix" library="system" name="check"></ts-icon>
                Option 3
            </ts-radio-button>
        </ts-radio-group>
    `,
};

export const ButtonsWithIcons: Story = {
    name: 'Icon-Only Buttons',
    parameters: {
        docs: {
            description: {
                story: 'Omit button labels and use icons only. Always set a `label` attribute on each `<ts-icon>` so screen readers can announce each option correctly.',
            },
        },
    },
    render: () => html`
        <ts-radio-group label="Select a mood" name="mood" value="neutral">
            <ts-radio-button value="very-dissatisfied">
                <ts-icon src="/assets/svg/sentiment_very_dissatisfied.svg" label="Very dissatisfied"></ts-icon>
            </ts-radio-button>

            <ts-radio-button value="sad">
                <ts-icon src="/assets/svg/sentiment_dissatisfied.svg" label="Sad"></ts-icon>
            </ts-radio-button>

            <ts-radio-button value="neutral">
                <ts-icon src="/assets/svg/sentiment_neutral.svg" label="Neutral"></ts-icon>
            </ts-radio-button>

            <ts-radio-button value="happy">
                <ts-icon src="/assets/svg/sentiment_satisfied.svg" label="Happy"></ts-icon>
            </ts-radio-button>

            <ts-radio-button value="very-happy">
                <ts-icon src="/assets/svg/sentiment_very_satisfied.svg" label="Very happy"></ts-icon>
            </ts-radio-button>
        </ts-radio-group>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'radio-button-event-log',
            entries: [
                { event: 'ts-focus', firedWhen: 'The radio button gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'The radio button loses focus', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: RadioButtonArgs) =>
                wrap(html`
                    <ts-radio-group label="Select an option" name="rb-events" value="1">
                        <ts-radio-button
                            value="1"
                            .size=${args.size}
                            size=${args.size}
                            @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                            @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                            >Option 1</ts-radio-button
                        >
                        <ts-radio-button
                            value="2"
                            .size=${args.size}
                            size=${args.size}
                            @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                            @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                            >Option 2</ts-radio-button
                        >
                        <ts-radio-button
                            value="3"
                            .size=${args.size}
                            size=${args.size}
                            @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                            @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                            >Option 3</ts-radio-button
                        >
                    </ts-radio-group>
                `),
        };
    })(),
};
