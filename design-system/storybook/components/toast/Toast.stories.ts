import { html, nothing } from 'lit';

import type { TsToast } from '@tuvsud/design-system/toast';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/toast';
import '@tuvsud/design-system/icon';

type ToastArgs = StoryContext<WebComponentsRenderer>['args'];

type ToastEvents = {
    'ts-show': unknown;
    'ts-after-show': unknown;
    'ts-hide': unknown;
    'ts-after-hide': unknown;
    'ts-close': unknown;
};

const meta = {
    title: 'Components/Toast',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'The Toast component is used to show brief, non-blocking messages. It supports variants, optional dismiss actions, loading state and stacked placements.',
            },
        },
    },
    args: {
        variant: 'primary',
        open: true,
        closable: true,
        loading: false,
        duration: Infinity,
        placement: 'inline',
    },
    argTypes: {
        // Properties category
        variant: {
            control: { type: 'select' },
            options: ['primary', 'success', 'neutral', 'warning', 'danger'],
            description: 'Visual style of the toast, defining its semantic meaning.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'primary' }, category: 'Properties' },
        },
        open: {
            control: 'boolean',
            description: 'Controls whether the toast is visible.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        closable: {
            control: 'boolean',
            description: 'If true, the toast can be dismissed by the user.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        loading: {
            control: 'boolean',
            description: 'If true, shows a spinner and disables auto-hide and close action.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        duration: {
            control: 'number',
            description: 'Time in milliseconds before the toast auto-hides. Use Infinity to disable auto-hide.',
            table: { type: { summary: 'number' }, defaultValue: { summary: 'Infinity' }, category: 'Properties' },
        },
        placement: {
            control: { type: 'select' },
            options: [
                'inline',
                'top-right',
                'top-left',
                'bottom-right',
                'bottom-left',
                'top-center',
                'bottom-center',
                'top',
            ],
            description:
                'Defines where the toast is rendered. Non-inline placements will mount into a stack in document.body.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'inline' }, category: 'Properties' },
        },
        // Events category
        'ts-show': {
            action: 'ts-show',
            description: 'Emitted when the toast begins to show.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-show': {
            action: 'ts-after-show',
            description: 'Emitted after the toast has shown and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-hide': {
            action: 'ts-hide',
            description: 'Emitted when the toast begins to hide.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-hide': {
            action: 'ts-after-hide',
            description: 'Emitted after the toast has hidden and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-close': {
            action: 'ts-close',
            description: 'Emitted when the toast is closed by the user.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    render: args => html`
        <ts-toast
            variant=${args.variant}
            .open=${args.open}
            ?open=${args.open}
            .closable=${args.closable}
            ?closable=${args.closable}
            .loading=${args.loading}
            ?loading=${args.loading}
            .duration=${args.duration}
            duration=${args.duration}
            placement=${args.placement}
        >
            <ts-icon slot="icon" size="24">
                <img src="/assets/svg/info.svg" alt="filter" />
            </ts-icon>
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <strong>Toast</strong>
                <span>Toast message goes here.</span>
            </div>
        </ts-toast>
    `,
} satisfies MetaWithLabel<TsToast & ToastEvents>;

export default meta;
type Story = StoryObjWithLabel<TsToast>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the toast is `primary`, open, and inline.',
            },
        },
    },
};

export const Variants: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set the `variant` property to change the toast’s semantic meaning.',
            },
        },
    },
    render: args => html`
        <div class="sb-story-wrapper--column">
            <ts-toast
                variant="primary"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .loading=${args.loading}
                ?loading=${args.loading}
                .duration=${args.duration}
                duration=${args.duration}
                placement="inline"
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/info.svg" alt="filter" />
                </ts-icon>
                Primary toast
            </ts-toast>

            <ts-toast
                variant="success"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .loading=${args.loading}
                ?loading=${args.loading}
                .duration=${args.duration}
                duration=${args.duration}
                placement="inline"
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/task_alt.svg" alt="filter" />
                </ts-icon>
                Success toast
            </ts-toast>

            <ts-toast
                variant="warning"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .loading=${args.loading}
                ?loading=${args.loading}
                .duration=${args.duration}
                duration=${args.duration}
                placement="inline"
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/warning.svg" alt="filter" />
                </ts-icon>
                Warning toast
            </ts-toast>

            <ts-toast
                variant="danger"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .loading=${args.loading}
                ?loading=${args.loading}
                .duration=${args.duration}
                duration=${args.duration}
                placement="inline"
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/error.svg" alt="filter" />
                </ts-icon>
                Danger toast
            </ts-toast>

            <ts-toast
                variant="neutral"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .loading=${args.loading}
                ?loading=${args.loading}
                .duration=${args.duration}
                duration=${args.duration}
                placement="inline"
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/lightbulb.svg" alt="filter" />
                </ts-icon>
                Neutral toast
            </ts-toast>
        </div>
    `,
};

export const AutoHide: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use a finite `duration` to auto-hide.',
            },
        },
    },
    render: () => html`
        <ts-toast variant="primary" open closable .duration=${3000} duration="3000" placement="inline">
            <ts-icon slot="icon" library="system" name="info" size="24"></ts-icon>
            This toast will auto-hide after 3 seconds.
        </ts-toast>
    `,
};

export const Loading: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When `loading` is true, the spinner is shown and auto-hide/closing are disabled.',
            },
        },
    },
    render: args => html`
        <ts-toast
            variant=${args.variant}
            .open=${args.open}
            ?open=${args.open}
            .closable=${args.closable}
            ?closable=${args.closable}
            loading
            .duration=${args.duration}
            duration=${args.duration}
            placement="inline"
        >
            <ts-icon slot="icon" library="system" name="info" size="24"></ts-icon>
            Loading…
        </ts-toast>
    `,
};

export const LongBody: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The toast body can contain multiple lines and custom markup.',
            },
        },
    },
    render: args => html`
        <ts-toast
            variant=${args.variant}
            .open=${args.open}
            ?open=${args.open}
            .closable=${args.closable}
            ?closable=${args.closable}
            .loading=${args.loading}
            ?loading=${args.loading}
            .duration=${args.duration}
            duration=${args.duration}
            placement=${args.placement}
        >
            <ts-icon slot="icon" library="system" name="info" size="24"></ts-icon>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua.
        </ts-toast>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'toast-event-log',
            entries: [
                { event: 'ts-show', firedWhen: 'Toast begins to show', detail: 'void' },
                { event: 'ts-after-show', firedWhen: 'Toast fully shown (animations done)', detail: 'void' },
                { event: 'ts-hide', firedWhen: 'Toast begins to hide', detail: 'void' },
                { event: 'ts-after-hide', firedWhen: 'Toast fully hidden (animations done)', detail: 'void' },
                { event: 'ts-close', firedWhen: 'Toast closed by user', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: ToastArgs) =>
                wrap(html`
                    <div style="padding: 1rem;">
                        <ts-toast
                            variant=${args.variant || nothing}
                            placement="inline"
                            open
                            closable
                            @ts-show=${(e: CustomEvent) => log('ts-show', e.detail)}
                            @ts-after-show=${(e: CustomEvent) => log('ts-after-show', e.detail)}
                            @ts-hide=${(e: CustomEvent) => log('ts-hide', e.detail)}
                            @ts-after-hide=${(e: CustomEvent) => log('ts-after-hide', e.detail)}
                            @ts-close=${(e: CustomEvent) => log('ts-close', e.detail)}
                        >
                            <ts-icon slot="icon" library="system" name="info" size="24"></ts-icon>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <strong>Toast</strong>
                                <span>Interact with this toast to see events fire.</span>
                            </div>
                        </ts-toast>
                    </div>
                `),
        };
    })(),
};
