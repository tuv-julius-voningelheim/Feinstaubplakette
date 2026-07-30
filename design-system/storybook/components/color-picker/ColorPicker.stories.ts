import { html, nothing } from 'lit';

import type { TsColorPicker } from '@tuvsud/design-system/color-picker';
import type { StoryContext } from 'storybook/internal/types';

import type {
    TsBlurEvent,
    TsColorPickerChangeEvent,
    TsColorPickerInputEvent,
    TsFocusEvent,
    TsInvalidEvent,
} from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/color-picker';

type ColorPickerArgs = StoryContext<WebComponentsRenderer>['args'];

type ColorPickerEvents = {
    'ts-blur': unknown;
    'ts-change': unknown;
    'ts-focus': unknown;
    'ts-input': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Color Picker',
    component: 'ts-color-picker',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Color Picker allows users to select and customize colors for UI elements such as badges, backgrounds, or text. It provides multiple input methods like visual selection, sliders, and direct value entry.',
            },
            story: {
                height: '370px',
            },
        },
    },
    argTypes: {
        // Properties category
        format: {
            control: 'select',
            options: ['hex', 'rgb', 'hsl', 'hsv'],
            description: 'Desired color format.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'hex' }, category: 'Properties' },
        },
        inline: {
            control: 'boolean',
            description: 'Render inline instead of a dropdown.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Trigger size (no effect when inline).',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the color picker.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        noFormatToggle: {
            control: 'boolean',
            description: 'Removes the format toggle button.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        hoist: {
            control: 'boolean',
            description: 'Prevents panel clipping inside scrollable containers by using fixed positioning.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        opacity: {
            control: 'boolean',
            description: 'Shows the opacity slider; affects formatted output (HEXA/RGBA/HSLA).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        uppercase: {
            control: 'boolean',
            description: 'Outputs uppercase values instead of lowercase.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        swatches: {
            control: 'text',
            description: 'Preset colors separated by semicolons, or set via JS array.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        // Form category
        value: {
            control: 'text',
            description: 'The current value. Format varies by `format`. Submitted with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        defaultValue: {
            control: 'text',
            description: 'Default value of the control; useful for form resets.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        name: {
            control: 'text',
            description: 'Form field name for submission as name/value pair.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        form: {
            control: 'text',
            description: 'Associates the control to a form by ID when outside a form element.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Marks the control as required.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        validity: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validity state object (read-only).',
        },
        validationMessage: {
            control: false,
            table: { disable: false, category: 'Form' },
            description: 'Gets the validation message (read-only).',
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'Accessible label announced by assistive tech. Use `label` slot for HTML.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        // Events category
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the color picker loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-change': {
            action: 'ts-change',
            description: "Emitted when the color picker's value changes. Detail contains the new color value.",
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-input': {
            action: 'ts-input',
            description:
                'Emitted on every input interaction (e.g. while dragging). Detail contains the current color value.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-invalid': {
            action: 'ts-invalid',
            description:
                "Emitted when the form control has been checked for validity and its constraints aren't satisfied.",
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        size: 'medium',
        value: '#0046ad',
        defaultValue: '',
        label: '',
        format: 'hex',
        inline: false,
        noFormatToggle: false,
        name: '',
        disabled: false,
        hoist: false,
        opacity: false,
        uppercase: false,
        swatches: '',
        form: '',
        required: false,
    },
    render: args => html`
        <ts-color-picker
            value=${args.value || nothing}
            default-value=${args.defaultValue || nothing}
            label=${args.label || nothing}
            format=${args.format || nothing}
            .inline=${args.inline}
            ?inline=${args.inline}
            size=${args.size || nothing}
            .noFormatToggle=${args.noFormatToggle}
            ?no-format-toggle=${args.noFormatToggle}
            name=${args.name || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .hoist=${args.hoist}
            ?hoist=${args.hoist}
            .opacity=${args.opacity}
            ?opacity=${args.opacity}
            .uppercase=${args.uppercase}
            ?uppercase=${args.uppercase}
            swatches=${typeof args.swatches === 'string' && args.swatches ? args.swatches : nothing}
            form=${args.form || nothing}
            .required=${args.required}
            ?required=${args.required}
        ></ts-color-picker>
    `,
} satisfies MetaWithLabel<TsColorPicker & ColorPickerEvents>;

export default meta;
type Story = StoryObjWithLabel<TsColorPicker>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default color picker with a preset value.',
            },
        },
    },
};
export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'color-picker-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'The color value changes', detail: 'TsColorPickerChangeDetail' },
                { event: 'ts-input', firedWhen: 'Input while dragging/typing', detail: 'TsColorPickerChangeDetail' },
                { event: 'ts-focus', firedWhen: 'The color picker gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'The color picker loses focus', detail: 'void' },
                { event: 'ts-invalid', firedWhen: 'Form validation fails', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: ColorPickerArgs) =>
                wrap(html`
                    <ts-color-picker
                        value=${args.value || nothing}
                        format=${args.format || nothing}
                        .inline=${args.inline}
                        ?inline=${args.inline}
                        size=${args.size || nothing}
                        .disabled=${args.disabled}
                        ?disabled=${args.disabled}
                        .opacity=${args.opacity}
                        ?opacity=${args.opacity}
                        .uppercase=${args.uppercase}
                        ?uppercase=${args.uppercase}
                        @ts-change=${(e: TsColorPickerChangeEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: TsColorPickerInputEvent) => log('ts-input', e.detail)}
                        @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                        @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                        @ts-invalid=${(e: TsInvalidEvent) => log('ts-invalid', e.detail)}
                    ></ts-color-picker>
                `),
        };
    })(),
};
