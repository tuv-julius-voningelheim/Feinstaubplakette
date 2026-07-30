import { html, nothing } from 'lit';

import type { TsDropzone } from '@tuvsud/design-system/dropzone';
import type { StoryContext } from 'storybook/internal/types';

import type {
    TsBlurEvent,
    TsDropEvent,
    TsDropzoneChangeEvent,
    TsDropzoneInputEvent,
    TsFileRejectEvent,
    TsFileRemoveEvent,
    TsFocusEvent,
    TsInvalidEvent,
} from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/dropzone';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/spinner';
import '@tuvsud/design-system/tooltip';

type DropzoneArgs = StoryContext<WebComponentsRenderer>['args'];

type DropzoneEvents = {
    'ts-change': unknown;
    'ts-input': unknown;
    'ts-drop': unknown;
    'ts-file-reject': unknown;
    'ts-file-remove': unknown;
    'ts-focus': unknown;
    'ts-blur': unknown;
    'ts-invalid': unknown;
};

const meta = {
    title: 'Components/Dropzone',
    component: 'ts-dropzone',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'The Dropzone component allows users to upload files by dragging and dropping or clicking to browse. It supports file validation, multiple file selection, and displays selected files with options to remove them.',
            },
        },
    },
    argTypes: {
        // Properties category
        locale: {
            control: { type: 'select' },
            options: ['en', 'de', 'fr', 'es', 'it', 'zh', 'ru', 'tr', 'da'],
            description: 'Locale used for all internal dropzone messages.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        loading: {
            control: 'boolean',
            description: 'Shows a spinner in the icon area and disables interaction.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        helpText: {
            control: 'text',
            description: 'Help text displayed below the dropzone. Use the `help-text` slot for HTML content.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'The dropzone\u2019s size variant.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the dropzone.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        multiple: {
            control: 'boolean',
            description: 'Allow multiple file selection.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        accept: {
            control: 'text',
            description: 'Accepted file types.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        maxSize: {
            control: 'number',
            description: 'Maximum file size in bytes.',
            table: { type: { summary: 'number' }, category: 'Properties' },
        },
        minSize: {
            control: 'number',
            description: 'Minimum file size in bytes.',
            table: { type: { summary: 'number' }, category: 'Properties' },
        },
        maxFiles: {
            control: 'number',
            description: 'Maximum number of files allowed.',
            table: { type: { summary: 'number' }, category: 'Properties' },
        },
        showFileList: {
            control: 'boolean',
            description: 'Whether to show the list of selected files.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        description: {
            control: 'text',
            description: 'Additional description text shown inside the dropzone area.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        dropzoneTitle: {
            control: 'text',
            description: 'The main title shown when not dragging.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        dragTitle: {
            control: 'text',
            description: 'The title shown while dragging files over the dropzone.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        fileLoadedTitle: {
            control: 'text',
            description: 'The title shown when a file is already loaded.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        maxFilesReachedTitle: {
            control: 'text',
            description: 'The title shown when maxFiles has been reached.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        // Form category
        name: {
            control: 'text',
            description: 'The name of the dropzone, submitted as a name/value pair with form data.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        required: {
            control: 'boolean',
            description: 'Makes the dropzone a required field.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        error: {
            control: 'boolean',
            description: 'Indicates whether the dropzone is in an error state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Form' },
        },
        errorMessage: {
            control: 'text',
            description: 'The error message to display when the dropzone is in an error state.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Form' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'The dropzone\u2019s label. Use the `label` slot for HTML content.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
        labelVisuallyHidden: {
            control: 'boolean',
            description: 'Hides the label visually but keeps it accessible to screen readers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Accessibility' },
        },
        helpTextVisuallyHidden: {
            control: 'boolean',
            description: 'Hides the help text visually but keeps it accessible to screen readers.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Accessibility' },
        },
        // Events category
        'ts-change': {
            action: 'ts-change',
            description: 'Emitted when files are added or removed. Detail contains the current file list.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-input': {
            action: 'ts-input',
            description:
                'Emitted when files are selected via browse or drop. Detail contains the newly accepted files.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-drop': {
            action: 'ts-drop',
            description: 'Emitted when files are dropped onto the dropzone.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-file-reject': {
            action: 'ts-file-reject',
            description: 'Emitted when files are rejected due to validation.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
        'ts-file-remove': {
            action: 'ts-file-remove',
            description: 'Emitted when a file is removed from the list.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-focus': {
            action: 'ts-focus',
            description: 'Emitted when the control gains focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-blur': {
            action: 'ts-blur',
            description: 'Emitted when the control loses focus.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-invalid': {
            action: 'ts-invalid',
            description:
                "Emitted when the form control has been checked for validity and its constraints aren't satisfied.",
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        locale: 'en',
        loading: false,
        label: '',
        dropzoneTitle: '',
        dragTitle: '',
        fileLoadedTitle: '',
        description: '',
        maxFilesReachedTitle: '',
        helpText: '',
        size: 'medium',
        name: '',
        disabled: false,
        required: false,
        error: false,
        errorMessage: '',
        multiple: false,
        accept: '',
        maxSize: undefined,
        minSize: undefined,
        maxFiles: undefined,
        showFileList: true,
        labelVisuallyHidden: false,
        helpTextVisuallyHidden: false,
    },
    render: args => html`
        <ts-dropzone
            locale=${args.locale || nothing}
            .loading=${args.loading}
            ?loading=${args.loading}
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            size=${args.size || nothing}
            name=${args.name || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .required=${args.required}
            ?required=${args.required}
            .error=${args.error}
            ?error=${args.error}
            error-message=${args.errorMessage || nothing}
            .multiple=${args.multiple}
            ?multiple=${args.multiple}
            accept=${args.accept || nothing}
            max-size=${args.maxSize ?? nothing}
            min-size=${args.minSize ?? nothing}
            max-files=${args.maxFiles ?? nothing}
            .showFileList=${args.showFileList}
            ?show-file-list=${args.showFileList}
            .labelVisuallyHidden=${args.labelVisuallyHidden}
            ?label-visually-hidden=${args.labelVisuallyHidden}
            .helpTextVisuallyHidden=${args.helpTextVisuallyHidden}
            ?help-text-visually-hidden=${args.helpTextVisuallyHidden}
            description=${args.description || nothing}
            dropzone-title=${args.dropzoneTitle || nothing}
            drag-title=${args.dragTitle || nothing}
            file-loaded-title=${args.fileLoadedTitle || nothing}
            max-files-reached-title=${args.maxFilesReachedTitle || nothing}
        >
        </ts-dropzone>
    `,
} satisfies MetaWithLabel<TsDropzone & DropzoneEvents>;

export default meta;
type Story = StoryObjWithLabel<TsDropzone>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default dropzone allows users to upload files by dragging and dropping or clicking to browse.',
            },
        },
    },
    args: {
        label: 'Upload Files',
        helpText: 'Drag and drop files here or click to browse',
    },
};

export const MultipleFiles: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Enable multiple file selection with the `multiple` attribute.',
            },
        },
    },
    args: {
        label: 'Upload Multiple Files',
        multiple: true,
        helpText: 'You can select multiple files at once',
        description: 'click to add 3 files',
        maxFiles: 3,
    },
};

