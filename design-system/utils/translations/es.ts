import { registerCalendarLocale } from '../date/calendar-i18n.js';
import { registerDropzoneLocale } from '../dropzone/dropzone-i18n.js';
import { registerTranslation } from '../internal/localize.js';
import { registerTableLocale } from '../table/table-i18n.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'es',
    $name: 'Español',
    $dir: 'ltr',

    carousel: 'Carrusel',
    clearEntry: 'Borrar entrada',
    close: 'Cerrar',
    copied: 'Copiado',
    copy: 'Copiar',
    currentValue: 'Valor actual',
    error: 'Error',
    goToSlide: (slide, count) => `Ir a la diapositiva ${slide} de ${count}`,
    hidePassword: 'Ocultar contraseña',
    loading: 'Cargando',
    nextSlide: 'Siguiente diapositiva',
    numOptionsSelected: num => {
        if (num === 0) return 'No hay opciones seleccionadas';
        if (num === 1) return '1 opción seleccionada';
        return `${num} opción seleccionada`;
    },
    previousSlide: 'Diapositiva anterior',
    progress: 'Progreso',
    remove: 'Eliminar',
    resize: 'Cambiar el tamaño',
    scrollToEnd: 'Desplazarse hasta el final',
    scrollToStart: 'Desplazarse al inicio',
    selectAColorFromTheScreen: 'Seleccione un color de la pantalla',
    showPassword: 'Mostrar contraseña',
    slideNum: slide => `Diapositiva ${slide}`,
    noOptionsFound: 'Sin opciones coincidentes',
    toggleColorFormat: 'Alternar formato de color',
};

registerTranslation(translation);

registerCalendarLocale('es', {
    calendarText: {
        months: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        weekdaysShort: ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'],
    },
    error: {
        required: () => 'Este campo es obligatorio.',
        invalidDate: () => 'Introduce una fecha válida.',
        minDate: p => `La fecha debe ser en o después de ${p?.minDate}.`,
        maxDate: p => `La fecha debe ser en o antes de ${p?.maxDate}.`,
        minYear: p => `El año debe ser ≥ ${p?.minYear}.`,
        maxYear: p => `El año debe ser ≤ ${p?.maxYear}.`,
        disabledDate: () => 'Esta fecha no está permitida.',
        disablePast: () => 'No se permiten fechas anteriores a hoy.',
        disableFuture: () => 'No se permiten fechas posteriores a hoy.',
        startAfterEnd: () => 'La fecha de inicio debe ser anterior o igual a la fecha de fin.',
        endBeforeStart: () => 'La fecha de fin debe ser posterior o igual a la fecha de inicio.',
    },
    buttons: { ok: 'Aceptar', cancel: 'Cancelar' },
    aria: {
        previousMonth: 'Mes anterior',
        nextMonth: 'Mes siguiente',
        openCalendar: 'Abrir calendario',
        selectMonth: 'Seleccionar mes',
        selectYear: 'Seleccionar año',
        weekdays: 'Días de la semana',
        calendarDateSelection: 'Selección de fecha del calendario',
        calendarIconStart: 'Abrir calendario para fecha de inicio',
        calendarIconEnd: 'Abrir calendario para fecha de fin',
    },
    rangeDialog: 'Rango de fechas seleccionado',
    fallback: { start: 'Fecha inicial', end: 'Fecha final' },
    shortcuts: {
        0: 'Esta semana',
        1: 'Próxima semana',
        2: 'Próximas 2 semanas',
        3: 'Próximas 3 semanas',
        4: 'Próximas 4 semanas',
        5: 'Este mes',
        6: 'Próximo mes',
    },
    datePlaceholders: {
        DMY_SLASH: 'DD/MM/AAAA',
    },
});

registerDropzoneLocale('es', {
    titles: {
        dropzoneTitle: 'Suelta archivos aquí o haz clic para buscar',
        dragTitle: 'Suelta archivos para subirlos',
        fileLoadedTitle: 'Archivo seleccionado',
        maxFilesReachedTitle: 'Máximo de archivos alcanzado',
    },
    error: {
        required: () => 'Selecciona al menos un archivo.',
        fileTooLarge: p => `El archivo "${p?.name}" supera el tamaño máximo de ${p?.max}.`,
        fileTooSmall: p => `El archivo "${p?.name}" es menor que el tamaño mínimo de ${p?.min}.`,
        invalidFileType: p => `El archivo "${p?.name}" tiene un tipo de archivo no válido.`,
        maxFilesReached: p => `Ya se alcanzó el número máximo de archivos (${p?.maxFiles}).`,
        onlyNMoreFiles: p => {
            const n = Number(p?.remaining);
            return `Solo se pueden añadir ${p?.remaining} ${n === 1 ? 'archivo' : 'archivos'} más.`;
        },
    },
    fileWord: n => (n === 1 ? 'archivo' : 'archivos'),
});

registerTableLocale('es', {
    searchPlaceholder: 'Buscar…',
    searchAriaLabel: 'Buscar',
    pageSizeLabel: 'Mostrar',
    pageSizeSuffix: 'entradas',
    pageSizeAriaLabel: 'Elementos por página',
    showingEntries: (from, to, total) => `Mostrando ${from} a ${to} de ${total} entradas`,
    noData: 'Sin datos',
});

export default translation;
