import { html, nothing } from 'lit';

import type { TsSpinner } from '@tuvsud/design-system/spinner';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/spinner';

const meta = {
    title: 'Components/Spinner',
    component: 'ts-spinner',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'The spinner component visually represents the state of an indeterminate process.',
            },
        },
        chromatic: { pauseAnimationAtEnd: false },
    },
    argTypes: {
        // Accessibility category
        label: {
            control: 'text',
            description:
                'A custom accessible label for the spinner. If omitted, defaults to the localized "Loading" term.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
    },
    args: {
        label: '',
    },
    render: (args: { label?: string }) => {
        return html`<ts-spinner label=${args.label || nothing}></ts-spinner>`;
    },
} satisfies MetaWithLabel<TsSpinner>;

export default meta;
type Story = StoryObjWithLabel<TsSpinner>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default spinner at 1em size.',
            },
        },
    },
    args: {},
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `font-size` to control the size of the spinner.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; align-items: center; gap: 1rem;">
            <ts-spinner style="font-size: 1rem;"></ts-spinner>
            <ts-spinner style="font-size: 2rem;"></ts-spinner>
            <ts-spinner style="font-size: 3rem;"></ts-spinner>
            <ts-spinner style="font-size: 4rem;"></ts-spinner>
        </div>
    `,
};

export const CustomLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Provide a custom `label` to override the default accessible label.',
            },
        },
    },
    args: {
        label: 'Saving changes…',
    },
};
