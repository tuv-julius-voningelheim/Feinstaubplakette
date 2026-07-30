import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';

import type { TsDropzone } from '@components/dropzone/index.js';

import '@tuvsud/design-system/dropzone';

describe('dropzone component <ts-dropzone>', () => {
    describe('rendering', () => {
        it('should render with default values', async () => {
            const el = await fixture<TsDropzone>(html`<ts-dropzone></ts-dropzone>`);

            expect(el.size).to.equal('medium');
            expect(el.disabled).to.be.false;
            expect(el.required).to.be.false;
            expect(el.multiple).to.be.false;
            expect(el.error).to.be.false;
            expect(el.files).to.deep.equal([]);
        });

        it('should render with label', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone label="Upload files"></ts-dropzone> `);

            const label = el.shadowRoot!.querySelector('.form-control__label');
            expect(label).to.exist;
            expect(label!.textContent).to.contain('Upload files');
        });

        it('should render with help text', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone help-text="Max file size: 10MB"></ts-dropzone> `);

            const helpText = el.shadowRoot!.querySelector('.form-control__help-text');
            expect(helpText).to.exist;
            expect(helpText!.textContent).to.contain('Max file size: 10MB');
        });

        it('should render with description', async () => {
            const el = await fixture<TsDropzone>(html`
                <ts-dropzone description="Supported formats: PDF, PNG, JPG"></ts-dropzone>
            `);

            const description = el.shadowRoot!.querySelector('.dropzone__description');
            expect(description).to.exist;
            expect(description!.textContent).to.contain('Supported formats: PDF, PNG, JPG');
        });
    });

    describe('size variants', () => {
        it('should apply small size class', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone size="small"></ts-dropzone> `);

            const dropzone = el.shadowRoot!.querySelector('.dropzone');
            expect(dropzone!.classList.contains('dropzone--small')).to.be.true;
        });

        it('should apply medium size class', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone size="medium"></ts-dropzone> `);

            const dropzone = el.shadowRoot!.querySelector('.dropzone');
            expect(dropzone!.classList.contains('dropzone--medium')).to.be.true;
        });

        it('should apply large size class', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone size="large"></ts-dropzone> `);

            const dropzone = el.shadowRoot!.querySelector('.dropzone');
            expect(dropzone!.classList.contains('dropzone--large')).to.be.true;
        });
    });

    describe('disabled state', () => {
        it('should be disabled with the disabled attribute', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone disabled></ts-dropzone> `);

            expect(el.disabled).to.be.true;
            const dropzone = el.shadowRoot!.querySelector('.dropzone');
            expect(dropzone!.classList.contains('dropzone--disabled')).to.be.true;
        });

        it('should not respond to clicks when disabled', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone disabled></ts-dropzone> `);

            const changeHandler = sinon.spy();
            el.addEventListener('ts-change', changeHandler);

            const dropzone = el.shadowRoot!.querySelector('.dropzone') as HTMLElement;
            dropzone.click();

            expect(changeHandler).to.not.have.been.called;
        });
    });

    describe('error state', () => {
        it('should show error state', async () => {
            const el = await fixture<TsDropzone>(html`
                <ts-dropzone error error-message="Please select a file"></ts-dropzone>
            `);

            expect(el.error).to.be.true;
            const dropzone = el.shadowRoot!.querySelector('.dropzone');
            expect(dropzone!.classList.contains('dropzone--error')).to.be.true;

            const errorText = el.shadowRoot!.querySelector('.form-control__help-text--error');
            expect(errorText).to.exist;
            expect(errorText!.textContent).to.contain('Please select a file');
        });
    });

    describe('file handling', () => {
        it('should add files programmatically', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone multiple></ts-dropzone> `);

            const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
            const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

            el.addFiles([file1, file2]);
            await el.updateComplete;

            expect(el.files).to.have.length(2);
            expect(el.files[0]!.name).to.equal('test1.txt');
            expect(el.files[1]!.name).to.equal('test2.txt');
        });

        it('should remove files', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone multiple></ts-dropzone> `);

            const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
            const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

            el.addFiles([file1, file2]);
            await el.updateComplete;

            const fileId = el.files[0]!.id;
            el.removeFile(fileId);
            await el.updateComplete;

            expect(el.files).to.have.length(1);
            expect(el.files[0]!.name).to.equal('test2.txt');
        });

        it('should clear all files', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone multiple></ts-dropzone> `);

            const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
            const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

            el.addFiles([file1, file2]);
            await el.updateComplete;

            el.clearFiles();
            await el.updateComplete;

            expect(el.files).to.have.length(0);
        });

        it('should only allow one file when multiple is false', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone></ts-dropzone> `);

            const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
            const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

            el.addFiles([file1, file2]);
            await el.updateComplete;

            expect(el.files).to.have.length(1);
        });
    });

    describe('validation', () => {
        it('should validate max file size', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone max-size="100"></ts-dropzone> `);

            const rejectHandler = sinon.spy();
            el.addEventListener('ts-file-reject', rejectHandler);

            const largeFile = new File(['a'.repeat(200)], 'large.txt', { type: 'text/plain' });
            el.addFiles([largeFile]);
            await el.updateComplete;

            expect(rejectHandler).to.have.been.called;
            expect(el.files).to.have.length(0);
        });

        it('should validate min file size', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone min-size="100"></ts-dropzone> `);

            const rejectHandler = sinon.spy();
            el.addEventListener('ts-file-reject', rejectHandler);

            const smallFile = new File(['small'], 'small.txt', { type: 'text/plain' });
            el.addFiles([smallFile]);
            await el.updateComplete;

            expect(rejectHandler).to.have.been.called;
            expect(el.files).to.have.length(0);
        });

        it('should validate file types', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone accept=".pdf,image/*"></ts-dropzone> `);

            const rejectHandler = sinon.spy();
            el.addEventListener('ts-file-reject', rejectHandler);

            const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
            el.addFiles([txtFile]);
            await el.updateComplete;

            expect(rejectHandler).to.have.been.called;
            expect(el.files).to.have.length(0);
        });

        it('should accept valid file types', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone accept="image/*"></ts-dropzone> `);

            const imageFile = new File(['content'], 'test.png', { type: 'image/png' });
            el.addFiles([imageFile]);
            await el.updateComplete;

            expect(el.files).to.have.length(1);
        });

        it('should validate max files limit', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone multiple max-files="2"></ts-dropzone> `);

            const file1 = new File(['1'], 'test1.txt', { type: 'text/plain' });
            const file2 = new File(['2'], 'test2.txt', { type: 'text/plain' });
            const file3 = new File(['3'], 'test3.txt', { type: 'text/plain' });

            el.addFiles([file1, file2, file3]);
            await el.updateComplete;

            expect(el.files).to.have.length(2);
        });
    });

    describe('events', () => {
        it('should emit ts-change when files are added', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone></ts-dropzone> `);

            const changeHandler = sinon.spy();
            el.addEventListener('ts-change', changeHandler);

            const file = new File(['content'], 'test.txt', { type: 'text/plain' });
            el.addFiles([file]);
            await el.updateComplete;

            expect(changeHandler).to.have.been.called;
        });

        it('should emit ts-file-remove when a file is removed', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone></ts-dropzone> `);

            const file = new File(['content'], 'test.txt', { type: 'text/plain' });
            el.addFiles([file]);
            await el.updateComplete;

            const removeHandler = sinon.spy();
            el.addEventListener('ts-file-remove', removeHandler);

            const fileId = el.files[0]!.id;
            el.removeFile(fileId);
            await el.updateComplete;

            expect(removeHandler).to.have.been.called;
        });

        it('should emit ts-focus when focused', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone></ts-dropzone> `);

            const focusHandler = sinon.spy();
            el.addEventListener('ts-focus', focusHandler);

            const dropzone = el.shadowRoot!.querySelector('.dropzone') as HTMLElement;
            dropzone.focus();
            await el.updateComplete;

            expect(focusHandler).to.have.been.called;
        });

        it('should emit ts-blur when blurred', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone></ts-dropzone> `);

            const blurHandler = sinon.spy();
            el.addEventListener('ts-blur', blurHandler);

            const dropzone = el.shadowRoot!.querySelector('.dropzone') as HTMLElement;
            dropzone.focus();
            dropzone.blur();
            await el.updateComplete;

            expect(blurHandler).to.have.been.called;
        });
    });

    describe('file list', () => {
        it('should show file list when showFileList is true', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone show-file-list></ts-dropzone> `);

            const file = new File(['content'], 'test.txt', { type: 'text/plain' });
            el.addFiles([file]);
            await el.updateComplete;

            const fileList = el.shadowRoot!.querySelector('.dropzone__file-list');
            expect(fileList).to.exist;
        });

        it('should hide file list when showFileList is false', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone .showFileList=${false}></ts-dropzone> `);

            const file = new File(['content'], 'test.txt', { type: 'text/plain' });
            el.addFiles([file]);
            await el.updateComplete;

            const fileList = el.shadowRoot!.querySelector('.dropzone__file-list');
            expect(fileList).to.not.exist;
        });

        it('should display file name and size', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone show-file-list></ts-dropzone> `);

            const file = new File(['hello world'], 'test.txt', { type: 'text/plain' });
            el.addFiles([file]);
            await el.updateComplete;

            const fileName = el.shadowRoot!.querySelector('.dropzone__file-name');
            const fileSize = el.shadowRoot!.querySelector('.dropzone__file-size');

            expect(fileName!.textContent).to.contain('test.txt');
            expect(fileSize!.textContent).to.exist;
        });
    });

    describe('slots', () => {
        it('should render custom icon slot', async () => {
            const el = await fixture<TsDropzone>(html`
                <ts-dropzone>
                    <ts-icon slot="icon" name="upload" library="system"></ts-icon>
                </ts-dropzone>
            `);

            const iconSlot = el.shadowRoot!.querySelector('slot[name="icon"]');
            expect(iconSlot).to.exist;
        });

        it('should render label slot', async () => {
            const el = await fixture<TsDropzone>(html`
                <ts-dropzone>
                    <span slot="label">Custom Label</span>
                </ts-dropzone>
            `);

            const labelSlot = el.shadowRoot!.querySelector('slot[name="label"]');
            expect(labelSlot).to.exist;
        });

        it('should render description slot', async () => {
            const el = await fixture<TsDropzone>(html`
                <ts-dropzone>
                    <span slot="description">Custom description</span>
                </ts-dropzone>
            `);

            const descSlot = el.shadowRoot!.querySelector('slot[name="description"]');
            expect(descSlot).to.exist;
        });
    });

    describe('<ts-dropzone> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsDropzone>(html`<ts-dropzone></ts-dropzone>`);
            const cssText = getCssText(el);

            // dropzone base
            expect(cssText).to.include('border: 2px dashed var(--ts-semantic-color-border-base-active);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-xl);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-default);');
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );

            // size variants
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-400);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-600);');

            // hover state
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-hover);');

            // focus
            expect(cssText).to.include('outline: 2px solid var(--ts-semantic-color-border-primary-focused);');

            // error state
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-danger-default);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-danger-hover);');

            // icon
            expect(cssText).to.include('--icon-color: var(--ts-semantic-color-border-base-active);');
            expect(cssText).to.include('background: var(--ts-semantic-color-text-inverted-disabled);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-pill);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-300);');

            // text
            expect(cssText).to.include('gap: var(--ts-semantic-size-space-100);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-medium);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-neutral-default);');

            // file list
            expect(cssText).to.include('margin-top: var(--ts-semantic-size-space-400);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-subtle-default);');
            expect(cssText).to.include('border: 1px solid var(--ts-semantic-color-border-neutral-subtle-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-icon-neutral-default);');
        });
    });

    describe('keyboard navigation', () => {
        it('should open file dialog on Enter key', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone></ts-dropzone> `);

            const dropzone = el.shadowRoot!.querySelector('.dropzone') as HTMLElement;
            const input = el.shadowRoot!.querySelector('.dropzone__input') as HTMLInputElement;
            const clickSpy = sinon.spy(input, 'click');

            dropzone.focus();
            dropzone.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            expect(clickSpy).to.have.been.called;
        });

        it('should open file dialog on Space key', async () => {
            const el = await fixture<TsDropzone>(html` <ts-dropzone></ts-dropzone> `);

            const dropzone = el.shadowRoot!.querySelector('.dropzone') as HTMLElement;
            const input = el.shadowRoot!.querySelector('.dropzone__input') as HTMLInputElement;
            const clickSpy = sinon.spy(input, 'click');

            dropzone.focus();
            dropzone.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

            expect(clickSpy).to.have.been.called;
        });
    });
});
