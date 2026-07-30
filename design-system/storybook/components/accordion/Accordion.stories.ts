import { html, nothing } from 'lit';

import type { TsAccordion } from '@tuvsud/design-system/accordion';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/accordion';
import '@tuvsud/design-system/accordion-item';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/link';

const meta = {
    title: 'Components/Accordion',
    component: 'ts-accordion',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'An accordion organizes related content into collapsible sections, letting users expand or hide details within a limited space for easier scanning and navigation.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/design/nht3ll2wvoSna1hPnxuPEB/T%C3%9CV-S%C3%9CD-Base-Components?node-id=5225-17424&t=2q4sw2NXuXvjYJjK-4',
        },
    },
    argTypes: {
        behavior: {
            control: { type: 'select' },
            options: ['single', 'multiple'],
            description: 'Defines whether one or multiple accordion items can be open at the same time.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'multiple' },
                category: 'Properties',
            },
        },
        label: {
            control: 'text',
            description: 'Accessible label or heading for the accordion group.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
                category: 'Accessibility',
            },
        },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'actions'],
            description:
                'Visual variant. Use `actions` to enable the `action` and `content` slots (custom header layout).',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'primary' },
                category: 'Properties',
            },
        },
    },
    args: {
        behavior: 'multiple',
        label: 'Accordion',
        variant: 'primary',
    },
    render: args => html`
        <ts-accordion
            behavior=${args.behavior || nothing}
            label=${args.label || nothing}
            .variant=${args.variant}
            variant=${args.variant || nothing}
        >
            <ts-accordion-item summary="Section 1">Content of section 1.</ts-accordion-item>
            <ts-accordion-item summary="Section 2">Content of section 2.</ts-accordion-item>
            <ts-accordion-item summary="Section 3">Content of section 3.</ts-accordion-item>
        </ts-accordion>
    `,
} satisfies MetaWithLabel<TsAccordion>;

export default meta;
type Story = StoryObjWithLabel<TsAccordion>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Default accordion allowing multiple sections to be open simultaneously.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/design/nht3ll2wvoSna1hPnxuPEB/T%C3%9CV-S%C3%9UD-Base-Components?node-id=3406-2056&p=f&m=dev',
        },
    },
};

export const SingleOpenItem: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `behaviour` property to control whether only one accordion item can be open at a time or multiple items can be expanded simultaneously.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/design/nht3ll2wvoSna1hPnxuPEB/T%C3%9CV-S%C3%9UD-Base-Components?node-id=3406-2056&p=f&m=dev',
        },
    },
    args: { behavior: 'single' },
};

export const Variants: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `variant` property to determine the visual style of the accordion.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/design/nht3ll2wvoSna1hPnxuPEB/T%C3%9CV-S%C3%9UD-Base-Components?node-id=3406-2056&p=f&m=dev',
        },
    },
    args: { variant: 'secondary' },
};

export const Actions: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `variant="actions"` to render action buttons in the header',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/design/nht3ll2wvoSna1hPnxuPEB/T%C3%9CV-S%C3%9UD-Base-Components?node-id=3406-2056&p=f&m=dev',
        },
    },
    args: { variant: 'actions' },
    render: args => html`
        <ts-accordion
            behavior=${args.behavior || nothing}
            label=${args.label || nothing}
            .variant=${args.variant}
            variant=${args.variant}
        >
            <ts-accordion-item summary="Section 1">
                <div slot="actions">
                    <ts-button variant="primary" size="small">Apply Now</ts-button>
                </div>

                Content of section 1.
            </ts-accordion-item>
            <ts-accordion-item summary="Section 2">
                <div slot="actions">
                    <ts-button variant="primary" size="small">Apply Now</ts-button>
                </div>
                Content of section 2.
            </ts-accordion-item>
            <ts-accordion-item summary="Section 3">
                <div slot="actions">
                    <ts-button variant="primary" size="small">Apply Now</ts-button>
                </div>
                Content of section 3.
            </ts-accordion-item>
        </ts-accordion>
    `,
};
