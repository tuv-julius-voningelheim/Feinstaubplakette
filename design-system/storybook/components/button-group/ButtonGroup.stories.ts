import { html, nothing } from 'lit';

import type { TsButtonGroup } from '@tuvsud/design-system/button-group';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/button-group';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';
import '@tuvsud/design-system/dropdown';
import '@tuvsud/design-system/tooltip';

const meta = {
    title: 'Components/ButtonGroup',
    component: 'ts-button-group',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Button Group is a set of related buttons displayed together in a horizontal or vertical layout. It allows users to select one or multiple options within a defined context.',
            },
        },
    },
    argTypes: {
        label: {
            control: 'text',
            description:
                "A label to use for the button group. This won't be displayed on the screen, but it will be announced by assistive devices when interacting with the control and is strongly recommended.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
    },
    args: {
        label: 'Button group',
    },
    render: args => html`
        <ts-button-group label=${args.label || nothing}>
            <ts-button variant="primary">Left</ts-button>
            <ts-button variant="primary">Center</ts-button>
            <ts-button variant="primary">Right</ts-button>
        </ts-button-group>
    `,
} satisfies MetaWithLabel<TsButtonGroup>;

export default meta;
type Story = StoryObjWithLabel<TsButtonGroup>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the button group contains three primary buttons labeled "Left," "Center," and "Right."',
            },
        },
    },
};

export const Variants: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Theme buttons are supported through the button’s `variant` property.',
            },
        },
    },
    render: () => html`
        <ts-button-group label="Alignment">
            <ts-button variant="primary">Left</ts-button>
            <ts-button variant="primary">Center</ts-button>
            <ts-button variant="primary">Right</ts-button>
        </ts-button-group>

        <br /><br />

        <ts-button-group label="Alignment">
            <ts-button variant="success">Left</ts-button>
            <ts-button variant="success">Center</ts-button>
            <ts-button variant="success">Right</ts-button>
        </ts-button-group>

        <br /><br />

        <ts-button-group label="Alignment">
            <ts-button variant="neutral">Left</ts-button>
            <ts-button variant="neutral">Center</ts-button>
            <ts-button variant="neutral">Right</ts-button>
        </ts-button-group>

        <br /><br />

        <ts-button-group label="Alignment">
            <ts-button variant="warning">Left</ts-button>
            <ts-button variant="warning">Center</ts-button>
            <ts-button variant="warning">Right</ts-button>
        </ts-button-group>

        <br /><br />

        <ts-button-group label="Alignment">
            <ts-button variant="danger">Left</ts-button>
            <ts-button variant="danger">Center</ts-button>
            <ts-button variant="danger">Right</ts-button>
        </ts-button-group>
    `,
};

export const Pill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Pill buttons are supported through the button’s `pill` property.',
            },
        },
    },
    render: () => html`
        <ts-button-group label="Alignment">
            <ts-button size="medium" variant="primary" pill>Left</ts-button>
            <ts-button size="medium" variant="primary" pill>Center</ts-button>
            <ts-button size="medium" variant="primary" pill>Center</ts-button>
            <ts-button size="medium" variant="primary" pill>Center</ts-button>
            <ts-button size="medium" variant="primary" pill>Right</ts-button>
        </ts-button-group>
    `,
};

export const SplitButtons: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Create a split button using a button and a dropdown. Use a visually hidden label to ensure the dropdown is accessible to users with assistive devices.',
            },
        },
    },
    render: () => html`
        <ts-button-group label="Example Button Group" style="height: 150px">
            <ts-button variant="primary">Save</ts-button>
            <ts-dropdown>
                <ts-button slot="trigger" variant="primary" caret></ts-button>
                <ts-menu>
                    <ts-menu-item>Save</ts-menu-item>
                    <ts-menu-item>Save as</ts-menu-item>
                    <ts-menu-item>Save all</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        </ts-button-group>
    `,
};

export const Tooltip: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Buttons can be wrapped in tooltips to provide more detail when the user interacts with them.',
            },
        },
    },
    render: () => html`
        <ts-button-group label="Alignment">
            <ts-tooltip content="I'm on the left">
                <ts-button variant="success">Left</ts-button>
            </ts-tooltip>
            <ts-tooltip content="I'm in the middle">
                <ts-button variant="success">Center</ts-button>
            </ts-tooltip>
            <ts-tooltip content="I'm on the right">
                <ts-button variant="success">Right</ts-button>
            </ts-tooltip>
        </ts-button-group>
    `,
};
