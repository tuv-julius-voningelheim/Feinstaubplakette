import { html, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import type { TsDrawer } from '@tuvsud/design-system/drawer';
import type { StoryContext } from 'storybook/internal/types';

import type {
    TsAfterHideEvent,
    TsAfterShowEvent,
    TsHideEvent,
    TsInitialFocusEvent,
    TsRequestCloseEvent,
    TsShowEvent,
} from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/drawer';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/accordion';
import '@tuvsud/design-system/accordion-item';

type TsDrawerWithArgs = TsDrawer & { size?: string };

type DrawerArgs = StoryContext<WebComponentsRenderer>['args'];

type DrawerEvents = {
    'ts-show': unknown;
    'ts-after-show': unknown;
    'ts-hide': unknown;
    'ts-after-hide': unknown;
    'ts-initial-focus': unknown;
    'ts-request-close': unknown;
};

const meta = {
    title: 'Components/Drawer',
    component: 'ts-drawer',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Drawers smoothly slide into view from their container, offering extra options and information while keeping the user in context.',
            },
            story: {
                height: '400px',
            },
        },
    },
    argTypes: {
        // Properties category
        open: {
            control: 'boolean',
            description:
                'Indicates whether or not the drawer is open. Can be toggled via attribute or show()/hide() methods.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        placement: {
            control: { type: 'select' },
            options: ['top', 'end', 'bottom', 'start'],
            description: 'The direction from which the drawer will open.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'end' }, category: 'Properties' },
        },
        contained: {
            control: 'boolean',
            description:
                'Slides the drawer out of its parent instead of the viewport. Add position: relative to the parent.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        noHeader: {
            control: 'boolean',
            description: 'Removes the header and default close button. Ensure an accessible way to dismiss the drawer.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        closable: {
            control: 'boolean',
            description: 'When true, the close button is shown in the header. When false, the close button is hidden.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        preventOverlayClose: {
            control: 'boolean',
            description: 'Prevents the drawer from closing when clicking on the overlay.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        size: {
            control: 'text',
            description: 'Sets the drawer size via the --size custom property (e.g., 25rem, 40vw).',
            table: { type: { summary: 'string' }, category: 'Properties' },
        },
        modal: {
            control: false,
            table: { disable: false, category: 'Properties' },
            description:
                'Exposes the internal modal utility for focus trapping. Use modal.activateExternal()/deactivateExternal() for third-party modals.',
        },
        // Accessibility category
        label: {
            control: 'text',
            description:
                'The drawer\u2019s label shown in the header. Provide a meaningful label even with no-header; use the `label` slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-show': {
            action: 'ts-show',
            description: 'Emitted when the drawer opens.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-show': {
            action: 'ts-after-show',
            description: 'Emitted after the drawer opens and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-hide': {
            action: 'ts-hide',
            description: 'Emitted when the drawer closes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-hide': {
            action: 'ts-after-hide',
            description: 'Emitted after the drawer closes and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-initial-focus': {
            action: 'ts-initial-focus',
            description: 'Emitted when the drawer opens and is ready to receive focus. Cancel to prevent focusing.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-request-close': {
            action: 'ts-request-close',
            description:
                'Emitted when the user attempts to close the drawer via the close button, escape key, or overlay. Cancel to prevent closing.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
    },
    args: {
        open: false,
        label: 'Drawer',
        placement: 'end',
        contained: false,
        noHeader: false,
        closable: true,
        preventOverlayClose: false,
        size: '25rem',
    },
    render: args => {
        const drawerRef = createRef<TsDrawer>();
        return html`
            <ts-drawer
                ${ref(drawerRef)}
                .open=${args.open}
                ?open=${args.open}
                label=${args.label || nothing}
                placement=${args.placement || nothing}
                .contained=${args.contained}
                ?contained=${args.contained}
                .noHeader=${args.noHeader}
                ?no-header=${args.noHeader}
                .closable=${args.closable}
                ?closable=${args.closable}
                .preventOverlayClose=${args.preventOverlayClose}
                ?prevent-overlay-close=${args.preventOverlayClose}
                style="--size: ${args.size}"
            >
                This is the drawer content.
                <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}>Close</ts-button>
            </ts-drawer>
            <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Drawer</ts-button>
        `;
    },
} satisfies MetaWithLabel<TsDrawerWithArgs & DrawerEvents>;

export default meta;
type Story = StoryObjWithLabel<TsDrawerWithArgs>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default drawer slides in from the end (right) and contains a header with a title and close button, content area, and footer with a close button.',
            },
        },
    },
};

export const Position: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, drawers slide in from the end. To make the drawer slide in from the start, set the `placement` property to start | end | top | bottom.',
            },
        },
    },
    args: { placement: 'end' },
    render: args => {
        const drawerRef = createRef<TsDrawer>();
        return html`
            <ts-drawer
                ${ref(drawerRef)}
                .open=${args.open}
                ?open=${args.open}
                label=${args.label || nothing}
                placement=${args.placement || nothing}
                .contained=${args.contained}
                ?contained=${args.contained}
                .noHeader=${args.noHeader}
                ?no-header=${args.noHeader}
                .closable=${args.closable}
                ?closable=${args.closable}
                .preventOverlayClose=${args.preventOverlayClose}
                ?prevent-overlay-close=${args.preventOverlayClose}
                style="--size: ${args.size}"
            >
                This drawer slides in from the end (right).
                <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}>Close</ts-button>
            </ts-drawer>
            <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Drawer</ts-button>
        `;
    },
};

