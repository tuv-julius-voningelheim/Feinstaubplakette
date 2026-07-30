import { html, nothing } from 'lit';

import type { TsCard } from '@tuvsud/design-system/card';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/card';
import '@tuvsud/design-system/button';

type TsCardArgs = TsCard & {
    showDivider?: boolean;
    href?: string;
    target?: string;
    nopopper?: boolean;
};

const meta = {
    title: 'Components/Card',
    component: 'ts-card',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Card is a flexible container used to group related content and actions in a visually distinct block. It supports multiple slots for structured content and optional media.',
            },
        },
    },
    argTypes: {
        showDivider: {
            control: 'boolean',
            description: 'Shows or hides dividers between card sections.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        href: {
            control: 'text',
            description: 'Makes the card clickable and navigates to the provided URL.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        target: {
            control: 'text',
            description: 'Specifies where the linked URL is opened when href is set.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        nopopper: {
            control: 'boolean',
            description: 'Disables the popper behavior when the card is clickable.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
    },
    args: {
        href: '',
        target: '',
        nopopper: false,
        showDivider: true,
    },
    render: args => html`
        <ts-card
            .showDivider=${args.showDivider}
            show-divider=${args.showDivider ? nothing : 'false'}
            href=${args.href || nothing}
            target=${args.target || nothing}
            ?nopopper=${args.nopopper}
        >
            <div slot="header">Card Header</div>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
            clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            <div slot="footer">Card Footer</div>
        </ts-card>
    `,
} satisfies MetaWithLabel<TsCardArgs>;

export default meta;
type Story = StoryObjWithLabel<TsCardArgs>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A basic card with header, content, and footer sections.',
            },
        },
    },
    args: { showDivider: true },
};

export const CardWithContent: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Cards can contain various types of content, including text and icons.',
            },
        },
    },
    render: args => html`
        <ts-card
            .showDivider=${args.showDivider}
            show-divider=${args.showDivider ? nothing : 'false'}
            href=${args.href || nothing}
            target=${args.target || nothing}
            ?nopopper=${args.nopopper}
        >
            <div style="display: flex; justify-content: space-between; width: 200px">
                <div>Card content!</div>
                <ts-icon>
                    <img src="/assets/svg/home.svg" />
                </ts-icon>
            </div>
        </ts-card>
    `,
};

export const CardWithImage: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The card component supports image sections using slots. This means you can insert <img> tag into image area. To do so, simply assign the appropriate slot attribute: slot="image"',
            },
        },
    },
    args: {
        showDivider: true,
    },
    render: args => html`
        <ts-card
            .showDivider=${args.showDivider}
            show-divider=${args.showDivider ? nothing : 'false'}
            href=${args.href || nothing}
            target=${args.target || nothing}
            ?nopopper=${args.nopopper}
        >
            <img slot="image" src="/assets/cat.avif" alt="A kitten" />
            The card component supports image sections using slots.
            <div slot="footer"><ts-button variant="primary">Primary</ts-button></div>
        </ts-card>
    `,
};

export const ClickableCard: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The card component supports a clickable feature, allowing the entire card to act as a clickable area when an `href` property is provided. Users can click anywhere on the card to navigate to the specified link, while any buttons or anchor tags inside the card maintain their own default behavior.',
            },
        },
    },
    args: {
        href: 'https://tuvsud.com',
        target: '_blank',
        nopopper: true,
    },
};

export const ClickableWithControls: Story = {
    parameters: {
        docs: {
            description: {
                story: 'In this example, the card is clickable, but it also contains inner controls (buttons) that have their own actions. Clicking on the card will navigate to the specified link, while clicking on the buttons will trigger their respective actions without navigating away.',
            },
        },
    },
    args: {
        href: 'https://tuvsud.com',
        target: '_blank',
        nopopper: true,
    },
    render: args => html`
        <ts-card
            .showDivider=${args.showDivider}
            show-divider=${args.showDivider ? nothing : 'false'}
            href=${args.href || nothing}
            target=${args.target || nothing}
            ?nopopper=${args.nopopper}
        >
            <div slot="header">Clickable Card With Inner Controls</div>
            The card is clickable, but these controls use their own actions.
            <ts-button @click=${() => console.log('Inner button clicked')}>Inner Button</ts-button>
            <div slot="footer">
                <ts-button variant="primary" @click=${() => console.log('Footer button clicked')}>
                    Footer Button
                </ts-button>
            </div>
        </ts-card>
    `,
};
