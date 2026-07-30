import { type CSSResultGroup, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

import type { PropertyValues } from 'lit';

import {
    fallbackLabels,
    getCalendarAriaLabels,
    getCalendarButtons,
    getRangeDialogLabels,
    loadCalendarLocale,
} from '@utils/date/calendar-i18n.js';
import { formatDateByLocale, formatShortRangeDate, parseByLocale } from '@utils/date/date-format.js';
import { languageOf } from '@utils/date/locale.js';
import { DaysOfWeek } from '@utils/date/model.js';
import { forwardProps } from '@utils/directive/forward-props.directive.js';

import { TsButton } from '@components/button/index.js';
import TsDateCalendarRangeMobile from '@components/date-range/date-calendar-range-mobile/date-calendar-range-mobile.component.js';
import TsDateInputEnd from '@components/date-range/date-input-range/date-input-end.component.js';
import TsDateInputStart from '@components/date-range/date-input-range/date-input-start.component.js';
import { fire } from '@components/date-range/src/events-range.helpers.js';
import { TsDialog } from '@components/dialog/index.js';
import { TsIconButton } from '@components/icon-button/index.js';
import { TsInput } from '@components/input/index.js';

import styles from './TsDateDialogRangeStyle.js';

type SelectEvent = CustomEvent<{ start?: Date; end?: Date }>;
type MonthChangeEvent = CustomEvent<{ focused: Date }>;

/**
 * @summary Internal mobile-oriented date range dialog that wraps a full-screen dialog with a
 * single-month calendar, date shortcuts, and OK/Cancel footer actions. Used by `ts-date-range`
 * on small viewports.
 * @documentation https://create.tuvsud.com/latest/components/date-range-picker/develop-vo4zlBb4
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-icon-button
 * @dependency ts-input
 * @dependency ts-date-input-start
 * @dependency ts-date-input-end
 * @dependency ts-dialog
 * @dependency ts-date-calendar-range-mobile
 * @dependency ts-button
 *
 * @slot suffix - Suffix slot forwarded to the internal start/end date inputs for calendar icons.
 * @slot label-icon - An icon (or any element) placed inline after the start date label text.
 * @slot label-icon-end - An icon (or any element) placed inline after the end date label text.
 *
 * @event ts-date-range-select - Emitted when the user selects or completes a range. Detail: `{ start, end, clearEnd }`.
 * @event ts-date-apply - Emitted when the user confirms the selection via OK. Detail: `{ start, end, locale, meta }`.
 * @event ts-date-cancel - Emitted when the user cancels via Cancel button. Detail: `{ start, end, locale, meta }`.
 * @event ts-shortcut-select - Re-dispatched when a date shortcut is clicked. Detail: `{ index }`.
 *
 * @csspart base - The component's root wrapper.
 */
export default class TsDateDialogRangeComponent extends LitElement {
    static override styles: CSSResultGroup = [styles];

    static dependencies = {
        'ts-icon-button': TsIconButton,
        'ts-input': TsInput,
        'ts-date-input-start': TsDateInputStart,
        'ts-date-input-end': TsDateInputEnd,
        'ts-dialog': TsDialog,
        'ts-date-calendar-range-mobile': TsDateCalendarRangeMobile,
        'ts-button': TsButton,
    };

    /** Indicates whether the dialog is currently open. */
    @property({ type: Boolean }) open = false;
    /** The formatted start date value. */
    @property() valueStart = '';
    /** The formatted end date value. */
    @property() valueEnd = '';
    /** The active locale for date formatting and localization. */
    @property() locale = 'en';
    /** When `true`, dates are handled in UTC rather than the local timezone. */
    @property({ type: Boolean }) utc = false;

    /** The size variant of the input fields (`'small'`, `'medium'`, or `'large'`). */
    @property() size: string | number | undefined;
    /** Indicates which field is being selected: `'start'` or `'end'`. */
    @property({ attribute: false }) activeField: 'start' | 'end' = 'start';
    /** Properties forwarded to the internal date inputs. */
    @property({ attribute: false }) forwardedProps: Record<string, unknown> = {};
    /** The currently focused date determining the visible month. */
    @property({ type: Object }) focusedDate: Date = new Date();
    /** When `true`, makes the input fields read-only. */
    @property({ type: Boolean, reflect: true }) readonly = false;

    /** Layout direction for the start/end inputs (`'horizontal'` or `'vertical'`). */
    @property() inputsDirection: 'horizontal' | 'vertical' = 'horizontal';
    /** Callback invoked when the trigger input is clicked. */
    @property({ attribute: false }) onTriggerClick!: (e: Event) => void;

    @query('ts-date-input-start') private triggerStart!: TsDateInputStart;
    @query('ts-date-input-end') private triggerEnd!: TsDateInputEnd;

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
    /** Callback invoked when the calendar month changes. */
    @property({ attribute: false }) monthChangeHandler!: (e: MonthChangeEvent) => void;
    /** Callback invoked when a date range is selected from the calendar. */
    @property({ attribute: false }) selectHandler!: (e: SelectEvent) => void;

    /** Numeric shortcut identifiers for quick date range selection. */
    @property({ type: Array }) shortcuts: number[] = [];

    /**
     * The first day of the week shown in the calendar.
     * `0` = Monday (default), `1` = Sunday.
     */
    @property({ type: Number }) firstDayOfWeek: 0 | 1 = 0;

    private justSelectedEnd = false;
    private originalValueStart = '';
    private originalValueEnd = '';

    @query('ts-date-calendar-range-mobile') private calendar!: TsDateCalendarRangeMobile;

    protected override willUpdate(changed: PropertyValues) {
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale).then(() => this.requestUpdate());
        }

        // Recompute focusedDate before render so we don't have to mutate
        // reactive state from updated(), which triggers Lit's
        // "change-in-update" warning.
        const valuesChanged = changed.has('valueStart') || changed.has('valueEnd') || changed.has('locale');
        if (!this.justSelectedEnd && valuesChanged) {
            const start = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
            const end = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;

            let newFocus: Date | undefined;
            if (this.activeField === 'start' && start) {
                newFocus = new Date(start.getFullYear(), start.getMonth(), 1);
            }
            if (this.activeField === 'end' && end) {
                newFocus = new Date(end.getFullYear(), end.getMonth(), 1);
            }

            if (
                newFocus &&
                (newFocus.getFullYear() !== this.focusedDate.getFullYear() ||
                    newFocus.getMonth() !== this.focusedDate.getMonth())
            ) {
                this.focusedDate = newFocus;
            }
        }
    }

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

        if (!s && !e) {
            this.focusedDate = new Date();
            return;
        }

        if (target === 'start') {
            if (s) this.focusedDate = monthOf(s);
            else if (e) this.focusedDate = monthOf(e);
            else this.focusedDate = new Date();
            return;
        }

        if (target === 'end') {
            if (e) this.focusedDate = monthOf(e);
            else if (s) this.focusedDate = monthOf(s);
            else this.focusedDate = new Date();
            return;
        }

        this.focusedDate = new Date();
    }

    private openDialog(target: 'start' | 'end') {
        this.originalValueStart = this.valueStart;
        this.originalValueEnd = this.valueEnd;
        this.activeField = target;
        this.applyFocus(target);
        this.open = true;
    }

    private handleTriggerClickStart = () => {
        if (this.readonly) return;
        this.openDialog('start');
    };

    private handleTriggerClickEnd = () => {
        if (this.readonly) return;
        this.openDialog('end');
    };

    private sendSyntheticStart() {
        if (typeof this.onInputOrChangeStart === 'function') {
            const ev = new CustomEvent('synthetic', { detail: { value: this.valueStart } });
            this.onInputOrChangeStart(ev);
        }
    }

    private sendSyntheticEnd() {
        if (typeof this.onInputOrChangeEnd === 'function') {
            const ev = new CustomEvent('synthetic', { detail: { value: this.valueEnd } });
            this.onInputOrChangeEnd(ev);
        }
    }

    private normalizeRange(detail: { start?: Date; end?: Date }) {
        const clicked = detail.end ?? detail.start;
        if (!clicked) return;

        const startObj = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
        const endObj = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;
        const format = (d: Date) => formatDateByLocale(d, this.locale);

        let newStart: string;
        let newEnd = this.valueEnd;

        let eventStart: Date | undefined;
        let eventEnd: Date | undefined;
        let clearEnd = false;

        if (this.activeField === 'start') {
            newStart = format(clicked);
            if (endObj && clicked > endObj) newEnd = '';
            eventStart = clicked;
            clearEnd = newEnd === '';
            this.activeField = 'end';
        } else {
            if (!startObj || clicked < startObj) {
                newStart = format(clicked);
                newEnd = '';
                eventStart = clicked;
                clearEnd = true;
            } else {
                newStart = formatDateByLocale(startObj, this.locale);
                newEnd = format(clicked);
                eventStart = startObj;
                eventEnd = clicked;
            }
        }

        this.valueStart = newStart;
        this.valueEnd = newEnd;

        this.sendSyntheticStart();
        this.sendSyntheticEnd();

        if (eventStart) {
            this.dispatchEvent(
                new CustomEvent('ts-date-range-select', {
                    detail: { start: eventStart, end: eventEnd, clearEnd },
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    private handleOkClick = () => {
        const start = this.calendar.startDate;
        const end = this.calendar.endDate;

        this.valueStart = start ? formatDateByLocale(start, this.locale) : '';
        this.valueEnd = end ? formatDateByLocale(end, this.locale) : '';

        this.sendSyntheticStart();
        this.sendSyntheticEnd();

        fire(this, 'ts-date-apply', this.valueStart || '', this.valueEnd || '', this.locale, this.utc);

        this.dispatchEvent(
            new CustomEvent('ts-date-range-select', {
                detail: { start, end, clearEnd: !end },
                bubbles: true,
                composed: true,
            }),
        );

        this.open = false;
    };

    private handleCancelClick = () => {
        this.valueStart = this.originalValueStart;
        this.valueEnd = this.originalValueEnd;

        this.sendSyntheticStart();
        this.sendSyntheticEnd();

        fire(this, 'ts-date-cancel', this.valueStart || '', this.valueEnd || '', this.locale, this.utc);

        this.open = false;
    };

    private get labels() {
        return getCalendarButtons(this.locale);
    }

    private get rangeLabel() {
        return getRangeDialogLabels(this.locale);
    }

    private get dialogRangeParts() {
        const start = this.calendar?.startDate;
        const end = this.calendar?.endDate;
        const lang = languageOf(this.locale);
        const fallback = fallbackLabels[lang];

        const customStart = this.forwardedProps.labelStart ?? '';
        const customEnd = this.forwardedProps.labelEnd ?? '';

        const startText = start ? formatShortRangeDate(start, this.locale) : customStart || fallback!.start;
        const endText = end ? formatShortRangeDate(end, this.locale) : customEnd || fallback!.end;

        return {
            startText,
            endText,
            startClass: 'range-start--always-active',
            endClass: this.activeField === 'start' ? 'range-end--inactive' : 'range-end--active',
        };
    }

    private onShortcutSelected(e: CustomEvent<{ index: number }>) {
        this.dispatchEvent(
            new CustomEvent('ts-shortcut-select', {
                detail: { index: e.detail.index },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private focusStartInput() {
        this.updateComplete.then(() => {
            const input = this.triggerStart?.shadowRoot?.querySelector('ts-input') as TsInput | null;
            input?.focus();
        });
    }

    private focusEndInput() {
        this.updateComplete.then(() => {
            const input = this.triggerEnd?.shadowRoot?.querySelector('ts-input') as TsInput | null;
            input?.focus();
        });
    }

    override updated(changed: Map<string, unknown>) {
        // Reactive recomputation of `focusedDate` happens in willUpdate now to
        // avoid Lit's "change-in-update" warning. updated() is reserved for
        // side-effects that touch child elements after they have rendered.
        const valuesChanged = changed.has('valueStart') || changed.has('valueEnd') || changed.has('locale');
        this.justSelectedEnd = false;

        // Push relevant props down to the inner calendar after it renders.
        if (this.calendar) {
            if (valuesChanged) {
                const start = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
                const end = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;
                this.calendar.startDate = start;
                this.calendar.endDate = end;
                this.calendar.locale = this.locale;
            }
            if (changed.has('focusedDate') || changed.has('valueStart') || changed.has('valueEnd')) {
                this.calendar.focusedDate = this.focusedDate;
            }
            if (changed.has('activeField')) {
                this.calendar.activeField = this.activeField;
            }
        }
    }

    private get iconSize() {
        return this.size === 'large' ? '24' : this.size === 'small' ? '16' : '20';
    }

    override render() {
        const startDate = this.valueStart ? parseByLocale(this.valueStart, this.locale) : undefined;
        const endDate = this.valueEnd ? parseByLocale(this.valueEnd, this.locale) : undefined;
        const aria = getCalendarAriaLabels(this.locale);

        return html`
            <div class="date-inputs-container ${this.inputsDirection}">
                <ts-date-input-start
                    .value=${this.valueStart}
                    .locale=${this.locale}
                    aria-haspopup="dialog"
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
                        @click=${this.handleTriggerClickStart}
                        slot="suffix"
                        name="calendar_month"
                        library="system"
                        label=${aria.calendarIconStart}
                        size=${this.iconSize}
                        ?disabled=${this.readonly}
                    ></ts-icon-button>
                    <slot name="label-icon" slot="label-icon"></slot>
                </ts-date-input-start>

                <ts-date-input-end
                    .value=${this.valueEnd}
                    .locale=${this.locale}
                    aria-haspopup="dialog"
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
                        @click=${this.handleTriggerClickEnd}
                        slot="suffix"
                        name="calendar_month"
                        library="system"
                        label=${aria.calendarIconEnd}
                        size=${this.iconSize}
                        ?disabled=${this.readonly}
                    ></ts-icon-button>
                    <slot name="label-icon-end" slot="label-icon"></slot>
                </ts-date-input-end>
            </div>

            <ts-dialog
                class="date-picker"
                no-header="true"
                no-body-padding
                prevent-overlay-close="true"
                width="auto"
                .open=${this.open}
                @ts-after-hide=${() => (this.open = false)}
            >
                <div class="dialog-header">
                    <div class="label-title">${this.rangeLabel}</div>
                    <div class="label-range">
                        <span class=${this.dialogRangeParts.startClass}>${this.dialogRangeParts.startText}</span>
                        <span> - </span>
                        <span class=${this.dialogRangeParts.endClass}>${this.dialogRangeParts.endText}</span>
                    </div>
                </div>

                ${
                    this.shortcuts.length
                        ? html`
                              <ts-date-shortcuts
                                  .shortcuts=${this.shortcuts}
                                  .locale=${this.locale}
                                  .size=${'small'}
                                  @ts-shortcut-select=${this.onShortcutSelected}
                              ></ts-date-shortcuts>
                          `
                        : null
                }

                <div class="dialog-divider-top"></div>

                <ts-date-calendar-range-mobile
                    .focusedDate=${this.focusedDate}
                    .startDate=${startDate}
                    .endDate=${endDate}
                    .activeField=${this.activeField}
                    .locale=${this.locale}
                    .firstDayOfWeek=${this.firstDayOfWeek === 1 ? DaysOfWeek.Sunday : DaysOfWeek.Monday}
                    @ts-month-change=${(e: MonthChangeEvent) => this.monthChangeHandler?.(e)}
                    @ts-date-range-select=${(e: SelectEvent) => this.normalizeRange(e.detail)}
                ></ts-date-calendar-range-mobile>

                <div class="dialog-divider"></div>

                <div class="date-picker__footer-actions">
                    <ts-button variant="text" @click=${this.handleCancelClick}>${this.labels.cancel}</ts-button>
                    <ts-button variant="text" @click=${this.handleOkClick}>${this.labels.ok}</ts-button>
                </div>
            </ts-dialog>
        `;
    }
}
