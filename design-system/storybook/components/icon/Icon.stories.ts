import { html, nothing } from 'lit';

import type { TsIcon } from '@tuvsud/design-system/icon';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/icon';

type IconEvents = {
    'ts-load': unknown;
    'ts-error': unknown;
};

const meta: MetaWithLabel<TsIcon & IconEvents> = {
    title: 'Components/Icon',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
Use \`<ts-icon>\` to render icons from a registered library, an inline SVG, or a direct URL.

> 📖 For setup instructions (Google Material Symbols, Angular, React) see [Foundation → Icons](?path=/docs/foundation-icons--docs).
                `,
            },
        },
    },
    argTypes: {
        src: {
            control: 'text',
            description: 'External SVG URL.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        size: {
            control: 'number',
            description: 'The size of the icon in pixels.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '16' }, category: 'Properties' },
        },
        // Registered Icons
        name: {
            control: 'text',
            description: 'Name of the icon to use from the library you are using like material (e.g., "star").',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Registered Icons' },
        },
        library: {
            control: 'text',
            description: 'Icon library to use (e.g., "material").',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'material' }, category: 'Registered Icons' },
        },
        'ts-load': {
            action: 'ts-load',
            description: 'Emitted when the icon has loaded. When using `spriteSheet: true` this will not emit.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-error': {
            action: 'ts-error',
            description:
                'Emitted when the icon fails to load due to an error. When using `spriteSheet: true` this will not emit.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        label: {
            control: 'text',
            description: 'Alternate description for assistive devices. If empty, icon is presentational.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
    },
    args: {
        size: 32,
        src: '',
        name: '',
        library: 'material',
        label: '',
    },
    render: args => html`
        <ts-icon
            name=${args.name || nothing}
            size=${args.size ?? nothing}
            label=${args.label && args.label.trim() !== '' ? args.label : nothing}
            library=${((args as unknown as Record<string, unknown>).library as string) || nothing}
            src=${args.src || nothing}
        >
        </ts-icon>
    `,
};

export default meta;
type Story = StoryObjWithLabel<TsIcon & IconEvents>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Pass an SVG path directly via the `src` prop — no `<img>` wrapper needed.',
            },
        },
    },
    args: {
        src: '/assets/svg/home.svg',
    },
};

export const Size: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Available sizes from 16px to 72px.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon size="16">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>

            <ts-icon size="24">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>

            <ts-icon size="32">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>

            <ts-icon size="48">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>

            <ts-icon size="60">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>

            <ts-icon size="72">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>
        </div>
    `,
};

export const Color: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `--icon-color` CSS custom property to change the icon colour.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon size="32" style="--icon-color: #ff7272">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>

            <ts-icon size="32" style="--icon-color: #74f2a180">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>

            <ts-icon size="32" style="--icon-color: #ffd239">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>

            <ts-icon size="32" style="--icon-color: #1d4fd7">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon>
        </div>
    `,
};

export const Src: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Point `src` directly at any `.svg` file. Works in both React and Web Components — no library registration or slot needed.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon src="/assets/svg/home.svg" size="24"></ts-icon>
            <ts-icon src="/assets/svg/filter_alt.svg" size="24"></ts-icon>
            <ts-icon src="/assets/svg/autorenew.svg" size="24"></ts-icon>
            <ts-icon src="/assets/svg/delete_forever.svg" size="24"></ts-icon>
        </div>
    `,
};
