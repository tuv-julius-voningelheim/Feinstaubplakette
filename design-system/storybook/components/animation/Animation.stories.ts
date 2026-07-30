import { html, nothing } from 'lit';

import type { TsAnimation } from '@tuvsud/design-system/animation';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/animation';

const meta = {
    title: 'Components/Animation',
    component: 'ts-animation',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Support declarative element animation through almost 100 predefined presets, with the option to implement custom keyframes as needed.',
            },
        },
    },
    argTypes: {
        name: {
            control: 'text',
            description: 'Preset animation name, or a custom animation name supported by the component.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'none' }, category: 'Properties' },
        },
        play: {
            control: 'boolean',
            description: 'If true, the animation plays.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        delay: {
            control: 'number',
            description: 'Delay before the animation starts (ms).',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        direction: {
            control: 'select',
            options: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
            description: 'Playback direction of the animation.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'normal' },
                category: 'Properties',
            },
        },
        duration: {
            control: 'number',
            description: 'Animation duration (ms).',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1000' }, category: 'Properties' },
        },
        easing: {
            control: 'text',
            description: 'CSS timing function (e.g. "linear", "ease-in-out").',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'linear' }, category: 'Properties' },
        },
        endDelay: {
            control: 'number',
            description: 'Delay after the animation ends before finishing (ms).',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        fill: {
            control: 'select',
            options: ['auto', 'none', 'forwards', 'backwards', 'both'],
            description: 'Controls how styles are applied before/after the animation.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'auto' },
                category: 'Properties',
            },
        },
        iterations: {
            control: 'number',
            description: 'Number of times the animation repeats. Use Infinity for endless looping.',
            table: { type: { summary: 'number' }, defaultValue: { summary: 'Infinity' }, category: 'Properties' },
        },
        iterationStart: {
            control: 'number',
            description: 'Start offset for the animation iteration count.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        keyframes: {
            control: 'object',
            description: 'Custom keyframes to run instead of a preset (Web Animations keyframes format).',
            table: {
                type: { summary: 'Keyframe[] | undefined' },
                defaultValue: { summary: 'undefined' },
                category: 'Properties',
            },
        },
        playbackRate: {
            control: 'number',
            description: 'Playback speed multiplier (1 = normal speed).',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        currentTime: {
            control: 'number',
            description: 'Sets the animation current time position (ms).',
            table: { type: { summary: 'number' }, defaultValue: { summary: 'undefined' }, category: 'Properties' },
        },
    },
    args: {
        name: 'bounce',
        play: true,
        delay: 0,
        direction: 'normal',
        duration: 1000,
        easing: 'linear',
        endDelay: 0,
        fill: 'auto',
        iterations: undefined,
        iterationStart: 0,
        keyframes: undefined,
        playbackRate: 1,
        currentTime: undefined,
    },
    render: args => html`
        <ts-animation
            name=${args.name || nothing}
            ?play=${args.play}
            delay=${args.delay ?? nothing}
            direction=${args.direction || nothing}
            duration=${args.duration ?? nothing}
            easing=${args.easing || nothing}
            end-delay=${args.endDelay ?? nothing}
            fill=${args.fill || nothing}
            iterations=${args.iterations ?? nothing}
            iteration-start=${args.iterationStart ?? nothing}
            .keyframes=${args.keyframes}
            playback-rate=${args.playbackRate ?? nothing}
        >
            <div
                style="width:96px;
                height:96px;border-radius:12px;
                background:var(--ts-semantic-color-background-primary-default);"
            ></div>
        </ts-animation>
    `,
} satisfies MetaWithLabel<TsAnimation>;

export default meta;
type Story = StoryObjWithLabel<TsAnimation>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Default animation using the `bounce` preset.',
            },
        },
    },
};

export const Animation: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This example demonstrates all of the baked-in animations and easings. Animations are based on those found in the popular Animate.css library.',
            },
        },
    },
    render: args => html`
        <div class="animation-overview">
            <ts-animation
                .name=${args.name}
                .duration=${args.duration}
                .play=${args.play}
                .delay=${args.delay}
                .direction=${args.direction}
                .easing=${args.easing}
                .endDelay=${args.endDelay}
                .fill=${args.fill}
                .iterations=${args.iterations}
                .iterationStart=${args.iterationStart}
                .keyframes=${args.keyframes}
                .playbackRate=${args.playbackRate}
                .currentTime=${args.currentTime}
            >
                <div class="box"></div>
            </ts-animation>

            <ts-animation .name=${'jello'} .duration=${args.duration} .play=${args.play}>
                <div class="box"></div>
            </ts-animation>

            <ts-animation .name=${'heartBeat'} .duration=${args.duration} .play=${args.play}>
                <div class="box"></div>
            </ts-animation>

            <ts-animation .name=${'flip'} .duration=${args.duration} .play=${args.play}>
                <div class="box"></div>
            </ts-animation>
        </div>

        <style>
            .animation-overview .box {
                display: inline-block;
                width: 100px;
                height: 100px;
                background-color: var(--ts-semantic-color-background-primary-default);
                margin: 1.5rem;
            }
        </style>
    `,
};
