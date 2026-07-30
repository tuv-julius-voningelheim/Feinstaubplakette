import { html, nothing } from 'lit';

import type { TsIconButton } from '@tuvsud/design-system/icon-button';

import { createEventLogger } from '@storybook/event-logger.js';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/icon-button';
import '@tuvsud/design-system/divider';

type IconButtonEvents = {
    'ts-blur': unknown;
    'ts-focus': unknown;
};

const meta = {
    title: 'Components/Icon Button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `Icon buttons are minimalist, icon-only controls designed for quick actions and commonly used in toolbars or compact UI spaces.

> 📖 For setup instructions (Google Material Symbols, Angular, React) see [Foundation → Icons](?path=/docs/foundation-icons--docs).`,
            },
        },
    },
    argTypes: {
        // Properties category
        src: {
            control: 'text',
            description: 'External SVG URL.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        href: {
            control: 'text',
            description: 'Renders as <a> with this href.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        target: {
            control: { type: 'select' },
            options: ['_self', '_blank', '_parent', '_top', undefined],
            description: 'Where to open the link. Used only when href is set.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: "'_self'" },
                category: 'Properties',
            },
        },
        download: {
            control: 'text',
            description: 'Filename to download when href is set.',
            table: { type: { summary: 'string' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the button.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        size: {
            control: 'number',
            description: 'The size of the icon in pixels.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '16' }, category: 'Properties' },
        },
        variant: {
            control: 'select',
            options: ['outline', 'filled', 'subtle'],
            description: 'The visual style of the icon button container.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'subtle' }, category: 'Properties' },
        },
        intent: {
            control: 'select',
            options: ['default', 'primary', 'success', 'warning', 'danger', 'neutral', 'accent01', 'accent02'],
            description: 'Color intent (aligned with button styles).',
            table: {
                type: {
                    summary: 'enum',
                },
                defaultValue: { summary: 'default' },
                category: 'Properties',
            },
        },
        circle: {
            control: 'boolean',
            description: 'When true, forces the button to be circular (border-radius: 50%).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        hover: {
            control: 'boolean',
            description: 'Forces hover state styles to be visible (CSS-only).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        inverted: {
            control: 'boolean',
            description:
                'When true, renders the icon button with inverted colors (white/light icon and border). Useful for placing icon buttons on dark or primary-coloured backgrounds.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
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
        // Accessibility category
        label: {
            control: 'text',
            description: 'Accessible label.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the icon button loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-focus': {
            action: 'ts-focus',
            description: 'Emitted when the icon button gains focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        src: '',
        href: '',
        target: '_self',
        download: '',
        disabled: false,
        size: 32,
        variant: 'subtle',
        intent: 'default',
        circle: false,
        hover: true,
        inverted: false,
        name: '',
        library: 'material',
        label: 'Open home',
    },
    render: args => html`
        <ts-icon-button
            name=${args.name ?? nothing}
            src=${args.src ?? nothing}
            href=${args.href ?? nothing}
            target=${args.target || nothing}
            download=${args.download || nothing}
            label=${args.label || nothing}
            ?disabled=${args.disabled}
            size=${args.size ?? nothing}
            variant=${args.variant || nothing}
            intent=${args.intent || nothing}
            ?circle=${args.circle}
            ?hover=${args.hover}
            ?inverted=${args.inverted}
            library=${args.library}
        >
            <img src="/assets/svg/home.svg" alt="icon" />
        </ts-icon-button>
    `,
} satisfies MetaWithLabel<TsIconButton & IconButtonEvents>;

export default meta;
type Story = StoryObjWithLabel<TsIconButton & IconButtonEvents>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'An icon button with the "home" icon, an accessible label, and enabled state.',
            },
        },
    },
};

export const Size: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This example showcases the icon component rendered in various sizes, ranging from 16px to 72px.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon-button size="16">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button size="24">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button size="32">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button size="48">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button size="60">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button size="72">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>
        </div>
    `,
};

export const SubtleIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The `subtle` variant renders just the icon — no border, no background. The icon is coloured by the `intent` token. A subtle background appears on hover/active to keep the interaction clear. Use this for low-emphasis actions in toolbars or dense UIs.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon-button label="Default" size="24" variant="subtle" intent="default">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Primary" size="24" variant="subtle" intent="primary">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Success" size="24" variant="subtle" intent="success">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Warning" size="24" variant="subtle" intent="warning">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Danger" size="24" variant="subtle" intent="danger">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Neutral" size="24" variant="subtle" intent="neutral">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>
        </div>
    `,
};

export const OutlineIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The `subtle` variant renders just the icon — no border, no background. The icon is coloured by the `intent` token. A subtle background appears on hover/active to keep the interaction clear. Use this for low-emphasis actions in toolbars or dense UIs.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon-button label="Default" size="24" variant="outline" intent="default">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Primary" size="24" variant="outline" intent="primary">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Success" size="24" variant="outline" intent="success">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Warning" size="24" variant="outline" intent="warning">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Danger" size="24" variant="outline" intent="danger">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Neutral" size="24" variant="outline" intent="neutral">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>
        </div>
    `,
};

