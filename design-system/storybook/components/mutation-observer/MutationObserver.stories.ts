import { html, nothing } from 'lit';

import type { TsMutationObserver } from '@tuvsud/design-system/mutation-observer';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/mutation-observer';

type MutationObserverArgs = StoryContext<WebComponentsRenderer>['args'];

type MutationObserverEvents = {
    'ts-mutation': unknown;
};

const meta = {
    title: 'Components/Mutation Observer',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'The Mutation Observer component supplies a minimal, declarative abstraction over the native MutationObserver API.',
            },
        },
    },
    argTypes: {
        // Properties category
        attr: {
            control: 'text',
            description: 'Attributes to watch (space-separated) or * for all.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        attrOldValue: {
            control: 'boolean',
            description: 'Record the previous value of changed attributes.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        charData: {
            control: 'boolean',
            description: 'Watch character data changes.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        charDataOldValue: {
            control: 'boolean',
            description: 'Record previous character data value.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        childList: {
            control: 'boolean',
            description: 'Watch added/removed child nodes.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disable the observer.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Events category
        'ts-mutation': {
            action: 'ts-mutation',
            description: 'Emitted when a mutation occurs.',
            table: { category: 'Events', type: { summary: 'CustomEvent<{ mutationList: MutationRecord[] }>' } },
        },
    },
    args: {
        attr: '',
        attrOldValue: false,
        charData: false,
        charDataOldValue: false,
        childList: false,
        disabled: false,
    },
    render: args => html`
        <div style="display:grid; gap:12px; max-width:520px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <button
                    type="button"
                    @click=${() => {
                        const el = document.getElementById('mo-target')!;
                        el.toggleAttribute('data-active');
                        el.textContent = el.hasAttribute('data-active') ? 'Active text' : 'Idle text';
                    }}
                >
                    Toggle attribute/text
                </button>
                <button
                    type="button"
                    @click=${() => {
                        const el = document.getElementById('mo-target')!;
                        const span = document.createElement('span');
                        span.textContent = ' +child';
                        el.appendChild(span);
                    }}
                >
                    Add child
                </button>
            </div>

            <ts-mutation-observer
                .attr=${args.attr}
                attr=${args.attr || nothing}
                .attrOldValue=${args.attrOldValue}
                ?attr-old-value=${args.attrOldValue}
                .charData=${args.charData}
                ?char-data=${args.charData}
                .charDataOldValue=${args.charDataOldValue}
                ?char-data-old-value=${args.charDataOldValue}
                .childList=${args.childList}
                ?child-list=${args.childList}
                .disabled=${args.disabled}
                ?disabled=${args.disabled}
            >
                <div id="mo-target" style="padding:8px; border:1px dashed currentColor;">Idle text</div>
            </ts-mutation-observer>
        </div>
    `,
} satisfies MetaWithLabel<TsMutationObserver & MutationObserverEvents>;

export default meta;
type Story = StoryObjWithLabel<TsMutationObserver>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the Mutation Observer is set up but does not observe any changes until configured via its properties.',
            },
        },
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'mutation-observer-event-log',
            entries: [
                {
                    event: 'ts-mutation',
                    firedWhen: 'A DOM mutation matching the configured options occurs',
                    detail: '{ mutationList: MutationRecord[] }',
                },
            ],
        });
        return {
            parameters,
            render: (args: MutationObserverArgs) =>
                wrap(html`
                    <div style="display:grid; gap:12px; max-width:520px;">
                        <div style="display:flex; gap:8px; align-items:center;">
                            <button
                                type="button"
                                @click=${() => {
                                    const el = document.getElementById('mo-target-log')!;
                                    el.toggleAttribute('data-active');
                                    el.textContent = el.hasAttribute('data-active') ? 'Active text' : 'Idle text';
                                }}
                            >
                                Toggle attribute/text
                            </button>
                            <button
                                type="button"
                                @click=${() => {
                                    const el = document.getElementById('mo-target-log')!;
                                    const span = document.createElement('span');
                                    span.textContent = ' +child';
                                    el.appendChild(span);
                                }}
                            >
                                Add child
                            </button>
                        </div>

                        <ts-mutation-observer
                            .attr=${args.attr}
                            attr=${args.attr || nothing}
                            .attrOldValue=${args.attrOldValue}
                            ?attr-old-value=${args.attrOldValue}
                            .charData=${args.charData}
                            ?char-data=${args.charData}
                            .charDataOldValue=${args.charDataOldValue}
                            ?char-data-old-value=${args.charDataOldValue}
                            .childList=${args.childList}
                            ?child-list=${args.childList}
                            .disabled=${args.disabled}
                            ?disabled=${args.disabled}
                            @ts-mutation=${(e: CustomEvent) => log('ts-mutation', e.detail)}
                        >
                            <div id="mo-target-log" style="padding:8px; border:1px dashed currentColor;">Idle text</div>
                        </ts-mutation-observer>
                    </div>
                `),
        };
    })(),
};
