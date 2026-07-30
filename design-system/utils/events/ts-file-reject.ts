import type { DropzoneFile } from '../../components/dropzone/src/dropzone.component.js';

export interface TsFileRejectDetail {
    /** The files that were rejected. */
    files: File[];
    /** The validation error messages for each rejected file. */
    errors: string[];
}

export type TsFileRejectEvent = CustomEvent<TsFileRejectDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-file-reject': TsFileRejectEvent;
    }
}

export type { DropzoneFile };