export const FilledIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The `filled` variant renders just the icon — no border, no background. The icon is coloured by the `intent` token. Use this for high-emphasis actions in toolbars or dense UIs.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon-button label="Default" size="24" variant="filled" intent="default">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Primary" size="24" variant="filled" intent="primary">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Success" size="24" variant="filled" intent="success">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Warning" size="24" variant="filled" intent="warning">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Danger" size="24" variant="filled" intent="danger">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Neutral" size="24" variant="filled" intent="neutral">
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>
        </div>
    `,
};

export const Circle: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Circular icon buttons using the boolean `circle` property.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon-button label="copy" size="24" variant="outline" intent="default" circle>
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="person" size="24" variant="outline" intent="primary" circle>
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="check" size="24" variant="outline" intent="success" circle>
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="Warn" size="24" variant="outline" intent="warning" circle>
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="open in new" size="24" variant="outline" intent="danger" circle>
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button label="open in new" size="24" variant="outline" intent="neutral" circle>
                <img src="/assets/svg/home.svg" alt="icon" />
            </ts-icon-button>
        </div>
    `,
};

export const Link: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When `href` is set the icon button renders as an `<a>` element. Use `target` to control where the link opens and `download` to trigger a file download.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon-button
                label="Open in new tab"
                size="24"
                variant="filled"
                intent="primary"
                href="https://www.tuvsud.com"
                target="_blank"
            >
                <img src="/assets/svg/open_in_new.svg" alt="icon" />
            </ts-icon-button>

            <ts-icon-button
                label="Download file"
                src="/assets/svg/download.svg"
                size="24"
                variant="filled"
                intent="primary"
                href="/assets/svg/home.svg"
                download="home.svg"
            ></ts-icon-button>
        </div>
    `,
};

export const Src: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `src` property to load an external SVG file directly into the icon button, without needing a named icon from a library.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-icon-button
                label="Home via src"
                src="/assets/svg/home.svg"
                size="24"
                variant="subtle"
                intent="default"
            ></ts-icon-button>

            <ts-icon-button
                label="Filter via src"
                src="/assets/svg/filter_alt.svg"
                size="24"
                variant="outline"
                intent="primary"
            ></ts-icon-button>

            <ts-icon-button
                label="Home filled via src"
                src="/assets/svg/home.svg"
                size="24"
                variant="filled"
                intent="primary"
            ></ts-icon-button>
        </div>
    `,
};

export const Inverted: Story = {
    args: {
        size: 24,
    },
    parameters: {
        docs: {
            description: {
                story: 'Use the `inverted` property on `primary` buttons placed on dark or primary-colored backgrounds. Other variants keep their standard appearance.',
            },
        },
    },
    render: args => html`
            <div
                class="sb-story-wrapper--column"
                style="background-color: var(--ts-semantic-color-background-primary-dark-default); padding: 15px;"
            >
                <div class="sb-story-wrapper">
                    <ts-icon-button label="Default" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="subtle" intent="default">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Primary" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="subtle" intent="primary">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Success" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="subtle" intent="success">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Warning" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="subtle" intent="warning">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Danger" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="subtle" intent="danger">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Neutral" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="subtle" intent="neutral">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Accent01" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="subtle" intent="accent01">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Accent02" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="subtle" intent="accent02">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>
                </div>

                <div class="sb-story-wrapper">
                    <ts-icon-button label="Default" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="outline" intent="default">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Primary" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="outline" intent="primary">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Success" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="outline" intent="success">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Warning" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="outline" intent="warning">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Danger" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="outline" intent="danger">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Neutral" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="outline" intent="neutral">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Accent01" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="outline" intent="accent01">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Accent02" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="outline" intent="accent02">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>
                </div>

                <div class="sb-story-wrapper">
                    <ts-icon-button label="Default" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="filled" intent="default">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Primary" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="filled" intent="primary">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Success" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="filled" intent="success">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Warning" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="filled" intent="warning">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Danger" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="filled" intent="danger">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Neutral" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="filled" intent="neutral">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Accent01" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="filled" intent="accent01">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>

                    <ts-icon-button label="Accent02" size=${args.size} ?disabled=${args.disabled} ?hover=${args.hover} ?circle=${args.circle} inverted variant="filled" intent="accent02">
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>
                </div>
            </div>
        </div>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'icon-btn-event-log',
            entries: [
                {
                    event: 'ts-blur',
                    firedWhen: 'Icon button loses focus',
                    detail: 'void',
                },
                {
                    event: 'ts-focus',
                    firedWhen: 'Icon button gains focus',
                    detail: 'void',
                },
            ],
        });
        return {
            parameters,
            render: () =>
                wrap(html`
                    <ts-icon-button
                        label="Open home"
                        variant="outline"
                        intent="primary"
                        size="32"
                        @ts-blur=${(e: CustomEvent) => log('ts-blur', e.detail)}
                        @ts-focus=${(e: CustomEvent) => log('ts-focus', e.detail)}
                    >
                        <img src="/assets/svg/home.svg" alt="icon" />
                    </ts-icon-button>
                `),
        };
    })(),
};
