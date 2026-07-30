import { html, nothing } from 'lit';

import type { TsDropdown } from '@tuvsud/design-system/dropdown';
import type { StoryContext } from 'storybook/internal/types';

import type { TsAfterHideEvent } from '@utils/events/ts-after-hide.js';
import type { TsAfterShowEvent } from '@utils/events/ts-after-show.js';
import type { TsHideEvent } from '@utils/events/ts-hide.js';
import type { TsShowEvent } from '@utils/events/ts-show.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/dropdown';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';
import '@tuvsud/design-system/divider';
import '@tuvsud/design-system/avatar';
import '@tuvsud/design-system/icon';

type DropdownArgs = StoryContext<WebComponentsRenderer>['args'];

type DropdownEvents = {
    'ts-show': unknown;
    'ts-after-show': unknown;
    'ts-hide': unknown;
    'ts-after-hide': unknown;
};

const meta = {
    title: 'Components/Dropdown',
    component: 'ts-dropdown',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Dropdowns expose extra content by expanding a panel that "drops down" from a trigger element.',
            },
            story: {
                height: '220px',
            },
        },
    },
    argTypes: {
        // Properties category
        open: {
            control: 'boolean',
            description:
                'Indicates whether or not the dropdown is open. You can toggle this attribute to show and hide the dropdown, or you can use the show() and hide() methods and this attribute will reflect the dropdown\u2019s open state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        placement: {
            control: 'select',
            description:
                'The preferred placement of the dropdown panel. Note that the actual placement may vary as needed to keep the panel inside of the viewport.',
            options: [
                'top',
                'top-start',
                'top-end',
                'bottom',
                'bottom-start',
                'bottom-end',
                'right',
                'right-start',
                'right-end',
                'left',
                'left-start',
                'left-end',
            ],
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'bottom-start' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the dropdown so the panel will not open.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        stayOpenOnSelect: {
            control: 'boolean',
            description:
                'By default, the dropdown is closed when an item is selected. This attribute will keep it open instead. Useful for dropdowns that allow for multiple interactions.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        distance: {
            control: 'number',
            description: 'The distance in pixels from which to offset the panel away from its trigger.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        skidding: {
            control: 'number',
            description: 'The distance in pixels from which to offset the panel along its trigger.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        hoist: {
            control: 'boolean',
            description:
                'Enable this option to prevent the panel from being clipped when the component is placed inside a container with overflow: auto|scroll. Hoisting uses a fixed positioning strategy that works in many, but not all, scenarios.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        sync: {
            control: 'select',
            options: [undefined, 'width', 'height'],
            description: 'Syncs the popup width or height to that of the trigger element.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'undefined' }, category: 'Properties' },
        },
        containingElement: {
            control: false,
            description:
                'The dropdown will close when the user interacts outside of this element (e.g. clicking). Useful for composing other components that use a dropdown internally.',
            table: { type: { summary: 'HTMLElement' }, category: 'Properties' },
        },
        // Events category
        'ts-show': {
            action: 'ts-show',
            description: 'Emitted when the dropdown opens.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-show': {
            action: 'ts-after-show',
            description: 'Emitted after the dropdown opens and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-hide': {
            action: 'ts-hide',
            description: 'Emitted when the dropdown closes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-hide': {
            action: 'ts-after-hide',
            description: 'Emitted after the dropdown closes and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        open: false,
        placement: 'bottom-start',
        disabled: false,
        stayOpenOnSelect: false,
        distance: 0,
        skidding: 0,
        hoist: false,
        sync: undefined,
        containingElement: undefined,
    },
    render: args => html`
        <ts-dropdown
            .open=${args.open}
            ?open=${args.open}
            placement=${args.placement || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .stayOpenOnSelect=${args.stayOpenOnSelect}
            ?stay-open-on-select=${args.stayOpenOnSelect}
            distance=${args.distance ?? nothing}
            skidding=${args.skidding ?? nothing}
            .hoist=${args.hoist}
            ?hoist=${args.hoist}
            sync=${args.sync || nothing}
        >
            <ts-button variant="primary" slot="trigger" caret>Dropdown</ts-button>
            <ts-menu>
                <ts-menu-item>Option 1</ts-menu-item>
                <ts-menu-item>Option 2</ts-menu-item>
                <ts-menu-item>Option 3</ts-menu-item>
                <ts-divider></ts-divider>
                <ts-menu-item>Separated Option</ts-menu-item>
            </ts-menu>
        </ts-dropdown>
    `,
} satisfies MetaWithLabel<TsDropdown & DropdownEvents>;

export default meta;
type Story = StoryObjWithLabel<TsDropdown>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default dropdown with several menu options.',
            },
        },
    },
};

