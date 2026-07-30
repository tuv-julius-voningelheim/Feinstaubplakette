import { html, nothing } from 'lit';

import type { TsTabPanel } from '@tuvsud/design-system/tab-panel';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/tab';
import '@tuvsud/design-system/tab-group';
import '@tuvsud/design-system/tab-panel';
import '@tuvsud/design-system/badge';

const meta = {
    title: 'Components/Tab Panel',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Tab panels live inside tab groups and reveal the content tied to each tab, creating a clean, organized navigation experience.',
            },
        },
    },
    argTypes: {
        // Properties category
        name: {
            control: 'text',
            description: "The tab panel's name.",
            table: { type: { summary: 'string' }, defaultValue: { summary: 'panel-1' }, category: 'Properties' },
        },
        active: {
            control: 'boolean',
            description: 'When true, the tab panel will be shown.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
    },
    args: {
        name: 'panel-1',
        active: false,
    },
    render: args => {
        const { name, active } = args as { name: string; active: boolean };
        return html`
            <ts-tab-group>
                <ts-tab slot="nav" panel=${name}>Tab 1</ts-tab>
                <ts-tab-panel .name=${name} name=${name || nothing} .active=${active} ?active=${active}>
                    Tab 1 content
                </ts-tab-panel>
            </ts-tab-group>
        `;
    },
} satisfies MetaWithLabel<TsTabPanel>;

export default meta;
type Story = StoryObjWithLabel<TsTabPanel>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This is the default tab panel used inside a tab group.',
            },
        },
    },
};