export const WithFileTypeRestriction: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Restrict accepted file types using the `accept` attribute. This example only accepts images and PDF files.',
            },
        },
    },
    args: {
        label: 'Upload Images or PDFs',
        accept: 'image/*,.pdf',
        description: 'Only images and PDF files are accepted',
        helpText: 'Accepted formats: JPG, PNG, GIF, PDF',
    },
};

export const WithSizeLimit: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set maximum and minimum file sizes using `max-size` and `min-size` attributes (in bytes).',
            },
        },
    },
    args: {
        label: 'Upload Files (Max 5MB)',
        maxSize: 5 * 1024 * 1024,
        description: 'Maximum file size: 5MB',
        helpText: 'Files larger than 5MB will be rejected',
    },
};

export const WithMaxFiles: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Limit the number of files that can be uploaded using the `max-files` attribute.',
            },
        },
    },
    args: {
        label: 'Upload Files (Max 3)',
        multiple: true,
        maxFiles: 3,
        description: 'You can upload up to 3 files',
        helpText: 'Maximum 3 files allowed',
    },
};

export const CustomTitle: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Customize the dropzone titles for different states using `dropzone-title`, `drag-title`, `file-loaded-title`, and `max-files-reached-title` attributes.',
            },
        },
    },
    args: {
        label: 'Upload Files',
        dropzoneTitle: 'Custom Title Drag and drop or click to browse ✅',
        dragTitle: 'Drop files here ✅',
        fileLoadedTitle: 'File loaded ✅',
        maxFilesReachedTitle: 'Maximum number of files reached',
        helpText: 'Custom titles example',
    },
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `disabled` attribute to disable the dropzone. A disabled dropzone appears at reduced opacity and cannot be interacted with.',
            },
        },
    },
    args: {
        label: 'Upload Files',
        disabled: true,
        helpText: 'This dropzone is disabled',
    },
};

