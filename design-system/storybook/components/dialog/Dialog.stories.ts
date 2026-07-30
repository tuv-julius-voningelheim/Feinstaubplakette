import { html, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import type { TsDialog } from '@tuvsud/design-system/dialog';
import type { StoryContext } from 'storybook/internal/types';

import type { TsAfterHideEvent } from '@utils/events/ts-after-hide.js';
import type { TsAfterShowEvent } from '@utils/events/ts-after-show.js';
import type { TsHideEvent } from '@utils/events/ts-hide.js';
import type { TsInitialFocusEvent } from '@utils/events/ts-initial-focus.js';
import type { TsShowEvent } from '@utils/events/ts-show.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/dialog';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/tooltip';
import '@tuvsud/design-system/input';

type DialogArgs = StoryContext<WebComponentsRenderer>['args'];

type DialogEvents = {
    'ts-show': unknown;
    'ts-after-show': unknown;
    'ts-hide': unknown;
    'ts-after-hide': unknown;
    'ts-initial-focus': unknown;
};

const meta = {
    title: 'Components/Dialog',
    component: 'ts-dialog',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Dialogs, sometimes called "modals", appear above the page and require the users immediate attention.',
            },
        },
    },
    argTypes: {
        // Properties category
        open: {
            control: 'boolean',
            description:
                'Indicates whether or not the dialog is open. Can be toggled via attribute or show()/hide() methods.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        noHeader: {
            control: 'boolean',
            description:
                'Disables the header. Also removes the default close button—ensure an accessible way to dismiss the dialog.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        preventOverlayClose: {
            control: 'boolean',
            description: 'Prevents the dialog from closing when clicking on the overlay.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        withoutModal: {
            control: 'boolean',
            description:
                'When true, the dialog opens without modal behaviour: the overlay is hidden, focus is not trapped, and body scrolling is not locked so the user can interact with background content.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        closable: {
            control: 'boolean',
            description: 'When true, the close button is shown. When false, the close button is hidden.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        closeTitle: {
            control: 'text',
            description:
                'The title text for the close button (shown on hover). Falls back to localized "close" text if not provided.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        modal: {
            control: false,
            table: { disable: false, category: 'Properties' },
            description:
                'Exposes the internal modal utility controlling focus trapping. Call modal.activateExternal() when opening a third-party modal, and modal.deactivateExternal() when it closes.',
        },
        // Accessibility category
        label: {
            control: 'text',
            description:
                'Label displayed in the header. Always provide a meaningful label, even with no-header; use the `label` slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-show': {
            action: 'ts-show',
            description: 'Emitted when the dialog opens.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-show': {
            action: 'ts-after-show',
            description: 'Emitted after the dialog opens and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-hide': {
            action: 'ts-hide',
            description: 'Emitted when the dialog closes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-hide': {
            action: 'ts-after-hide',
            description: 'Emitted after the dialog closes and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-initial-focus': {
            action: 'ts-initial-focus',
            description: 'Emitted when the dialog opens and is ready to receive focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        open: false,
        label: 'Dialog',
        noHeader: false,
        closable: true,
        closeTitle: '',
        preventOverlayClose: false,
        withoutModal: false,
    },
    render: args => {
        const dialogRef = createRef<TsDialog>();
        return html`
            <div style="height: 300px">
                <ts-dialog
                    ${ref(dialogRef)}
                    .open=${args.open}
                    ?open=${args.open}
                    label=${args.label || nothing}
                    .noHeader=${args.noHeader}
                    ?no-header=${args.noHeader}
                    .preventOverlayClose=${args.preventOverlayClose}
                    ?prevent-overlay-close=${args.preventOverlayClose}
                    .closable=${args.closable}
                    ?closable=${args.closable}
                    close-title=${args.closeTitle || nothing}
                    .withoutModal=${args.withoutModal}
                    ?without-modal=${args.withoutModal}
                >
                    Default dialog content.
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef.value?.hide()}>Close</ts-button>
                </ts-dialog>

                <ts-button variant="primary" @click=${() => dialogRef.value?.show()}>Open Dialog</ts-button>
            </div>
        `;
    },
} satisfies MetaWithLabel<TsDialog & DialogEvents>;

export default meta;
type Story = StoryObjWithLabel<TsDialog>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default dialog contains a header with a title and close button, content area, and footer with a close button.',
            },
        },
    },
    args: { label: 'Dialog Title' },
};

export const NoHeader: Story = {
    parameters: {
        docs: {
            description: {
                story: 'If the label property is not provided, the header text will not be displayed. However, the header placeholder remains visible by default. To completely remove the header section (including the close button), set the no-header property to true.',
            },
        },
    },
    args: { noHeader: true },
    render: args => {
        const dialogRef = createRef<TsDialog>();
        return html`
            <div style="height: 300px">
                <ts-dialog
                    ${ref(dialogRef)}
                    .open=${args.open}
                    ?open=${args.open}
                    label=${args.label || nothing}
                    .noHeader=${args.noHeader}
                    ?no-header=${args.noHeader}
                    .closable=${args.closable}
                    ?closable=${args.closable}
                    .closeTitle=${args.closeTitle}
                    close-title=${args.closeTitle || nothing}
                    .withoutModal=${args.withoutModal}
                    ?without-modal=${args.withoutModal}
                >
                    This dialog has no header.
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef.value?.hide()}>Close</ts-button>
                </ts-dialog>

                <ts-button variant="primary" @click=${() => dialogRef.value?.show()}>Open Dialog</ts-button>
            </div>
        `;
    },
};

export const LongContent: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When the dialog contains long content that exceeds the available space, a scroll bar will automatically appear in the content section. This ensures the dialog remains within the viewport while allowing users to access all content without resizing the dialog.',
            },
        },
    },
    args: { label: 'Scrolling Dialog' },
    render: args => {
        const dialogRef = createRef<TsDialog>();
        return html`
            <div style="height: 300px">
                <ts-dialog
                    ${ref(dialogRef)}
                    .open=${args.open}
                    ?open=${args.open}
                    label=${args.label || nothing}
                    .noHeader=${args.noHeader}
                    ?no-header=${args.noHeader}
                    .closable=${args.closable}
                    ?closable=${args.closable}
                    .closeTitle=${args.closeTitle}
                    close-title=${args.closeTitle || nothing}
                    .withoutModal=${args.withoutModal}
                    ?without-modal=${args.withoutModal}
                >
                    ${Array(20)
                        .fill('This is a line of content that will cause the dialog to scroll.')
                        .map(line => html`<div>${line}</div>`)}
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef.value?.hide()}>Close</ts-button>
                </ts-dialog>

                <ts-button variant="primary" @click=${() => dialogRef.value?.show()}>Open Dialog</ts-button>
            </div>
        `;
    },
};

