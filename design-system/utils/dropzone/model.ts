import type { Locale } from '@utils/date/model.js';

export type DropzoneLocale = Locale;

export type DropzoneErrorRule =
    'required' | 'fileTooLarge' | 'fileTooSmall' | 'invalidFileType' | 'maxFilesReached' | 'onlyNMoreFiles';

export interface DropzoneTitles {
    dropzoneTitle: string;
    dragTitle: string;
    fileLoadedTitle: string;
    maxFilesReachedTitle: string;
}

export interface DropzoneLangData {
    titles: DropzoneTitles;
    error: Record<DropzoneErrorRule, (p?: Record<string, string | number>) => string>;
    /**
     * Returns the localized word for "file(s)" given a count. Used inside
     * pluralized error messages.
     */
    fileWord: (n: number) => string;
}
