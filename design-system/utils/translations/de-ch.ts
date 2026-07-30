import { registerTranslation } from '../internal/localize.js';
import baseTranslation from './de.js';
import type { Translation } from '../internal/localize.js';

const translation: Translation = {
    ...baseTranslation,
    $code: 'de-CH',
    $name: 'Deutsch (Schweiz)',

    close: 'Schliessen',
    resize: 'Grösse ändern',
};

registerTranslation(translation);

export default translation;