export const CustomFooter: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The dialog supports a custom footer that can contain any HTML content. This footer is implemented as a slot, allowing developers to insert buttons, links, or any other custom elements as needed.',
            },
        },
    },
    args: { label: 'Custom Footer' },
    render: args => {
        const dialogRef = createRef<TsDialog>();
        return html`
            <div style="height: 300px">
                <ts-dialog
                    ${ref(dialogRef)}
                    .open=${args.open}
                    ?open=${args.open}
                    label=${args.label || nothing}
                    .noHeader=${args.noHeader}
                    ?no-header=${args.noHeader}
                    .closable=${args.closable}
                    ?closable=${args.closable}
                    .closeTitle=${args.closeTitle}
                    close-title=${args.closeTitle || nothing}
                    .withoutModal=${args.withoutModal}
                    ?without-modal=${args.withoutModal}
                >
                    This dialog has custom footer buttons.
                    <div slot="footer" style="display: flex; gap: 0.5rem; justify-content: flex-end">
                        <ts-button variant="default" @click=${() => dialogRef.value?.hide()}>Cancel</ts-button>
                        <ts-button variant="primary">Save Changes</ts-button>
                    </div>
                </ts-dialog>

                <ts-button variant="primary" @click=${() => dialogRef.value?.show()}>Open Dialog</ts-button>
            </div>
        `;
    },
};

