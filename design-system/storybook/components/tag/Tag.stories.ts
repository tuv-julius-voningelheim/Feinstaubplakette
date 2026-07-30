import { html, nothing } from 'lit';

import type { TsTag } from '@tuvsud/design-system/tag';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/tag';
import '@tuvsud/design-system/icon';

type TagArgs = StoryContext<WebComponentsRenderer>['args'];

type TagEvents = {
    'ts-remove': unknown;
};

const meta = {
    title: 'Components/Tag',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Tag is a compact UI element used to categorize, label, or organize content. Tags can be interactive (removable) or static, and they help users quickly identify attributes or groupings.',
            },
        },
    },
    argTypes: {
        // Properties category
        variant: {
            control: 'select',
            options: ['neutral', 'primary', 'success', 'warning', 'danger'],
            description: "The tag's theme variant.",
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'neutral' }, category: 'Properties' },
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: "The tag's size.",
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        pill: {
            control: 'boolean',
            description: 'Draws a pill-style tag with rounded edges.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        removable: {
            control: 'boolean',
            description: 'Makes the tag removable and shows a remove button.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        hasBorder: {
            control: 'boolean',
            description: 'Controls whether the tag has a border.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        // Events category
        'ts-remove': {
            action: 'ts-remove',
            description: 'Emitted when the remove button is activated.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        variant: 'neutral',
        size: 'medium',
        pill: false,
        removable: false,
        hasBorder: true,
    },
    render: args => {
        const { variant, size, pill, removable, hasBorder } = args;
        return html`
            <ts-tag
                variant=${variant || nothing}
                size=${size || nothing}
                ?pill=${pill}
                ?removable=${removable}
                .hasBorder=${hasBorder}
            >
                Tag
            </ts-tag>
        `;
    },
} satisfies MetaWithLabel<TsTag & TagEvents>;

export default meta;
type Story = StoryObjWithLabel<TsTag>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default tag component.',
            },
        },
    },
};

export const Variants: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Different variant styles of the tag component.',
            },
        },
    },
    render: () => {
        return html`
            <div class="sb-story-wrapper">
                <ts-tag variant="neutral">Neutral</ts-tag>
                <ts-tag variant="primary">Primary</ts-tag>
                <ts-tag variant="success">Success</ts-tag>
                <ts-tag variant="warning">Warning</ts-tag>
                <ts-tag variant="danger">Danger</ts-tag>
            </div>
        `;
    },
};

export const Size: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the size property to change a tags size.',
            },
        },
    },
    render: () => {
        return html`
            <div class="sb-story-wrapper--column">
                <div class="sb-story-wrapper">
                    <ts-tag size="small">Small</ts-tag>
                    <ts-tag size="small" variant="primary">Small</ts-tag>
                    <ts-tag size="small" variant="success">Small</ts-tag>
                    <ts-tag size="small" variant="warning">Small</ts-tag>
                    <ts-tag size="small" variant="danger">Small</ts-tag>
                </div>

                <div class="sb-story-wrapper">
                    <ts-tag size="medium">Medium</ts-tag>
                    <ts-tag size="medium" variant="primary">Medium</ts-tag>
                    <ts-tag size="medium" variant="success">Medium</ts-tag>
                    <ts-tag size="medium" variant="warning">Medium</ts-tag>
                    <ts-tag size="medium" variant="danger">Medium</ts-tag>
                </div>

                <div class="sb-story-wrapper">
                    <ts-tag size="large">Large</ts-tag>
                    <ts-tag size="large" variant="primary">Large</ts-tag>
                    <ts-tag size="large" variant="success">Large</ts-tag>
                    <ts-tag size="large" variant="warning">Large</ts-tag>
                    <ts-tag size="large" variant="danger">Large</ts-tag>
                </div>
            </div>
        `;
    },
};

export const Pill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `pill` property to give tags rounded edges.',
            },
        },
    },
    render: () => {
        return html`
            <div class="sb-story-wrapper">
                <ts-tag size="medium" pill>Neutral</ts-tag>
                <ts-tag size="medium" variant="primary" pill>Primary</ts-tag>
                <ts-tag size="medium" variant="success" pill>Success</ts-tag>
                <ts-tag size="medium" variant="warning" pill>Warning</ts-tag>
                <ts-tag size="medium" variant="danger" pill>Danger</ts-tag>
            </div>
        `;
    },
};

