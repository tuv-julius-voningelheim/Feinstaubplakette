import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

import {
    formatDropzoneError,
    formatFileSize,
    getDropzoneTitles,
    loadDropzoneLocale,
    normalizeKey,
} from '@utils/dropzone/dropzone-i18n.js';
import ComponentElement from '@utils/internal/component-element.js';
import { FormControlController } from '@utils/internal/form.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';
import formControlStyles from '@utils/styles/form-control-styles.js';
import type { ComponentFormControl } from '@utils/internal/component-element.js';

import { TsIcon } from '@components/icon/index.js';
import { TsIconButton } from '@components/icon-button/index.js';

import styles from './TsDropzoneStyles.js';

export interface DropzoneFile {
    file?: File;
    id: string;
    name: string;
    size: number;
    type: string;
    error?: string;
    /** URL of a previously uploaded file's thumbnail/preview. Set via displayExistingFile(). */
    thumbnailUrl?: string;
    /** Locally generated object URL for newly uploaded image files. Revoked on removal. */
    objectUrl?: string;
    /** Whether this file entry represents a previously uploaded (existing) file. */
    existing?: boolean;
}

/**
 * @summary Dropzone allows users to upload files by dragging and dropping or clicking to browse.
 * @documentation https://create.tuvsud.com/latest/components/dropzone
 * @status stable
 * @since 1.16.0
 *
 * @dependency ts-icon
 * @dependency ts-icon-button
 *
 * @slot label - The dropzone's label. Alternatively, you can use the `label` attribute.
 * @slot label-icon - An icon (or any element) placed inline after the label text. Use this together with the `label` attribute or `label` slot to show e.g. an info icon without wrapping markup.
 * @slot icon - The icon to display in the dropzone. Defaults to an upload icon.
 * @slot help-text - Text that describes how to use the dropzone. Alternatively, you can use the `help-text` attribute.
 * @slot description - Additional description text shown in the dropzone area.
 *
 * @event ts-change - Emitted when files are added or removed.
 * @event ts-drop - Emitted when files are dropped onto the dropzone.
 * @event ts-input - Emitted when files are selected.
 * @event ts-blur - Emitted when the control loses focus.
 * @event ts-focus - Emitted when the control gains focus.
 * @event ts-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 * @event {{ file: DropzoneFile }} ts-file-remove - Emitted when a file is removed.
 * @event {{ files: DropzoneFile[], errors: string[] }} ts-file-reject - Emitted when files are rejected due to validation.
 *
 * @csspart form-control - The form control that wraps the label, dropzone, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The dropzone's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The component's base wrapper.
 * @csspart dropzone - The dropzone area.
 * @csspart icon - The icon container.
 * @csspart content - The content area containing label and description.
 * @csspart file-list - The container for the list of selected files.
 * @csspart file-item - Individual file item in the list.
 * @csspart file-thumbnail - The thumbnail image for existing (previously uploaded) files.
 * @csspart file-name - The file name text.
 * @csspart file-size - The file size text.
 * @csspart file-remove - The remove button for each file.
 *
 * @cssproperty --dropzone-border-color - The border color of the dropzone.
 * @cssproperty --dropzone-border-color-hover - The border color when hovering.
 * @cssproperty --dropzone-border-color-drag - The border color when dragging files over.
 * @cssproperty --dropzone-background-color - The background color of the dropzone.
 * @cssproperty --dropzone-background-color-hover - The background color when hovering.
 * @cssproperty --dropzone-background-color-drag - The background color when dragging.
 */
export default class TsDropzoneComponent extends ComponentElement implements ComponentFormControl {
    static override styles: CSSResultGroup = [componentStyles, formControlStyles, styles];
    static override dependencies = {
        'ts-icon': TsIcon,
        'ts-icon-button': TsIconButton,
    };

    private readonly formControlController = new FormControlController(this, {
        assumeInteractionOn: ['ts-blur', 'ts-input'],
    });
    private readonly hasSlotController = new HasSlotController(
        this,
        'help-text',
        'label',
        'label-icon',
        'icon',
        'description',
    );
    private readonly localize = new LocalizeController(this);

    private static idCounter = 0;
    private readonly dropzoneId = `ts-dropzone-${++TsDropzoneComponent.idCounter}`;

    private fileIdCounter = 0;

    @query('.dropzone__input') input!: HTMLInputElement;
    @query('.dropzone') dropzoneEl!: HTMLElement;