export const NotClosable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To hide the close icon, set the closable property to false. It should be used together with preventOverlayClose when the goal is to wait for user interaction.',
            },
        },
    },
    args: {
        label: 'Non-Closable Dialog',
        closable: false,
        preventOverlayClose: true,
    },
    render: args => {
        const dialogRef = createRef<TsDialog>();
        return html`
            <div style="height: 300px">
                <ts-dialog
                    ${ref(dialogRef)}
                    .open=${args.open}
                    ?open=${args.open}
                    label=${args.label || nothing}
                    .noHeader=${args.noHeader}
                    ?no-header=${args.noHeader}
                    .closable=${args.closable}
                    ?closable=${args.closable}
                    .preventOverlayClose=${args.preventOverlayClose}
                    ?prevent-overlay-close=${args.preventOverlayClose}
                    .closeTitle=${args.closeTitle}
                    close-title=${args.closeTitle || nothing}
                    .withoutModal=${args.withoutModal}
                    ?without-modal=${args.withoutModal}
                >
                    This dialog has no close button in the header.You must use the footer button to close it.
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef.value?.hide()}
                        >Close Dialog</ts-button
                    >
                </ts-dialog>

                <ts-button variant="primary" @click=${() => dialogRef.value?.show()}>Open Dialog</ts-button>
            </div>
        `;
    },
};

export const CustomCloseTitle: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The close-title property allows you to customize the tooltip text that appears when hovering over the close button. This is useful for providing more specific or localized close button labels.',
            },
        },
    },
    args: {
        label: 'Custom Close Title',
        closeTitle: 'Dismiss this dialog',
    },
    render: args => {
        const dialogRef = createRef<TsDialog>();
        return html`
            <div style="height: 300px">
                <ts-dialog
                    ${ref(dialogRef)}
                    .open=${args.open}
                    ?open=${args.open}
                    label=${args.label || nothing}
                    .noHeader=${args.noHeader}
                    ?no-header=${args.noHeader}
                    .closable=${args.closable}
                    ?closable=${args.closable}
                    .closeTitle=${args.closeTitle}
                    close-title=${args.closeTitle || nothing}
                    .withoutModal=${args.withoutModal}
                    ?without-modal=${args.withoutModal}
                >
                    Hover over the close button(X) in the header to see the custom tooltip text.
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef.value?.hide()}>Close</ts-button>
                </ts-dialog>

                <ts-button variant="primary" @click=${() => dialogRef.value?.show()}>Open Dialog</ts-button>
            </div>
        `;
    },
};

export const MultipleDialogs: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This story demonstrates that multiple dialog instances can coexist with unique title IDs, ensuring proper accessibility. Each dialog maintains its own unique identifier for screen readers.',
            },
        },
    },
    args: {
        label: 'Dialog 1',
    },
    render: args => {
        const dialogRef1 = createRef<TsDialog>();
        const dialogRef2 = createRef<TsDialog>();
        return html`
            <div style="height: 300px">
                <ts-dialog
                    ${ref(dialogRef1)}
                    .open=${args.open}
                    ?open=${args.open}
                    label="First Dialog"
                    close-title="Close first dialog"
                >
                    This is the first dialog with its own unique title ID.
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef1.value?.hide()}
                        >Close First</ts-button
                    >
                </ts-dialog>

                <ts-dialog ${ref(dialogRef2)} label="Second Dialog" close-title="Close second dialog">
                    This is the second dialog with its own unique title ID.
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef2.value?.hide()}
                        >Close Second</ts-button
                    >
                </ts-dialog>

                <div style="display: flex; gap: 1rem;">
                    <ts-button variant="primary" @click=${() => dialogRef1.value?.show()}>Open First Dialog</ts-button>
                    <ts-button variant="primary" @click=${() => dialogRef2.value?.show()}>Open Second Dialog</ts-button>
                </div>
            </div>
        `;
    },
};

