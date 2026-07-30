import { html, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import type { TsTab } from '@tuvsud/design-system/tab';
import type { TsTabGroup } from '@tuvsud/design-system/tab-group';
import type { StoryContext } from 'storybook/internal/types';

import type { TsTabHideEvent, TsTabShowEvent } from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/tab';
import '@tuvsud/design-system/tab-group';
import '@tuvsud/design-system/tab-panel';
import '@tuvsud/design-system/badge';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/carousel';
import '@tuvsud/design-system/carousel-item';

type TabGroupArgs = StoryContext<WebComponentsRenderer>['args'];

type TabGroupEvents = {
    'ts-tab-show': unknown;
    'ts-tab-hide': unknown;
};

const meta = {
    title: 'Components/Tab Group',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Tab Group organizes content into multiple sections, displayed one at a time. It helps users navigate between related views without leaving the current page.',
            },
        },
    },
    argTypes: {
        // Properties category
        placement: {
            control: 'select',
            options: ['top', 'bottom', 'start', 'end'],
            description: 'The placement of the tabs.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'top' }, category: 'Properties' },
        },
        activation: {
            control: 'select',
            options: ['auto', 'manual'],
            description: 'Arrow keys activate tabs automatically or on confirm.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'auto' }, category: 'Properties' },
        },
        noScrollControls: {
            control: 'boolean',
            description: 'Disables scroll arrows when tabs overflow.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        fixedScrollControls: {
            control: 'boolean',
            description: 'Prevents scroll buttons from hiding when inactive.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Events category
        'ts-tab-show': {
            action: 'ts-tab-show',
            description: 'Emitted when a tab is shown.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-tab-hide': {
            action: 'ts-tab-hide',
            description: 'Emitted when a tab is hidden.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        placement: 'top',
        activation: 'auto',
        noScrollControls: false,
        fixedScrollControls: false,
    },
    render: args => {
        const { panel, active, disabled, closable } = args as never;
        return html`
            <ts-tab-group
                .placement=${args.placement}
                placement=${args.placement || nothing}
                .activation=${args.activation}
                activation=${args.activation || nothing}
                .noScrollControls=${args.noScrollControls}
                ?no-scroll-controls=${args.noScrollControls}
                .fixedScrollControls=${args.fixedScrollControls}
                ?fixed-scroll-controls=${args.fixedScrollControls}
            >
                <ts-tab
                    slot="nav"
                    .panel=${panel}
                    panel=${panel || nothing}
                    .active=${active}
                    ?active=${active}
                    .disabled=${disabled}
                    ?disabled=${disabled}
                    .closable=${closable}
                    ?closable=${closable}
                    >Tab 1</ts-tab
                >
                <ts-tab-panel name=${panel}>Tab 1 content</ts-tab-panel>
            </ts-tab-group>
        `;
    },
} satisfies MetaWithLabel<TsTabGroup & TabGroupEvents>;

export default meta;
type Story = StoryObjWithLabel<TsTabGroup>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the tab group displays tabs at the top with automatic activation and scroll controls when needed.',
            },
        },
    },
    render: () => html`
        <ts-tab-group>
            ${Array.from({ length: 5 }, (_, i) => i + 1).map(
                num => html`
                    <ts-tab slot="nav" panel="panel-${num}">Tab ${num}</ts-tab>
                    <ts-tab-panel name="panel-${num}">Panel ${num} content</ts-tab-panel>
                `,
            )}
        </ts-tab-group>
    `,
};