export const Start: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, drawers slide in from the end. To make the drawer slide in from the start, set the placement property to `start`',
            },
        },
    },
    args: { placement: 'start' },
    render: args => {
        const drawerRef = createRef<TsDrawer>();
        return html`
            <ts-drawer
                ${ref(drawerRef)}
                .open=${args.open}
                ?open=${args.open}
                label=${args.label || nothing}
                placement=${args.placement || nothing}
                .contained=${args.contained}
                ?contained=${args.contained}
                .noHeader=${args.noHeader}
                ?no-header=${args.noHeader}
                .closable=${args.closable}
                ?closable=${args.closable}
                .preventOverlayClose=${args.preventOverlayClose}
                ?prevent-overlay-close=${args.preventOverlayClose}
                style="--size: ${args.size}"
            >
                This drawer slides in from the start (left).
                <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}>Close</ts-button>
            </ts-drawer>
            <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Drawer</ts-button>
        `;
    },
};

export const Top: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, drawers slide in from the end. To make the drawer slide in from the top, set the placement property to `top`',
            },
        },
    },
    args: { placement: 'top' },
    render: args => {
        const drawerRef = createRef<TsDrawer>();
        return html`
            <ts-drawer
                ${ref(drawerRef)}
                .open=${args.open}
                ?open=${args.open}
                label=${args.label || nothing}
                placement=${args.placement || nothing}
                .contained=${args.contained}
                ?contained=${args.contained}
                .noHeader=${args.noHeader}
                ?no-header=${args.noHeader}
                .closable=${args.closable}
                ?closable=${args.closable}
                .preventOverlayClose=${args.preventOverlayClose}
                ?prevent-overlay-close=${args.preventOverlayClose}
                style="--size: ${args.size}"
            >
                This drawer slides in from the top.
                <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}>Close</ts-button>
            </ts-drawer>
            <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Drawer</ts-button>
        `;
    },
};

export const Bottom: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, drawers slide in from the end. To make the drawer slide in from the bottom, set the placement property to `bottom`',
            },
        },
    },
    args: { placement: 'bottom' },
    render: args => {
        const drawerRef = createRef<TsDrawer>();
        return html`
            <ts-drawer
                ${ref(drawerRef)}
                .open=${args.open}
                ?open=${args.open}
                label=${args.label || nothing}
                placement=${args.placement || nothing}
                .contained=${args.contained}
                ?contained=${args.contained}
                .noHeader=${args.noHeader}
                ?no-header=${args.noHeader}
                .closable=${args.closable}
                ?closable=${args.closable}
                .preventOverlayClose=${args.preventOverlayClose}
                ?prevent-overlay-close=${args.preventOverlayClose}
                style="--size: ${args.size}"
            >
                This drawer slides in from the bottom.
                <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}>Close</ts-button>
            </ts-drawer>
            <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Drawer</ts-button>
        `;
    },
};

export const Contained: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, drawers slide out of their containing block, which is usually the viewport. To make a drawer slide out of a parent element, add the contained attribute to the drawer and apply position: relative to its parent.',
            },
        },
    },
    args: { contained: true },
    render: args => {
        const drawerRef = createRef<TsDrawer>();
        return html`
            <ts-drawer
                ${ref(drawerRef)}
                .open=${args.open}
                ?open=${args.open}
                label=${args.label || nothing}
                placement=${args.placement || nothing}
                .contained=${args.contained}
                ?contained=${args.contained}
                .noHeader=${args.noHeader}
                ?no-header=${args.noHeader}
                .closable=${args.closable}
                ?closable=${args.closable}
                style="--size: ${args.size}"
            >
                This drawer is contained within its parent element.
                <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}>Close</ts-button>
            </ts-drawer>
            <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Contained Drawer</ts-button>
        `;
    },
};

