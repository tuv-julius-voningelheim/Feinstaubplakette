import { type CSSResultGroup, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

import { getCalendarAriaLabels, getCalendarButtons, loadCalendarLocale } from '@utils/date/calendar-i18n.js';
import { formatDateByLocale, parseByLocale } from '@utils/date/date-format.js';
import { DaysOfWeek } from '@utils/date/model.js';
import { forwardProps } from '@utils/directive/forward-props.directive.js';

import { TsButton } from '@components/button/index.js';
import TsDateCalendarRange from '@components/date-range/date-calendar-range/date-calendar-range.component.js';
import TsDateInputEnd from '@components/date-range/date-input-range/date-input-end.component.js';
import TsDateInputStart from '@components/date-range/date-input-range/date-input-start.component.js';
import TsDateShortcutComponent from '@components/date-range/date-shortcuts/date-shortcuts.component.js';
import { type CalendarOpenOrigin, DateRangeFocusManager } from '@components/date-range/src/date-range-focus-manager.js';
import { fire } from '@components/date-range/src/events-range.helpers.js';
import { TsDropdown } from '@components/dropdown/index.js';
import { TsIconButton } from '@components/icon-button/index.js';
import { TsInput } from '@components/input/index.js';

import styles from './TsDateDropdownRangeStyle.js';

/**
 * @summary Internal desktop dropdown variant for the date range picker. Wraps a `ts-dropdown`
 * containing start/end inputs, a dual-month calendar, optional shortcuts, and optional
 * OK/Cancel footer actions. Used by `ts-date-range` on larger viewports.
 * @documentation https://create.tuvsud.com/latest/components/date-range-picker/develop-vo4zlBb4
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-icon-button
 * @dependency ts-input
 * @dependency ts-date-input-start
 * @dependency ts-date-input-end
 * @dependency ts-dropdown
 * @dependency ts-date-calendar-range
 * @dependency ts-date-shortcuts
 * @dependency ts-button
 *
 * @slot suffix - Suffix slot forwarded to the internal start/end date inputs for calendar icons.
 * @slot label-icon - An icon (or any element) placed inline after the start date label text.
 * @slot label-icon-end - An icon (or any element) placed inline after the end date label text.
 *
 * @event ts-date-range-select - Emitted when the user selects or completes a range. Detail: `{ start, end, clearEnd, clearStart }`.
 * @event ts-date-apply - Emitted when the user confirms the selection via OK. Detail: `{ start, end, locale, meta }`.
 * @event ts-date-cancel - Emitted when the user cancels via Cancel button. Detail: `{ start, end, locale, meta }`.
 * @event ts-shortcut-select - Re-dispatched when a date shortcut is clicked. Detail: `{ index }`.
 *
 * @csspart base - The component's root wrapper.
 */
export default class TsDateDropdownRangeComponent extends LitElement {
    static override styles: CSSResultGroup = [styles];

    static dependencies = {
        'ts-icon-button': TsIconButton,
        'ts-input': TsInput,
        'ts-date-input-start': TsDateInputStart,
        'ts-date-input-end': TsDateInputEnd,
        'ts-dropdown': TsDropdown,
        'ts-date-calendar-range': TsDateCalendarRange,
        'ts-date-shortcuts': TsDateShortcutComponent,
        'ts-button': TsButton,
    };

    /** The formatted start date value. */
    @property() valueStart = '';

    /** The formatted end date value. */
    @property() valueEnd = '';

    /** The active locale for date formatting and localization. */
    @property() locale = 'en';

    /** The size variant of the input fields (`'small'`, `'medium'`, or `'large'`). */
    @property() size: string | number | undefined;

    /** The distance offset between the trigger and the dropdown popup. */
    @property({ type: Number }) distance = 6;

    /** When `true`, disables the inputs and prevents interaction. */
    @property({ type: Boolean }) disabled = false;

    /** The currently focused date determining the visible month in the calendar. */
    @property({ attribute: false }) focused: Date = new Date();

    /** Properties forwarded to the internal date inputs. */
    @property({ attribute: false }) forwardedProps: Record<string, unknown> = {};

    /** Callback invoked after the dropdown finishes showing. */
    @property({ attribute: false }) onAfterShow!: () => void;

    /** Callback invoked after the dropdown finishes hiding. */
    @property({ attribute: false }) onAfterHide!: () => void;

    /** The helper or assistive text displayed below the inputs. */
    @property({ type: String, reflect: true, attribute: 'help-text' }) helpText = '';

    /** Callback invoked on input or change events from the start date input. */
    @property({ attribute: false }) onInputOrChangeStart!: (e: Event) => void;

    /** Callback invoked on input or change events from the end date input. */
    @property({ attribute: false }) onInputOrChangeEnd!: (e: Event) => void;

    /** Callback invoked when either date input loses focus. */
    @property({ attribute: false }) onInputBlur!: () => void;

    /** Callback invoked when the start date input loses focus (parent-level blur validation). */
    @property({ attribute: false }) onBlurStart!: () => void;

    /** Callback invoked when the end date input loses focus (parent-level blur validation). */
    @property({ attribute: false }) onBlurEnd!: () => void;

    /** Callback invoked when the trigger input is clicked. */
    @property({ attribute: false }) onTriggerClick!: (e: Event) => void;

    /** Callback invoked when the calendar month changes. */
    @property({ attribute: false }) onMonthChange!: (e: CustomEvent<{ focused: Date }>) => void;

    /** Callback invoked when a range selection is made from the calendar. */
    @property({ attribute: false }) onSelect!: (
        e: CustomEvent<{ start?: string; end?: string; clearEnd?: boolean }>,
    ) => void;

    /** Indicates which field is being selected: `'start'` or `'end'`. */
    @property({ attribute: false }) activeField: 'start' | 'end' = 'start';

    /** When `true`, closes the dropdown when a complete range is selected. */
    @property({ type: Boolean }) closeOnSelect = false;

    /** When `true`, makes the input fields read-only. */
    @property({ type: Boolean, reflect: true }) readonly = false;

    /** Numeric shortcut identifiers for quick date range selection. */
    @property({ type: Array }) shortcuts: number[] = [];

    /** Indicates an error on the start input. */
    @property({ type: Boolean, reflect: true, attribute: 'error-start' }) errorStart = false;

    /** Error message for the start input. */
    @property({ type: String, reflect: true, attribute: 'error-message-start' }) errorMessageStart?: string;

    /** Indicates an error on the end input. */
    @property({ type: Boolean, reflect: true, attribute: 'error-end' }) errorEnd = false;

    /** Error message for the end input. */
    @property({ type: String, reflect: true, attribute: 'error-message-end' }) errorMessageEnd?: string;

    /** The label for the start input. */
    @property({ type: String, reflect: true, attribute: 'label-start' }) labelStart: string | undefined;

    /** The label for the end input. */
    @property({ type: String, reflect: true, attribute: 'label-end' }) labelEnd: string | undefined;

    /** Layout direction for the start/end inputs (`'horizontal'` or `'vertical'`). */
    @property({ type: String, reflect: true, attribute: 'inputs-direction' })
    inputsDirection: 'horizontal' | 'vertical' = 'horizontal';

    /** When `true`, the labels are visually hidden but remain accessible to assistive technologies. */
    @property({ type: Boolean, reflect: true, attribute: 'label-visually-hidden' })
    labelVisuallyHidden = false;

    /** When `true`, dates are handled in UTC rather than the local timezone. */
    @property({ type: Boolean }) utc = false;

    /** Shows OK/Cancel footer actions. The selection is only confirmed on OK click. */
    @property({ type: Boolean, reflect: true, attribute: 'footer-action' })
    footerAction = false;

    /**
     * The first day of the week shown in the calendar.
     * `0` = Monday (default), `1` = Sunday.
     */
    @property({ type: Number }) firstDayOfWeek: 0 | 1 = 0;

    @query('ts-dropdown') private dropdown!: TsDropdown;
    @query('ts-date-calendar-range') private calendar!: TsDateCalendarRange;
    @query('ts-date-input-start') private triggerStart!: TsDateInputStart;
    @query('ts-date-input-end') private triggerEnd!: TsDateInputEnd;
    @query('.date-picker__footer-actions ts-button:last-of-type') private okButton!: TsButton;
    @query('.date-picker__footer-actions ts-button:first-of-type') private cancelButton!: TsButton;

    private originalValueStart = '';

    private originalValueEnd = '';
    private focusManager: DateRangeFocusManager;
    private resizeObserver?: ResizeObserver;

    constructor() {
        super();
        this.focusManager = new DateRangeFocusManager();
    }

    private measureAndPositionDivider(): void {
        const startInput = this.triggerStart;
        const divider = this.shadowRoot?.querySelector('.date-inputs-divider') as HTMLElement | null;
        if (!startInput || !divider) return;

        const tsInput = startInput.shadowRoot?.querySelector('ts-input') as
            | (HTMLElement & {
                  shadowRoot: ShadowRoot | null;
              })
            | null;
        if (!tsInput?.shadowRoot) return;

        const formControlInput = tsInput.shadowRoot.querySelector('.form-control-input') as HTMLElement | null;
        if (!formControlInput) return;

        const container = this.shadowRoot?.querySelector('.date-inputs-container') as HTMLElement | null;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const controlRect = formControlInput.getBoundingClientRect();

        if (containerRect.height === 0 || controlRect.height === 0) return;

        const centerY = controlRect.top + controlRect.height / 2 - containerRect.top;
        const marginTop = Math.max(0, centerY - divider.offsetHeight / 2);

        divider.style.marginTop = `${marginTop}px`;
    }

    private normalizeShortcuts(value: unknown): number[] {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            try {
                const p = JSON.parse(value);
                return Array.isArray(p) ? p : [];
            } catch {
                return [];
            }
        }
        return [];
    }

    private get labels() {
        return getCalendarButtons(this.locale);
    }

    private focusStartInput() {
        this.updateComplete.then(() => {
            const inner = this.triggerStart?.shadowRoot?.querySelector('ts-input') as TsInput | null;
            inner?.focus();
        });
    }

    private focusEndInput() {
        this.updateComplete.then(() => {
            const inner = this.triggerEnd?.shadowRoot?.querySelector('ts-input') as TsInput | null;
            inner?.focus();
        });
    }

    private focusCalendarDay() {
        this.updateComplete.then(() => {
            const calendar = this.calendar as TsDateCalendarRange & { focusCurrentDay?: () => void };
            calendar?.focusCurrentDay?.();
        });
    }

    private focusFirstShortcut() {
        this.updateComplete.then(() => {
            const shortcutsPanel = this.querySelector('ts-date-shortcuts');
            if (shortcutsPanel) {
                const firstShortcut = shortcutsPanel.shadowRoot?.querySelector('.shortcut-focus') as HTMLElement;
                firstShortcut?.focus();
            }
        });
    }

    private send(detail: { start?: Date; end?: Date; clearEnd?: boolean; clearStart?: boolean }) {
        const start = detail.start ? formatDateByLocale(detail.start, this.locale) : undefined;
        const end = detail.end ? formatDateByLocale(detail.end, this.locale) : undefined;

        const ev = new CustomEvent('ts-date-range-select', {
            detail: { start, end, clearEnd: detail.clearEnd, clearStart: detail.clearStart },
            bubbles: true,
            composed: true,
        });

        this.onSelect?.(ev);
    }

    private onAfterShowInternal = () => {
        // Snapshot for cancel revert (used when footerAction=true; harmless otherwise)
        this.originalValueStart = this.valueStart;
        this.originalValueEnd = this.valueEnd;

        // Update focus manager state
        const startDate = this.valueStart ? parseByLocale(this.valueStart, this.locale) : null;
        const endDate = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : null;

        this.focusManager.updateState({
            calendarOpen: true,
            activeField: this.activeField,
            hasShortcuts: this.shortcuts.length > 0,
            hasFooterActions: this.footerAction,
            selectedStartDate: startDate,
            selectedEndDate: endDate,
        });

        // Determine open origin based on active field
        const origin: CalendarOpenOrigin = this.activeField === 'start' ? 'start-input' : 'end-input';
        this.focusManager.resetOnOpen(origin);

        this.onAfterShow?.();
        this.applyFocus(this.activeField);

        // Use focus manager to determine initial focus
        const initialFocus = this.focusManager.getInitialFocusOnOpen();

        if (initialFocus === 'calendar-day') {
            this.focusCalendarDay();
        } else if (initialFocus === 'shortcuts' && this.shortcuts.length > 0) {
            this.focusFirstShortcut();
        } else if (this.activeField === 'start') {
            this.focusStartInput();
        } else {
            this.focusEndInput();
        }
    };

    private onAfterHideInternal = () => {
        this.focusManager.resetOnClose();
        this.onAfterHide?.();
    };

    private onShortcutSelected(e: CustomEvent<{ index: number }>) {
        const index = e.detail.index;
        const ev = new CustomEvent('ts-shortcut-select', {
            detail: { index },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(ev);

        // Use focus manager to determine where focus should go after shortcut
        const nextFocus = this.focusManager.getFocusAfterShortcutSelection();

        // Always close the dropdown when there are no footer actions —
        // the shortcut is the final action in that flow.
        if (!this.footerAction) {
            this.dropdown?.hide?.();
        }

        this.updateComplete.then(() => {
            if (nextFocus === 'ok-button') {
                this.okButton?.focus();
            }
            // 'outside' (or any other target) → do not steal focus.
        });
    }

    private handleRangeSelect = (e: CustomEvent<{ start?: string | Date; end?: string | Date }>) => {
        const normalize = (v: string | Date | undefined) =>
            v instanceof Date ? v : v ? parseByLocale(v, this.locale) : undefined;

        const startDate = normalize(e.detail.start);
        const endDate = normalize(e.detail.end);

        const clicked = endDate ?? startDate;
        if (!clicked) return;

        const s = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
        const fmt = (d: Date) => formatDateByLocale(d, this.locale);

        // --- SELECTING START DATE ---
        if (this.activeField === 'start') {
            const existingEnd = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;
            const newStart = clicked;
            const shouldClearEnd = existingEnd && existingEnd < newStart;

            this.valueStart = fmt(newStart);
            this.valueEnd = shouldClearEnd ? '' : this.valueEnd;

            this.activeField = 'end';
            this.send({
                start: newStart,
                end: shouldClearEnd ? undefined : existingEnd,
                clearEnd: shouldClearEnd,
            });

            this.applyFocus('end');
            // Don't move focus to input - stay in calendar

            return;
        }

        if (!s || clicked < s) {
            this.valueStart = fmt(clicked);
            this.valueEnd = '';
            this.send({ start: clicked, clearEnd: true });
            this.applyFocus('end');
            // Don't move focus to input - stay in calendar

            return;
        }

        this.valueEnd = fmt(clicked);
        this.send({ start: s, end: clicked, clearEnd: false });
        this.applyFocus('end');
        // Don't move focus to input - stay in calendar

        if (this.closeOnSelect && !this.footerAction) {
            this.dropdown?.hide?.();
        }
    };

    private blockInputClick(e: MouseEvent) {
        const path = e.composedPath();
        const isIcon = path.some(t => t instanceof HTMLElement && t.tagName === 'TS-ICON-BUTTON');
        if (!isIcon) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    private applyFocus(target: 'start' | 'end') {
        const s = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
        const e = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;

        const monthOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
        const monthBefore = (d: Date) =>
            d.getMonth() === 0 ? new Date(d.getFullYear() - 1, 11, 1) : new Date(d.getFullYear(), d.getMonth() - 1, 1);

        const setFocused = (d: Date) => {
            if (
                !this.focused ||
                this.focused.getFullYear() !== d.getFullYear() ||
                this.focused.getMonth() !== d.getMonth()
            ) {
                this.focused = d;
            }
        };

        const startMonth = s ? monthOf(s) : undefined;
        const endMonth = e ? monthOf(e) : undefined;

        if (!startMonth && !endMonth) {
            setFocused(new Date());
            return;
        }

        if (target === 'start') {
            if (startMonth) {
                setFocused(startMonth);
                return;
            }
            if (endMonth) {
                setFocused(monthBefore(endMonth));
                return;
            }
            setFocused(new Date());
            return;
        }

        if (target === 'end') {
            if (endMonth && startMonth) {
                if (
                    startMonth.getFullYear() === endMonth.getFullYear() &&
                    startMonth.getMonth() === endMonth.getMonth()
                ) {
                    setFocused(startMonth);
                    return;
                }
                setFocused(monthBefore(endMonth));
                return;
            }

            if (endMonth && !startMonth) {
                setFocused(monthBefore(endMonth));
                return;
            }

            if (startMonth && !endMonth) {
                setFocused(startMonth);
                return;
            }
        }

        setFocused(new Date());
    }

    override updated(changed: Map<string, unknown>) {
        const valuesChanged = changed.has('valueStart') || changed.has('valueEnd') || changed.has('locale');

        const start = valuesChanged
            ? this.valueStart
                ? parseByLocale(this.valueStart, this.locale)
                : undefined
            : undefined;
        const end = valuesChanged ? (this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined) : undefined;

        if (changed.has('valueStart') || changed.has('valueEnd')) {
            this.applyFocus(this.activeField);
        }

        if (this.calendar) {
            // Only push calendar props when the relevant values changed
            if (valuesChanged) {
                this.calendar.startDate = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
                this.calendar.endDate = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;
                this.calendar.locale = this.locale;
            }
            if (changed.has('activeField')) {
                this.calendar.activeField = this.activeField;
            }
            if (changed.has('focused') || changed.has('valueStart') || changed.has('valueEnd')) {
                this.calendar.focusedDate = this.focused;
            }
            if (changed.has('focusManager') || !this.calendar.focusManager) {
                this.calendar.focusManager = this.focusManager;
            }
        }

        if (changed.has('locale') && start) {
            this.valueStart = formatDateByLocale(start, this.locale);
            if (end) this.valueEnd = formatDateByLocale(end, this.locale);
        }

        requestAnimationFrame(() => this.measureAndPositionDivider());
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver(() => this.measureAndPositionDivider());
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
    }

    override firstUpdated(): void {
        if (this.triggerStart) this.resizeObserver?.observe(this.triggerStart);
        if (this.triggerEnd) this.resizeObserver?.observe(this.triggerEnd);
        requestAnimationFrame(() => this.measureAndPositionDivider());
    }

    override willUpdate(changed: Map<string, unknown>) {
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale as string).then(() => this.requestUpdate());
        }
        if (changed.has('shortcuts')) {
            this.shortcuts = this.normalizeShortcuts(this.shortcuts);
        }
    }

    private get iconSize() {
        return this.size === 'large' ? '24' : this.size === 'small' ? '16' : '20';
    }

    private handleOkClick = () => {
        // Confirm current internal values (already updated via handleRangeSelect)
        fire(this, 'ts-date-apply', this.valueStart || '', this.valueEnd || '', this.locale, this.utc);

        const start = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
        const end = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;

        // Keep parent in sync on confirm
        this.send({ start, end, clearEnd: !end });

        this.dropdown?.hide?.();

        // Use focus manager to determine where focus goes after OK
        const nextFocus = this.focusManager.getFocusAfterOK();
        this.updateComplete.then(() => {
            if (nextFocus === 'end-input') {
                this.focusEndInput();
            }
        });
    };

    private handleCancelClick = () => {
        // Revert to snapshot from open
        this.valueStart = this.originalValueStart;
        this.valueEnd = this.originalValueEnd;

        fire(this, 'ts-date-cancel', this.valueStart || '', this.valueEnd || '', this.locale, this.utc);

        const start = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
        const end = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;

        this.send({
            start,
            end,
            clearStart: !this.originalValueStart,
            clearEnd: !this.originalValueEnd,
        });

        this.dropdown?.hide?.();

        // Use focus manager to determine where focus goes after Cancel
        const nextFocus = this.focusManager.getFocusAfterCancel();
        this.updateComplete.then(() => {
            if (nextFocus === 'start-input') {
                this.focusStartInput();
            } else if (nextFocus === 'end-input') {
                this.focusEndInput();
            }
        });
    };

    override render() {
        const startDate = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
        const endDate = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;
        const aria = getCalendarAriaLabels(this.locale);

        return html`
            <ts-dropdown
                class="date-picker"
                hoist
                role="dialog"
                aria-modal="true"
                aria-label=${aria.calendarDateSelection}
                distance=${4}
                placement="bottom-start"
                @ts-after-show=${this.onAfterShowInternal}
                @ts-after-hide=${this.onAfterHideInternal}
            >
                <div
                    class="date-inputs-container ${this.inputsDirection === 'vertical' ? 'vertical' : ''}"
                    slot="trigger"
                >
                    <ts-date-input-start
                        .value=${this.valueStart}
                        .locale=${this.locale}
                        .inputsDirection=${this.inputsDirection}
                        @click=${(e: MouseEvent) => {
                            this.blockInputClick(e);
                            this.activeField = 'start';
                            this.applyFocus('start');
                            this.onTriggerClick?.(e);
                            this.focusStartInput();
                        }}
                        @input=${this.onInputOrChangeStart}
                        @change=${this.onInputOrChangeStart}
                        @blur=${() => {
                            this.onInputBlur?.();
                            this.onBlurStart?.();
                        }}
                        ${forwardProps(this.forwardedProps)}
                    >
                        <ts-icon-button
                            slot="suffix"
                            name="calendar_month"
                            library="system"
                            label=${aria.calendarIconStart}
                            size=${this.iconSize}
                            ?disabled=${this.disabled || this.readonly}
                            @click=${(e: MouseEvent) => {
                                if (this.readonly) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }
                            }}
                        ></ts-icon-button>
                        <slot name="label-icon" slot="label-icon"></slot>
                    </ts-date-input-start>

                    <div class="date-inputs-divider size-${this.size ?? 'medium'}" aria-hidden="true">-</div>

                    <ts-date-input-end
                        .value=${this.valueEnd}
                        .locale=${this.locale}
                        .inputsDirection=${this.inputsDirection}
                        @click=${(e: MouseEvent) => {
                            this.blockInputClick(e);
                            this.activeField = 'end';
                            this.applyFocus('end');
                            this.onTriggerClick?.(e);
                            this.focusEndInput();
                        }}
                        @input=${this.onInputOrChangeEnd}
                        @change=${this.onInputOrChangeEnd}
                        @blur=${() => {
                            this.onInputBlur?.();
                            this.onBlurEnd?.();
                        }}
                        ${forwardProps(this.forwardedProps)}
                    >
                        <ts-icon-button
                            slot="suffix"
                            name="calendar_month"
                            library="system"
                            label=${aria.calendarIconEnd}
                            size=${this.iconSize}
                            ?disabled=${this.disabled || this.readonly}
                            @click=${(e: MouseEvent) => {
                                if (this.readonly) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }
                            }}
                        ></ts-icon-button>
                        <slot name="label-icon-end" slot="label-icon"></slot>
                    </ts-date-input-end>
                </div>

                <div class="content-wrapper">
                    <div class="content-shortcut-wrapper">
                        ${
                            this.shortcuts.length
                                ? html`
                                      <ts-date-shortcuts
                                          .shortcuts=${this.shortcuts}
                                          .locale=${this.locale}
                                          @ts-shortcut-select=${this.onShortcutSelected}
                                      ></ts-date-shortcuts>
                                  `
                                : null
                        }
                        <ts-date-calendar-range
                            id="calendar-panel"
                            .startDate=${startDate}
                            .endDate=${endDate}
                            .focusedDate=${this.focused}
                            .firstDayOfWeek=${this.firstDayOfWeek === 1 ? DaysOfWeek.Sunday : DaysOfWeek.Monday}
                            .locale=${this.locale}
                            .activeField=${this.activeField}
                            @ts-month-change=${this.onMonthChange}
                            @ts-date-range-select=${this.handleRangeSelect}
                        ></ts-date-calendar-range>
                    </div>

                    ${
                        this.footerAction
                            ? html`
                                  <div class="footer-container">
                                      <div class="footer-divider"></div>
                                      <div class="date-picker__footer-actions">
                                          <ts-button variant="text" @click=${this.handleCancelClick}
                                              >${this.labels.cancel}</ts-button
                                          >
                                          <ts-button variant="text" @click=${this.handleOkClick}
                                              >${this.labels.ok}</ts-button
                                          >
                                      </div>
                                  </div>
                              `
                            : null
                    }
                </div>
            </ts-dropdown>
        `;
    }
}