export const EmptyHeaderActions: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When both closable is false and there are no header-actions, the header-actions section is not rendered at all, eliminating empty padding.',
            },
        },
    },
    args: {
        label: 'Clean Header',
        closable: false,
    },
    render: args => {
        const dialogRef = createRef<TsDialog>();
        return html`
            <div style="height: 300px">
                <ts-dialog
                    ${ref(dialogRef)}
                    .open=${args.open}
                    ?open=${args.open}
                    label=${args.label || nothing}
                    .closable=${args.closable}
                    ?closable=${args.closable}
                    .withoutModal=${args.withoutModal}
                    ?without-modal=${args.withoutModal}
                >
                    This dialog has no close button and no header actions, so the header-actions section is not
                    rendered.
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef.value?.hide()}
                        >Close Dialog</ts-button
                    >
                </ts-dialog>

                <ts-button variant="primary" @click=${() => dialogRef.value?.show()}>Open Dialog</ts-button>
            </div>
        `;
    },
};

export const WithoutModal: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When `without-modal` is set, the dialog opens without an overlay, does not trap focus, and does not lock body scrolling. The user can freely interact with content behind the dialog while it is open. A border is added to the panel to visually distinguish it from the page content.',
            },
        },
    },
    args: {
        label: 'Without-Modal Dialog',
        withoutModal: true,
    },
    render: args => {
        const dialogRef = createRef<TsDialog>();
        return html`
            <div style="height: 400px; position: relative;">
                <p>
                    This text is in the background. When the dialog is open, you can still select this text, click
                    links, and interact with the page normally.
                </p>
                <ts-dialog
                    ${ref(dialogRef)}
                    .open=${args.open}
                    ?open=${args.open}
                    label=${args.label || nothing}
                    .withoutModal=${args.withoutModal}
                    ?without-modal=${args.withoutModal}
                    .closable=${args.closable}
                    ?closable=${args.closable}
                >
                    The overlay is hidden and background interaction is fully enabled.
                    <ts-button slot="footer" variant="primary" @click=${() => dialogRef.value?.hide()}>Close</ts-button>
                </ts-dialog>

                <ts-button variant="primary" @click=${() => dialogRef.value?.show()}
                    >Open without-modal Dialog</ts-button
                >
            </div>
        `;
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'dialog-event-log',
            entries: [
                { event: 'ts-show', firedWhen: 'The dialog starts to open', detail: 'void' },
                {
                    event: 'ts-after-show',
                    firedWhen: 'The dialog finishes opening (animation complete)',
                    detail: 'void',
                },
                { event: 'ts-hide', firedWhen: 'The dialog starts to close', detail: 'void' },
                {
                    event: 'ts-after-hide',
                    firedWhen: 'The dialog finishes closing (animation complete)',
                    detail: 'void',
                },
                {
                    event: 'ts-initial-focus',
                    firedWhen: 'The dialog opens and is ready to receive focus',
                    detail: 'void',
                },
            ],
        });
        return {
            parameters,
            render: (args: DialogArgs) => {
                const dialogRef = createRef<TsDialog>();
                return wrap(html`
                    <div style="height: 300px">
                        <ts-dialog
                            ${ref(dialogRef)}
                            .open=${args.open}
                            ?open=${args.open}
                            label=${args.label || nothing}
                            .noHeader=${args.noHeader}
                            ?no-header=${args.noHeader}
                            .preventOverlayClose=${args.preventOverlayClose}
                            ?prevent-overlay-close=${args.preventOverlayClose}
                            .closable=${args.closable}
                            ?closable=${args.closable}
                            .closeTitle=${args.closeTitle}
                            close-title=${args.closeTitle || nothing}
                            .withoutModal=${args.withoutModal}
                            ?without-modal=${args.withoutModal}
                            @ts-show=${(e: TsShowEvent) => log('ts-show', e.detail)}
                            @ts-after-show=${(e: TsAfterShowEvent) => log('ts-after-show', e.detail)}
                            @ts-hide=${(e: TsHideEvent) => log('ts-hide', e.detail)}
                            @ts-after-hide=${(e: TsAfterHideEvent) => log('ts-after-hide', e.detail)}
                            @ts-initial-focus=${(e: TsInitialFocusEvent) => log('ts-initial-focus', e.detail)}
                        >
                            Interact with this dialog to see events fired in real time.
                            <ts-button slot="footer" variant="primary" @click=${() => dialogRef.value?.hide()}
                                >Close</ts-button
                            >
                        </ts-dialog>

                        <ts-button variant="primary" @click=${() => dialogRef.value?.show()}>Open Dialog</ts-button>
                    </div>
                `);
            },
        };
    })(),
};
