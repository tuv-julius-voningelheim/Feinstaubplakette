import { registerCalendarLocale } from '../date/calendar-i18n.js';
import { registerDropzoneLocale } from '../dropzone/dropzone-i18n.js';
import { registerTranslation } from '../internal/localize.js';
import { registerTableLocale } from '../table/table-i18n.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'da',
    $name: 'Dansk',
    $dir: 'ltr',

    carousel: 'Karrusel',
    clearEntry: 'Ryd indtastning',
    close: 'Luk',
    copied: 'Kopieret',
    copy: 'Kopier',
    currentValue: 'Nuværende værdi',
    error: 'Fejl',
    goToSlide: (slide, count) => `Gå til dias ${slide} af ${count}`,
    hidePassword: 'Skjul adgangskode',
    loading: 'Indlæser',
    nextSlide: 'Næste slide',
    numOptionsSelected: (num: number) => {
        if (num === 0) return 'Ingen valgt';
        if (num === 1) return '1 valgt';
        return `${num} valgt`;
    },
    previousSlide: 'Forrige dias',
    progress: 'Status',
    remove: 'Fjern',
    resize: 'Tilpas størrelse',
    scrollToEnd: 'Scroll til slut',
    scrollToStart: 'Scroll til start',
    selectAColorFromTheScreen: 'Vælg en farve fra skærmen',
    showPassword: 'Vis adgangskode',
    slideNum: slide => `Slide ${slide}`,
    noOptionsFound: 'Ingen matchende muligheder',
    toggleColorFormat: 'Skift farveformat',
};

registerTranslation(translation);

registerCalendarLocale('da', {
    calendarText: {
        months: [
            'Januar',
            'Februar',
            'Marts',
            'April',
            'Maj',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'December',
        ],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        weekdaysShort: ['Sø', 'Ma', 'Ti', 'On', 'To', 'Fr', 'Lø'],
    },
    error: {
        required: () => 'Dette felt er påkrævet.',
        invalidDate: () => 'Angiv en gyldig dato.',
        minDate: p => `Datoen skal være på eller efter ${p?.minDate}.`,
        maxDate: p => `Datoen skal være på eller før ${p?.maxDate}.`,
        minYear: p => `Året skal være ≥ ${p?.minYear}.`,
        maxYear: p => `Året skal være ≤ ${p?.maxYear}.`,
        disabledDate: () => 'Denne dato er ikke tilladt.',
        disablePast: () => 'Datoer før i dag er ikke tilladt.',
        disableFuture: () => 'Datoer efter i dag er ikke tilladt.',
        startAfterEnd: () => 'Startdato skal være før eller lig med slutdato.',
        endBeforeStart: () => 'Slutdato skal være efter eller lig med startdato.',
    },
    buttons: { ok: 'OK', cancel: 'Annuller' },
    aria: {
        previousMonth: 'Forrige måned',
        nextMonth: 'Næste måned',
        openCalendar: 'Åbn kalender',
        selectMonth: 'Vælg måned',
        selectYear: 'Vælg år',
        weekdays: 'Ugedage',
        calendarDateSelection: 'Kalender datovalg',
        calendarIconStart: 'Åbn kalender for startdato',
        calendarIconEnd: 'Åbn kalender for slutdato',
    },
    rangeDialog: 'Valgt datointerval',
    fallback: { start: 'Startdato', end: 'Slutdato' },
    shortcuts: {
        0: 'Denne uge',
        1: 'Næste uge',
        2: 'Næste 2 uger',
        3: 'Næste 3 uger',
        4: 'Næste 4 uger',
        5: 'Denne måned',
        6: 'Næste måned',
    },
});

registerDropzoneLocale('da', {
    titles: {
        dropzoneTitle: 'Slip filer her eller klik for at vælge',
        dragTitle: 'Slip filer for at uploade',
        fileLoadedTitle: 'Fil valgt',
        maxFilesReachedTitle: 'Maksimalt antal filer nået',
    },
    error: {
        required: () => 'Vælg mindst én fil.',
        fileTooLarge: p => `Filen "${p?.name}" overstiger den maksimale størrelse på ${p?.max}.`,
        fileTooSmall: p => `Filen "${p?.name}" er mindre end den minimale størrelse på ${p?.min}.`,
        invalidFileType: p => `Filen "${p?.name}" har en ugyldig filtype.`,
        maxFilesReached: p => `Maksimalt antal filer (${p?.maxFiles}) er allerede nået.`,
        onlyNMoreFiles: p => {
            const n = Number(p?.remaining);
            return `Der kan kun tilføjes ${p?.remaining} ${n === 1 ? 'fil' : 'filer'} mere.`;
        },
    },
    fileWord: n => (n === 1 ? 'fil' : 'filer'),
});

registerTableLocale('da', {
    searchPlaceholder: 'Søg…',
    searchAriaLabel: 'Søg',
    pageSizeLabel: 'Vis',
    pageSizeSuffix: 'poster',
    pageSizeAriaLabel: 'Elementer pr. side',
    showingEntries: (from, to, total) => `Viser ${from}–${to} af ${total} poster`,
    noData: 'Ingen data',
});

export default translation;