export const NotClosable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When the closable property is set to false, the close button in the header is hidden. Users can only close the drawer through custom footer buttons or programmatically.',
            },
        },
    },
    args: {
        label: 'Non-Closable Drawer',
        closable: false,
    },
    render: args => {
        const drawerRef = createRef<TsDrawer>();
        return html`
            <ts-drawer
                ${ref(drawerRef)}
                .open=${args.open}
                ?open=${args.open}
                label=${args.label || nothing}
                placement=${args.placement || nothing}
                .contained=${args.contained}
                ?contained=${args.contained}
                .noHeader=${args.noHeader}
                ?no-header=${args.noHeader}
                .closable=${args.closable}
                ?closable=${args.closable}
                style="--size: ${args.size}"
            >
                This drawer has no close button in the header. You must use the footer button to close it.
                <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}
                    >Close Drawer</ts-button
                >
            </ts-drawer>
            <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Drawer</ts-button>
        `;
    },
};

export const PreventOverlayClose: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When prevent-overlay-close is set, clicking the overlay will not close the drawer. Use the close button or footer button to dismiss it.',
            },
        },
    },
    args: {
        label: 'Overlay Close Prevented',
        preventOverlayClose: true,
    },
    render: args => {
        const drawerRef = createRef<TsDrawer>();
        return html`
            <ts-drawer
                ${ref(drawerRef)}
                .open=${args.open}
                ?open=${args.open}
                label=${args.label || nothing}
                placement=${args.placement || nothing}
                .contained=${args.contained}
                ?contained=${args.contained}
                .noHeader=${args.noHeader}
                ?no-header=${args.noHeader}
                .preventOverlayClose=${args.preventOverlayClose}
                ?prevent-overlay-close=${args.preventOverlayClose}
                style="--size: ${args.size}"
            >
                Try clicking the overlay — the drawer will not close. Use the footer button or the close button instead.
                <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}
                    >Close Drawer</ts-button
                >
            </ts-drawer>
            <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Drawer</ts-button>
        `;
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'drawer-event-log',
            entries: [
                { event: 'ts-show', firedWhen: 'The drawer starts to open', detail: 'void' },
                {
                    event: 'ts-after-show',
                    firedWhen: 'The drawer finishes opening (animation complete)',
                    detail: 'void',
                },
                { event: 'ts-hide', firedWhen: 'The drawer starts to close', detail: 'void' },
                {
                    event: 'ts-after-hide',
                    firedWhen: 'The drawer finishes closing (animation complete)',
                    detail: 'void',
                },
                {
                    event: 'ts-initial-focus',
                    firedWhen: 'The drawer opens and is ready to receive focus',
                    detail: 'void',
                },
                {
                    event: 'ts-request-close',
                    firedWhen: 'The user attempts to close via close button, escape key, or overlay',
                    detail: 'TsRequestCloseDetail',
                },
            ],
        });
        return {
            parameters,
            render: (args: DrawerArgs) => {
                const drawerRef = createRef<TsDrawer>();
                return wrap(html`
                    <div style="min-height: 300px;">
                        <ts-drawer
                            ${ref(drawerRef)}
                            .open=${args.open}
                            ?open=${args.open}
                            label=${args.label || nothing}
                            placement=${args.placement || nothing}
                            .noHeader=${args.noHeader}
                            ?no-header=${args.noHeader}
                            .preventOverlayClose=${args.preventOverlayClose}
                            ?prevent-overlay-close=${args.preventOverlayClose}
                            .closable=${args.closable}
                            ?closable=${args.closable}
                            style="--size: ${args.size}"
                            @ts-show=${(e: TsShowEvent) => log('ts-show', e.detail)}
                            @ts-after-show=${(e: TsAfterShowEvent) => log('ts-after-show', e.detail)}
                            @ts-hide=${(e: TsHideEvent) => log('ts-hide', e.detail)}
                            @ts-after-hide=${(e: TsAfterHideEvent) => log('ts-after-hide', e.detail)}
                            @ts-initial-focus=${(e: TsInitialFocusEvent) => log('ts-initial-focus', e.detail)}
                            @ts-request-close=${(e: TsRequestCloseEvent) => log('ts-request-close', e.detail)}
                        >
                            Interact with this drawer to see events fired in real time.
                            <ts-button slot="footer" variant="primary" @click=${() => drawerRef.value?.hide()}
                                >Close</ts-button
                            >
                        </ts-drawer>

                        <ts-button variant="primary" @click=${() => drawerRef.value?.show()}>Open Drawer</ts-button>
                    </div>
                `);
            },
        };
    })(),
};