export const HelpTextHidden: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `helpTextVisuallyHidden` property to visually hide the help text while keeping it accessible to screen readers.',
            },
        },
    },
    args: {
        label: 'Upload Files',
        helpText: 'This help text is visually hidden but readable by screen readers.',
        helpTextVisuallyHidden: true,
    },
};

export const LabelWithIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label` slot to pass a custom label alongside an icon. When a `<label>` element is provided inside the slot, its `for` attribute is automatically set to point to the internal dropzone — ensuring full accessibility even without an explicit `for` attribute.',
            },
        },
    },
    render: () => html`
        <ts-dropzone>
            <div slot="label" style="display: flex; align-items: center; gap: 0.25rem;">
                <label>Upload Files</label>
                <ts-tooltip content="Only PDF or Word documents are accepted">
                    <ts-icon name="info" size="16" library="system"></ts-icon>
                </ts-tooltip>
            </div>
        </ts-dropzone>
    `,
};

export const LabelWithIconSlot: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label` attribute together with the `label-icon` slot to add an icon next to the label without any extra wrapper markup or inline styles. The layout (flexbox + gap) is handled automatically by the component.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <ts-dropzone label="Upload files">
                <ts-tooltip content="This is tooltip info label" slot="label-icon">
                    <ts-icon style="--icon-color: #1d4fd7">
                        <img src="/assets/svg/info.svg" alt="info" />
                    </ts-icon>
                </ts-tooltip>
            </ts-dropzone>

            <ts-dropzone label="Upload documents" accept=".pdf,.doc,.docx" description="PDF or Word documents only">
                <ts-tooltip content="Only PDF or Word documents are accepted" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/drafts.svg" alt="drafts" />
                    </ts-icon>
                </ts-tooltip>
            </ts-dropzone>

            <ts-dropzone label="Upload secure files" accept=".pdf" description="Encrypted PDFs only">
                <ts-tooltip content="Files are uploaded over a secure connection" slot="label-icon">
                    <ts-icon>
                        <img src="/assets/svg/lock.svg" alt="lock" />
                    </ts-icon>
                </ts-tooltip>
            </ts-dropzone>
        </div>
    `,
};

export const HiddenFileList: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Hide the file list by setting `show-file-list` to false. Useful when you want to display files in a custom way.',
            },
        },
    },
    args: {
        label: 'Upload Files',
        showFileList: false,
        helpText: 'File list is hidden - handle display yourself',
    },
};

export const WithCustomIcon: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Customize the dropzone icon using the `icon` slot.',
            },
        },
    },
    render: args => html`
        <ts-dropzone
            .loading=${args.loading}
            ?loading=${args.loading}
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            description=${args.description || nothing}
            dropzone-title=${args.dropzoneTitle || nothing}
            drag-title=${args.dragTitle || nothing}
            file-loaded-title=${args.fileLoadedTitle || nothing}
            max-files-reached-title=${args.maxFilesReachedTitle || nothing}
        >
            <ts-icon slot="icon" size="32">
                <img src="/assets/svg/upload_file.svg" alt="filter" />
            </ts-icon>
        </ts-dropzone>
    `,
    args: {
        label: 'Upload Images',
        description: 'Only image files accepted',
        helpText: 'Custom icon example',
        loading: false,
    },
};

export const InForm: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The dropzone integrates with native HTML forms and supports form validation.',
            },
        },
    },
    render: () => html`
        <form
            @submit=${(e: Event) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const dropzone = form.querySelector('ts-dropzone') as TsDropzone;
                if (dropzone.reportValidity()) {
                    alert('Form submitted! Files: ' + dropzone.value);
                }
            }}
        >
            <ts-dropzone
                label="Upload Document"
                name="document"
                required
                accept=".pdf,.doc,.docx"
                description="PDF or Word documents only"
                help-text="This field is required"
                style="margin-bottom: 1rem;"
                dropzone-title="Drag and drop or click to browse"
                drag-title="Drop files here"
                file-loaded-title="File loaded"
                max-files-reached-title="Maximum number of files reached"
            ></ts-dropzone>
            <ts-button type="submit" variant="primary">Submit</ts-button>
        </form>
    `,
};

export const AllSizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Comparison of all available size variants.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <ts-dropzone label="Small Dropzone" size="small"></ts-dropzone>
            <ts-dropzone label="Medium Dropzone" size="medium"></ts-dropzone>
            <ts-dropzone label="Large Dropzone" size="large"></ts-dropzone>
        </div>
    `,
};