export const Closable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add the closable attribute to a tab to show a close button. Click the close button or press Delete/Backspace when the tab is focused to close it. When a tab is closed, the next available tab (or previous if no next tab exists) is automatically activated.',
            },
        },
    },
    render: () => {
        const tabGroupRef = createRef<TsTabGroup>();
        return html`
            <ts-tab-group
                ${ref(tabGroupRef)}
                @ts-close=${(ev: Event) => {
                    const tab = ev.target as TsTab;
                    const tabGroup = tabGroupRef.value!;
                    const panel = tabGroup.querySelector(`ts-tab-panel[name="${tab.panel}"]`)!;

                    // Tab-group automatically activates next/previous tab
                    // Just remove the tab and panel from DOM
                    tab.remove();
                    panel.remove();
                }}
            >
                <ts-tab slot="nav" panel="panel-1" closable>Tab 1</ts-tab>
                <ts-tab slot="nav" panel="panel-2" closable>Tab 2</ts-tab>
                <ts-tab slot="nav" panel="panel-3" closable>Tab 3</ts-tab>

                <ts-tab-panel name="panel-1">First panel content</ts-tab-panel>
                <ts-tab-panel name="panel-2">Second panel content</ts-tab-panel>
                <ts-tab-panel name="panel-3">Third panel content</ts-tab-panel>
            </ts-tab-group>
        `;
    },
};

export const DisabledTabs: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When there are more tabs than horizontal space allows, the nav will be scrollable.',
            },
        },
    },
    render: () => html`
        <ts-tab-group>
            <ts-tab slot="nav" panel="panel-1">Enabled Tab</ts-tab>
            <ts-tab slot="nav" panel="panel-2" disabled>Disabled Tab</ts-tab>
            <ts-tab slot="nav" panel="panel-3">Enabled Tab</ts-tab>
            <ts-tab-panel name="panel-1">First panel content</ts-tab-panel>
            <ts-tab-panel name="panel-2">Second panel content</ts-tab-panel>
            <ts-tab-panel name="panel-3">Third panel content</ts-tab-panel>
        </ts-tab-group>
    `,
};

export const Scrollable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When there are more tabs than horizontal space allows, the nav will be scrollable.',
            },
        },
    },
    render: () => html`
        <ts-tab-group>
            ${Array.from({ length: 20 }, (_, i) => i + 1).map(
                num => html`
                    <ts-tab slot="nav" panel="panel-${num}">Tab ${num}</ts-tab>
                    <ts-tab-panel name="panel-${num}">Panel ${num} content</ts-tab-panel>
                `,
            )}
        </ts-tab-group>
    `,
};

export const WithCustomContent: Story = {
    parameters: {
        docs: {
            description: {
                story: 'You can include custom content within a tab header, such as icons or badges, by placing the desired elements inside the `<ts-tab>` component.',
            },
        },
    },
    render: () => html`
        <ts-tab-group>
            <ts-tab slot="nav" panel="panel-1">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <ts-icon library="system" name="info"></ts-icon>
                    <span>Custom Content</span>
                    <ts-badge variant="primary">New</ts-badge>
                </div>
            </ts-tab>
            <ts-tab slot="nav" panel="panel-2">Regular Tab</ts-tab>

            <ts-tab-panel name="panel-1">Panel with custom tab header content</ts-tab-panel>
            <ts-tab-panel name="panel-2">Regular panel content</ts-tab-panel>
        </ts-tab-group>
    `,
};

export const BottomPlacement: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Tabs can be positioned at the bottom of the content by setting the `placement` attribute to `bottom`.',
            },
        },
    },
    render: () => html`
        <ts-tab-group placement="bottom">
            ${Array.from({ length: 5 }, (_, i) => i + 1).map(
                num => html`
                    <ts-tab slot="nav" panel="panel-${num}">Tab ${num}</ts-tab>
                    <ts-tab-panel name="panel-${num}">Panel ${num} content</ts-tab-panel>
                `,
            )}
        </ts-tab-group>
    `,
};

export const StartPlacement: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Tabs can be positioned on the left side (start) of the content by setting the `placement` attribute to `start`.',
            },
        },
    },
    render: () => html`
        <ts-tab-group placement="start" style="height: 300px;">
            <ts-tab slot="nav" panel="panel-1">positioned Tab 1</ts-tab>
            <ts-tab-panel name="panel-1">Panel 1 content</ts-tab-panel>

            <ts-tab slot="nav" panel="panel-2"> Tab 2</ts-tab>
            <ts-tab-panel name="panel-2">Panel 2 content</ts-tab-panel>
        </ts-tab-group>
    `,
};

