import { registerTranslation } from '@shoelace-style/localize';

import type { LangData } from '../date/model.js';
import type { DropzoneLangData } from '../dropzone/model.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'en',
    $name: 'English',
    $dir: 'ltr',

    carousel: 'Carousel',
    clearEntry: 'Clear entry',
    close: 'Close',
    copied: 'Copied',
    copy: 'Copy',
    currentValue: 'Current value',
    error: 'Error',
    goToSlide: (slide, count) => `Go to slide ${slide} of ${count}`,
    hidePassword: 'Hide password',
    loading: 'Loading',
    nextSlide: 'Next slide',
    numOptionsSelected: num => {
        if (num === 0) return 'No options selected';
        if (num === 1) return '1 option selected';
        return `${num} options selected`;
    },
    previousSlide: 'Previous slide',
    progress: 'Progress',
    remove: 'Remove',
    resize: 'Resize',
    scrollToEnd: 'Scroll to end',
    scrollToStart: 'Scroll to start',
    selectAColorFromTheScreen: 'Select a color from the screen',
    showPassword: 'Show password',
    slideNum: slide => `Slide ${slide}`,
    noOptionsFound: 'No matching options',
    toggleColorFormat: 'Toggle color format',
};

registerTranslation(translation);

export const enCalendar: LangData = {
    calendarText: {
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    error: {
        required: () => 'This field is required.',
        invalidDate: () => 'Enter a valid date.',
        minDate: p => `Date must be on or after ${p?.minDate}.`,
        maxDate: p => `Date must be on or before ${p?.maxDate}.`,
        minYear: p => `Year must be ≥ ${p?.minYear}.`,
        maxYear: p => `Year must be ≤ ${p?.maxYear}.`,
        disabledDate: () => 'This date is not allowed.',
        disablePast: () => 'Dates before today are not allowed.',
        disableFuture: () => 'Dates after today are not allowed.',
        startAfterEnd: () => 'Start date must be before or equal to end date.',
        endBeforeStart: () => 'End date must be after or equal to start date.',
    },
    buttons: { ok: 'Ok', cancel: 'Cancel' },
    aria: {
        previousMonth: 'Previous month',
        nextMonth: 'Next month',
        openCalendar: 'Open calendar',
        selectMonth: 'Select month',
        selectYear: 'Select year',
        weekdays: 'Weekdays',
        calendarDateSelection: 'Calendar date selection',
        calendarIconStart: 'Open calendar for start date',
        calendarIconEnd: 'Open calendar for end date',
    },
    rangeDialog: 'Selected date range',
    fallback: { start: 'Start date', end: 'End date' },
    shortcuts: {
        0: 'This week',
        1: 'Next week',
        2: 'Next 2 weeks',
        3: 'Next 3 weeks',
        4: 'Next 4 weeks',
        5: 'This month',
        6: 'Next month',
    },
    datePlaceholders: {
        DMY_DOT: 'DD.MM.YYYY',
        DMY_SLASH: 'DD/MM/YYYY',
        MDY_SLASH: 'MM/DD/YYYY',
        YMD_SLASH: 'YYYY/MM/DD',
    },
};

export const enDropzone: DropzoneLangData = {
    titles: {
        dropzoneTitle: 'Drop files here or click to browse',
        dragTitle: 'Drop files to upload',
        fileLoadedTitle: 'File selected',
        maxFilesReachedTitle: 'Maximum files reached',
    },
    error: {
        required: () => 'Please select at least one file.',
        fileTooLarge: p => `File "${p?.name}" exceeds the maximum size of ${p?.max}.`,
        fileTooSmall: p => `File "${p?.name}" is smaller than the minimum size of ${p?.min}.`,
        invalidFileType: p => `File "${p?.name}" has an invalid file type.`,
        maxFilesReached: p => `Maximum number of files (${p?.maxFiles}) already reached.`,
        onlyNMoreFiles: p => {
            const n = Number(p?.remaining);
            return `Only ${p?.remaining} more ${n === 1 ? 'file' : 'files'} can be added.`;
        },
    },
    fileWord: n => (n === 1 ? 'file' : 'files'),
};

export default translation;
