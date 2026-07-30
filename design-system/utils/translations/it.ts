import { registerCalendarLocale } from '../date/calendar-i18n.js';
import { registerDropzoneLocale } from '../dropzone/dropzone-i18n.js';
import { registerTranslation } from '../internal/localize.js';
import { registerTableLocale } from '../table/table-i18n.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'it',
    $name: 'Italian',
    $dir: 'ltr',

    carousel: 'Carosello',
    clearEntry: 'Cancella inserimento',
    close: 'Chiudi',
    copied: 'Copiato',
    copy: 'Copia',
    currentValue: 'Valore attuale',
    error: 'Errore',
    goToSlide: (slide, count) => `Vai alla diapositiva ${slide} di ${count}`,
    hidePassword: 'Nascondi password',
    loading: 'In caricamento',
    nextSlide: 'Prossima diapositiva',
    numOptionsSelected: num => {
        if (num === 0) return 'Nessuna opzione selezionata';
        if (num === 1) return '1 opzione selezionata';
        return `${num} opzioni selezionate`;
    },
    previousSlide: 'Diapositiva precedente',
    progress: 'Avanzamento',
    remove: 'Rimuovi',
    resize: 'Ridimensiona',
    scrollToEnd: 'Scorri alla fine',
    scrollToStart: "Scorri all'inizio",
    selectAColorFromTheScreen: 'Seleziona un colore dalla schermo',
    showPassword: 'Mostra password',
    slideNum: slide => `Diapositiva ${slide}`,
    noOptionsFound: 'Nessuna opzione corrispondente',
    toggleColorFormat: 'Cambia formato colore',
};

registerTranslation(translation);

registerCalendarLocale('it', {
    calendarText: {
        months: [
            'Gennaio',
            'Febbraio',
            'Marzo',
            'Aprile',
            'Maggio',
            'Giugno',
            'Luglio',
            'Agosto',
            'Settembre',
            'Ottobre',
            'Novembre',
            'Dicembre',
        ],
        monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        weekdaysShort: ['DO', 'LU', 'MA', 'ME', 'GI', 'VE', 'SA'],
    },
    error: {
        required: () => 'Questo campo è obbligatorio.',
        invalidDate: () => 'Inserisci una data valida.',
        minDate: p => `La data deve essere il ${p?.minDate} o successiva.`,
        maxDate: p => `La data deve essere il ${p?.maxDate} o precedente.`,
        minYear: p => `L'anno deve essere ≥ ${p?.minYear}.`,
        maxYear: p => `L'anno deve essere ≤ ${p?.maxYear}.`,
        disabledDate: () => 'Questa data non è consentita.',
        disablePast: () => 'Non sono consentite date precedenti a oggi.',
        disableFuture: () => 'Non sono consentite date successive a oggi.',
        startAfterEnd: () => 'La data di inizio deve essere anteriore o uguale alla data di fine.',
        endBeforeStart: () => 'La data di fine deve essere posteriore o uguale alla data di inizio.',
    },
    buttons: { ok: 'OK', cancel: 'Annulla' },
    aria: {
        previousMonth: 'Mese precedente',
        nextMonth: 'Mese successivo',
        openCalendar: 'Apri calendario',
        selectMonth: 'Seleziona mese',
        selectYear: 'Seleziona anno',
        weekdays: 'Giorni della settimana',
        calendarDateSelection: 'Selezione data calendario',
        calendarIconStart: 'Apri calendario per la data di inizio',
        calendarIconEnd: 'Apri calendario per la data di fine',
    },
    rangeDialog: 'Intervallo di date selezionato',
    fallback: { start: 'Data inizio', end: 'Data fine' },
    shortcuts: {
        0: 'Questa settimana',
        1: 'Prossima settimana',
        2: 'Prossime 2 settimane',
        3: 'Prossime 3 settimane',
        4: 'Prossime 4 settimane',
        5: 'Questo mese',
        6: 'Il prossimo mese',
    },
    datePlaceholders: {
        DMY_SLASH: 'GG/MM/AAAA',
    },
});

registerDropzoneLocale('it', {
    titles: {
        dropzoneTitle: 'Trascina i file qui o fai clic per selezionare',
        dragTitle: 'Rilascia i file per caricarli',
        fileLoadedTitle: 'File selezionato',
        maxFilesReachedTitle: 'Numero massimo di file raggiunto',
    },
    error: {
        required: () => 'Seleziona almeno un file.',
        fileTooLarge: p => `Il file "${p?.name}" supera la dimensione massima di ${p?.max}.`,
        fileTooSmall: p => `Il file "${p?.name}" è più piccolo della dimensione minima di ${p?.min}.`,
        invalidFileType: p => `Il file "${p?.name}" ha un tipo di file non valido.`,
        maxFilesReached: p => `Numero massimo di file (${p?.maxFiles}) già raggiunto.`,
        onlyNMoreFiles: p => `È possibile aggiungere solo altri ${p?.remaining} file.`,
    },
    fileWord: () => 'file',
});

registerTableLocale('it', {
    searchPlaceholder: 'Cerca…',
    searchAriaLabel: 'Cerca',
    pageSizeLabel: 'Mostra',
    pageSizeSuffix: 'voci',
    pageSizeAriaLabel: 'Elementi per pagina',
    showingEntries: (from, to, total) => `Visualizzazione da ${from} a ${to} di ${total} voci`,
    noData: 'Nessun dato',
});

export default translation;
