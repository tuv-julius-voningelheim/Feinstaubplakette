import { html, nothing } from 'lit';

import type { TsRating } from '@tuvsud/design-system/rating';
import type { StoryContext } from 'storybook/internal/types';

import type { TsChangeEvent, TsHoverEvent } from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/rating';

type RatingArgs = StoryContext<WebComponentsRenderer>['args'];

type RatingEvents = {
    'ts-change': unknown;
    'ts-hover': unknown;
};

const meta = {
    title: 'Components/Rating',
    component: 'ts-rating',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Rating component allows users to provide feedback or express preferences using visual indicators such as stars, hearts, or emojis.',
            },
        },
    },
    argTypes: {
        // Properties category
        value: {
            control: { type: 'number', min: 0, max: 10, step: 0.5 },
            description: 'The current rating.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        max: {
            control: { type: 'number', min: 1, max: 10, step: 1 },
            description: 'The highest rating to show.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '5' }, category: 'Properties' },
        },
        precision: {
            control: { type: 'number', min: 0.1, max: 1, step: 0.1 },
            description: 'Increment/decrement precision (e.g., 0.5 for half steps).',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        readonly: {
            control: 'boolean',
            description: 'Makes the rating readonly.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the rating.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'A label that describes the rating to assistive devices.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-change': {
            action: 'ts-change',
            description: 'Emitted when the rating value changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-hover': {
            action: 'ts-hover',
            description:
                'Emitted when the user hovers over a rating symbol. The `phase` detail indicates the hover phase (`start`, `move`, `end`) and `value` is the hovered rating value.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        value: 3,
        max: 5,
        precision: 1,
        readonly: false,
        disabled: false,
        label: '',
    },
    render: args => html`
        <ts-rating
            label=${args.label || nothing}
            value=${args.value ?? nothing}
            max=${args.max ?? nothing}
            precision=${args.precision ?? nothing}
            .readonly=${args.readonly}
            ?readonly=${args.readonly}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
        >
            rating
        </ts-rating>
    `,
} satisfies MetaWithLabel<TsRating & RatingEvents>;

export default meta;
type Story = StoryObjWithLabel<TsRating>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default rating component.',
            },
        },
    },
};

export const Readonly: Story = {
    parameters: {
        docs: {
            description: {
                story: "Use the `readonly` property to display a rating that users can't change.",
            },
        },
    },
    args: { readonly: true },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disable` property to disable the rating.',
            },
        },
    },
    args: { disabled: true },
};

export const CustomMax: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `max` property to change the default count of the rating.',
            },
        },
    },
    args: { max: 10, value: 7 },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'rating-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'The rating value changes', detail: 'void' },
                {
                    event: 'ts-hover',
                    firedWhen: 'The user hovers over a rating symbol',
                    detail: 'TsHoverDetail',
                },
            ],
        });
        return {
            parameters,
            render: (args: RatingArgs) =>
                wrap(html`
                    <ts-rating
                        label=${args.label || nothing}
                        value=${args.value ?? nothing}
                        max=${args.max ?? nothing}
                        precision=${args.precision ?? nothing}
                        @ts-change=${(e: TsChangeEvent) => log('ts-change', e.detail)}
                        @ts-hover=${(e: TsHoverEvent) => log('ts-hover', e.detail)}
                    ></ts-rating>
                `),
        };
    })(),
};
