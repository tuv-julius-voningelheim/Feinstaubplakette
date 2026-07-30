import { html, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import type { TsPopup } from '@tuvsud/design-system/popup';
import type { StoryContext } from 'storybook/internal/types';

import type { TsRepositionEvent } from '@utils/events/ts-reposition.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/popup';
import '@tuvsud/design-system/button';

type PopupArgs = StoryContext<WebComponentsRenderer>['args'];

type PopupEvents = {
    'ts-reposition': unknown;
};

const meta = {
    title: 'Components/Popup',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Popup is a utility that lets you declaratively anchor “popup” containers to another element.',
            },
        },
    },
    argTypes: {
        // Properties category
        popup: {
            control: false,
            table: { disable: false, category: 'Properties' },
            description: 'Reference to internal popup container.',
        },
        anchor: {
            control: 'text',
            description: 'Anchor element, id, or VirtualElement. Use slot="anchor" when inside.',
            table: { type: { summary: 'string' }, category: 'Properties' },
        },
        active: {
            control: 'boolean',
            description: 'Activates positioning and shows the popup.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        placement: {
            control: 'select',
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
            description: 'Preferred placement; may change to keep the popup in view.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'top-start' }, category: 'Properties' },
        },
        strategy: {
            control: 'select',
            options: ['absolute', 'fixed'],
            description: 'Positioning strategy.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'absolute' },
                category: 'Properties',
            },
        },
        distance: {
            control: 'number',
            description: 'Offset distance in pixels from the anchor.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '10' }, category: 'Properties' },
        },
        skidding: {
            control: 'number',
            description: 'Offset along the anchor in pixels.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        arrow: {
            control: 'boolean',
            description: 'Attaches an arrow to the popup.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        arrowPlacement: {
            control: 'select',
            options: ['start', 'end', 'center', 'anchor'],
            description: 'Arrow alignment.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'anchor' },
                category: 'Properties',
            },
        },
        arrowPadding: {
            control: 'number',
            description: 'Padding between arrow and popup edges.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '10' }, category: 'Properties' },
        },
        flip: {
            control: 'boolean',
            description: 'Flip to opposite side to stay in view.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        flipFallbackPlacements: {
            control: 'text',
            description: 'Space-separated fallback placements.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        flipFallbackStrategy: {
            control: 'select',
            options: ['best-fit', 'initial'],
            description: 'Strategy when nothing fits.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'best-fit' },
                category: 'Properties',
            },
        },
        flipBoundary: {
            control: false,
            table: { disable: false, category: 'Properties' },
            description: 'Elements used as flip boundary.',
        },
        flipPadding: {
            control: 'number',
            description: 'Padding before flip occurs.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        shift: {
            control: 'boolean',
            description: 'Shift along axis to keep in view.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        shiftBoundary: {
            control: false,
            table: { disable: false, category: 'Properties' },
            description: 'Elements used as shift boundary.',
        },
        shiftPadding: {
            control: 'number',
            description: 'Padding before shift occurs.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        autoSize: {
            control: 'select',
            options: [undefined, 'horizontal', 'vertical', 'both'],
            description: 'Auto-resize to prevent overflow.',
            table: { type: { summary: 'enum' }, category: 'Properties' },
        },
        sync: {
            control: 'select',
            options: [undefined, 'width', 'height', 'both'],
            description: 'Sync size to the anchor.',
            table: { type: { summary: 'enum' }, category: 'Properties' },
        },
        autoSizeBoundary: {
            control: false,
            table: { disable: false, category: 'Properties' },
            description: 'Elements used as auto-size boundary.',
        },
        autoSizePadding: {
            control: 'number',
            description: 'Padding before auto-size occurs.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        hoverBridge: {
            control: 'boolean',
            description: 'Adds invisible bridge to avoid hover gaps.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        contentBgColor: {
            control: 'text',
            description: 'Background color of the popup content.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        // Events category
        'ts-reposition': {
            action: 'ts-reposition',
            description: 'Emitted when the popup is repositioned.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        anchor: '',
        active: false,
        placement: 'top-start',
        strategy: 'absolute',
        distance: 10,
        skidding: 0,
        arrow: true,
        arrowPlacement: 'anchor',
        arrowPadding: 10,
        flip: true,
        flipFallbackPlacements: '',
        flipFallbackStrategy: 'best-fit',
        flipBoundary: undefined,
        flipPadding: 0,
        shift: true,
        shiftBoundary: undefined,
        shiftPadding: 0,
        autoSize: undefined,
        sync: undefined,
        autoSizeBoundary: undefined,
        autoSizePadding: 0,
        hoverBridge: false,
        contentBgColor: '',
    },
    decorators: [story => html`<div style="min-height:20px; padding-top:5rem">${story()}</div>`],
    render: args => {
        const popupRef = createRef<TsPopup>();
        return html`
            <ts-popup
                ${ref(popupRef)}
                anchor=${args.anchor || nothing}
                placement=${args.placement || nothing}
                strategy=${args.strategy || nothing}
                distance=${args.distance ?? nothing}
                skidding=${args.skidding ?? nothing}
                .active=${args.active}
                ?active=${args.active}
                .arrow=${args.arrow}
                ?arrow=${args.arrow}
                arrow-placement=${args.arrowPlacement || nothing}
                arrow-padding=${args.arrowPadding ?? nothing}
                .flip=${args.flip}
                ?flip=${args.flip}
                flip-fallback-placements=${args.flipFallbackPlacements || nothing}
                flip-fallback-strategy=${args.flipFallbackStrategy || nothing}
                flip-padding=${args.flipPadding ?? nothing}
                .shift=${args.shift}
                ?shift=${args.shift}
                shift-padding=${args.shiftPadding ?? nothing}
                auto-size=${args.autoSize || nothing}
                sync=${args.sync || nothing}
                auto-size-padding=${args.autoSizePadding ?? nothing}
                .hoverBridge=${args.hoverBridge}
                ?hover-bridge=${args.hoverBridge}
                content-bg-color=${args.contentBgColor || nothing}
            >
                <ts-button
                    slot="anchor"
                    variant="primary"
                    @click=${() => {
                        if (popupRef.value) popupRef.value.active = !popupRef.value.active;
                    }}
                    >Click to Toggle</ts-button
                >
                <div style="padding: 1rem;">
                    <strong>Popup Content</strong><br />
                    <span>This is the popup's content.</span>
                </div>
            </ts-popup>
        `;
    },
} satisfies MetaWithLabel<TsPopup & PopupEvents>;

