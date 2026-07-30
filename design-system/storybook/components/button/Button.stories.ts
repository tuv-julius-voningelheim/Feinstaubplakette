import { html, nothing } from 'lit';

import type { TsButton } from '@tuvsud/design-system/button';

import { createEventLogger } from '@storybook/event-logger.js';
import type { Meta, StoryObj } from '@storybook/web-components';

import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';

type ButtonEvents = {
    'ts-blur': unknown;
    'ts-focus': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Button',
    component: 'ts-button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Buttons are interactive elements that allow users to perform actions or navigate. They are an essential part of the user interface and should be consistent and easily recognizable.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/design/nht3ll2wvoSna1hPnxuPEB/T%C3%9CV-S%C3%9CD-Base-Components?node-id=11-970&t=2q4sw2NXuXvjYJjK-4',
        },
    },
    argTypes: {
        label: {
            control: 'text',
            type: 'string',
            description: 'Text content rendered inside the button (story helper, not a component property).',
            table: { defaultValue: { summary: 'Button' }, category: 'Properties' },
        },
        variant: {
            control: 'select',
            options: ['default', 'primary', 'success', 'neutral', 'warning', 'danger', 'accent01', 'accent02'],
            type: {
                name: 'enum',
                value: ['default', 'primary', 'success', 'neutral', 'warning', 'danger', 'accent01', 'accent02'],
            },
            description: 'The button\u2019s theme variant.',
            table: { defaultValue: { summary: 'default' }, category: 'Properties' },
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            type: { name: 'enum', value: ['small', 'medium', 'large'] },
            description: 'The button\u2019s size.',
            table: { defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        caret: {
            control: 'boolean',
            description:
                'Draws the button with a caret. Used to indicate that the button triggers a dropdown menu or similar behavior.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the button.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        loading: {
            control: 'boolean',
            description: 'Draws the button in a loading state.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        outline: {
            control: 'boolean',
            description: 'Draws an outlined button.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        pill: {
            control: 'boolean',
            description: 'Draws a pill-style button with rounded edges.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        text: {
            control: 'boolean',
            description:
                'Renders the button in a text-only style (no background, no border). The text color reflects the current `variant` (e.g. `success` shows success-colored text).',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        inverted: {
            control: 'boolean',
            description:
                'Inverts the colors of the `primary` variant — useful for placing buttons on dark/primary-colored backgrounds. Has no effect on other variants.',
            table: { defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        href: {
            control: 'text',
            type: 'string',
            description:
                'When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`.',
            table: {
                defaultValue: { summary: '' },
                category: 'Link',
            },
        },
        preventAnchorTag: {
            control: 'boolean',
            description:
                'When `true`, prevents rendering as an anchor tag and handles navigation programmatically via JavaScript. Useful for SPAs or when you need to intercept navigation. Requires `href` to be set.',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Link',
            },
        },
        target: {
            control: 'select',
            options: ['_self', '_blank', '_parent', '_top'],
            type: { name: 'enum', value: ['_self', '_blank', '_parent', '_top'] },
            description: 'Where to open the linked URL. Only used when `href` is present.',
            table: {
                defaultValue: { summary: '' },
                category: 'Link',
            },
        },
        rel: {
            control: 'text',
            type: 'string',
            description:
                'The `rel` attribute for the underlying anchor tag. Defaults to `"noreferrer noopener"` for security. Adjust when using `target` to point to a specific tab/window.',
            table: {
                defaultValue: { summary: 'noreferrer noopener' },
                category: 'Link',
            },
        },
        download: {
            control: 'text',
            type: 'string',
            description:
                'Tells the browser to download the linked file using this filename. Only used when `href` is present.',
            table: { category: 'Link' },
        },
        type: {
            control: 'select',
            options: ['button', 'submit', 'reset'],
            type: { name: 'enum', value: ['button', 'submit', 'reset'] },
            description:
                'The type of button. Note that the default value is `"button"` instead of `"submit"`, which is opposite of how native `<button>` elements behave. When the type is `"submit"`, the button will submit the surrounding form.',
            table: {
                defaultValue: { summary: 'button' },
                category: 'Form',
            },
        },
        name: {
            control: 'text',
            type: 'string',
            description:
                'The name of the button, submitted as a name/value pair with form data, but only when this button is the submitter. This attribute is ignored when `href` is present.',
            table: {
                defaultValue: { summary: '' },
                category: 'Form',
            },
        },
        value: {
            control: 'text',
            type: 'string',
            description:
                'The value of the button, submitted as a pair with the button\u2019s name as part of the form data, but only when this button is the submitter. This attribute is ignored when `href` is present.',
            table: {
                defaultValue: { summary: '' },
                category: 'Form',
            },
        },
        form: {
            control: 'text',
            type: 'string',
            description:
                'The form owner to associate the button with. If omitted, the closest containing form will be used instead. The value must be an id of a form in the same document or shadow root.',
            table: {
                defaultValue: { summary: '' },
                category: 'Form',
            },
        },
        formAction: {
            control: 'text',
            type: 'string',
            description: 'Used to override the form owner\u2019s `action` attribute.',
            table: {
                defaultValue: { summary: '' },
                category: 'Form',
            },
        },
        formEnctype: {
            control: 'select',
            options: ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
            type: { name: 'enum', value: ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'] },
            description: 'Used to override the form owner\u2019s `enctype` attribute.',
            table: { category: 'Form' },
        },
        formMethod: {
            control: 'select',
            options: ['post', 'get'],
            type: { name: 'enum', value: ['post', 'get'] },
            description: 'Used to override the form owner\u2019s `method` attribute.',
            table: {
                defaultValue: { summary: '' },
                category: 'Form',
            },
        },
        formNoValidate: {
            control: 'boolean',
            description: 'Used to override the form owner\u2019s `novalidate` attribute.',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Form',
            },
        },
        formTarget: {
            control: 'select',
            options: ['_self', '_blank', '_parent', '_top'],
            type: { name: 'enum', value: ['_self', '_blank', '_parent', '_top'] },
            description: 'Used to override the form owner\u2019s `target` attribute.',
            table: {
                defaultValue: { summary: '' },
                category: 'Form',
            },
        },
        validity: {
            control: false,
            description: 'Gets the validity state object (read-only).',
            table: {
                disable: false,
                category: 'Form',
            },
        },
        validationMessage: {
            control: false,
            description: 'Gets the validation message (read-only).',
            table: {
                disable: false,
                category: 'Form',
            },
        },
        ariaLabel: {
            control: 'text',
            type: 'string',
            description:
                'ARIA label applied to the internal native interactive element (`<button>` or `<a>`). Use this to provide an explicit accessible name when the visible content is not sufficient \u2014 e.g. icon-only buttons.',
            table: {
                defaultValue: { summary: 'null' },
                category: 'Accessibility',
            },
        },
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the button loses focus.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
        'ts-focus': {
            action: 'ts-focus',
            description: 'Emitted when the button gains focus.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
        'ts-invalid': {
            action: 'ts-invalid',
            description:
                'Emitted when the form control has been checked for validity and its constraints are not satisfied.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
    },
    args: {
        label: 'Button',
        variant: 'primary',
        size: 'medium',
        caret: false,
        disabled: false,
        loading: false,
        outline: false,
        pill: false,
        text: false,
        inverted: false,
        type: 'button',
        name: '',
        value: '',
        href: '',
        preventAnchorTag: false,
        target: undefined,
        rel: 'noreferrer noopener',
        download: undefined,
        form: '',
        formAction: '',
        formEnctype: undefined,
        formMethod: undefined,
        formNoValidate: false,
        formTarget: undefined,
        ariaLabel: null,
    },
    render: args => html`
        <ts-button
            .variant=${args.variant}
            variant=${args.variant || nothing}
            .size=${args.size}
            size=${args.size || nothing}
            .caret=${args.caret}
            ?caret=${args.caret}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .loading=${args.loading}
            ?loading=${args.loading}
            .outline=${args.outline}
            ?outline=${args.outline}
            .pill=${args.pill}
            ?pill=${args.pill}
            .text=${args.text}
            ?text=${args.text}
            .inverted=${args.inverted}
            ?inverted=${args.inverted}
            .type=${args.type}
            type=${args.type || nothing}
            .name=${args.name}
            name=${args.name || nothing}
            .value=${args.value}
            value=${args.value || nothing}
            .href=${args.href}
            href=${args.href || nothing}
            .preventAnchorTag=${args.preventAnchorTag}
            ?prevent-anchor-tag=${args.preventAnchorTag}
            .target=${args.target}
            target=${args.target || nothing}
            .rel=${args.rel}
            rel=${args.rel || nothing}
            .download=${args.download}
            download=${args.download || nothing}
            .form=${args.form}
            form=${args.form || nothing}
            .formAction=${args.formAction}
            formaction=${args.formAction || nothing}
            .formEnctype=${args.formEnctype}
            formenctype=${args.formEnctype || nothing}
            .formMethod=${args.formMethod}
            formmethod=${args.formMethod || nothing}
            .formNoValidate=${args.formNoValidate}
            ?formnovalidate=${args.formNoValidate}
            .formTarget=${args.formTarget}
            formtarget=${args.formTarget || nothing}
            .ariaLabel=${args.ariaLabel}
            aria-label=${args.ariaLabel || nothing}
        >
            ${args.label}
        </ts-button>
    `,
} satisfies Meta<TsButton & ButtonEvents & { label?: string }>;

export default meta;
type Story = StoryObj<TsButton & ButtonEvents & { label?: string }>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the button is of `primary` variant and `medium` size.',
            },
        },
    },
};

export const Variants: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `variant` property to set the button’s variant.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-button variant="default">Default</ts-button>
            <ts-button variant="primary">Primary</ts-button>
            <ts-button variant="success">Success</ts-button>
            <ts-button variant="warning">Warning</ts-button>
            <ts-button variant="danger">Danger</ts-button>
            <ts-button variant="neutral">Neutral</ts-button>
        </div>
    `,
};

export const Outline: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `outline` property to draw outlined buttons with transparent backgrounds.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-button variant="default" outline>Default</ts-button>
            <ts-button variant="primary" outline>Primary</ts-button>
            <ts-button variant="success" outline>Success</ts-button>
            <ts-button variant="warning" outline>Warning</ts-button>
            <ts-button variant="danger" outline>Danger</ts-button>
            <ts-button variant="neutral" outline>Neutral</ts-button>
        </div>
    `,
};

