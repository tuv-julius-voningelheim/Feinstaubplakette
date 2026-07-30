import { html, nothing } from 'lit';

import type { TsImageComparer } from '@tuvsud/design-system/image-comparer';
import type { StoryContext } from 'storybook/internal/types';

import type { TsImageComparerChangeEvent } from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/image-comparer';

type ImageComparerArgs = StoryContext<WebComponentsRenderer>['args'];

type ImageComparerEvents = {
    'ts-change': unknown;
};

const meta = {
    title: 'Components/Image Comparer',
    tags: ['autodocs'],
    parameters: {
        description: {
            component:
                'Easily spot visual differences between similar photos with an intuitive, interactive sliding panel.',
        },
    },
    argTypes: {
        // Properties category
        position: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
            description: 'Divider position as a percentage.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '50' }, category: 'Properties' },
        },
        // Events category
        'ts-change': {
            action: 'ts-change',
            description: 'Emitted when the position changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: { position: 50 },
    render: args => html`
        <ts-image-comparer .position=${Number(args.position)} position=${args.position ?? nothing}>
            <img style="width: 100%; height: 400px" slot="before" src="assets/image-comparer/image1.jpg" alt="Before" />
            <img style="width: 100%;" slot="after" src="assets/image-comparer/image2.jpg" alt="After" />
        </ts-image-comparer>
    `,
} satisfies MetaWithLabel<TsImageComparer & ImageComparerEvents>;

export default meta;
type Story = StoryObjWithLabel<TsImageComparer>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the image comparer is set to a position of 50%, showing equal parts of both images.',
            },
        },
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'image-comparer-event-log',
            entries: [
                {
                    event: 'ts-change',
                    firedWhen: 'The divider position changes',
                    detail: 'TsImageComparerChangeDetail',
                },
            ],
        });
        return {
            parameters,
            render: (args: ImageComparerArgs) =>
                wrap(html`
                    <ts-image-comparer
                        .position=${Number(args.position)}
                        position=${args.position ?? nothing}
                        @ts-change=${(e: TsImageComparerChangeEvent) => log('ts-change', e.detail)}
                    >
                        <img
                            style="width: 100%; height: 400px"
                            slot="before"
                            src="assets/image-comparer/image1.jpg"
                            alt="Before"
                        />
                        <img style="width: 100%;" slot="after" src="assets/image-comparer/image2.jpg" alt="After" />
                    </ts-image-comparer>
                `),
        };
    })(),
};