export const ImageUpload: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A practical example for uploading images with size and type restrictions.',
            },
        },
    },
    args: {
        label: 'Upload Images',
        multiple: true,
        maxFiles: 5,
        accept: 'image/jpeg,image/png,image/gif,image/webp',
        maxSize: 10 * 1024 * 1024,
        description: 'JPG, PNG, GIF, or WebP (max 10MB each)',
        helpText: 'You can upload up to 5 images',
    },
};

export const DocumentUpload: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A practical example for uploading documents with specific file type restrictions.',
            },
        },
    },
    args: {
        label: 'Upload Documents',
        multiple: true,
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
        maxSize: 25 * 1024 * 1024,
        description: 'PDF, Word, Excel, PowerPoint, or Text files',
        helpText: 'Maximum file size: 25MB',
    },
};

export const MaxFilesReached: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Shows the locked state when the maximum number of files is reached. Add 3 files to see the dropzone become non-interactive.',
            },
        },
    },
    args: {
        label: 'Upload Files (Max 3)',
        multiple: true,
        maxFiles: 3,
        description: 'You can upload up to 3 files',
        helpText: 'After 3 files are selected, the dropzone is locked',
        maxFilesReachedTitle: 'Maximum number of files reached',
    },
};

export const SingleFileLoadedLocked: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Shows the locked state when multiple is false and a file has been selected. Add 1 file to see the dropzone become non-interactive.',
            },
        },
    },
    args: {
        label: 'Upload File',
        multiple: false,
        description: 'Single file only',
        helpText: 'After a file is selected, the dropzone is locked',
        fileLoadedTitle: 'File loaded',
    },
};

export const ErrorState: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Real validation example: files larger than 10KB are rejected; files <= 10KB are accepted.',
            },
        },
    },
    render: args => html`
        <ts-dropzone
            locale=${args.locale || nothing}
            .loading=${args.loading}
            ?loading=${args.loading}
            label=${args.label || nothing}
            help-text=${args.helpText || nothing}
            size=${args.size || nothing}
            name=${args.name || nothing}
            .disabled=${args.disabled}
            ?disabled=${args.disabled}
            .required=${args.required}
            ?required=${args.required}
            .error=${args.error}
            ?error=${args.error}
            error-message=${args.errorMessage || nothing}
            .multiple=${args.multiple}
            ?multiple=${args.multiple}
            accept=${args.accept || nothing}
            max-size=${args.maxSize ?? nothing}
            min-size=${args.minSize ?? nothing}
            max-files=${args.maxFiles ?? nothing}
            .showFileList=${args.showFileList}
            ?show-file-list=${args.showFileList}
            .labelVisuallyHidden=${args.labelVisuallyHidden}
            ?label-visually-hidden=${args.labelVisuallyHidden}
            description=${args.description || nothing}
            dropzone-title=${args.dropzoneTitle || nothing}
            drag-title=${args.dragTitle || nothing}
            file-loaded-title=${args.fileLoadedTitle || nothing}
            max-files-reached-title=${args.maxFilesReachedTitle || nothing}
            @ts-file-reject=${(e: TsFileRejectEvent) => {
                const dropzone = e.currentTarget as TsDropzone;
                const first = (e.detail?.errors?.[0] as string | undefined) || 'Validation failed';
                dropzone.error = true;
                dropzone.errorMessage = first;
            }}
            @ts-change=${(e: TsDropzoneChangeEvent) => {
                const dropzone = e.currentTarget as TsDropzone;
                if (dropzone.files?.length) {
                    dropzone.error = false;
                    dropzone.errorMessage = '';
                }
            }}
        >
        </ts-dropzone>
    `,
    args: {
        label: 'Upload Images (Max 10KB)',
        helpText: 'Choose an image \u2264 10KB to pass. Images > 10KB will be rejected.',
        accept: 'image/*',
        maxSize: 10 * 1024,
        error: false,
        errorMessage: '',
        loading: false,
    },
};

