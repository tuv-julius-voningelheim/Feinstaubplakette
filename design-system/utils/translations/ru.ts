import { registerCalendarLocale } from '../date/calendar-i18n.js';
import { registerDropzoneLocale } from '../dropzone/dropzone-i18n.js';
import { registerTranslation } from '../internal/localize.js';
import { registerTableLocale } from '../table/table-i18n.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'ru',
    $name: 'Русский',
    $dir: 'ltr',

    carousel: 'Карусель',
    clearEntry: 'Очистить запись',
    close: 'Закрыть',
    copied: 'Скопировано',
    copy: 'Скопировать',
    currentValue: 'Текущее значение',
    error: 'Ошибка',
    goToSlide: (slide, count) => `Перейти к слайду ${slide} из ${count}`,
    hidePassword: 'Скрыть пароль',
    loading: 'Загрузка',
    nextSlide: 'Следующий слайд',
    numOptionsSelected: num => {
        if (num === 0) return 'выбрано 0 вариантов';
        if (num === 1) return 'Выбран 1 вариант';
        return `выбрано ${num} варианта`;
    },
    previousSlide: 'Предыдущий слайд',
    progress: 'Прогресс',
    remove: 'Удалить',
    resize: 'Изменить размер',
    scrollToEnd: 'Пролистать до конца',
    scrollToStart: 'Пролистать к началу',
    selectAColorFromTheScreen: 'Выберите цвет на экране',
    showPassword: 'Показать пароль',
    slideNum: slide => `Слайд ${slide}`,
    noOptionsFound: 'Нет подходящих вариантов',
    toggleColorFormat: 'Переключить цветовую модель',
};

registerTranslation(translation);

registerCalendarLocale('ru', {
    calendarText: {
        months: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
        ],
        monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        weekdaysShort: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
    },
    error: {
        required: () => 'Это обязательное поле.',
        invalidDate: () => 'Введите корректную дату.',
        minDate: p => `Дата должна быть не раньше ${p?.minDate}.`,
        maxDate: p => `Дата должна быть не позже ${p?.maxDate}.`,
        minYear: p => `Год должен быть ≥ ${p?.minYear}.`,
        maxYear: p => `Год должен быть ≤ ${p?.maxYear}.`,
        disabledDate: () => 'Эта дата недоступна.',
        disablePast: () => 'Даты до сегодняшнего дня недопустимы.',
        disableFuture: () => 'Даты после сегодняшнего дня недопустимы.',
        startAfterEnd: () => 'Дата начала должна быть раньше или равна дате окончания.',
        endBeforeStart: () => 'Дата окончания должна быть позже или равна дате начала.',
    },
    buttons: { ok: 'ОК', cancel: 'Отмена' },
    aria: {
        previousMonth: 'Предыдущий месяц',
        nextMonth: 'Следующий месяц',
        openCalendar: 'Открыть календарь',
        selectMonth: 'Выбрать месяц',
        selectYear: 'Выбрать год',
        weekdays: 'Дни недели',
        calendarDateSelection: 'Выбор даты в календаре',
        calendarIconStart: 'Открыть календарь для даты начала',
        calendarIconEnd: 'Открыть календарь для даты окончания',
    },
    rangeDialog: 'Выбранный диапазон дат',
    fallback: { start: 'Дата начала', end: 'Дата окончания' },
    shortcuts: {
        0: 'Эта неделя',
        1: 'Следующая неделя',
        2: 'Следующие 2 недели',
        3: 'Следующие 3 недели',
        4: 'Следующие 4 недели',
        5: 'Этот месяц',
        6: 'Следующий месяц',
    },
    datePlaceholders: {
        DMY_DOT: 'DD.ММ.YYYY',
    },
});

function ruFileWord(n: number): string {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'файл';
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'файла';
    return 'файлов';
}

registerDropzoneLocale('ru', {
    titles: {
        dropzoneTitle: 'Перетащите файлы сюда или нажмите для выбора',
        dragTitle: 'Отпустите файлы для загрузки',
        fileLoadedTitle: 'Файл выбран',
        maxFilesReachedTitle: 'Достигнут максимум файлов',
    },
    error: {
        required: () => 'Выберите хотя бы один файл.',
        fileTooLarge: p => `Файл «${p?.name}» превышает максимальный размер ${p?.max}.`,
        fileTooSmall: p => `Файл «${p?.name}» меньше минимального размера ${p?.min}.`,
        invalidFileType: p => `Файл «${p?.name}» имеет недопустимый тип.`,
        maxFilesReached: p => `Максимальное количество файлов (${p?.maxFiles}) уже достигнуто.`,
        onlyNMoreFiles: p => {
            const n = Number(p?.remaining);
            return `Можно добавить только ещё ${p?.remaining} ${ruFileWord(n)}.`;
        },
    },
    fileWord: ruFileWord,
});

registerTableLocale('ru', {
    searchPlaceholder: 'Поиск…',
    searchAriaLabel: 'Поиск',
    pageSizeLabel: 'Показать',
    pageSizeSuffix: 'записей',
    pageSizeAriaLabel: 'Записей на странице',
    showingEntries: (from, to, total) => `Показано с ${from} по ${to} из ${total} записей`,
    noData: 'Нет данных',
});

export default translation;
