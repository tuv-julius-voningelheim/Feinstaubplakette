import { html, nothing } from 'lit';

import type { TsQrCode } from '@tuvsud/design-system/qr-code';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/qr-code';

const meta = {
    title: 'Components/QR Code',
    component: 'ts-qr-code',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'QR codes are useful for providing small pieces of information to users who can quickly scan them with a smartphone. Most smartphones have built-in QR code scanners, so simply pointing the camera at a QR code will decode it and allow the user to visit a website, dial a phone number, read a message, etc.',
            },
        },
    },
    argTypes: {
        // Properties category
        value: {
            control: 'text',
            description: "The QR code's value.",
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        size: {
            control: { type: 'number', min: 64, step: 8 },
            description: 'Size in pixels.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '128' }, category: 'Properties' },
        },
        fill: {
            control: 'text',
            description: 'Fill color.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'black' }, category: 'Properties' },
        },
        background: {
            control: 'text',
            description: 'Background color.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'white' }, category: 'Properties' },
        },
        radius: {
            control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
            description: 'Module edge radius (0–0.5).',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        errorCorrection: {
            control: 'select',
            options: ['L', 'M', 'Q', 'H'],
            description: 'Error correction level.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'H' }, category: 'Properties' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'Accessible label; defaults to value.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
    },
    args: {
        value: 'https://www.tuvsud.com/de-de',
        label: 'QR code linking to example.com',
        size: 160,
        fill: 'black',
        background: 'white',
        radius: 0,
        errorCorrection: 'H',
    },
    render: args => {
        const { value, label, size, fill, background, radius, errorCorrection } = args;
        return html`
            <ts-qr-code
                value=${value || nothing}
                label=${label || nothing}
                size=${size ?? nothing}
                fill=${fill || nothing}
                background=${background || nothing}
                radius=${radius ?? nothing}
                error-correction=${errorCorrection || nothing}
            ></ts-qr-code>
        `;
    },
} satisfies MetaWithLabel<TsQrCode>;

export default meta;
type Story = StoryObjWithLabel<TsQrCode>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the component generates a QR code linking to the specified URL with high error correction.',
            },
        },
    },
};