    @state() private hasFocus = false;
    @state() private isDragging = false;
    @state() files: DropzoneFile[] = [];

    /** The current value of the dropzone (file names as comma-separated string). */
    @property() value = '';

    /** The dropzone's label. If you need to display HTML, use the `label` slot instead. */
    @property() label = '';

    /** The dropzone's help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** The dropzone's size variant. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** The name of the dropzone, submitted as a name/value pair with form data. */
    @property() name = '';

    /** Disables the dropzone. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** Makes the dropzone a required field. */
    @property({ type: Boolean, reflect: true }) required = false;

    /** Indicates whether the dropzone is in an error state. */
    @property({ type: Boolean, reflect: true }) error = false;

    /** The error message to display when the dropzone is in an error state. */
    @property({ type: String, attribute: 'error-message' }) errorMessage = '';

    /** Allow multiple file selection. */
    @property({ type: Boolean, reflect: true }) multiple = false;

    /** Accepted file types (comma-separated MIME types or extensions, e.g., "image/*,.pdf"). */
    @property({ type: String }) accept = '';

    /** Maximum file size in bytes. */
    @property({ type: Number, attribute: 'max-size' }) maxSize?: number;

    /** Minimum file size in bytes. */
    @property({ type: Number, attribute: 'min-size' }) minSize?: number;

    /** Maximum number of files allowed (only applicable when multiple is true). */
    @property({ type: Number, attribute: 'max-files' }) maxFiles?: number;

    /** Whether to show the list of selected files. */
    @property({ type: Boolean, attribute: 'show-file-list' }) showFileList = true;

    /** Hides the label visually but keeps it accessible to screen readers. */
    @property({ type: Boolean, reflect: true, attribute: 'label-visually-hidden' }) labelVisuallyHidden = false;

