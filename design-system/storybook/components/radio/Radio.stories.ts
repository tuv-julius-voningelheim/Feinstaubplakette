import { html } from 'lit';
import { nothing } from 'lit';

import type { TsRadio } from '@tuvsud/design-system/radio';
import type { StoryContext } from 'storybook/internal/types';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/radio';
import '@tuvsud/design-system/radio-button';
import '@tuvsud/design-system/radio-group';

type RadioArgs = StoryContext<WebComponentsRenderer>['args'];

type RadioEvents = {
    'ts-blur': unknown;
    'ts-focus': unknown;
};

const meta = {
    title: 'Components/Radio',
    component: 'ts-radio',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A radio is a single selectable option within a set, representing one mutually exclusive choice.',
            },
        },
    },
    argTypes: {
        // Properties category
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: "The radio's size. In a group, the group's size wins.",
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'medium' },
                category: 'Properties',
            },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the radio.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description:
                'Help text displayed below the radio label. For HTML content, use the `help-text` slot instead.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        helpTextVisuallyHidden: {
            control: 'boolean',
            description: 'Visually hides the help text but keeps it accessible to screen readers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Form category
        error: {
            control: 'boolean',
            description: 'Puts the radio in an error state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorMessage: {
            control: 'text',
            description: 'Custom error message displayed below the radio when in an error state.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        // Accessibility category
        ariaLabel: {
            control: 'text',
            description:
                "The radio's aria-label attribute for accessibility. Required when the radio has no visible label.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        label: {
            control: 'text',
            description: 'Label of the radio button.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the radio loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-focus': {
            action: 'ts-focus',
            description: 'Emitted when the radio gains focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        size: 'medium',
        disabled: false,
        error: false,
        errorMessage: '',
        helpText: '',
        helpTextVisuallyHidden: false,
        ariaLabel: '',
        label: 'Select an option',
    },
    render: args => html`
        <ts-radio
            .size=${args.size}
            size=${args.size || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            value="1"
            ?error=${args.error}
            .errorMessage=${args.errorMessage}
            error-message=${args.errorMessage || nothing}
            help-text=${args.helpText || nothing}
            ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
            aria-label=${args.ariaLabel || nothing}
        >
            Option
        </ts-radio>
    `,
} satisfies MetaWithLabel<TsRadio & RadioEvents>;

export default meta;
type Story = StoryObjWithLabel<TsRadio>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the radio is unselected.',
            },
        },
    },
    args: { label: 'Default Radio' },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `size` property to change the radio size. Available sizes are `small`, `medium` (default), and `large`. When used inside a radio group, the group size takes precedence.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <ts-radio size="small" value="s">Small option</ts-radio>
            <ts-radio size="medium" value="m">Medium option</ts-radio>
            <ts-radio size="large" value="l">Large option</ts-radio>
        </div>
    `,
};

export const DisabledOption: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` property to disable a radio. Disabled radios are not interactive and visually dimmed.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <ts-radio value="enabled">Enabled option</ts-radio>
            <ts-radio value="disabled" disabled>Disabled option</ts-radio>
        </div>
    `,
};

export const WithHelpText: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `help-text` property to add descriptive text below each radio option.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <ts-radio value="all" help-text="You will receive all notifications.">All notifications</ts-radio>
            <ts-radio value="important" help-text="Only high-priority alerts will be sent.">Important only</ts-radio>
            <ts-radio value="none" help-text="No notifications will be sent to you.">None</ts-radio>
        </div>
    `,
};

export const HelpTextHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `help-text-visually-hidden` to keep help text accessible to screen readers while hiding it visually.',
            },
        },
    },
    render: () => html`
        <ts-radio value="important" help-text="Only high-priority alerts will be sent." help-text-visually-hidden
            >Important only</ts-radio
        >
    `,
};

export const Error: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `error` property to put the radio in an error state. Combine with `error-message` to show a descriptive validation message below the radio.',
            },
        },
    },
    render: () => html`
        <ts-radio value="option" error error-message="Please select a valid option.">Error Option</ts-radio>
    `,
};

export const ErrorWithoutMessage: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The `error` state can be used without an `error-message` when the error context is communicated elsewhere (e.g. by the containing radio group).',
            },
        },
    },
    render: () => html` <ts-radio value="option" error>Error Option</ts-radio> `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'radio-event-log',
            entries: [
                { event: 'ts-focus', firedWhen: 'The radio gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'The radio loses focus', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: RadioArgs) =>
                wrap(html`
                    <ts-radio-group label="Select an option" name="radio-events" value="1">
                        <ts-radio
                            value="1"
                            size=${args.size || nothing}
                            @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                            @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                            >Option 1</ts-radio
                        >
                        <ts-radio
                            value="2"
                            size=${args.size || nothing}
                            @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                            @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                            >Option 2</ts-radio
                        >
                    </ts-radio-group>
                `),
        };
    })(),
};
