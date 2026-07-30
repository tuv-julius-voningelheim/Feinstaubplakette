import { html, nothing } from 'lit';

import type { TsBreadcrumbItem } from '@tuvsud/design-system/breadcrumb-item';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/breadcrumb';
import '@tuvsud/design-system/breadcrumb-item';
import '@tuvsud/design-system/icon';

const meta = {
    title: 'Components/Breadcrumb Item',
    component: 'ts-breadcrumb-item',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Breadcrumb items serve as the individual links that make up a breadcrumb navigation structure.',
            },
        },
    },
    argTypes: {
        href: {
            control: 'text',
            description: 'URL the breadcrumb item links to.',
            table: { defaultValue: { summary: '' }, category: 'Properties' },
        },
        target: {
            control: 'select',
            options: ['_blank', '_parent', '_self', '_top', undefined],
            description: 'Specifies where the linked document is opened.',
            table: { defaultValue: { summary: '_self' }, category: 'Properties' },
        },
        rel: {
            control: 'text',
            description: 'Specifies the relationship between the current document and the linked document.',
            table: { defaultValue: { summary: '' }, category: 'Properties' },
        },
    },
    args: {
        href: '/',
        target: '_self',
        rel: 'noopener noreferrer',
    },
    render: args => html`
        <ts-breadcrumb>
            <ts-breadcrumb-item
                .href=${args.href}
                href=${args.href || nothing}
                .target=${args.target}
                target=${args.target || nothing}
                .rel=${args.rel}
                rel=${args.rel || nothing}
            >
                <ts-icon slot="prefix">
                    <img src="/assets/svg/home.svg" />
                </ts-icon>
                Home
            </ts-breadcrumb-item>
            <ts-breadcrumb-item>Clothing</ts-breadcrumb-item>
            <ts-breadcrumb-item>Shirts</ts-breadcrumb-item>
        </ts-breadcrumb>
    `,
} satisfies MetaWithLabel<TsBreadcrumbItem>;

export default meta;
type Story = StoryObjWithLabel<TsBreadcrumbItem>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A breadcrumb item linking to the home page with an icon prefix, followed by two additional items.',
            },
        },
    },
};
