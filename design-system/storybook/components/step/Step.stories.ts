import { html, nothing } from 'lit';

import type { TsStep } from '@tuvsud/design-system/step';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/step';
import '@tuvsud/design-system/stepper';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/spinner';

type Events = {
    'ts-select-step': unknown;
};

const meta: MetaWithLabel<TsStep & Events> = {
    title: 'Components/Step',
    component: 'ts-step',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Steps are individual items used within a Stepper component to represent stages in a multi-step process. Each step can display a label, description, icon, and different states to indicate progress.',
            },
        },
    },
    argTypes: {
        // Properties category
        active: {
            control: 'boolean',
            description: 'Whether the step is currently active.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        description: {
            control: 'text',
            description: 'The description text for the step.',
            table: { defaultValue: { summary: '' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the step is disabled.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        last: {
            control: 'boolean',
            description: 'Whether this is the last step (hides connector).',
            table: { defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        hideContent: {
            control: 'boolean',
            description: 'Hides the label and description, showing only the icon.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        loading: {
            control: 'boolean',
            description: 'Shows a loading spinner instead of the icon.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        state: {
            control: 'select',
            options: ['default', 'done', 'error', 'warning'],
            description: 'The state of the step.',
            table: { defaultValue: { summary: 'default' }, category: 'Properties' },
        },
        index: {
            control: { type: 'number', min: 0, max: 10 },
            description: 'The index of the step (0-based).',
            table: { defaultValue: { summary: '0' }, category: 'Properties' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'The label text for the step.',
            table: { defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-select-step': {
            action: 'ts-select-step',
            description: 'Emitted when the step is selected (clicked). Contains detail with the step index.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        state: 'default',
        description: 'Step description',
        active: false,
        disabled: false,
        last: true,
        hideContent: false,
        loading: false,
        index: 0,
        label: 'Step Label',
    },
    render: args => html`
        <ts-stepper>
            <ts-step
                label=${args.label || nothing}
                description=${args.description || nothing}
                ?active=${args.active}
                ?disabled=${args.disabled}
                ?last=${args.last}
                ?hide-content=${args.hideContent}
                ?loading=${args.loading}
                .state=${args.state}
                state=${args.state || nothing}
                .index=${args.index}
                index=${args.index ?? nothing}
            ></ts-step>
        </ts-stepper>
    `,
} satisfies MetaWithLabel<TsStep & Events>;

export default meta;

type Story = StoryObjWithLabel<TsStep>;

export const Default: Story = {
    args: {
        label: 'Personal Information',
        description: 'Enter your personal details',
        active: false,
        state: 'default',
        index: 0,
    },
};

export const Active: Story = {
    args: {
        label: 'Personal Information',
        description: 'Enter your personal details',
        active: true,
        state: 'default',
        index: 1,
    },
    parameters: {
        docs: {
            description: {
                story: 'Active state indicates the current step in the process.',
            },
        },
    },
};

export const Done: Story = {
    args: {
        label: 'Personal Information',
        description: 'Completed successfully',
        active: false,
        state: 'done',
        index: 0,
    },
    parameters: {
        docs: {
            description: {
                story: 'Done state shows a checkmark icon to indicate completion.',
            },
        },
    },
};

export const Error: Story = {
    args: {
        label: 'Payment Information',
        description: 'Please fix the errors',
        active: false,
        state: 'error',
        index: 2,
    },
    parameters: {
        docs: {
            description: {
                story: 'Error state highlights issues that need attention.',
            },
        },
    },
};

export const Warning: Story = {
    args: {
        label: 'Review Details',
        description: 'Some information is missing',
        active: false,
        state: 'warning',
        index: 3,
    },
    parameters: {
        docs: {
            description: {
                story: 'Warning state indicates potential issues or missing information.',
            },
        },
    },
};

export const Disabled: Story = {
    args: {
        label: 'Future Step',
        description: 'Not yet available',
        active: false,
        disabled: true,
        index: 4,
    },
    parameters: {
        docs: {
            description: {
                story: 'Disabled steps cannot be interacted with.',
            },
        },
    },
};

export const HiddenContent: Story = {
    args: {
        label: 'Step with icon only',
        description: 'This will be hidden',
        hideContent: true,
        active: true,
        index: 0,
    },
    parameters: {
        docs: {
            description: {
                story: 'Steps with hidden content show only the icon. Useful for compact mobile views or icon-only navigation.',
            },
        },
    },
};

export const Loading: Story = {
    args: {
        label: 'Processing',
        description: 'Please wait...',
        loading: true,
        index: 1,
    },
    parameters: {
        docs: {
            description: {
                story: 'Loading state shows a spinner animation to indicate processing.',
            },
        },
    },
};

export const LoadingSteps: Story = {
    render: () => html`
        <ts-stepper orientation="horizontal" current-step="1" variant="primary">
            <ts-step label="Completed" description="Step done" state="done" index="0"></ts-step>
            <ts-step label="Processing" description="Please wait..." loading index="1"></ts-step>
            <ts-step label="Pending" description="Waiting" index="2"></ts-step>
        </ts-stepper>
    `,
    parameters: {
        docs: {
            description: {
                story: 'A multi-step process with one step in loading state.',
            },
        },
    },
};

export const IconsOnly: Story = {
    render: () => html`
        <ts-stepper orientation="horizontal" current-step="1" variant="primary">
            <ts-step hide-content state="done" index="0"></ts-step>
            <ts-step hide-content active index="1"></ts-step>
            <ts-step hide-content index="2"></ts-step>
            <ts-step hide-content index="3"></ts-step>
            <ts-step hide-content last index="4"></ts-step>
        </ts-stepper>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Compact view using `hide-content` — only icons are visible, perfect for mobile or space-constrained layouts.',
            },
        },
    },
};

export const CustomIcons: Story = {
    render: () => html`
        <ts-stepper>
            <ts-step label="User" description="User details">
                <ts-icon slot="icon" library="system" name="person"></ts-icon>
            </ts-step>
        </ts-stepper>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Steps can use custom icons via slots. Use `icon` slot for default state and `icon-done`, `icon-error`, `icon-warning` for specific states.',
            },
        },
    },
};

export const SecondaryVariant: Story = {
    render: () => html`
        <ts-stepper orientation="horizontal" current-step="1" variant="secondary">
            <ts-step state="done" index="0"></ts-step>
            <ts-step index="1"></ts-step>
            <ts-step index="2"></ts-step>
            <ts-step index="3"></ts-step>
            <ts-step index="4"></ts-step>
        </ts-stepper>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Secondary variant shows minimal pagination dots without labels.',
            },
        },
    },
};

export const LongLabels: Story = {
    render: () => html`
        <ts-stepper orientation="horizontal" current-step="1" variant="primary">
            <ts-step
                label="Personal Information Verification"
                description="Please provide your complete personal details including name, date of birth, and identification"
                index="0"
            ></ts-step>
            <ts-step
                label="Address Confirmation"
                description="Verify your residential address and contact information"
                active
                index="1"
            ></ts-step>
            <ts-step
                label="Payment Processing"
                description="Enter your payment method and billing information"
                index="2"
                index="2"
            ></ts-step>
        </ts-stepper>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Steps handle long labels and descriptions gracefully.',
            },
        },
    },
};

export const Vertical: Story = {
    render: () => html`
        <ts-stepper orientation="vertical" current-step="1" navigation variant="primary">
            <ts-step label="Create Account" description="Sign up with email" state="done"></ts-step>
            <ts-step label="Profile Setup" description="Add your information" active></ts-step>
            <ts-step label="Preferences" description="Set your preferences"></ts-step>
            <ts-step label="Complete" description="Start using the app"></ts-step>
        </ts-stepper>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Vertical orientation — requires a parent container with an explicit height so steps are evenly distributed and connectors are visible.',
            },
        },
    },
};

export const Interactive: Story = {
    render: () => html`
        <ts-stepper orientation="horizontal" current-step="0" navigation variant="primary" id="interactive-stepper">
            <ts-step label="Personal Info" description="Enter your details"></ts-step>
            <ts-step label="Address" description="Your location"></ts-step>
            <ts-step label="Payment" description="Payment method"></ts-step>
            <ts-step label="Review" description="Confirm details"></ts-step>
        </ts-stepper>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Click any step to navigate. Uses the `navigation` attribute on the stepper.',
            },
        },
    },
};

export const MinimalLabels: Story = {
    render: () => html`
        <ts-stepper orientation="horizontal" current-step="1" variant="primary">
            <ts-step label="Step 1" index="0"></ts-step>
            <ts-step label="Step 2" active index="1"></ts-step>
            <ts-step label="Step 3" index="2"></ts-step>
            <ts-step label="Step 4" last index="3"></ts-step>
        </ts-stepper>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Steps can be displayed with labels only, without descriptions.',
            },
        },
    },
};
