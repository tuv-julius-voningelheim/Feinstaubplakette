import type { DropzoneFile } from '../../components/dropzone/src/dropzone.component.js';

export interface TsDropzoneChangeDetail {
    /** The current list of accepted files after the change. */
    files: DropzoneFile[];
}

/** Emitted by ts-dropzone when files are added or removed (ts-change). */
export type TsDropzoneChangeEvent = CustomEvent<TsDropzoneChangeDetail>;

/** Emitted by ts-dropzone when files are selected via browse or drop (ts-input). */
export type TsDropzoneInputEvent = CustomEvent<TsDropzoneChangeDetail>;
