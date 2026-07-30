import { html, nothing } from 'lit';

import type { TsCopyButton } from '@tuvsud/design-system/copy-button';
import type { StoryContext } from 'storybook/internal/types';

import type { TsCopyEvent, TsErrorEvent } from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/copy-button';
import '@tuvsud/design-system/icon';

type CopyButtonArgs = StoryContext<WebComponentsRenderer>['args'];

type CopyButtonEvents = {
    'ts-copy': unknown;
    'ts-error': unknown;
};

const meta = {
    title: 'Components/Copy Button',
    component: 'ts-copy-button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Copy Button allows users to quickly copy text or content to their clipboard with a single click. It provides immediate feedback through visual states and tooltips.',
            },
        },
    },
    argTypes: {
        // Properties category
        value: {
            control: 'text',
            description: 'The text value to copy.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        from: {
            control: 'text',
            description:
                'Element id to copy from. Supports attribute via [attr] and property via .prop (e.g., "el[value]" or "el.value"). Takes precedence over value.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the copy button.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        copyLabel: {
            control: 'text',
            description: 'Custom tooltip label.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        successLabel: {
            control: 'text',
            description: 'Tooltip label shown after copying.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        errorLabel: {
            control: 'text',
            description: 'Tooltip label shown when a copy error occurs.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        feedbackDuration: {
            control: 'number',
            description: 'Duration in ms to show feedback before restoring the default trigger.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1000' }, category: 'Properties' },
        },
        tooltipPlacement: {
            control: 'select',
            options: ['top', 'right', 'bottom', 'left'],
            description: 'Preferred placement of the tooltip.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'top' }, category: 'Properties' },
        },
        hoist: {
            control: 'boolean',
            description: 'Prevents tooltip clipping in scrollable containers by using fixed positioning.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Events category
        'ts-copy': {
            action: 'ts-copy',
            description: 'Emitted when the data has been copied.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-error': {
            action: 'ts-error',
            description: 'Emitted when the data could not be copied.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        value: 'this value will be copied to clipboard',
        from: '',
        disabled: false,
        copyLabel: '',
        successLabel: '',
        errorLabel: '',
        feedbackDuration: 1000,
        tooltipPlacement: 'top',
        hoist: false,
    },
    render: args => html`
        <ts-copy-button
            value=${args.value || nothing}
            from=${args.from || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            copy-label=${args.copyLabel || nothing}
            success-label=${args.successLabel || nothing}
            error-label=${args.errorLabel || nothing}
            .feedbackDuration=${args.feedbackDuration}
            feedback-duration=${args.feedbackDuration ?? nothing}
            tooltip-placement=${args.tooltipPlacement || nothing}
            .hoist=${args.hoist}
            ?hoist=${args.hoist}
        >
            Copy
        </ts-copy-button>
    `,
} satisfies MetaWithLabel<TsCopyButton & CopyButtonEvents>;

export default meta;
type Story = StoryObjWithLabel<TsCopyButton>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default copy button state is enabled and ready to copy the preset value.',
            },
        },
    },
};

export const FromElements: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The copy button can copy text from other elements by specifying the element ID using the `from` attribute.',
            },
        },
    },
    render: () => html`
        <span id="phone-number" style="color: var(--ts-semantic-color-text-base-default);">+1 (234) 456-7890</span>
        <ts-copy-button from="phone-number"></ts-copy-button>
    `,
};

export const Error: Story = {
    parameters: {
        docs: {
            description: {
                story: 'If the copy action fails (e.g., due to an invalid `from` reference), the button will show an error state and emit a `ts-error` event.',
            },
        },
    },
    render: () => html` <ts-copy-button error-label="Can't be copied" from="id"></ts-copy-button> `,
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The copy button can copy text from other elements by specifying the element ID using the `from` attribute.',
            },
        },
    },
    render: () => html` <ts-copy-button disabled></ts-copy-button> `,
};

export const CustomCopyIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `copy-icon` slot to replace the default copy icon with a custom one.',
            },
        },
    },
    render: () => html`
        <ts-copy-button value="Custom copy icon example">
            <ts-icon slot="copy-icon" size="20" name="integration_instructions" style="--icon-color: #ff7272">
                <img src="/assets/svg/folder_copy.svg" alt="filter" />
            </ts-icon>
            <ts-icon slot="success-icon" size="20" style="--icon-color: rgba(58,163,96,0.5)">
                <img src="/assets/svg/task_alt.svg" alt="filter" />
            </ts-icon>
        </ts-copy-button>
    `,
};

export const CustomSuccessIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `success-icon` slot to replace the default success (checkmark) icon with a custom one.',
            },
        },
    },
    render: () => html`
        <ts-copy-button value="Custom success icon example">
            <ts-icon slot="success-icon" style="--icon-color: rgba(58,163,96,0.5)">
                <img src="/assets/svg/task_alt.svg" alt="filter" />
            </ts-icon>
        </ts-copy-button>
    `,
};

export const CustomErrorIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `error-icon` slot to replace the default error icon with a custom one.',
            },
        },
    },
    render: () => html`
        <ts-copy-button from="nonexistent-id">
            <ts-icon slot="error-icon" name="cancel" style="--icon-color: #ff7272">
                <img src="/assets/svg/error.svg" alt="filter" />
            </ts-icon>
        </ts-copy-button>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'copy-button-event-log',
            entries: [
                { event: 'ts-copy', firedWhen: 'The data has been copied to clipboard', detail: 'TsCopyDetail' },
                { event: 'ts-error', firedWhen: 'The data could not be copied', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: CopyButtonArgs) =>
                wrap(html`
                    <ts-copy-button
                        value=${args.value || nothing}
                        .disabled=${args.disabled}
                        ?disabled=${args.disabled}
                        .feedbackDuration=${args.feedbackDuration}
                        feedback-duration=${args.feedbackDuration ?? nothing}
                        tooltip-placement=${args.tooltipPlacement || nothing}
                        @ts-copy=${(e: TsCopyEvent) => log('ts-copy', e.detail)}
                        @ts-error=${(e: TsErrorEvent) => log('ts-error', e.detail)}
                    >
                        Copy
                    </ts-copy-button>
                `),
        };
    })(),
};