export const LocaleGerman: Story = {
    args: {
        locale: 'de-DE',
        label: 'Dateien hochladen',
        helpText: 'Ziehen Sie Dateien hierher oder klicken Sie zum Auswählen',
        multiple: true,
        maxFiles: 3,
    },
};

export const LocaleFrench: Story = {
    args: {
        locale: 'fr-FR',
        label: 'Téléverser des fichiers',
        helpText: 'Glissez-déposez ou cliquez pour parcourir',
        multiple: true,
        maxFiles: 3,
    },
};

export const ImageOnlyValidation: Story = {
    parameters: {
        docs: {
            description: {
                story: `Demonstrates **image-only file-type validation** driven entirely by custom events.

- \`accept="image/*"\` restricts selection to image files.
- The \`ts-file-reject\` event fires when a wrong file type (e.g. PDF, DOC) is uploaded — the handler sets the dropzone's \`error\` and \`errorMessage\` to surface the reason.
- The \`ts-change\` event fires when a valid image is accepted — the handler clears the error state.

\`\`\`js
dropzone.addEventListener('ts-file-reject', (e) => {
  dropzone.error = true;
  dropzone.errorMessage = e.detail.errors[0];
});

dropzone.addEventListener('ts-change', () => {
  dropzone.error = false;
  dropzone.errorMessage = '';
});
\`\`\``,
            },
        },
    },
    render: () => {
        const handleReject = (e: TsFileRejectEvent) => {
            const dropzone = e.currentTarget as TsDropzone;
            const errors: string[] = (e.detail?.errors as string[] | undefined) ?? ['File rejected'];
            dropzone.error = true;
            dropzone.errorMessage = errors[0] ?? 'File rejected';
        };

        const handleChange = (e: TsDropzoneChangeEvent) => {
            const dropzone = e.currentTarget as TsDropzone;
            dropzone.error = false;
            dropzone.errorMessage = '';
        };

        return html`
            <ts-dropzone
                label="Upload Images"
                multiple
                accept="image/*"
                description="JPG, PNG, GIF or WebP only"
                help-text="Try uploading a PDF or any non-image file to see the validation error."
                @ts-file-reject=${handleReject}
                @ts-change=${handleChange}
            ></ts-dropzone>
        `;
    },
};

