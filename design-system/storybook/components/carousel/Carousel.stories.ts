import { html, nothing } from 'lit';

import type { TsCarousel } from '@tuvsud/design-system/carousel';
import type { StoryContext } from 'storybook/internal/types';

import type { TsClickNextEvent } from '@utils/events/ts-click-next.js';
import type { TsClickPreviousEvent } from '@utils/events/ts-click-previous.js';
import type { TsSlideChangeEvent } from '@utils/events/ts-slide-change.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/carousel';
import '@tuvsud/design-system/carousel-item';

type CarouselArgs = StoryContext<WebComponentsRenderer>['args'];

type CarouselEvents = {
    'ts-slide-change': unknown;
    'ts-click-next': unknown;
    'ts-click-previous': unknown;
};

const renderCarousel = (args: CarouselArgs) => html`
    <ts-carousel
        .loop=${args.loop}
        ?loop=${args.loop}
        .navigation=${args.navigation}
        ?navigation=${args.navigation}
        .pagination=${args.pagination}
        ?pagination=${args.pagination}
        .autoplay=${args.autoplay}
        ?autoplay=${args.autoplay}
        .autoplayInterval=${args.autoplayInterval}
        autoplay-interval=${args.autoplayInterval ?? nothing}
        .slidesPerPage=${args.slidesPerPage}
        slides-per-page=${args.slidesPerPage ?? nothing}
        .slidesPerMove=${args.slidesPerMove}
        slides-per-move=${args.slidesPerMove ?? nothing}
        orientation=${args.orientation || nothing}
        .mouseDragging=${args.mouseDragging}
        ?mouse-dragging=${args.mouseDragging}
        style="--aspect-ratio: 16/9;"
    >
        <ts-carousel-item>
            <img src="/assets/carousel/slide1.jpg" alt="slide1" style="width: 100%; height: 100%; object-fit: cover;" />
        </ts-carousel-item>
        <ts-carousel-item>
            <img src="/assets/carousel/slide2.jpg" alt="slide2" style="width: 100%; height: 100%; object-fit: cover;" />
        </ts-carousel-item>
        <ts-carousel-item>
            <img src="/assets/carousel/slide3.jpg" alt="slide3" style="width: 100%; height: 100%; object-fit: cover;" />
        </ts-carousel-item>
        <ts-carousel-item>
            <img src="/assets/carousel/slide4.jpg" alt="slide4" style="width: 100%; height: 100%; object-fit: cover;" />
        </ts-carousel-item>
    </ts-carousel>
`;

const meta = {
    title: 'Components/Carousel',
    component: 'ts-carousel',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Carousels let you showcase as many content slides as you need, navigable along either a horizontal or vertical axis.',
            },
        },
    },
    argTypes: {
        loop: {
            control: 'boolean',
            description: 'If true, the carousel wraps around from last slide to first.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        navigation: {
            control: 'boolean',
            description: 'Shows previous/next navigation controls.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        pagination: {
            control: 'boolean',
            description: 'Displays pagination indicators for the slides.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        autoplay: {
            control: 'boolean',
            description: 'Automatically advances slides at a fixed interval.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        autoplayInterval: {
            control: 'number',
            description: 'Time in milliseconds between slide changes when autoplay is enabled.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '3000' }, category: 'Properties' },
        },
        slidesPerPage: {
            control: 'number',
            description: 'Number of slides visible at the same time.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        slidesPerMove: {
            control: 'number',
            description: 'Number of slides advanced per navigation step.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Direction in which the carousel scrolls.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'horizontal' }, category: 'Properties' },
        },
        mouseDragging: {
            control: 'boolean',
            description: 'Allows dragging slides with the mouse or touch gestures.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        'ts-slide-change': {
            action: 'ts-slide-change',
            description: 'Emitted when the active slide changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-click-next': {
            action: 'ts-click-next',
            description: 'Emitted when the next navigation button is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-click-previous': {
            action: 'ts-click-previous',
            description: 'Emitted when the previous navigation button is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        autoplay: false,
        autoplayInterval: 3000,
        pagination: true,
        navigation: true,
        loop: true,
        mouseDragging: true,
        slidesPerPage: 1,
        slidesPerMove: 1,
        orientation: 'horizontal',
    },
    render: args => renderCarousel(args),
} satisfies MetaWithLabel<TsCarousel & CarouselEvents>;

export default meta;
type Story = StoryObjWithLabel<TsCarousel>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A basic carousel with navigation and pagination enabled, displaying one slide at a time.',
            },
        },
    },
};

