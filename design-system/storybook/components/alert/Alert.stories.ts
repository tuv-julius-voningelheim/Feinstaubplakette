import { html, nothing } from 'lit';

import type { TsAlert } from '@tuvsud/design-system/alert';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/alert';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';

type AlertArgs = StoryContext<WebComponentsRenderer>['args'];

type AlertEvents = {
    'ts-show': unknown;
    'ts-after-show': unknown;
    'ts-hide': unknown;
    'ts-after-hide': unknown;
};

const meta = {
    title: 'Components/Alert',
    component: 'ts-alert',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'The Alert component is used to inform users about important information, warnings, or errors. It supports user guidance and improves transparency within the interface.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/design/nht3ll2wvoSna1hPnxuPEB/T%C3%9CV-S%C3%9CD-Base-Components?node-id=8-407&t=2q4sw2NXuXvjYJjK-4',
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'success', 'neutral', 'warning', 'danger'],
            description: 'Visual style of the alert, defining its semantic meaning.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'primary' },
                category: 'Properties',
            },
        },
        open: {
            control: 'boolean',
            description: 'Controls whether the alert is visible.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        closable: {
            control: 'boolean',
            description: 'If true, the alert can be dismissed by the user.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        duration: {
            control: 'number',
            description: 'Time in milliseconds before the alert auto-closes. Use `Infinity` to disable auto-close.',
            table: { type: { summary: 'number' }, defaultValue: { summary: 'Infinity' }, category: 'Properties' },
        },
        placement: {
            control: { type: 'select' },
            options: ['inline', 'top'],
            description: 'Defines the placement of the alert within the application layout.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'inline' }, category: 'Properties' },
        },
        countdown: {
            control: { type: 'select' },
            options: [undefined, 'rtl', 'ltr'],
            description:
                'Shows a countdown progress bar indicating the remaining time before auto-close. Requires `duration` to be set. `"rtl"` fills right-to-left, `"ltr"` fills left-to-right.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'undefined' }, category: 'Properties' },
        },
        'ts-show': {
            action: 'ts-show',
            description: 'Emitted when the alert starts to show (open becomes true).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-show': {
            action: 'ts-after-show',
            description: 'Emitted after the alert finishes showing and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-hide': {
            action: 'ts-hide',
            description: 'Emitted when the alert starts to hide (open becomes false or dismissed).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-hide': {
            action: 'ts-after-hide',
            description: 'Emitted after the alert finishes hiding and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        variant: 'primary',
        open: true,
        closable: true,
        duration: undefined,
        placement: 'inline',
        countdown: undefined,
    },
    render: args => html`
        <ts-alert
            .variant=${args.variant}
            variant=${args.variant || nothing}
            .open=${args.open}
            ?open=${args.open}
            .closable=${args.closable}
            ?closable=${args.closable}
            .duration=${args.duration}
            duration=${args.duration ?? nothing}
            .placement=${args.placement}
            placement=${args.placement || nothing}
            .countdown=${args.countdown}
            countdown=${args.countdown || nothing}
        >
            <ts-icon slot="icon" library="system" name="info" size="24"></ts-icon>
            Alert message goes here.
        </ts-alert>
    `,
} satisfies MetaWithLabel<TsAlert & AlertEvents>;

export default meta;
type Story = StoryObjWithLabel<TsAlert>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the alert is of `primary` variant.',
            },
        },
    },
};

export const Variants: Story = {
    parameters: {
        docs: {
            description: {
                story: "Set the `variant` property to change the alert's variant.",
            },
        },
    },
    render: args => html`
        <div class="sb-story-wrapper--column">
            <ts-alert
                variant="primary"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .duration=${args.duration}
                duration=${args.duration ?? nothing}
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/info.svg" alt="filter" />
                </ts-icon>
                Primary alert
            </ts-alert>

            <ts-alert
                variant="success"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .duration=${args.duration}
                duration=${args.duration ?? nothing}
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/task_alt.svg" alt="filter" />
                </ts-icon>
                Success alert
            </ts-alert>

            <ts-alert
                variant="warning"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .duration=${args.duration}
                duration=${args.duration ?? nothing}
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/warning.svg" alt="filter" />
                </ts-icon>
                Warning alert
            </ts-alert>

            <ts-alert
                variant="danger"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .duration=${args.duration}
                duration=${args.duration ?? nothing}
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/error.svg" alt="filter" />
                </ts-icon>
                Danger alert
            </ts-alert>

            <ts-alert
                variant="neutral"
                .open=${args.open}
                ?open=${args.open}
                .closable=${args.closable}
                ?closable=${args.closable}
                .duration=${args.duration}
                duration=${args.duration ?? nothing}
            >
                <ts-icon slot="icon" size="24">
                    <img src="/assets/svg/lightbulb_circle.svg" alt="filter" />
                </ts-icon>
                Neutral alert
            </ts-alert>
        </div>
    `,
};