export const WithIcons: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A dropdown with menu items that include icons.',
            },
        },
    },
    render: args => html`
        <ts-dropdown
            .open=${args.open}
            ?open=${args.open}
            placement=${args.placement || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .stayOpenOnSelect=${args.stayOpenOnSelect}
            ?stay-open-on-select=${args.stayOpenOnSelect}
            distance=${args.distance ?? nothing}
            skidding=${args.skidding ?? nothing}
            .hoist=${args.hoist}
            ?hoist=${args.hoist}
            sync=${args.sync || nothing}
        >
            <ts-button variant="primary" slot="trigger" caret>Menu</ts-button>
            <ts-menu>
                <ts-menu-item>
                    <ts-icon slot="prefix">
                        <img src="/assets/svg/home.svg" />
                    </ts-icon>
                    Home
                </ts-menu-item>

                <ts-menu-item>
                    <ts-icon slot="prefix">
                        <img src="/assets/svg/settings.svg" />
                    </ts-icon>
                    Settings
                </ts-menu-item>

                <ts-menu-item>
                    <ts-icon slot="prefix">
                        <img src="/assets/svg/person.svg" />
                    </ts-icon>
                    Profile
                </ts-menu-item>
                <ts-divider></ts-divider>
                <ts-menu-item>
                    <ts-icon slot="prefix">
                        <img src="/assets/svg/logout.svg" />
                    </ts-icon>
                    Sign Out
                </ts-menu-item>
            </ts-menu>
        </ts-dropdown>
    `,
};

export const Nested: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A dropdown with nested sub-menus for additional options.',
            },
        },
    },
    args: { hoist: true },
    render: args => html`
        <ts-dropdown
            .open=${args.open}
            ?open=${args.open}
            placement=${args.placement || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .stayOpenOnSelect=${args.stayOpenOnSelect}
            ?stay-open-on-select=${args.stayOpenOnSelect}
            distance=${args.distance ?? nothing}
            skidding=${args.skidding ?? nothing}
            .hoist=${args.hoist}
            ?hoist=${args.hoist}
            sync=${args.sync || nothing}
        >
            <ts-button variant="primary" slot="trigger" caret>Nested</ts-button>
            <ts-menu>
                <ts-menu-item>Item 1</ts-menu-item>
                <ts-menu-item disabled>Item 2</ts-menu-item>
                <ts-menu-item>
                    More Options
                    <ts-menu slot="submenu">
                        <ts-menu-item>Sub-item 1</ts-menu-item>
                        <ts-menu-item>Sub-item 2</ts-menu-item>
                        <ts-menu-item>
                            Even More
                            <ts-menu slot="submenu">
                                <ts-menu-item>Deep Option 1</ts-menu-item>
                                <ts-menu-item>Deep Option 2</ts-menu-item>
                            </ts-menu>
                        </ts-menu-item>
                    </ts-menu>
                </ts-menu-item>
            </ts-menu>
        </ts-dropdown>
    `,
};

export const CustomTrigger: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Dropdown using a custom trigger element (an avatar in this case).',
            },
        },
    },
    render: args => html`
        <ts-dropdown
            .open=${args.open}
            ?open=${args.open}
            placement=${args.placement || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .stayOpenOnSelect=${args.stayOpenOnSelect}
            ?stay-open-on-select=${args.stayOpenOnSelect}
            distance=${args.distance ?? nothing}
            skidding=${args.skidding ?? nothing}
            .hoist=${args.hoist}
            ?hoist=${args.hoist}
            sync=${args.sync || nothing}
        >
            <div slot="trigger" style="cursor: pointer; user-select: none;">
                <ts-avatar
                    image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=300"
                    label="Custom trigger"
                ></ts-avatar>
            </div>
            <ts-menu>
                <ts-menu-item>View Profile</ts-menu-item>
                <ts-menu-item>Settings</ts-menu-item>
                <ts-divider></ts-divider>
                <ts-menu-item>Sign Out</ts-menu-item>
            </ts-menu>
        </ts-dropdown>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'dropdown-event-log',
            entries: [
                { event: 'ts-show', firedWhen: 'The dropdown starts to open', detail: 'void' },
                {
                    event: 'ts-after-show',
                    firedWhen: 'The dropdown finishes opening (animation complete)',
                    detail: 'void',
                },
                { event: 'ts-hide', firedWhen: 'The dropdown starts to close', detail: 'void' },
                {
                    event: 'ts-after-hide',
                    firedWhen: 'The dropdown finishes closing (animation complete)',
                    detail: 'void',
                },
            ],
        });
        return {
            parameters,
            render: (args: DropdownArgs) =>
                wrap(html`
                    <ts-dropdown
                        .open=${args.open}
                        ?open=${args.open}
                        placement=${args.placement || nothing}
                        .disabled=${args.disabled}
                        ?disabled=${args.disabled}
                        .stayOpenOnSelect=${args.stayOpenOnSelect}
                        ?stay-open-on-select=${args.stayOpenOnSelect}
                        distance=${args.distance ?? nothing}
                        skidding=${args.skidding ?? nothing}
                        .hoist=${args.hoist}
                        ?hoist=${args.hoist}
                        sync=${args.sync || nothing}
                        @ts-show=${(e: TsShowEvent) => log('ts-show', e.detail)}
                        @ts-after-show=${(e: TsAfterShowEvent) => log('ts-after-show', e.detail)}
                        @ts-hide=${(e: TsHideEvent) => log('ts-hide', e.detail)}
                        @ts-after-hide=${(e: TsAfterHideEvent) => log('ts-after-hide', e.detail)}
                    >
                        <ts-button variant="primary" slot="trigger" caret>Dropdown</ts-button>
                        <ts-menu>
                            <ts-menu-item>Option 1</ts-menu-item>
                            <ts-menu-item>Option 2</ts-menu-item>
                            <ts-menu-item>Option 3</ts-menu-item>
                            <ts-divider></ts-divider>
                            <ts-menu-item>Separated Option</ts-menu-item>
                        </ts-menu>
                    </ts-dropdown>
                `),
        };
    })(),
};