export const ScrollHint: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The scroll hint indicates that additional content is available beyond the visible area, prompting users to scroll for more information.',
            },
        },
    },
    render: args => html`
        <ts-carousel
            .loop=${args.loop}
            ?loop=${args.loop}
            .navigation=${args.navigation}
            ?navigation=${args.navigation}
            .pagination=${args.pagination}
            ?pagination=${args.pagination}
            .autoplay=${args.autoplay}
            ?autoplay=${args.autoplay}
            .autoplayInterval=${args.autoplayInterval}
            autoplay-interval=${args.autoplayInterval ?? nothing}
            .slidesPerPage=${args.slidesPerPage}
            slides-per-page=${args.slidesPerPage ?? nothing}
            .slidesPerMove=${args.slidesPerMove}
            slides-per-move=${args.slidesPerMove ?? nothing}
            orientation=${args.orientation || nothing}
            .mouseDragging=${args.mouseDragging}
            ?mouse-dragging=${args.mouseDragging}
            class="scroll-hint"
            style="--scroll-hint: 10%;"
        >
            <ts-carousel-item><img src="/assets/carousel/slide1.jpg" alt="slide1" /></ts-carousel-item>
            <ts-carousel-item><img src="/assets/carousel/slide2.jpg" alt="slide2" /></ts-carousel-item>
            <ts-carousel-item><img src="/assets/carousel/slide3.jpg" alt="slide3" /></ts-carousel-item>
            <ts-carousel-item><img src="/assets/carousel/slide4.jpg" alt="slide4" /></ts-carousel-item>
        </ts-carousel>
    `,
};

export const ManySlides: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Testing loop functionality with many slides. The pagination indicators are scrollable and the carousel should loop infinitely without jumping back to the first slide.',
            },
        },
    },
    args: { loop: true, pagination: true, navigation: true, autoplay: false },
    render: args => html`
        <ts-carousel
            .loop=${args.loop}
            ?loop=${args.loop}
            .navigation=${args.navigation}
            ?navigation=${args.navigation}
            .pagination=${args.pagination}
            ?pagination=${args.pagination}
            .autoplay=${args.autoplay}
            ?autoplay=${args.autoplay}
            .autoplayInterval=${args.autoplayInterval}
            autoplay-interval=${args.autoplayInterval ?? nothing}
            .slidesPerPage=${args.slidesPerPage}
            slides-per-page=${args.slidesPerPage ?? nothing}
            .slidesPerMove=${args.slidesPerMove}
            slides-per-move=${args.slidesPerMove ?? nothing}
            orientation=${args.orientation || nothing}
            .mouseDragging=${args.mouseDragging}
            ?mouse-dragging=${args.mouseDragging}
            style="--aspect-ratio: 16/9;"
        >
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-sky-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 1
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-pink-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 2
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-green-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 3
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-orange-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 4
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-purple-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 5
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-teal-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 6
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-yellow-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 7
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-red-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 8
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-blue-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 9
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-lime-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 10
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-indigo-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 11
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-cyan-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 12
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-amber-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 13
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-emerald-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 14
                </div>
            </ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-violet-400);">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;"
                >
                    Slide 15
                </div>
            </ts-carousel-item>
        </ts-carousel>
    `,
};

export const Vertical: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When enabled, the navigation elements of the component are displayed vertically instead of horizontally.',
            },
        },
    },
    args: { orientation: 'vertical', pagination: true },
    render: args => html`
        <ts-carousel
            .loop=${args.loop}
            ?loop=${args.loop}
            .navigation=${args.navigation}
            ?navigation=${args.navigation}
            .pagination=${args.pagination}
            ?pagination=${args.pagination}
            .autoplay=${args.autoplay}
            ?autoplay=${args.autoplay}
            .autoplayInterval=${args.autoplayInterval}
            autoplay-interval=${args.autoplayInterval ?? nothing}
            .slidesPerPage=${args.slidesPerPage}
            slides-per-page=${args.slidesPerPage ?? nothing}
            .slidesPerMove=${args.slidesPerMove}
            slides-per-move=${args.slidesPerMove ?? nothing}
            orientation=${args.orientation || nothing}
            .mouseDragging=${args.mouseDragging}
            ?mouse-dragging=${args.mouseDragging}
            class="vertical"
        >
            <ts-carousel-item><img src="/assets/carousel/slide1.jpg" alt="slide1" /></ts-carousel-item>
            <ts-carousel-item><img src="/assets/carousel/slide2.jpg" alt="slide2" /></ts-carousel-item>
            <ts-carousel-item><img src="/assets/carousel/slide3.jpg" alt="slide3" /></ts-carousel-item>
            <ts-carousel-item><img src="/assets/carousel/slide4.jpg" alt="slide4" /></ts-carousel-item>
        </ts-carousel>

        <style>
            .vertical {
                max-height: 400px;
            }
            .vertical::part(base) {
                grid-template-areas: 'slides slides pagination';
            }
            .vertical::part(pagination) {
                flex-direction: column;
            }
            .vertical::part(navigation) {
                transform: rotate(90deg);
                display: flex;
            }
        </style>
    `,
};