export const Pill: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `pill` property to give buttons rounded edges.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-button variant="default" pill>Default</ts-button>
            <ts-button variant="primary" pill>Primary</ts-button>
            <ts-button variant="success" pill>Success</ts-button>
            <ts-button variant="warning" pill>Warning</ts-button>
            <ts-button variant="danger" pill>Danger</ts-button>
            <ts-button variant="neutral" pill>Neutral</ts-button>
        </div>
    `,
};

export const Caret: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `caret` property to add a dropdown indicator when a button will trigger a dropdown, menu, or popover.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-button variant="default" caret>Default</ts-button>
            <ts-button variant="primary" caret>Primary</ts-button>
            <ts-button variant="success" caret>Success</ts-button>
            <ts-button variant="warning" caret>Warning</ts-button>
            <ts-button variant="danger" caret>Danger</ts-button>
            <ts-button variant="neutral" caret>Neutral</ts-button>
        </div>
    `,
};

export const Loading: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `loading` property to make a button busy. The width will remain the same as before, preventing adjacent elements from moving around.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-button variant="default" loading>Default</ts-button>
            <ts-button variant="primary" loading>Primary</ts-button>
            <ts-button variant="success" loading>Success</ts-button>
            <ts-button variant="warning" loading>Warning</ts-button>
            <ts-button variant="danger" loading>Danger</ts-button>
            <ts-button variant="neutral" loading>Neutral</ts-button>
        </div>
    `,
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` property to disable a button.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-button variant="default" disabled>Default</ts-button>
            <ts-button variant="primary" disabled>Primary</ts-button>
            <ts-button variant="success" disabled>Success</ts-button>
            <ts-button variant="warning" disabled>Warning</ts-button>
            <ts-button variant="danger" disabled>Danger</ts-button>
            <ts-button variant="neutral" disabled>Neutral</ts-button>
        </div>
    `,
};

export const TextVariant: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `text` property to render buttons with no background or border. The text color reflects the active `variant` — e.g. `success` shows success-colored text.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-button variant="default" text>Default</ts-button>
            <ts-button variant="primary" text>Primary</ts-button>
            <ts-button variant="success" text>Success</ts-button>
            <ts-button variant="warning" text>Warning</ts-button>
            <ts-button variant="danger" text>Danger</ts-button>
            <ts-button variant="neutral" text>Neutral</ts-button>
        </div>
    `,
};

