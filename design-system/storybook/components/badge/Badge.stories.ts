import { html, nothing } from 'lit';

import type { TsBadge } from '@tuvsud/design-system/badge';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/badge';
import '@tuvsud/design-system/button';

const meta = {
    title: 'Components/Badge',
    component: 'ts-badge',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Badges help draw attention to key information, such as statuses, alerts, or item counts.',
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['neutral', 'primary', 'success', 'warning', 'danger'],
            description: 'Visual style of the badge, representing its semantic meaning.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'primary' },
                category: 'Properties',
            },
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
            description: 'Displays the badge style.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        pill: {
            control: 'boolean',
            description: 'Displays the badge with rounded, pill-shaped styling.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        pulse: {
            control: 'boolean',
            description: 'Enables a pulsing animation to draw attention.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
    },
    args: {
        variant: 'primary',
        size: 'medium',
        pill: false,
        pulse: false,
    },
    render: args => html`
        <ts-badge
            variant=${args.variant || nothing}
            size=${args.size || nothing}
            ?pill=${args.pill}
            ?pulse=${args.pulse}
        >
            Badge
        </ts-badge>
    `,
} satisfies MetaWithLabel<TsBadge>;

export default meta;
type Story = StoryObjWithLabel<TsBadge>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the badge is of `primary` variant.',
            },
        },
    },
};

export const Variants: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `variant` property to change the badge’s variant.',
            },
        },
    },
    args: { variant: 'success' },
    render: args => html`
        <ts-badge .variant=${'primary'} size=${args.size}>primary</ts-badge>
        <ts-badge .variant=${'success'} size=${args.size}>success</ts-badge>
        <ts-badge .variant=${'warning'} size=${args.size}>warning</ts-badge>
        <ts-badge .variant=${'danger'} size=${args.size}>danger</ts-badge>
        <ts-badge .variant=${'neutral'} size=${args.size}>neutral</ts-badge>
    `,
};

export const Pill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `pill` property to give badges rounded edges.',
            },
        },
    },
    args: { pill: true, pulse: true },
    render: args => html`
        <ts-badge .variant=${'primary'} size=${args.size} ?pill=${args.pill}>primary</ts-badge>
        <ts-badge .variant=${'success'} size=${args.size} ?pill=${args.pill}>success</ts-badge>
        <ts-badge .variant=${'warning'} size=${args.size} ?pill=${args.pill}>warning</ts-badge>
        <ts-badge .variant=${'danger'} size=${args.size} ?pill=${args.pill}>danger</ts-badge>
        <ts-badge .variant=${'neutral'} size=${args.size} ?pill=${args.pill}>neutral</ts-badge>
    `,
};

export const Pulse: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `pulse` property to draw attention to the badge with a subtle animation.',
            },
        },
    },
    args: { pill: true, pulse: true },
    render: args => html`
        <div style="display: flex; flex-direction: row;  align-items: center; gap: 25px">
            <ts-badge .variant=${'primary'} size=${args.size} ?pill=${args.pill} ?pulse=${args.pulse}>1</ts-badge>
            <ts-badge .variant=${'success'} size=${args.size} ?pill=${args.pill} ?pulse=${args.pulse}>1</ts-badge>
            <ts-badge .variant=${'warning'} size=${args.size} ?pill=${args.pill} ?pulse=${args.pulse}>1</ts-badge>
            <ts-badge .variant=${'danger'} size=${args.size} ?pill=${args.pill} ?pulse=${args.pulse}>1</ts-badge>
            <ts-badge .variant=${'neutral'} size=${args.size} ?pill=${args.pill} ?pulse=${args.pulse}>1</ts-badge>
        </div>
    `,
};