export const DisplayExistingFiles: Story = {
    parameters: {
        docs: {
            description: {
                story: `Demonstrates the \`displayExistingFile(mockFile, thumbnailUrl, callback?)\` method. Use it to pre-populate the dropzone with previously uploaded files — bypassing all validation. Each file entry is displayed with its thumbnail image when a URL is provided.

\`\`\`js
const dropzone = document.querySelector('ts-dropzone');

// Without thumbnail
dropzone.displayExistingFile({ name: 'document.pdf', size: 204800 });

// With thumbnail + optional callback
dropzone.displayExistingFile(
  { name: 'photo.jpg', size: 12345, type: 'image/jpeg' },
  'https://example.com/photo.jpg',
  (file) => console.log('Added:', file)
);
\`\`\``,
            },
        },
    },
    render: () => html`
        <ts-dropzone
            id="existing-files-demo"
            label="Previously Uploaded Files"
            multiple
            max-files="5"
            help-text="Files below were pre-populated via displayExistingFile(). You can still add more files."
            description="Drag &amp; drop or click to add more"
        >
        </ts-dropzone>

        <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
            <ts-button
                variant="primary"
                size="small"
                @click=${() => {
                    const dz = document.querySelector('#existing-files-demo') as TsDropzone;
                    dz?.displayExistingFile(
                        { name: 'photo.jpg', size: 204800, type: 'image/jpeg' },
                        'https://picsum.photos/seed/photo/80/80',
                    );
                }}
            >
                Add image (with thumbnail)
            </ts-button>

            <ts-button
                variant="default"
                size="small"
                @click=${() => {
                    const dz = document.querySelector('#existing-files-demo') as TsDropzone;
                    dz?.displayExistingFile({ name: 'report.pdf', size: 512000, type: 'application/pdf' });
                }}
            >
                Add PDF (no thumbnail)
            </ts-button>

            <ts-button
                variant="default"
                size="small"
                @click=${() => {
                    const dz = document.querySelector('#existing-files-demo') as TsDropzone;
                    dz?.displayExistingFile(
                        { name: 'avatar.png', size: 98304, type: 'image/png' },
                        'https://picsum.photos/seed/avatar/80/80',
                        file => console.log('[displayExistingFile callback]', file),
                    );
                }}
                >Add image with callback</ts-button
            >

            <ts-button
                variant="warning"
                size="small"
                @click=${() => {
                    const dz = document.querySelector('#existing-files-demo') as TsDropzone;
                    dz?.clearFiles();
                }}
            >
                Clear all
            </ts-button>
        </div>
    `,
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        await customElements.whenDefined('ts-dropzone');
        const dz = canvasElement.querySelector('#existing-files-demo') as TsDropzone;
        if (!dz) return;
        dz.displayExistingFile(
            { name: 'profile-photo.jpg', size: 153600, type: 'image/jpeg' },
            'https://picsum.photos/seed/profile/80/80',
        );
        dz.displayExistingFile({ name: 'contract.pdf', size: 1048576, type: 'application/pdf' });
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'dropzone-event-log',
            entries: [
                { event: 'ts-change', firedWhen: 'Files are added or removed', detail: 'TsDropzoneChangeDetail' },
                {
                    event: 'ts-input',
                    firedWhen: 'Files are selected via input or drop',
                    detail: 'TsDropzoneChangeDetail',
                },
                { event: 'ts-drop', firedWhen: 'Files are dropped onto the dropzone', detail: 'TsDropDetail' },
                {
                    event: 'ts-file-reject',
                    firedWhen: 'Files are rejected due to validation',
                    detail: 'TsFileRejectDetail',
                },
                { event: 'ts-file-remove', firedWhen: 'A file is removed from the list', detail: 'TsFileRemoveDetail' },
                { event: 'ts-focus', firedWhen: 'The dropzone gains focus', detail: 'void' },
                { event: 'ts-blur', firedWhen: 'The dropzone loses focus', detail: 'void' },
                { event: 'ts-invalid', firedWhen: 'Form validation fails', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: DropzoneArgs) =>
                wrap(html`
                    <ts-dropzone
                        locale=${args.locale || nothing}
                        .loading=${args.loading}
                        ?loading=${args.loading}
                        label=${args.label || nothing}
                        help-text=${args.helpText || nothing}
                        size=${args.size || nothing}
                        name=${args.name || nothing}
                        .disabled=${args.disabled}
                        ?disabled=${args.disabled}
                        .required=${args.required}
                        ?required=${args.required}
                        .multiple=${args.multiple}
                        ?multiple=${args.multiple}
                        accept=${args.accept || nothing}
                        max-size=${args.maxSize ?? nothing}
                        .showFileList=${args.showFileList}
                        ?show-file-list=${args.showFileList}
                        description=${args.description || nothing}
                        @ts-change=${(e: TsDropzoneChangeEvent) => log('ts-change', e.detail)}
                        @ts-input=${(e: TsDropzoneInputEvent) => log('ts-input', e.detail)}
                        @ts-drop=${(e: TsDropEvent) => log('ts-drop', e.detail)}
                        @ts-file-reject=${(e: TsFileRejectEvent) => log('ts-file-reject', e.detail)}
                        @ts-file-remove=${(e: TsFileRemoveEvent) => log('ts-file-remove', e.detail)}
                        @ts-focus=${(e: TsFocusEvent) => log('ts-focus', e.detail)}
                        @ts-blur=${(e: TsBlurEvent) => log('ts-blur', e.detail)}
                        @ts-invalid=${(e: TsInvalidEvent) => log('ts-invalid', e.detail)}
                    >
                    </ts-dropzone>
                `),
        };
    })(),
};