export default meta;
type Story = StoryObjWithLabel<TsPopup>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the popup is inactive and hidden. Click the button to toggle its visibility.',
            },
        },
    },
    args: { active: true },
};

export const WithArrow: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add an arrow to your popup with the arrow property. It’s usually a good idea to set a distance to make room for the arrow. To adjust the arrow’s color and size, use the `--arrow-color` and `--arrow-size` custom properties, respectively. You can also target the arrow part to add additional styles such as shadows and borders.',
            },
        },
    },
    args: { active: true, arrow: true },
};

export const Placement: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `placement` property to tell the popup the preferred placement of the popup. Note that the actual position will vary to ensure the panel remains in the viewport if you\u2019re using positioning features such as flip and shift.',
            },
        },
    },
    args: { active: true, arrow: true, placement: 'right' },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'popup-event-log',
            entries: [
                { event: 'ts-reposition', firedWhen: 'The popup is repositioned by Floating UI', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: PopupArgs) => {
                const popupRef = createRef<TsPopup>();
                return wrap(html`
                    <ts-popup
                        ${ref(popupRef)}
                        placement=${args.placement || nothing}
                        .active=${args.active}
                        ?active=${args.active}
                        .arrow=${args.arrow}
                        ?arrow=${args.arrow}
                        distance=${args.distance ?? nothing}
                        .flip=${args.flip}
                        ?flip=${args.flip}
                        .shift=${args.shift}
                        ?shift=${args.shift}
                        @ts-reposition=${(e: TsRepositionEvent) => log('ts-reposition', e.detail)}
                    >
                        <ts-button
                            slot="anchor"
                            variant="primary"
                            @click=${() => {
                                if (popupRef.value) popupRef.value.active = !popupRef.value.active;
                            }}
                            >Click to Toggle</ts-button
                        >
                        <div style="padding: 1rem;">
                            <strong>Popup Content</strong><br />
                            <span>Interact to see ts-reposition fire.</span>
                        </div>
                    </ts-popup>
                `);
            },
        };
    })(),
};