export const ShortBody: Story = {
    parameters: {
        docs: {
            description: {
                story: 'An alert with a bold header and a short descriptive body line below it.',
            },
        },
    },
    render: args => html`
        <ts-alert
            variant="success"
            .open=${args.open}
            ?open=${args.open}
            .closable=${args.closable}
            ?closable=${args.closable}
            .duration=${args.duration}
            duration=${args.duration ?? nothing}
        >
            <ts-icon slot="icon" size="24">
                <img src="/assets/svg/task_alt.svg" alt="filter" />
            </ts-icon>
            <strong>Success header</strong>
            <div>This is a more detailed message body for the success alert.</div>
        </ts-alert>
    `,
};

export const LongBody: Story = {
    parameters: {
        docs: {
            description: {
                story: 'An alert with a bold header and multiple body lines to show how the component handles longer content.',
            },
        },
    },
    render: args => html`
        <ts-alert
            variant="success"
            .open=${args.open}
            ?open=${args.open}
            .closable=${args.closable}
            ?closable=${args.closable}
            .duration=${args.duration}
            duration=${args.duration ?? nothing}
        >
            <ts-icon slot="icon" size="24">
                <img src="/assets/svg/task_alt.svg" alt="filter" />
            </ts-icon>
            <strong>Success header</strong>
            <div>This is a more detailed message body for the success alert.</div>
            <div>This is a more detailed message body for the success alert.</div>
            <div>This is a more detailed message body for the success alert.</div>
            <div>This is a more detailed message body for the success alert.</div>
            <div>This is a more detailed message body for the success alert.</div>
        </ts-alert>
    `,
};

export const CustomContent: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default slot accepts arbitrary HTML. Use it to build rich layouts — such as a title + description on the left and an action button on the right — without the close button.',
            },
        },
    },
    args: {
        closable: false,
    },
    render: args => html`
        <ts-alert
            variant="success"
            .open=${args.open}
            ?open=${args.open}
            .closable=${false}
            .duration=${args.duration}
            duration=${args.duration ?? nothing}
        >
            <ts-icon slot="icon" size="20">
                <img src="/assets/svg/open_in_new.svg" alt="autorenew" />
            </ts-icon>
            <div
                style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%;"
            >
                <div>
                    <h4 style="margin: 0;">WM Action</h4>
                    <span
                        >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                        ut labore et dolore magna aliquyam erat, sed diam voluptua.</span
                    >
                </div>
                <div>
                    <ts-button variant="success" size="small">Subscribe now</ts-button>
                </div>
            </div>
        </ts-alert>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'alert-event-log',
            entries: [
                { event: 'ts-show', firedWhen: 'The alert starts to show (open becomes true)', detail: 'void' },
                {
                    event: 'ts-after-show',
                    firedWhen: 'The alert finishes showing (animation complete)',
                    detail: 'void',
                },
                {
                    event: 'ts-hide',
                    firedWhen: 'The alert starts to hide (dismissed or open set to false)',
                    detail: 'void',
                },
                { event: 'ts-after-hide', firedWhen: 'The alert finishes hiding (animation complete)', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: AlertArgs) =>
                wrap(html`
                    <ts-alert
                        .variant=${args.variant}
                        variant=${args.variant || nothing}
                        .open=${args.open}
                        ?open=${args.open}
                        .closable=${args.closable}
                        ?closable=${args.closable}
                        .duration=${args.duration}
                        duration=${args.duration ?? nothing}
                        .placement=${args.placement}
                        placement=${args.placement || nothing}
                        .countdown=${args.countdown}
                        countdown=${args.countdown || nothing}
                        @ts-show=${(e: CustomEvent) => log('ts-show', e.detail)}
                        @ts-after-show=${(e: CustomEvent) => log('ts-after-show', e.detail)}
                        @ts-hide=${(e: CustomEvent) => log('ts-hide', e.detail)}
                        @ts-after-hide=${(e: CustomEvent) => log('ts-after-hide', e.detail)}
                    >
                        <ts-icon slot="icon" size="24">
                            <img src="/assets/svg/info.svg" alt="filter" />
                        </ts-icon>
                        Alert message goes here.
                    </ts-alert>
                `),
        };
    })(),
};
