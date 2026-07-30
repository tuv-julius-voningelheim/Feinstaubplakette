import { html, nothing } from 'lit';

import type { TsLink } from '@tuvsud/design-system/link';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/link';

const meta = {
    title: 'Components/Link',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Links navigate users to another resource. This component renders a native <a> element and supports size, variant, and common anchor attributes.',
            },
        },
    },
    argTypes: {
        // Properties category
        variant: {
            control: 'select',
            description: 'Visual style of the link.',
            options: ['secondary', 'primary', 'inverted-text'],
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'primary' },
                category: 'Properties',
            },
        },
        size: {
            control: 'select',
            description: 'Controls the link\u2019s size (font-size and spacing).',
            options: ['small', 'medium', 'large'],
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        href: {
            control: 'text',
            description: 'Destination URL of the link.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        target: {
            control: 'select',
            description:
                'Where to open the linked document. When set to `_blank`, the component will ensure `rel` includes `noopener` and `noreferrer`.',
            options: [undefined, '_self', '_blank', '_parent', '_top'],
            table: { type: { summary: 'enum' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        rel: {
            control: 'text',
            description:
                'Specifies the relationship between the current document and the linked document. When `target="_blank"`, the component adds `noopener noreferrer` automatically (and preserves any provided values).',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        download: {
            control: 'text',
            description:
                'When set, clicking the link downloads the resource instead of navigating. If a value is provided, it will be used as the suggested filename.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        visitedColor: {
            control: 'boolean',
            description:
                'When true, the link can show a different color for the `:visited` state. When false, visited styling is disabled.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        underline: {
            control: 'boolean',
            description: 'When true, the link is underlined. When false, the underline is removed.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the link and prevents interaction.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'Text displayed for the link.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'Link' }, category: 'Accessibility' },
        },
    },
    args: {
        variant: 'primary',
        size: 'medium',
        label: 'Link',
        href: 'https://www.tuvsud.com/de',
        target: undefined,
        rel: '',
        download: '',
        visitedColor: true,
        underline: true,
        disabled: false,
    },
    render: args => html`
        <ts-link
            .variant=${args.variant}
            variant=${args.variant || nothing}
            .size=${args.size}
            size=${args.size || nothing}
            .href=${args.href}
            href=${args.href || nothing}
            .target=${args.target}
            target=${args.target || nothing}
            .rel=${args.rel}
            rel=${args.rel || nothing}
            .download=${args.download}
            download=${args.download || nothing}
            ?visited-color=${args.visitedColor}
            .visitedColor=${args.visitedColor}
            ?underline=${args.underline}
            .underline=${args.underline}
            ?disabled=${args.disabled}
            .disabled=${args.disabled}
        >
            ${args.label}
        </ts-link>
    `,
} satisfies MetaWithLabel<TsLink>;

export default meta;
type Story = StoryObjWithLabel<TsLink>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default link variant is `primary`.',
            },
        },
    },
    args: {
        variant: 'primary',
        label: 'Primary link',
    },
};

export const Secondary: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The `secondary` variant is used for less prominent links.',
            },
        },
    },
    args: {
        variant: 'secondary',
        label: 'Secondary link',
    },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Disables the link, preventing user interaction and indicating its inactive state.',
            },
        },
    },
    args: {
        disabled: true,
        label: 'Disabled link',
    },
};

export const BlankTarget: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Opens in a new tab. The component should ensure rel includes noopener/noreferrer when target="_blank".',
            },
        },
    },
    args: {
        label: 'Open in new tab',
        target: '_blank',
    },
};

export const NoUnderline: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Disables the underline. Useful when the surrounding UI already communicates "clickable".',
            },
        },
    },
    args: {
        label: 'No underline',
        underline: false,
    },
};

export const NoVisitedColor: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Disables `:visited` styling so the link color stays consistent after navigation.',
            },
        },
    },
    args: {
        label: 'Visited color disabled',
        visitedColor: false,
    },
};

export const Download: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Sets the native anchor `download` attribute. The browser will download the resource instead of navigating.',
            },
        },
    },
    args: {
        label: 'Download file',
        href: '/assets/example.pdf',
        download: '',
    },
};

export const Sizes: Story = {
    parameters: {
        controls: { exclude: ['size', 'label'] },
        docs: {
            description: {
                story: 'Links are available in three sizes: small, medium, and large.',
            },
        },
    },
    render: args => html`
        <div class="sb-story-wrapper">
            <ts-link
                variant=${args.variant || nothing}
                size="small"
                href=${args.href || nothing}
                target=${args.target || nothing}
                rel=${args.rel || nothing}
                download=${args.download || nothing}
                ?visited-color=${args.visitedColor}
                ?underline=${args.underline}
                ?disabled=${args.disabled}
            >
                Small
            </ts-link>

            <ts-link
                variant=${args.variant || nothing}
                size="medium"
                href=${args.href || nothing}
                target=${args.target || nothing}
                rel=${args.rel || nothing}
                download=${args.download || nothing}
                ?visited-color=${args.visitedColor}
                ?underline=${args.underline}
                ?disabled=${args.disabled}
            >
                Medium
            </ts-link>

            <ts-link
                variant=${args.variant || nothing}
                size="large"
                href=${args.href || nothing}
                target=${args.target || nothing}
                rel=${args.rel || nothing}
                download=${args.download || nothing}
                ?visited-color=${args.visitedColor}
                ?underline=${args.underline}
                ?disabled=${args.disabled}
            >
                Large
            </ts-link>
        </div>
    `,
    args: {
        variant: 'primary',
        href: 'https://www.tuvsud.com/en',
        visitedColor: true,
        underline: true,
        disabled: false,
    },
};

export const InvertedText: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the inverted-text variant when placing links on dark backgrounds.',
            },
        },
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'inverted-text',
        label: 'Inverted text link',
    },
    render: args => html`
        <div
            class="sb-story-wrapper"
            style=" background-color: var(--ts-semantic-color-surface-inverted-default); padding: 20px"
        >
            <ts-link
                variant=${args.variant || nothing}
                size="medium"
                href=${args.href || nothing}
                target=${args.target || nothing}
                rel=${args.rel || nothing}
                download=${args.download || nothing}
                ?visited-color=${args.visitedColor}
                ?underline=${args.underline}
                ?disabled=${args.disabled}
            >
                Link
            </ts-link>

            <ts-link
                variant=${args.variant || nothing}
                target="_blank"
                size="medium"
                href=${args.href || nothing}
                rel=${args.rel || nothing}
                download=${args.download || nothing}
                ?visited-color=${args.visitedColor}
                ?underline=${args.underline}
                ?disabled=${args.disabled}
            >
                Blank Link
            </ts-link>
        </div>
    `,
};

export const SlotTag: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The link component renders a native anchor element. You can use the default slot to provide custom content, such as icons or additional text.',
            },
        },
    },
    render: args => html`
        <div class="sb-story-wrapper">
            <ts-link
                variant=${args.variant || nothing}
                size=${args.size || nothing}
                href=${args.href || nothing}
                target=${args.target || nothing}
                rel=${args.rel || nothing}
                download=${args.download || nothing}
                ?visited-color=${args.visitedColor}
                ?underline=${args.underline}
                ?disabled=${args.disabled}
            >
                <a href=${args.href || nothing} target=${args.target || nothing}> Custom Tag for SEO </a>
            </ts-link>
        </div>
    `,
    args: {
        variant: 'primary',
        href: 'https://www.tuvsud.com/en',
        visitedColor: true,
        underline: true,
        disabled: false,
    },
};