export const EndPlacement: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Tabs can be positioned on the right side (end) of the content by setting the `placement` attribute to `end`.',
            },
        },
    },
    render: () => html`
        <ts-tab-group placement="end" style="height: 300px;">
            ${Array.from({ length: 5 }, (_, i) => i + 1).map(
                num => html`
                    <ts-tab slot="nav" panel="panel-${num}">Tab ${num}</ts-tab>
                    <ts-tab-panel name="panel-${num}">Panel ${num} content</ts-tab-panel>
                `,
            )}
        </ts-tab-group>
    `,
};

export const ManualActivation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When `activation` is set to `manual`, tabs receive focus but do not activate until the user presses Space or Enter. This can help reduce unnecessary rendering when users navigate with keyboard.',
            },
        },
    },
    render: () => html`
        <ts-tab-group activation="manual">
            <ts-tab slot="nav" panel="panel-1">Tab 1</ts-tab>
            <ts-tab slot="nav" panel="panel-2">Tab 2</ts-tab>
            <ts-tab slot="nav" panel="panel-3">Tab 3</ts-tab>
            <ts-tab-panel name="panel-1"
                >First panel - Navigate with arrow keys and press Enter to activate</ts-tab-panel
            >
            <ts-tab-panel name="panel-2">Second panel content</ts-tab-panel>
            <ts-tab-panel name="panel-3">Third panel content</ts-tab-panel>
        </ts-tab-group>
    `,
};

export const NoScrollControls: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `no-scroll-controls` attribute to hide the scroll buttons, even when tabs overflow.',
            },
        },
    },
    render: () => html`
        <ts-tab-group no-scroll-controls>
            ${Array.from({ length: 20 }, (_, i) => i + 1).map(
                num => html`
                    <ts-tab slot="nav" panel="panel-${num}">Tab ${num}</ts-tab>
                    <ts-tab-panel name="panel-${num}">Panel ${num} content</ts-tab-panel>
                `,
            )}
        </ts-tab-group>
    `,
};

export const FixedScrollControls: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `fixed-scroll-controls` attribute to prevent scroll buttons from hiding when they become inactive (at the start or end of scrollable area).',
            },
        },
    },
    render: () => html`
        <ts-tab-group fixed-scroll-controls>
            ${Array.from({ length: 20 }, (_, i) => i + 1).map(
                num => html`
                    <ts-tab slot="nav" panel="panel-${num}">Tab ${num}</ts-tab>
                    <ts-tab-panel name="panel-${num}">Panel ${num} content</ts-tab-panel>
                `,
            )}
        </ts-tab-group>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'tab-group-event-log',
            entries: [
                { event: 'ts-tab-show', firedWhen: 'A tab is shown', detail: 'TsTabDetail' },
                { event: 'ts-tab-hide', firedWhen: 'A tab is hidden', detail: 'TsTabDetail' },
            ],
        });
        return {
            parameters,
            render: (args: TabGroupArgs) =>
                wrap(html`
                    <ts-tab-group
                        placement=${args.placement || nothing}
                        @ts-tab-show=${(e: TsTabShowEvent) => log('ts-tab-show', e.detail)}
                        @ts-tab-hide=${(e: TsTabHideEvent) => log('ts-tab-hide', e.detail)}
                    >
                        <ts-tab slot="nav" panel="panel-1">Tab 1</ts-tab>
                        <ts-tab slot="nav" panel="panel-2">Tab 2</ts-tab>
                        <ts-tab slot="nav" panel="panel-3">Tab 3</ts-tab>
                        <ts-tab-panel name="panel-1">Panel 1 content</ts-tab-panel>
                        <ts-tab-panel name="panel-2">Panel 2 content</ts-tab-panel>
                        <ts-tab-panel name="panel-3">Panel 3 content</ts-tab-panel>
                    </ts-tab-group>
                `),
        };
    })(),
};