export const SizePill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `size` property to change the badge’s size. The small size is ideal for compact spaces, while medium and large sizes are better for more prominent displays.',
            },
        },
    },
    args: { pill: true, pulse: true },
    render: args => html`
        <div style="display: flex; flex-direction: column; gap: 20px">
            <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
                <ts-badge .variant=${'primary'} size="small" ?pill=${args.pill}>1</ts-badge>
                <ts-badge .variant=${'success'} size="small" ?pill=${args.pill}>2</ts-badge>
                <ts-badge .variant=${'neutral'} size="small" ?pill=${args.pill}>3</ts-badge>
                <ts-badge .variant=${'warning'} size="small" ?pill=${args.pill}>4</ts-badge>
                <ts-badge .variant=${'danger'} size="small" ?pill=${args.pill}>5</ts-badge>
                <ts-badge .variant=${'danger'} size="small" ?pill=${args.pill}>6</ts-badge>
                <ts-badge .variant=${'danger'} size="small" ?pill=${args.pill}>7</ts-badge>
                <ts-badge .variant=${'danger'} size="small" ?pill=${args.pill}>8</ts-badge>
                <ts-badge .variant=${'danger'} size="small" ?pill=${args.pill}>9</ts-badge>
                <ts-badge .variant=${'danger'} size="small" ?pill=${args.pill}>9+</ts-badge>
            </div>

            <div style="display: flex; flex-direction: row;  align-items: center; gap: 10px">
                <ts-badge .variant=${'primary'} size="medium" ?pill=${args.pill}>1</ts-badge>
                <ts-badge .variant=${'success'} size="medium" ?pill="${args.pill}">2</ts-badge>
                <ts-badge .variant=${'neutral'} size="medium" ?pill=${args.pill}>3</ts-badge>
                <ts-badge .variant=${'warning'} size="medium" ?pill=${args.pill}>4</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" ?pill=${args.pill}>5</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" ?pill=${args.pill}>6</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" ?pill=${args.pill}>7</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" ?pill=${args.pill}>8</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" ?pill=${args.pill}>9</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" ?pill=${args.pill}>9+</ts-badge>
            </div>

            <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
                <ts-badge .variant=${'primary'} size="large" ?pill=${args.pill}>1</ts-badge>
                <ts-badge .variant=${'success'} size="large" ?pill="${args.pill}">2</ts-badge>
                <ts-badge .variant=${'neutral'} size="large" ?pill=${args.pill}>3</ts-badge>
                <ts-badge .variant=${'warning'} size="large" ?pill=${args.pill}>4</ts-badge>
                <ts-badge .variant=${'danger'} size="large" ?pill=${args.pill}>5</ts-badge>
                <ts-badge .variant=${'danger'} size="large" ?pill=${args.pill}>6</ts-badge>
                <ts-badge .variant=${'danger'} size="large" ?pill=${args.pill}>7</ts-badge>
                <ts-badge .variant=${'danger'} size="large" ?pill=${args.pill}>8</ts-badge>
                <ts-badge .variant=${'danger'} size="large" ?pill=${args.pill}>9</ts-badge>
                <ts-badge .variant=${'danger'} size="large" ?pill=${args.pill}>9+</ts-badge>
            </div>
        </div>
    `,
};

export const Size: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `size` property to change the badge’s size. The small size is ideal for compact spaces, while medium and large sizes are better for more prominent displays.',
            },
        },
    },
    args: { pill: true, pulse: true },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 20px">
            <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
                <ts-badge .variant=${'primary'} size="small" >1</ts-badge>
                <ts-badge .variant=${'success'} size="small"">2</ts-badge>
                <ts-badge .variant=${'neutral'} size="small" >3</ts-badge>
                <ts-badge .variant=${'warning'} size="small" >4</ts-badge>
                <ts-badge .variant=${'danger'} size="small" }>5</ts-badge>
                <ts-badge .variant=${'danger'} size="small" >6</ts-badge>
                <ts-badge .variant=${'danger'} size="small" >7</ts-badge>
                <ts-badge .variant=${'danger'} size="small">8</ts-badge>
                <ts-badge .variant=${'danger'} size="small" >9</ts-badge>
                <ts-badge .variant=${'danger'} size="small" }>9+</ts-badge>
            </div>

            <div style="display: flex; flex-direction: row;  align-items: center; gap: 10px">
                <ts-badge .variant=${'primary'} size="medium" >1</ts-badge>
                <ts-badge .variant=${'success'} size="medium"">2</ts-badge>
                <ts-badge .variant=${'neutral'} size="medium">3</ts-badge>
                <ts-badge .variant=${'warning'} size="medium" >4</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" >5</ts-badge>
                <ts-badge .variant=${'danger'} size="medium">6</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" >7</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" >8</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" >9</ts-badge>
                <ts-badge .variant=${'danger'} size="medium" >9+</ts-badge>
            </div>

            <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
                <ts-badge .variant=${'primary'} size="large" >1</ts-badge>
                <ts-badge .variant=${'success'} size="large" ">2</ts-badge>
                <ts-badge .variant=${'neutral'} size="large" >3</ts-badge>
                <ts-badge .variant=${'warning'} size="large" >4</ts-badge>
                <ts-badge .variant=${'danger'} size="large" >5</ts-badge>
                <ts-badge .variant=${'danger'} size="large" >6</ts-badge>
                <ts-badge .variant=${'danger'} size="large" >7</ts-badge>
                <ts-badge .variant=${'danger'} size="large" >8</ts-badge>
                <ts-badge .variant=${'danger'} size="large" >9</ts-badge>
                <ts-badge .variant=${'danger'} size="large" >9+</ts-badge>
            </div>
        </div>
    `,
};

export const WithButton: Story = {
    parameters: {
        docs: {
            description: {
                story: 'One of the most common use cases for badges is attaching them to buttons. To make this easier, badges will be automatically positioned at the top-right when they’re a child of a button.',
            },
        },
    },
    render: args => html`
        <ts-button>
            Requests
            <ts-badge .variant=${args.variant} size=${args.size} ?pill=${args.pill} ?pulse=${args.pulse}>30</ts-badge>
        </ts-button>

        <ts-button style="margin-inline-start: 1rem;">
            Warnings
            <ts-badge .variant=${'warning'} size=${args.size} ?pill=${args.pill} ?pulse=${args.pulse}>8</ts-badge>
        </ts-button>

        <ts-button style="margin-inline-start: 1rem;">
            Errors
            <ts-badge .variant=${'danger'} size=${args.size} ?pill=${args.pill} ?pulse=${args.pulse}>6</ts-badge>
        </ts-button>
    `,
};
