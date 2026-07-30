import { html, nothing } from 'lit';

import type { TsTab } from '@tuvsud/design-system/tab';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/tab';
import '@tuvsud/design-system/tab-group';
import '@tuvsud/design-system/tab-panel';
import '@tuvsud/design-system/badge';

type TabArgs = StoryContext<WebComponentsRenderer>['args'];

type TabEvents = {
    'ts-close': unknown;
    'ts-tab-click': unknown;
};

const meta = {
    title: 'Components/Tab',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Tabs live inside tab groups, letting users seamlessly switch between panels of organized, tabbed content.',
            },
        },
    },
    argTypes: {
        // Properties category
        panel: {
            control: 'text',
            description: 'Associated panel name in the same tab group.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'panel-1' }, category: 'Properties' },
        },
        active: {
            control: 'boolean',
            description: 'Draws the tab in an active state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        closable: {
            control: 'boolean',
            description: 'Shows a close button and makes the tab closable.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the tab and prevents selection.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Events category
        'ts-close': {
            action: 'ts-close',
            description: 'Emitted when the tab is closable and the close button is activated.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-tab-click': {
            action: 'ts-tab-click',
            description: 'Emitted when the tab is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        panel: 'panel-1',
        active: false,
        disabled: false,
        closable: false,
    },
    render: args => {
        const { panel, active, disabled, closable } = args;
        return html`
            <ts-tab-group>
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
} satisfies MetaWithLabel<TsTab & TabEvents>;

export default meta;
type Story = StoryObjWithLabel<TsTab>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This is the default tab component used within a tab group. You can set the associated panel, active state, disabled state, and whether the tab is closable.',
            },
        },
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'tab-event-log',
            entries: [
                { event: 'ts-close', firedWhen: 'Close button is activated', detail: 'void' },
                { event: 'ts-tab-click', firedWhen: 'Tab is clicked', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: TabArgs) =>
                wrap(html`
                    <ts-tab-group>
                        <ts-tab
                            slot="nav"
                            panel=${args.panel || nothing}
                            .closable=${true}
                            ?closable=${true}
                            @ts-close=${(e: CustomEvent) => log('ts-close', e.detail)}
                            @ts-tab-click=${(e: CustomEvent) => log('ts-tab-click', e.detail)}
                            >Tab 1</ts-tab
                        >
                        <ts-tab-panel name=${args.panel}>Tab 1 content</ts-tab-panel>
                    </ts-tab-group>
                `),
        };
    })(),
};
