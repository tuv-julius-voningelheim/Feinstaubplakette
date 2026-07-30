import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export type EventLoggerEntry = {
    /** The custom event name to listen for, e.g. `'ts-page-click'` */
    event: string;
    /** Short description of when this event fires */
    firedWhen: string;
    /** Human-readable description of the detail payload, e.g. `'{ page: number }'` */
    detail: string;
};

export type EventLoggerOptions = {
    /** Unique DOM id for the log list — must be unique per page */
    id: string;
    /** The entries that describe each event (shown in the reference table) */
    entries: EventLoggerEntry[];
    /** Placeholder text shown before any events are logged */
    placeholder?: string;
    /** Story description shown in the Docs tab */
    description?: string;
};

export type EventLogger = {
    /** Call this inside an event handler to append a new entry to the log panel */
    log: (label: string, detail: unknown) => void;
    /**
     * Wraps your component template in the flex layout container + log panel + reference table.
     * Pass the component template as the argument.
     *
     * @example
     * return wrap(html`<my-component @my-event=${(e: CustomEvent) => log('my-event', e.detail)}></my-component>`);
     */
    wrap: (component: TemplateResult) => TemplateResult;
    /** Story `parameters` object — spread into your story export */
    parameters: {
        docs: {
            description: {
                story: string;
            };
        };
    };
};

/**
 * Creates a reusable event logger panel for Storybook stories.
 *
 * @example
 * ```ts
 * const { log, wrap, parameters } = createEventLogger({
 *     id: 'my-log',
 *     description: 'Interact with the component to see events.',
 *     entries: [
 *         { event: 'my-event', firedWhen: 'Something happens', detail: '{ value: string }' },
 *     ],
 * });
 *
 * export const EventsLogger: Story = {
 *     parameters,
 *     render: () => wrap(html`
 *         <my-component @my-event=${(e: CustomEvent) => log('my-event', e.detail)}></my-component>
 *     `),
 * };
 * ```
 */
export function createEventLogger(options: EventLoggerOptions): EventLogger {
    const {
        id,
        entries,
        placeholder = 'Interact with the component to see events…',
        description = 'Interact with the component below to see all emitted events and their detail payloads logged in the panel.',
    } = options;

    const log = (label: string, detail: unknown) => {
        const list = document.getElementById(id);
        if (!list) return;
        const item = document.createElement('li');
        item.style.cssText =
            'font-family:monospace;font-size:13px;padding:6px 0;border-bottom:1px solid var(--ts-semantic-color-border-base-default);';
        item.innerHTML = `
            <span style="font-weight:700;">${new Date().toLocaleTimeString()} › ${label}</span>
            <details style="margin-top:4px;">
                <summary style="cursor:pointer;font-weight:700;font-size:12px;color:var(--ts-semantic-color-text-base-default);list-style:none;display:flex;align-items:center;gap:4px;">
                    <span style="font-size:10px;">▶</span> payload
                </summary>
                <pre style="margin:4px 0 0 0;padding:6px 10px;background:var(--ts-semantic-color-surface-neutral-default);border-radius:4px;font-size:12px;overflow-x:auto;white-space:pre-wrap;">${JSON.stringify(detail, null, 2)}</pre>
            </details>
        `;
        item.querySelector('details')?.addEventListener('toggle', function (this: HTMLDetailsElement) {
            const arrow = this.querySelector('span');
            if (arrow) arrow.textContent = this.open ? '▼' : '▶';
        });
        list.prepend(item);
    };

    const clearLog = () => {
        const list = document.getElementById(id);
        if (list)
            list.innerHTML = `<li style="font-family:monospace;font-size:13px;color:var(--ts-semantic-color-text-base-default);">${placeholder}</li>`;
    };

    const tableRowsHtml = entries
        .map(
            entry =>
                `<tr>
                    <td style="padding:8px 12px;border:1px solid var(--ts-semantic-color-border-base-default);font-family:monospace;">${entry.event}</td>
                    <td style="padding:8px 12px;border:1px solid var(--ts-semantic-color-border-base-default);">${entry.firedWhen}</td>
                    <td style="padding:8px 12px;border:1px solid var(--ts-semantic-color-border-base-default);font-family:monospace;">${entry.detail}</td>
                </tr>`,
        )
        .join('');

    const logPanel = html`
        <div
            style="border:1px solid var(--ts-semantic-color-border-base-default);border-radius:6px;padding:12px;background:var(--ts-semantic-color-surface-neutral-default);min-height:180px;"
        >
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span
                    style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--ts-semantic-color-text-base-default);"
                    >Event Log</span
                >
                <button
                    style="font-size:11px;cursor:pointer;border:1px solid var(--ts-semantic-color-border-base-default);border-radius:4px;padding:2px 8px;background:var(--ts-semantic-color-surface-base-default);color:var(--ts-semantic-color-text-base-default);"
                    @click=${clearLog}
                >
                    Clear
                </button>
            </div>
            <ul
                id=${id}
                style="list-style:none;margin:0;padding:0;color:var(--ts-semantic-color-text-base-default);max-height:300px;overflow-y:auto;"
            >
                <li style="font-family:monospace;font-size:13px;color:var(--ts-semantic-color-text-base-default);">
                    ${placeholder}
                </li>
            </ul>
        </div>

        <table class="sb-event-logger-table" style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
                <tr>
                    <th
                        style="text-align:left;padding:8px 12px;border:1px solid var(--ts-semantic-color-border-base-default);"
                    >
                        Event
                    </th>
                    <th
                        style="text-align:left;padding:8px 12px;border:1px solid var(--ts-semantic-color-border-base-default);"
                    >
                        Fired when
                    </th>
                    <th
                        style="text-align:left;padding:8px 12px;border:1px solid var(--ts-semantic-color-border-base-default);"
                    >
                        Detail payload
                    </th>
                </tr>
            </thead>
            <tbody>
                ${unsafeHTML(tableRowsHtml)}
            </tbody>
        </table>
    `;

    const wrap = (component: TemplateResult) => html`
        <div style="display:flex;flex-direction:column;gap:20px;">${component} ${logPanel}</div>
    `;

    const parameters = {
        docs: {
            description: {
                story: description,
            },
        },
    };

    return { log, wrap, parameters };
}