    /** Hides the help text visually but keeps it accessible to screen readers. */
    @property({ type: Boolean, reflect: true, attribute: 'help-text-visually-hidden' }) helpTextVisuallyHidden = false;

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`.
     * The form must be in the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /** The dropzone's description text shown inside the dropzone area. */
    @property() description = '';

    /** The default value of the form control. Primarily used for resetting the form control. */
    @property() defaultValue = '';

    /** The main title shown when not dragging and when selection is allowed. */
    @property({ type: String, attribute: 'dropzone-title' }) dropzoneTitle = '';

    /** The title shown while dragging files over the dropzone. */
    @property({ type: String, attribute: 'drag-title' }) dragTitle = '';

    /** The title shown when multiple is false and a file is already loaded. */
    @property({ type: String, attribute: 'file-loaded-title' }) fileLoadedTitle = '';

    /** The title shown when multiple is true and maxFiles has been reached. */
    @property({ type: String, attribute: 'max-files-reached-title' }) maxFilesReachedTitle = '';

    @property() locale = '';

    @property({ type: Boolean, reflect: true }) loading = false;

    private get resolvedLocale(): string {
        const anyLocalize = this.localize as unknown as { lang?: unknown; locale?: unknown };
        const raw =
            this.locale ||
            (anyLocalize?.locale as unknown) ||
            (anyLocalize?.lang as unknown) ||
            document.documentElement.lang ||
            'en-US';

        const loc = typeof raw === 'string' ? raw : String(raw);
        return normalizeKey(loc);
    }

    private get hasReachedMaxFiles(): boolean {
        if (!this.multiple) return false;
        if (!this.maxFiles) return false;
        return this.files.length >= this.maxFiles;
    }

    private get hasSingleFileSelected(): boolean {
        if (this.multiple) return false;
        return this.files.length >= 1;
    }

    private get canAddMoreFiles(): boolean {
        if (this.loading) return false;
        if (this.disabled) return false;
        if (this.hasSingleFileSelected) return false;
        if (this.hasReachedMaxFiles) return false;
        return true;
    }

    private get titleText(): string {
        const titles = getDropzoneTitles(this.resolvedLocale);
        const drag = this.dragTitle || titles.dragTitle;
        const loaded = this.fileLoadedTitle || titles.fileLoadedTitle;
        const reached = this.maxFilesReachedTitle || titles.maxFilesReachedTitle;
        const idle = this.dropzoneTitle || titles.dropzoneTitle;

        if (this.isDragging && this.canAddMoreFiles) return drag;
        if (this.hasSingleFileSelected) return loaded;
        if (this.hasReachedMaxFiles) return reached;
        return idle;
    }

    /** Gets the validity state object. */
    get validity(): ValidityState {
        if (this.required && this.files.length === 0) {
            return {
                valid: false,
                valueMissing: true,
                badInput: false,
                customError: false,
                patternMismatch: false,
                rangeOverflow: false,
                rangeUnderflow: false,
                stepMismatch: false,
                tooLong: false,
                tooShort: false,
                typeMismatch: false,
            };
        }
        return (
            this.input?.validity ?? {
                valid: true,
                valueMissing: false,
                badInput: false,
                customError: false,
                patternMismatch: false,
                rangeOverflow: false,
                rangeUnderflow: false,
                stepMismatch: false,
                tooLong: false,
                tooShort: false,
                typeMismatch: false,
            }
        );
    }

    /** Gets the validation message. */
    get validationMessage(): string {
        if (this.required && this.files.length === 0) {
            return formatDropzoneError(this.resolvedLocale, 'required');
        }
        return this.input?.validationMessage ?? '';
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm();
    }

    /** Checks for validity but does not show a validation message. */
    checkValidity(): boolean {
        if (this.required && this.files.length === 0) {
            this.formControlController.emitInvalidEvent();
            return false;
        }
        return true;
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean {
        if (!this.checkValidity()) {
            this.error = true;
            this.errorMessage = this.errorMessage || this.validationMessage;
            return false;
        }
        return true;
    }

    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string): void {
        this.input?.setCustomValidity(message);
        this.formControlController.updateValidity();
    }

    /** Sets focus on the dropzone. */
    override focus(options?: FocusOptions): void {
        this.dropzoneEl?.focus(options);
    }

    /** Removes focus from the dropzone. */
    override blur(): void {
        this.dropzoneEl?.blur();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.revokeAllObjectUrls();
    }

    protected override willUpdate(changed: PropertyValues): void {
        super.willUpdate(changed);
        if (changed.has('locale')) {
            loadDropzoneLocale(this.locale).then(() => this.requestUpdate());
        }
    }

    private revokeAllObjectUrls(): void {
        for (const file of this.files) {
            if (file.objectUrl) {
                URL.revokeObjectURL(file.objectUrl);
            }
        }
    }

    /** Clears all selected files. */
    clearFiles(): void {
        this.revokeAllObjectUrls();
        this.files = [];
        this.value = '';
        if (this.input) {
            this.input.value = '';
        }
        this.dispatchEvent(
            new CustomEvent('ts-change', { detail: { files: this.files }, bubbles: true, composed: true }),
        );
    }

    /** Programmatically add files. */
    addFiles(fileList: FileList | File[]): void {
        if (!this.canAddMoreFiles) return;
        const filesArray = Array.from(fileList);
        this.processFiles(filesArray);
    }

    /** Remove a specific file by its id. */
    removeFile(fileId: string): void {
        const file = this.files.find(f => f.id === fileId);
        if (file) {
            if (file.objectUrl) {
                URL.revokeObjectURL(file.objectUrl);
            }
            this.files = this.files.filter(f => f.id !== fileId);
            this.value = this.files.map(f => f.name).join(', ');
            this.dispatchEvent(new CustomEvent('ts-file-remove', { detail: { file }, bubbles: true, composed: true }));
            this.dispatchEvent(
                new CustomEvent('ts-change', { detail: { files: this.files }, bubbles: true, composed: true }),
            );
        }
    }

    /**
     * Displays a previously uploaded file in the dropzone file list without going through validation.
     * Mirrors the dropzone.js `displayExistingFile` API.
     *
     * @param mockFile - An object with at least `name` and `size` properties (and optionally `type`).
     * @param thumbnailUrl - Optional URL of the file's thumbnail/preview image.
     * @param callback - Optional callback invoked after the file is added.
     */
    displayExistingFile(
        mockFile: { name: string; size: number; type?: string },
        thumbnailUrl?: string,
        callback?: (file: DropzoneFile) => void,
    ): void {
        const existingFile: DropzoneFile = {
            id: this.generateFileId(),
            name: mockFile.name,
            size: mockFile.size,
            type: mockFile.type ?? '',
            thumbnailUrl,
            existing: true,
        };

        if (this.multiple) {
            this.files = [...this.files, existingFile];
        } else {
            this.files = [existingFile];
        }

        this.value = this.files.map(f => f.name).join(', ');
        this.dispatchEvent(
            new CustomEvent('ts-change', { detail: { files: this.files }, bubbles: true, composed: true }),
        );

        if (callback) {
            callback(existingFile);
        }
    }

    private generateFileId(): string {
        return `file-${++this.fileIdCounter}-${Date.now()}`;
    }

    private formatFileSize(bytes: number): string {
        return formatFileSize(this.resolvedLocale, bytes);
    }

    private validateFile(file: File): string | null {
        if (this.maxSize && file.size > this.maxSize) {
            return formatDropzoneError(this.resolvedLocale, 'fileTooLarge', {
                name: file.name,
                max: this.formatFileSize(this.maxSize),
            });
        }
        if (this.minSize && file.size < this.minSize) {
            return formatDropzoneError(this.resolvedLocale, 'fileTooSmall', {
                name: file.name,
                min: this.formatFileSize(this.minSize),
            });
        }

        if (this.accept) {
            const acceptedTypes = this.accept.split(',').map(t => t.trim().toLowerCase());
            const fileType = file.type.toLowerCase();
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

            const isAccepted = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileExtension === type;
                }
                if (type.endsWith('/*')) {
                    return fileType.startsWith(type.replace('/*', '/'));
                }
                return fileType === type;
            });

            if (!isAccepted) {
                return formatDropzoneError(this.resolvedLocale, 'invalidFileType', { name: file.name });
            }
        }

        return null;
    }

    private processFiles(newFiles: File[]): void {
        const validFiles: DropzoneFile[] = [];
        const errors: string[] = [];

        if (this.maxFiles && !this.multiple) {
            newFiles = newFiles.slice(0, 1);
        } else if (this.maxFiles && this.files.length + newFiles.length > this.maxFiles) {
            const remaining = this.maxFiles - this.files.length;
            if (remaining <= 0) {
                errors.push(formatDropzoneError(this.resolvedLocale, 'maxFilesReached', { maxFiles: this.maxFiles }));
                newFiles = [];
            } else {
                errors.push(formatDropzoneError(this.resolvedLocale, 'onlyNMoreFiles', { remaining }));
                newFiles = newFiles.slice(0, remaining);
            }
        }

        for (const file of newFiles) {
            const error = this.validateFile(file);
            if (error) {
                errors.push(error);
            } else {
                const isImage = file.type.startsWith('image/');
                validFiles.push({
                    file,
                    id: this.generateFileId(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    objectUrl: isImage ? URL.createObjectURL(file) : undefined,
                });
            }
        }

        if (errors.length > 0) {
            this.dispatchEvent(
                new CustomEvent('ts-file-reject', {
                    detail: { files: newFiles, errors },
                    bubbles: true,
                    composed: true,
                }),
            );
        }

        if (validFiles.length > 0) {
            if (this.multiple) {
                this.files = [...this.files, ...validFiles];
            } else {
                this.files = validFiles.slice(0, 1);
            }
            this.value = this.files.map(f => f.name).join(', ');
            this.dispatchEvent(
                new CustomEvent('ts-input', { detail: { files: this.files }, bubbles: true, composed: true }),
            );
            this.dispatchEvent(
                new CustomEvent('ts-change', { detail: { files: this.files }, bubbles: true, composed: true }),
            );
        }

        if (validFiles.length > 0 && this.error && this.required) {
            this.error = false;
            this.errorMessage = '';
        }
    }

    private handleClick(): void {
        if (this.disabled) return;
        if (!this.canAddMoreFiles) return;
        this.input?.click();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (this.disabled) return;
        if (!this.canAddMoreFiles) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.input?.click();
        }
    }

    private handleInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!this.canAddMoreFiles) {
            input.value = '';
            return;
        }
        if (input.files && input.files.length > 0) {
            this.processFiles(Array.from(input.files));
        }
        input.value = '';

        this.hasFocus = false;
        this.dropzoneEl?.blur();
    }

    private handleDragEnter(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.disabled) return;
        if (!this.canAddMoreFiles) return;
        this.isDragging = true;
    }

    private handleDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.disabled) return;
        if (!this.canAddMoreFiles) return;
        this.isDragging = true;
    }

    private handleDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (!this.canAddMoreFiles) return;
        const rect = this.dropzoneEl.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
            this.isDragging = false;
        }
    }

    private handleDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        if (this.disabled) return;
        if (!this.canAddMoreFiles) return;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.dispatchEvent(
                new CustomEvent('ts-drop', { detail: { files: Array.from(files) }, bubbles: true, composed: true }),
            );
            this.processFiles(Array.from(files));
        }

        this.hasFocus = false;
        this.dropzoneEl?.blur();
    }

    private handleFocus(): void {
        this.hasFocus = this.dropzoneEl?.matches(':focus-visible') ?? false;
        this.emit('ts-focus');
    }

    private handleBlur(): void {
        this.hasFocus = false;
        this.emit('ts-blur');
    }

    private handleRemoveFile(event: Event, fileId: string): void {
        event.stopPropagation();
        this.removeFile(fileId);
    }

    private handleInvalid(event: Event): void {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
    }

    private handleLabelSlotChange(event: Event): void {
        const slot = event.target as HTMLSlotElement;
        const assignedNodes = slot.assignedElements({ flatten: true });

        const findLabels = (elements: Element[]): HTMLLabelElement[] => {
            const labels: HTMLLabelElement[] = [];
            for (const el of elements) {
                if (el.tagName === 'LABEL') {
                    labels.push(el as HTMLLabelElement);
                }
                labels.push(...findLabels(Array.from(el.children)));
            }
            return labels;
        };

        const slottedLabels = findLabels(assignedNodes);
        for (const label of slottedLabels) {
            if (!label.htmlFor) {
                label.htmlFor = this.dropzoneId;
            }
        }
    }

    @watch(['error', 'errorMessage'], { waitUntilFirstUpdate: true })
    handleErrorChange(): void {
        this.formControlController.updateValidity();
    }

    private renderIcon(): TemplateResult {
        const hasIconSlot = this.hasSlotController.test('icon');
        const size = this.size === 'small' ? '24' : this.size === 'large' ? '48' : '32';

        if (this.loading) {
            return html`<div class="dropzone__loading">
                <ts-spinner slot="icon" style=${`font-size: ${size}px; --track-width: 3px;`}></ts-spinner>
            </div>`;
        }
        if (hasIconSlot) {
            return html`<div class="dropzone__icon"><slot name="icon"></slot></div>`;
        }

        return html`<div class="dropzone__icon">
            <ts-icon slot="icon" library="system" name="upload" size=${size}></ts-icon>
        </div>`;
    }

    private getFileExtension(filename: string): string {
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop()!.toUpperCase().slice(0, 4) : '?';
    }

    private renderFileItemIcon(file: DropzoneFile): TemplateResult {
        const previewUrl = file.thumbnailUrl ?? file.objectUrl;

        if (previewUrl) {
            return html`
                <div class="dropzone__file-thumbnail-wrapper">
                    <img
                        part="file-thumbnail"
                        class="dropzone__file-thumbnail"
                        src=${previewUrl}
                        alt=${file.name}
                        loading="lazy"
                    />
                </div>
            `;
        }

        const ext = this.getFileExtension(file.name);
        return html`
            <div class="dropzone__file-type-icon" aria-hidden="true">
                <ts-icon library="system" size="24" name="docs"></ts-icon>
                <span class="dropzone__file-type-ext">${ext}</span>
            </div>
        `;
    }

    private renderFileList(): TemplateResult | typeof nothing {
        if (!this.showFileList || this.files.length === 0) {
            return nothing;
        }

        return html`
            <div part="file-list" class="dropzone__file-list">
                ${this.files.map(
                    file => html`
                        <div
                            part="file-item"
                            class="dropzone__file-item ${file.existing ? 'dropzone__file-item--existing' : ''}"
                        >
                            ${this.renderFileItemIcon(file)}
                            <div class="dropzone__file-info">
                                <span part="file-name" class="dropzone__file-name">${file.name}</span>
                                <span part="file-size" class="dropzone__file-size"
                                    >${this.formatFileSize(file.size)}</span
                                >
                            </div>
                            <ts-icon-button
                                part="file-remove"
                                class="dropzone__file-remove"
                                name="close"
                                library="system"
                                @click=${(e: Event) => this.handleRemoveFile(e, file.id)}
                                ?disabled=${this.disabled}
                            ></ts-icon-button>
                        </div>
                    `,
                )}
            </div>
        `;
    }

    override render() {
        const hasLabelSlot = this.hasSlotController.test('label');
        const hasLabelIconSlot = this.hasSlotController.test('label-icon');
        const hasHelpTextSlot = this.hasSlotController.test('help-text');
        const hasDescriptionSlot = this.hasSlotController.test('description');
        const hasLabel = this.label ? true : hasLabelSlot || hasLabelIconSlot;
        const hasHelpText = this.helpText ? true : hasHelpTextSlot;
        const hasDescription = this.description ? true : hasDescriptionSlot;
        const showErrorText = this.error && this.errorMessage.length > 0;
        const describedBy = hasHelpText || showErrorText ? 'help-text' : undefined;

        return html`
            <div
                part="form-control"
                class=${classMap({
                    'form-control': true,
                    'form-control--small': this.size === 'small',
                    'form-control--medium': this.size === 'medium',
                    'form-control--large': this.size === 'large',
                    'form-control--has-label': hasLabel,
                    'form-control--has-help-text':
                        (hasHelpText || showErrorText) && !(this.helpTextVisuallyHidden && !showErrorText),
                    'form-control--label-hidden': this.labelVisuallyHidden,
                })}
            >
                <label
                    part="form-control-label"
                    class="form-control__label ${this.labelVisuallyHidden ? 'visually-hidden' : ''} ${
                        hasLabelIconSlot ? 'form-control__label--has-icon' : ''
                    }"
                    for=${this.dropzoneId}
                    aria-hidden=${hasLabel ? 'false' : 'true'}
                >
                    <slot name="label" @slotchange=${this.handleLabelSlotChange}>${this.label}</slot
                    ><slot name="label-icon"></slot>
                </label>

                <div part="form-control-input" class="form-control-input">
                    <input
                        class="dropzone__input"
                        type="file"
                        name=${ifDefined(this.name || undefined)}
                        ?multiple=${this.multiple}
                        ?disabled=${this.disabled || !this.canAddMoreFiles}
                        ?required=${this.required}
                        accept=${ifDefined(this.accept || undefined)}
                        tabindex="-1"
                        aria-hidden="true"
                        @change=${this.handleInputChange}
                        @invalid=${this.handleInvalid}
                    />

                    <div
                        part="base"
                        id=${this.dropzoneId}
                        class=${classMap({
                            dropzone: true,
                            'dropzone--small': this.size === 'small',
                            'dropzone--medium': this.size === 'medium',
                            'dropzone--large': this.size === 'large',
                            'dropzone--disabled': this.disabled || !this.canAddMoreFiles,
                            'dropzone--focused': this.hasFocus,
                            'dropzone--dragging': this.isDragging && this.canAddMoreFiles,
                            'dropzone--error': this.error,
                            'dropzone--has-files': this.files.length > 0,
                        })}
                        tabindex=${this.disabled ? '-1' : '0'}
                        role="button"
                        aria-label=${ifDefined(this.label || undefined)}
                        aria-describedby=${ifDefined(describedBy)}
                        aria-disabled=${this.disabled || !this.canAddMoreFiles ? 'true' : 'false'}
                        aria-invalid=${this.error ? 'true' : 'false'}
                        @click=${this.handleClick}
                        @keydown=${this.handleKeyDown}
                        @dragenter=${this.handleDragEnter}
                        @dragover=${this.handleDragOver}
                        @dragleave=${this.handleDragLeave}
                        @drop=${this.handleDrop}
                        @focus=${this.handleFocus}
                        @blur=${this.handleBlur}
                    >
                        <div part="dropzone" class="dropzone__content">
                            <div>${this.renderIcon()}</div>
                            <div part="content" class="dropzone__text">
                                <span class="dropzone__label">${this.titleText}</span>
                                ${
                                    hasDescription
                                        ? html`
                                              <span class="dropzone__description">
                                                  <slot name="description">${this.description}</slot>
                                              </span>
                                          `
                                        : nothing
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    part="form-control-help-text"
                    id="help-text"
                    class=${classMap({
                        'form-control__help-text': true,
                        'form-control__help-text--error': showErrorText,
                    })}
                    aria-hidden=${hasHelpText || showErrorText ? 'false' : 'true'}
                >
                    ${
                        showErrorText
                            ? html`<span role="alert" aria-live="polite">${this.errorMessage}</span>`
                            : html`<span class=${this.helpTextVisuallyHidden ? 'visually-hidden' : ''}>
                                  <slot name="help-text">${this.helpText}</slot></span
                              >`
                    }
                </div>

                ${this.renderFileList()}
            </div>
        `;
    }
}