export const Inverted: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `inverted` property on `primary` buttons placed on dark or primary-colored backgrounds. Other variants keep their standard appearance.',
            },
        },
    },
    render: () => html`
        <div
            class="sb-story-wrapper"
            style="background-color: var(--ts-semantic-color-background-primary-dark-default); padding: 15px;"
        >
            <ts-button variant="default" inverted>Default</ts-button>
            <ts-button variant="primary" inverted>Primary</ts-button>
            <ts-button variant="success" inverted>Success</ts-button>
            <ts-button variant="warning" inverted>Warning</ts-button>
            <ts-button variant="danger" inverted>Danger</ts-button>
            <ts-button variant="neutral" inverted>Neutral</ts-button>
        </div>
    `,
};

export const OutlineInverted: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `inverted` property on `primary` buttons placed on dark or primary-colored backgrounds. Other variants keep their standard appearance.',
            },
        },
    },
    render: () => html`
        <div
            class="sb-story-wrapper"
            style="background-color: var(--ts-semantic-color-background-primary-dark-default); padding: 15px;"
        >
            <ts-button variant="default" outline inverted>Default</ts-button>
            <ts-button variant="primary" outline inverted>Primary</ts-button>
            <ts-button variant="success" outline inverted>Success</ts-button>
            <ts-button variant="warning" outline inverted>Warning</ts-button>
            <ts-button variant="danger" outline inverted>Danger</ts-button>
            <ts-button variant="neutral" outline inverted>Neutral</ts-button>
        </div>
    `,
};

