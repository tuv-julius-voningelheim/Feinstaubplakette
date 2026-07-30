import { registerTranslation } from '../internal/localize.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    $code: 'uk',
    $name: 'Українська',
    $dir: 'ltr',

    carousel: 'Карусель',
    clearEntry: 'Очистити поле',
    close: 'Закрити',
    copied: 'Скопійовано',
    copy: 'Скопіювати',
    currentValue: 'Поточне значення',
    error: 'Збій',
    goToSlide: (slide, count) => `Перейти до слайда №${slide} з ${count}`,
    hidePassword: 'Приховати пароль',
    loading: 'Завантаження',
    nextSlide: 'Наступний слайд',
    numOptionsSelected: num => {
        const n = num % 10;
        if (n === 0) return 'не вибрано варіантів';
        if (n === 1) return 'вибрано 1 варіант';
        if (n === 2 || n === 3 || n === 4) return `вибрано ${num} варіанти`;
        return `вибрано ${num} варіантів`;
    },
    previousSlide: 'Попередній слайд',
    progress: 'Поступ',
    remove: 'Видалити',
    resize: 'Змінити розмір',
    scrollToEnd: 'Прокрутити в кінець',
    scrollToStart: 'Прокрутити на початок',
    selectAColorFromTheScreen: 'Виберіть колір на екрані',
    showPassword: 'Показати пароль',
    slideNum: slide => `Слайд ${slide}`,
    noOptionsFound: 'Немає відповідних варіантів',
    toggleColorFormat: 'Переключити кольорову модель',
};

registerTranslation(translation);

export default translation;