export const MultipleSlidesPerView: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `slides-per-page` and `slides-per-move` to show and advance multiple slides at a time.',
            },
        },
    },
    args: { slidesPerPage: 2, slidesPerMove: 2 },
    render: args => html`
        <ts-carousel
            .loop=${args.loop}
            ?loop=${args.loop}
            .navigation=${args.navigation}
            ?navigation=${args.navigation}
            .pagination=${args.pagination}
            ?pagination=${args.pagination}
            .autoplay=${args.autoplay}
            ?autoplay=${args.autoplay}
            .autoplayInterval=${args.autoplayInterval}
            autoplay-interval=${args.autoplayInterval ?? nothing}
            .slidesPerPage=${args.slidesPerPage}
            slides-per-page=${args.slidesPerPage ?? nothing}
            .slidesPerMove=${args.slidesPerMove}
            slides-per-move=${args.slidesPerMove ?? nothing}
            orientation=${args.orientation || nothing}
            .mouseDragging=${args.mouseDragging}
            ?mouse-dragging=${args.mouseDragging}
        >
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-sky-400);">Slide 1</ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-pink-400);">Slide 2</ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-sky-400);">Slide 3</ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-pink-400);">Slide 4</ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-sky-400);">Slide 5</ts-carousel-item>
            <ts-carousel-item style="background: var(--ts-semantic-color-charts-pink-400);">Slide 6</ts-carousel-item>
        </ts-carousel>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'carousel-event-log',
            entries: [
                {
                    event: 'ts-slide-change',
                    firedWhen: 'The active slide changes',
                    detail: 'TsCarouselSlideDetail',
                },
                {
                    event: 'ts-click-next',
                    firedWhen: 'The next navigation button is clicked',
                    detail: 'TsCarouselSlideDetail',
                },
                {
                    event: 'ts-click-previous',
                    firedWhen: 'The previous navigation button is clicked',
                    detail: 'TsCarouselSlideDetail',
                },
            ],
        });
        return {
            parameters,
            render: (args: CarouselArgs) =>
                wrap(html`
                    <ts-carousel
                        .loop=${args.loop}
                        ?loop=${args.loop}
                        .navigation=${true}
                        ?navigation=${true}
                        .pagination=${args.pagination}
                        ?pagination=${args.pagination}
                        .autoplay=${args.autoplay}
                        ?autoplay=${args.autoplay}
                        .autoplayInterval=${args.autoplayInterval}
                        autoplay-interval=${args.autoplayInterval ?? nothing}
                        .slidesPerPage=${args.slidesPerPage}
                        slides-per-page=${args.slidesPerPage ?? nothing}
                        .slidesPerMove=${args.slidesPerMove}
                        slides-per-move=${args.slidesPerMove ?? nothing}
                        orientation=${args.orientation || nothing}
                        .mouseDragging=${args.mouseDragging}
                        ?mouse-dragging=${args.mouseDragging}
                        style="--aspect-ratio: 16/9;"
                        @ts-slide-change=${(e: TsSlideChangeEvent) => log('ts-slide-change', { index: e.detail.index })}
                        @ts-click-next=${(e: TsClickNextEvent) => log('ts-click-next', { index: e.detail.index })}
                        @ts-click-previous=${(e: TsClickPreviousEvent) =>
                            log('ts-click-previous', { index: e.detail.index })}
                    >
                        <ts-carousel-item>
                            <img
                                src="/assets/carousel/slide1.jpg"
                                alt="slide1"
                                style="width: 100%; height: 100%; object-fit: cover;"
                            />
                        </ts-carousel-item>
                        <ts-carousel-item>
                            <img
                                src="/assets/carousel/slide2.jpg"
                                alt="slide2"
                                style="width: 100%; height: 100%; object-fit: cover;"
                            />
                        </ts-carousel-item>
                        <ts-carousel-item>
                            <img
                                src="/assets/carousel/slide3.jpg"
                                alt="slide3"
                                style="width: 100%; height: 100%; object-fit: cover;"
                            />
                        </ts-carousel-item>
                        <ts-carousel-item>
                            <img
                                src="/assets/carousel/slide4.jpg"
                                alt="slide4"
                                style="width: 100%; height: 100%; object-fit: cover;"
                            />
                        </ts-carousel-item>
                    </ts-carousel>
                `),
        };
    })(),
};
