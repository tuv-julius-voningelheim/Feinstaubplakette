import { registerCalendarLocale } from '../date/calendar-i18n.js';
import { registerDropzoneLocale } from '../dropzone/dropzone-i18n.js';
import { registerTranslation } from '../internal/localize.js';
import { registerTableLocale } from '../table/table-i18n.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'de',
    $name: 'Deutsch',
    $dir: 'ltr',

    carousel: 'Karussell',
    clearEntry: 'Eingabe löschen',
    close: 'Schließen',
    copied: 'Kopiert',
    copy: 'Kopieren',
    currentValue: 'Aktueller Wert',
    error: 'Fehler',
    goToSlide: (slide, count) => `Zu Folie ${slide} von ${count} gehen`,
    hidePassword: 'Passwort verbergen',
    loading: 'Wird geladen',
    nextSlide: 'Nächste Folie',
    numOptionsSelected: num => {
        if (num === 0) return 'Keine Optionen ausgewählt';
        if (num === 1) return '1 Option ausgewählt';
        return `${num} Optionen ausgewählt`;
    },
    previousSlide: 'Vorherige Folie',
    progress: 'Fortschritt',
    remove: 'Entfernen',
    resize: 'Größe ändern',
    scrollToEnd: 'Zum Ende scrollen',
    scrollToStart: 'Zum Anfang scrollen',
    selectAColorFromTheScreen: 'Farbe vom Bildschirm auswählen',
    showPassword: 'Passwort anzeigen',
    slideNum: slide => `Folie ${slide}`,
    noOptionsFound: 'Keine übereinstimmenden Optionen',
    toggleColorFormat: 'Farbformat umschalten',
};

registerTranslation(translation);

registerCalendarLocale('de', {
    calendarText: {
        months: [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember',
        ],
        monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    },
    error: {
        required: () => 'Dieses Feld ist erforderlich.',
        invalidDate: () => 'Bitte ein gültiges Datum eingeben.',
        minDate: p => `Datum muss am oder nach dem ${p?.minDate} liegen.`,
        maxDate: p => `Datum muss am oder vor dem ${p?.maxDate} liegen.`,
        minYear: p => `Jahr muss ≥ ${p?.minYear} sein.`,
        maxYear: p => `Jahr muss ≤ ${p?.maxYear} sein.`,
        disabledDate: () => 'Dieses Datum ist nicht erlaubt.',
        disablePast: () => 'Daten vor heute sind nicht erlaubt.',
        disableFuture: () => 'Daten nach heute sind nicht erlaubt.',
        startAfterEnd: () => 'Startdatum muss vor oder gleich dem Enddatum sein.',
        endBeforeStart: () => 'Enddatum muss nach oder gleich dem Startdatum sein.',
    },
    buttons: { ok: 'OK', cancel: 'Abbrechen' },
    aria: {
        previousMonth: 'Vorheriger Monat',
        nextMonth: 'Nächster Monat',
        openCalendar: 'Kalender öffnen',
        selectMonth: 'Monat auswählen',
        selectYear: 'Jahr auswählen',
        weekdays: 'Wochentage',
        calendarDateSelection: 'Kalender-Datumsauswahl',
        calendarIconStart: 'Kalender für Startdatum öffnen',
        calendarIconEnd: 'Kalender für Enddatum öffnen',
    },
    rangeDialog: 'Ausgewählter Datumsbereich',
    fallback: { start: 'Startdatum', end: 'Enddatum' },
    shortcuts: {
        0: 'Diese Woche',
        1: 'Nächste Woche',
        2: 'Nächste 2 Wochen',
        3: 'Nächste 3 Wochen',
        4: 'Nächste 4 Wochen',
        5: 'Diesen Monat',
        6: 'Nächsten Monat',
    },
    datePlaceholders: {
        DMY_DOT: 'TT.MM.JJJJ',
        DMY_SLASH: 'TT/MM/JJJJ',
    },
});

registerDropzoneLocale('de', {
    titles: {
        dropzoneTitle: 'Dateien hier ablegen oder klicken zum Auswählen',
        dragTitle: 'Dateien zum Hochladen ablegen',
        fileLoadedTitle: 'Datei ausgewählt',
        maxFilesReachedTitle: 'Maximale Anzahl erreicht',
    },
    error: {
        required: () => 'Bitte mindestens eine Datei auswählen.',
        fileTooLarge: p => `Datei „${p?.name}“ überschreitet die maximale Größe von ${p?.max}.`,
        fileTooSmall: p => `Datei „${p?.name}“ ist kleiner als die minimale Größe von ${p?.min}.`,
        invalidFileType: p => `Datei „${p?.name}“ hat einen ungültigen Dateityp.`,
        maxFilesReached: p => `Maximale Anzahl an Dateien (${p?.maxFiles}) bereits erreicht.`,
        onlyNMoreFiles: p => {
            const n = Number(p?.remaining);
            return `Es können nur noch ${p?.remaining} ${n === 1 ? 'Datei' : 'Dateien'} hinzugefügt werden.`;
        },
    },
    fileWord: n => (n === 1 ? 'Datei' : 'Dateien'),
});

registerTableLocale('de', {
    searchPlaceholder: 'Suchen…',
    searchAriaLabel: 'Suchen',
    pageSizeLabel: 'Zeige',
    pageSizeSuffix: 'Einträge',
    pageSizeAriaLabel: 'Einträge pro Seite',
    showingEntries: (from, to, total) => `Zeige ${from} bis ${to} von ${total} Einträgen`,
    noData: 'Keine Daten',
});

export default translation;
