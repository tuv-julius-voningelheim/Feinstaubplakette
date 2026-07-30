import type { DropzoneFile } from '../../components/dropzone/src/dropzone.component.js';

export interface TsFileRemoveDetail {
    /** The file that was removed. */
    file: DropzoneFile;
}

export type TsFileRemoveEvent = CustomEvent<TsFileRemoveDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-file-remove': TsFileRemoveEvent;
    }
}
