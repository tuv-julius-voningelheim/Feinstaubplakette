import { html, nothing } from 'lit';

import type { TsSplitPanel } from '@tuvsud/design-system/split-panel';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/split-panel';

const meta = {
    title: 'Components/Split Panel',
    component: 'ts-split-panel',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Split panels showcase two adjustable, side‑by‑side panels, giving users precise control over layout and space.',
            },
        },
    },
    argTypes: {
        // Properties category
        position: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
            description: 'Initial splitter position as a percentage (0–100).',
            table: { type: { summary: 'number' }, defaultValue: { summary: '50' }, category: 'Properties' },
        },
        positionInPixels: {
            control: 'number',
            description: 'Initial splitter position in pixels (overrides position when set).',
            table: { type: { summary: 'number' }, defaultValue: { summary: 'undefined' }, category: 'Properties' },
        },
        vertical: {
            control: 'boolean',
            description: 'If true, the split panel is vertical (top/bottom) instead of horizontal (start/end).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables dragging and resizing.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        primary: {
            control: { type: 'select' },
            options: [undefined, 'start', 'end'],
            description: 'Which panel is primary and keeps its size when the container resizes.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'undefined' }, category: 'Properties' },
        },
        snap: {
            control: 'text',
            description: 'Snap points for the divider (e.g. "100px 50%").',
            table: { defaultValue: { summary: '' }, category: 'Properties' },
        },
        snapThreshold: {
            control: 'number',
            description: 'Distance in pixels from a snap point required to snap.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '-' }, category: 'Properties' },
        },
    },

    args: {
        position: 50,
        positionInPixels: undefined,
        vertical: false,
        disabled: false,
        primary: undefined,
        snap: '',
        snapThreshold: undefined,
    },
    render: args => html`
        <ts-split-panel
            .position=${args.position}
            position=${args.position ?? nothing}
            .positionInPixels=${args.positionInPixels}
            position-in-pixels=${args.positionInPixels ?? nothing}
            .vertical=${args.vertical}
            ?vertical=${args.vertical}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .primary=${args.primary}
            primary=${args.primary || nothing}
            .snap=${args.snap}
            snap=${args.snap || nothing}
            .snapThreshold=${args.snapThreshold}
            snap-threshold=${args.snapThreshold ?? nothing}
        >
            <div
                slot="start"
                style="height:200px;background:#f5f5f5;display:flex;align-items:center;justify-content:center"
            >
                Start
            </div>
            <div
                slot="end"
                style="height:200px;background:#f5f5f5;display:flex;align-items:center;justify-content:center"
            >
                End
            </div>
        </ts-split-panel>
    `,
} satisfies MetaWithLabel<TsSplitPanel>;

export default meta;
type Story = StoryObjWithLabel<TsSplitPanel>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default split panel with two resizable panels.',
            },
        },
    },
};

export const InitialPosition: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To set the initial position, use the position property. If no position is provided, it will default to 50% of the available space.',
            },
        },
    },
    render: () => {
        return html`
            <ts-split-panel position="75">
                <div
                    slot="start"
                    style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                >
                    Start
                </div>
                <div
                    slot="end"
                    style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                >
                    End
                </div>
            </ts-split-panel>
        `;
    },
};

export const InitialPositionInPixels: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To set the initial position in pixels instead of a percentage, use the position-in-pixels property.',
            },
        },
    },
    render: () => {
        return html`
            <ts-split-panel position-in-pixels="150">
                <div
                    slot="start"
                    style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                >
                    Start
                </div>
                <div
                    slot="end"
                    style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                >
                    End
                </div>
            </ts-split-panel>
        `;
    },
};

export const Vertical: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add the vertical property to render the split panel in a vertical orientation where the start and end panels are stacked. You also need to set a height when using the vertical orientation.',
            },
        },
    },
    render: () => {
        return html`
            <ts-split-panel vertical style="height: 400px;">
                <div
                    slot="start"
                    style="height: 100%; background:  #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                >
                    Start
                </div>
                <div
                    slot="end"
                    style="height: 100%; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                >
                    End
                </div>
            </ts-split-panel>
        `;
    },
};

export const Snapping: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'To snap panels at specific positions while dragging, you can use the snap property. You can provide one or more space-separated pixel or percentage values, either as single values or within a repeat() expression, which will be repeated along the length of the panel. You can also customize how close the divider must be before snapping with the snap-threshold property.\n' +
                    'For example, to snap the panel at 100px and 50%, use snap="100px 50%".',
            },
        },
    },
    render: () => {
        return html`
            <div class="split-panel-snapping">
                <ts-split-panel snap="100px 50%">
                    <div
                        slot="start"
                        style="height: 150px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                    >
                        Start
                    </div>
                    <div
                        slot="end"
                        style="height: 150px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                    >
                        End
                    </div>
                </ts-split-panel>

                <div class="split-panel-snapping-dots"></div>
            </div>

            <style>
                .split-panel-snapping {
                    position: relative;
                }

                .split-panel-snapping-dots::before,
                .split-panel-snapping-dots::after {
                    content: '';
                    position: absolute;
                    bottom: -12px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #ccc;
                    transform: translateX(-3px);
                }

                .split-panel-snapping .split-panel-snapping-dots::before {
                    left: 100px;
                }

                .split-panel-snapping .split-panel-snapping-dots::after {
                    left: 50%;
                }
            </style>
        `;
    },
};

export const MinMax: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'To set a minimum or maximum size of the primary panel, use the --min and --max custom properties. Since the secondary panel is flexible, size constraints can only be applied to the primary panel. If no primary panel is designated, these constraints will be applied to the start panel.\n' +
                    'This examples demonstrates how you can ensure both panels are at least 150px using --min, --max, and the calc() function.',
            },
        },
    },
    render: () => {
        return html`
            <ts-split-panel style="--min: 150px; --max: calc(100% - 150px);">
                <div
                    slot="start"
                    style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                >
                    Start
                </div>
                <div
                    slot="end"
                    style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                >
                    End
                </div>
            </ts-split-panel>
        `;
    },
};

export const NestedSplitPanels: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Create complex layouts that can be repositioned independently by nesting split panels.',
            },
        },
    },
    render: () => {
        return html`
            <ts-split-panel>
                <div
                    slot="start"
                    style="height: 400px; background:  #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden"
                >
                    Start
                </div>
                <div slot="end">
                    <ts-split-panel vertical style="height: 400px;">
                        <div
                            slot="start"
                            style="height: 100%; background:  #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden"
                        >
                            Top
                        </div>
                        <div
                            slot="end"
                            style="height: 100%; background:  #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden"
                        >
                            Bottom
                        </div>
                    </ts-split-panel>
                </div>
            </ts-split-panel>
        `;
    },
};
