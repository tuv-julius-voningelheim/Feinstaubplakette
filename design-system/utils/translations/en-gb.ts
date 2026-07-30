import { registerTranslation } from '../internal/localize.js';
import baseTranslation from './en.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    ...baseTranslation,
    $code: 'en-GB',
    $name: 'English (United Kingdom)',

    selectAColorFromTheScreen: 'Select a colour from the screen',
    noOptionsFound: 'No matching options',
    toggleColorFormat: 'Toggle colour format',
};

registerTranslation(translation);

export default translation;