export const TextInverted: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `inverted` property on `primary` buttons placed on dark or primary-colored backgrounds. Other variants keep their standard appearance.',
            },
        },
    },
    render: () => html`
        <div
            class="sb-story-wrapper"
            style="background-color: var(--ts-semantic-color-background-primary-dark-default); padding: 15px;"
        >
            <ts-button variant="default" text inverted>Default</ts-button>
            <ts-button variant="primary" text inverted>Primary</ts-button>
            <ts-button variant="success" text inverted>Success</ts-button>
            <ts-button variant="warning" text inverted>Warning</ts-button>
            <ts-button variant="danger" text inverted>Danger</ts-button>
            <ts-button variant="neutral" text inverted>Neutral</ts-button>
        </div>
    `,
};

export const LinkTag: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `href` property to render the button as an anchor tag.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper">
            <ts-button variant="default" target="_blank" text href="https://www.tuvsud.com/en">Link</ts-button>
            <ts-button variant="primary" target="_blank" text href="https://www.tuvsud.com/en">Link</ts-button>
            <ts-button variant="success" target="_blank" text href="https://www.tuvsud.com/en">Link</ts-button>
            <ts-button variant="warning" target="_blank" text href="https://www.tuvsud.com/en">Link</ts-button>
            <ts-button variant="danger" target="_blank" text href="https://www.tuvsud.com/en">Link</ts-button>
            <ts-button variant="neutral" target="_blank" text href="https://www.tuvsud.com/en">Link</ts-button>
        </div>
    `,
};

export const NativeLink: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When using the `href` property, you can still use native anchor tags inside the button for more complex link content. This can be used basically for SEO purposes to render native HTML elements instead of custom tag on the SSR.',
            },
        },
    },
    render: () => html`
            <div class="sb-story-wrapper">
                <ts-button variant="default" target="_blank" outline size="medium" href="https://www.tuvsud.com/en">
                    <a href="https://www.tuvsud.com/en">
                        Link
                        <ts-icon
                            library="system"
                            name="open_in_new"
                            size="14"
                            style="color: currentColor; padding-left: 5px"
                        >
                        </ts-icon>
                    </a>
                </ts-button>
                
                <ts-button variant="primary" href="https://www.tuvsud.com/en" target="_blank">
                    <a href="https://www.tuvsud.com/en">
                        Link
                        <ts-icon
                            library="system"
                            name="open_in_new"
                            size="14"
                            style="color: currentColor; padding-left: 5px"
                        >
                        </ts-icon>
                    </a>
                </ts-button>
                
                <ts-button variant="success" href="https://www.tuvsud.com/en" target="_blank">
                    <a href="https://www.tuvsud.com/en">
                        Link
                        <ts-icon
                            library="system"
                            name="open_in_new"
                            size="14"
                            style="color: currentColor; padding-left: 5px"
                        >
                        </ts-icon>
                    </a>
                </ts-button>

                <ts-button variant="warning" href="https://www.tuvsud.com/en" target="_blank">
                    <a href="https://www.tuvsud.com/en">
                        Link
                        <ts-icon
                            library="system"
                            name="open_in_new"
                            size="14"
                            style="color: currentColor; padding-left: 5px"
                        >
                        </ts-icon>
                    </a>
                </ts-button>
                
                <ts-button variant="danger" href="https://www.tuvsud.com/en" target="_blank">
                    <a href="https://www.tuvsud.com/en">
                        Link
                        <ts-icon
                            library="system"    
                            name="open_in_new"
                            size="14"
                            style="color: currentColor; padding-left: 5px"
                        >
                        </ts-icon>
                    </a>
                </ts-button>

                <ts-button variant="neutral" href="https://www.tuvsud.com/en" target="_blank">
                    <a href="https://www.tuvsud.com/en">
                        Link
                        <ts-icon
                                library="system"
                                name="open_in_new"
                                size="14"
                                style="color: currentColor; padding-left: 5px"
                        >
                        </ts-icon>
                    </a>
                </ts-button>
            </div>
        </div>
    `,
};

export const PrefixAndSuffix: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `prefix` and `suffix` slots to add icons.',
            },
        },
    },
    render: () => html`
        <div class="sb-story-wrapper--column story-inverted-color">
            <span>Prefix</span>

            <div class="sb-story-wrapper">
                <ts-button variant="primary">
                    <ts-icon slot="prefix" size="24">
                        <img src="/assets/svg/settings.svg" />
                    </ts-icon>
                    Settings
                </ts-button>
                <ts-button variant="primary">
                    <ts-icon slot="prefix" size="24">
                        <img src="/assets/svg/autorenew.svg" />
                    </ts-icon>
                    Refresh
                </ts-button>
                <ts-button variant="primary">
                    <ts-icon slot="prefix" size="24">
                        <img src="/assets/svg/save.svg" />
                    </ts-icon>
                    Save
                </ts-button>
            </div>

            <ts-divider></ts-divider>
            <span>Suffix</span>
            <div class="sb-story-wrapper">
                <ts-button variant="primary">
                    <ts-icon slot="suffix" size="24">
                        <img src="/assets/svg/settings.svg" />
                    </ts-icon>
                    Settings
                </ts-button>
                <ts-button variant="primary">
                    <ts-icon slot="suffix" size="24">
                        <img src="/assets/svg/autorenew.svg" />
                    </ts-icon>
                    Refresh
                </ts-button>
                <ts-button variant="primary">
                    <ts-icon slot="suffix" size="24">
                        <img src="/assets/svg/save.svg" />
                    </ts-icon>
                    Save
                </ts-button>
            </div>
        </div>
    `,
};

export const PreventAnchorTag: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `prevent-anchor-tag` property with `href` to handle navigation programmatically instead of rendering as an anchor tag. This is useful for single-page applications where you need to intercept navigation, or when you want button semantics but need to navigate. The button will still navigate to the URL, but using JavaScript instead of a native anchor element.',
            },
        },
    },
    render: () => html`
        <div
            style="display: flex; gap: 10px; flex-direction: column; align-items: flex-start;"
            class="story-inverted-color"
        >
            <div>
                <p style="margin-bottom: 8px;"><strong>Standard button with href (renders as anchor tag):</strong></p>
                <ts-button variant="primary" href="https://www.tuvsud.com/en">Link Button (Anchor Tag)</ts-button>
                <p style="margin-top: 4px; font-size: 12px;">Inspect: Renders as &lt;a&gt; tag</p>
            </div>

            <div>
                <p style="margin-bottom: 8px;">
                    <strong>Button with href and prevent-anchor-tag. With target="_self:</strong>
                </p>
                <ts-button variant="primary" href="/?path=/docs/components-button--docs" prevent-anchor-tag=${true}>
                    Navigate Programmatically (Button Tag)
                </ts-button>
                <p style="margin-top: 4px; font-size: 12px;">
                    Inspect: Renders as &lt;button&gt; tag, navigates via JavaScript
                </p>
            </div>

            <div>
                <p style="margin-bottom: 8px;">
                    <strong>Button with href and prevent-anchor-tag. With target="_blank":</strong>
                </p>
                <ts-button
                    variant="success"
                    href="https://www.tuvsud.com/en"
                    target="_blank"
                    prevent-anchor-tag=${true}
                >
                    Open in New Tab
                </ts-button>
                <p style="margin-top: 4px; font-size: 12px;">Opens link in a new tab programmatically</p>
            </div>
        </div>
    `,
};

export const AriaLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `ariaLabel` to provide an accessible name when the button content alone is not sufficient. This is most commonly used for icon-only buttons or when you need a different accessible name than the visible text.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 20px;" class="story-inverted-color">
            <div>
                <h4>Buttons with contextual information</h4>
                <div style="display: flex; gap: 10px;">
                    <ts-button variant="primary" .ariaLabel=${'User profile changes'}> Save </ts-button>
                    <ts-button variant="danger" .ariaLabel=${'Delete this document permanently'}>Delete</ts-button>
                </div>
                <p style="margin-top: 8px; font-size: 12px;">
                    Adding context to generic actions makes them more accessible and clear.
                </p>
            </div>
            <div>
                <h4>Buttons that replace visible text entirely</h4>
                <div style="display: flex; gap: 10px;">
                    <ts-button variant="primary" .ariaLabel=${'Navigate to next step in checkout process'}>
                        Next
                    </ts-button>
                    <ts-button variant="neutral" .ariaLabel=${'Return to previous step in checkout process'}>
                        Back
                    </ts-button>
                </div>
                <p style="margin-top: 8px; font-size: 12px;">
                    Screen readers will hear the ariaLabel instead of the visible text.
                </p>
            </div>
        </div>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'btn-event-log',
            entries: [
                {
                    event: 'ts-blur',
                    firedWhen: 'Button loses focus',
                    detail: 'void',
                },
                {
                    event: 'ts-focus',
                    firedWhen: 'Button gains focus',
                    detail: 'void',
                },
                {
                    event: 'ts-invalid',
                    firedWhen: 'Form validity check fails',
                    detail: 'void',
                },
            ],
        });
        return {
            parameters,
            render: () =>
                wrap(html`
                    <ts-button
                        variant="primary"
                        @ts-blur=${(e: CustomEvent) => log('ts-blur', e.detail)}
                        @ts-focus=${(e: CustomEvent) => log('ts-focus', e.detail)}
                        @ts-invalid=${(e: CustomEvent) => log('ts-invalid', e.detail)}
                    >
                        Click or focus me
                    </ts-button>
                `),
        };
    })(),
};