export const Removable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `removable` property to add a remove button to the tag.',
            },
        },
    },
    render: () => {
        return html`
            <div class="sb-story-wrapper">
                <ts-tag size="medium" removable>Neutral</ts-tag>
                <ts-tag size="medium" variant="primary" removable>Primary</ts-tag>
                <ts-tag size="medium" variant="success" removable>Success</ts-tag>
                <ts-tag size="medium" variant="warning" removable>Warning</ts-tag>
                <ts-tag size="medium" variant="danger" removable>Danger</ts-tag>
            </div>
        `;
    },
};

export const WithIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add icons to the prefix slot to enhance visual context.',
            },
        },
    },
    render: () => {
        return html`
            <div class="sb-story-wrapper">
                <ts-tag variant="success" pill>
                    <ts-icon slot="prefix">
                        <img src="/assets/svg/task_alt.svg" alt="filter" />
                    </ts-icon>
                    Done
                </ts-tag>

                <ts-tag variant="primary">
                    <ts-icon slot="prefix">
                        <img src="/assets/svg/lock.svg" alt="filter" />
                    </ts-icon>
                    Locked
                </ts-tag>

                <ts-tag variant="warning">
                    <ts-icon slot="prefix">
                        <img src="/assets/svg/warning.svg" alt="filter" />
                    </ts-icon>
                    Warning
                </ts-tag>

                <ts-tag variant="danger">
                    <ts-icon slot="prefix">
                        <img src="/assets/svg/close.svg" alt="filter" />
                    </ts-icon>
                    Error
                </ts-tag>
            </div>
        `;
    },
};

export const NoBorder: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `has-border` attribute to remove the border from the tag component.',
            },
        },
    },
    render: () => {
        return html`
            <div class="sb-story-wrapper">
                <ts-tag variant="neutral" .hasBorder=${false}>No Border</ts-tag>
                <ts-tag variant="primary" .hasBorder=${false}>No Border</ts-tag>
                <ts-tag variant="success" .hasBorder=${false} pill>No Border Pill</ts-tag>
                <ts-tag variant="warning" .hasBorder=${false}>No Border</ts-tag>
                <ts-tag variant="danger" .hasBorder=${false}>No Border</ts-tag>
            </div>
        `;
    },
};

export const CustomColors: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use CSS variables `--ts-tag-bg-color`, `--ts-tag-font-color`, and `--ts-tag-border-color` to fully customize the tag appearance.',
            },
        },
    },
    render: () => {
        return html`
            <div class="sb-story-wrapper">
                <ts-tag style="--ts-tag-bg-color: #0ea5e9; --ts-tag-font-color: #001b26;">Custom BG + Text</ts-tag>
                <ts-tag style="--ts-tag-bg-color: rebeccapurple; --ts-tag-font-color: white;">Purple Pill</ts-tag>
                <ts-tag
                    style="--ts-tag-bg-color: #fef3c7; --ts-tag-font-color: #92400e; --ts-tag-border-color: #f59e0b;"
                >
                    Custom Border
                </ts-tag>
                <ts-tag
                    style="--ts-tag-bg-color: var(--ts-semantic-color-background-success-default); --ts-tag-font-color: black;"
                >
                    Token Color
                </ts-tag>
            </div>
        `;
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'tag-event-log',
            entries: [{ event: 'ts-remove', firedWhen: 'Remove button is activated', detail: 'void' }],
        });
        return {
            parameters,
            render: (args: TagArgs) =>
                wrap(html`
                    <div style="display: inline-flex;">
                        <ts-tag
                            variant=${args.variant || nothing}
                            size=${args.size || nothing}
                            ?removable=${true}
                            pill
                            @ts-remove=${(e: CustomEvent) => log('ts-remove', e.detail)}
                        >
                            Removable
                        </ts-tag>
                    </div>
                `),
        };
    })(),
};
