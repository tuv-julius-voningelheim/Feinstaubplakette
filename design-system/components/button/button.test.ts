import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';
import { runFormControlBaseTests } from '@utils/internal/test/form-control-base.tests.js';
import type { ComponentFormControl } from '@utils/internal/component-element.js';

import type { TsButton } from '@components/button/index.js';

import '@tuvsud/design-system/button';

const variants = ['default', 'primary', 'success', 'neutral', 'warning', 'danger'];

describe('button component <ts-button>', () => {
    runFormControlBaseTests({
        tagName: 'ts-button',
        variantName: 'type="button"',
        init: (control: ComponentFormControl & TsButton) => {
            control.type = 'button';
        },
    });

    runFormControlBaseTests({
        tagName: 'ts-button',
        variantName: 'type="submit"',
        init: (control: ComponentFormControl & TsButton) => {
            control.type = 'submit';
        },
    });

    runFormControlBaseTests({
        tagName: 'ts-button',
        variantName: 'href="xyz"',

        init: (control: ComponentFormControl & TsButton) => {
            control.href = 'some-url';
        },
    });

    describe('accessibility tests', () => {
        variants.forEach(variant => {
            it(`should be accessible when variant is "${variant}"`, async () => {
                const el = await fixture<TsButton>(html`<ts-button variant="${variant}">Button Label</ts-button>`);
                await expect(el).to.be.accessible();
            });
        });
    });

    describe('when an attribute is removed', () => {
        it("should return to 'default' when attribute removed with no initial attribute", async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button label</ts-button>`);
            expect(el.variant).to.equal('default');
            expect(el.getAttribute('variant')).to.equal('default');
            el.removeAttribute('variant');
            await el.updateComplete;
            expect(el.variant).to.equal('default');
            expect(el.getAttribute('variant')).to.equal('default');
        });

        it("should return to 'default' when attribute removed with an initial attribute", async () => {
            const el = await fixture<TsButton>(html`<ts-button variant="primary">Button label</ts-button>`);
            expect(el.variant).to.equal('primary');
            expect(el.getAttribute('variant')).to.equal('primary');
            el.removeAttribute('variant');
            await el.updateComplete;
            expect(el.variant).to.equal('default');
            expect(el.getAttribute('variant')).to.equal('default');
        });
    });

    describe('when a property is set to null', () => {
        it("should return to 'default' when property set to null with no initial attribute", async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button label</ts-button>`);
            expect(el.variant).to.equal('default');
            expect(el.getAttribute('variant')).to.equal('default');
            // @ts-expect-error test
            el.variant = null;
            await el.updateComplete;
            expect(el.variant).to.equal('default');
            expect(el.getAttribute('variant')).to.equal('default');
        });

        it("should return to 'default' when property set to null with an initial attribute", async () => {
            const el = await fixture<TsButton>(html`<ts-button variant="primary">Button label</ts-button>`);
            expect(el.variant).to.equal('primary');
            expect(el.getAttribute('variant')).to.equal('primary');
            // @ts-expect-error test
            el.variant = null;
            await el.updateComplete;
            expect(el.variant).to.equal('default');
            expect(el.getAttribute('variant')).to.equal('default');
        });
    });

    describe('when provided no parameters', () => {
        it('passes accessibility test', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button Label</ts-button>`);
            await expect(el).to.be.accessible();
        });

        it('default values are set correctly', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button Label</ts-button>`);
            expect(el.title).to.equal('');
            expect(el.variant).to.equal('default');
            expect(el.size).to.equal('medium');
            expect(el.disabled).to.equal(false);
            expect(el.caret).to.equal(false);
            expect(el.loading).to.equal(false);
            expect(el.outline).to.equal(false);
            expect(el.pill).to.equal(false);
            expect(el.circle).to.equal(false);
        });

        it('should render as a <button>', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button Label</ts-button>`);
            expect(el.shadowRoot!.querySelector('button')).to.exist;
            expect(el.shadowRoot!.querySelector('a')).not.to.exist;
        });

        it('should not have a spinner present', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button Label</ts-button>`);
            expect(el.shadowRoot!.querySelector('ts-spinner')).not.to.exist;
        });

        it('should not have a caret present', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button Label</ts-button>`);
            expect(el.shadowRoot?.querySelector('[part~="caret"]')).not.to.exist;
        });
    });

    describe('when disabled', () => {
        it('passes accessibility test', async () => {
            const el = await fixture<TsButton>(html`<ts-button disabled>Button Label</ts-button>`);
            await expect(el).to.be.accessible();
        });

        it('should disable the native <button> when rendering a <button>', async () => {
            const el = await fixture<TsButton>(html`<ts-button disabled>Button Label</ts-button>`);
            expect(el.shadowRoot!.querySelector('button[disabled]')).to.exist;
        });

        it('should not disable the native <a> when rendering an <a>', async () => {
            const el = await fixture<TsButton>(html`<ts-button href="some/path" disabled>Button Label</ts-button>`);
            expect(el.shadowRoot!.querySelector('a[disabled]')).not.to.exist;
        });

        it('should set aria-disabled="true" and tabindex="-1" on disabled button', async () => {
            const el = await fixture<TsButton>(html`<ts-button disabled>Button Label</ts-button>`);
            const button = el.shadowRoot!.querySelector('button')!;
            expect(button.getAttribute('aria-disabled')).to.equal('true');
            expect(button.getAttribute('tabindex')).to.equal('-1');
        });

        it('should set aria-disabled="true" and tabindex="-1" on disabled link', async () => {
            const el = await fixture<TsButton>(
                html`<ts-button href="/register" disabled>Jetzt Konto anlegen</ts-button>`,
            );
            const link = el.shadowRoot!.querySelector('a')!;
            expect(link.getAttribute('aria-disabled')).to.equal('true');
            expect(link.getAttribute('tabindex')).to.equal('-1');
        });

        it('should not render href on disabled link', async () => {
            const el = await fixture<TsButton>(
                html`<ts-button href="/register" disabled>Jetzt Konto anlegen</ts-button>`,
            );
            const link = el.shadowRoot!.querySelector('a')!;
            expect(link.hasAttribute('href')).to.be.false;
        });

        it('should not set aria-disabled on enabled button', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button Label</ts-button>`);
            const button = el.shadowRoot!.querySelector('button')!;
            expect(button.hasAttribute('aria-disabled')).to.be.false;
            expect(button.hasAttribute('tabindex')).to.be.false;
        });
    });

    describe('accessible name', () => {
        it('should prefer explicit aria-label over text content', async () => {
            const el = await fixture<TsButton>(html`<ts-button aria-label="Custom label">Visible text</ts-button>`);
            await el.updateComplete;
            const button = el.shadowRoot!.querySelector('button')!;
            expect(button.getAttribute('aria-label')).to.equal('Custom label');
        });

        it('should forward aria-label to internal link', async () => {
            const el = await fixture<TsButton>(
                html`<ts-button href="/register" aria-label="Jetzt Konto anlegen">Visible text</ts-button>`,
            );
            await el.updateComplete;
            const link = el.shadowRoot!.querySelector('a')!;
            expect(link.getAttribute('aria-label')).to.equal('Jetzt Konto anlegen');
        });

        it('should not set aria-label on inner control when none provided', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Anmelden</ts-button>`);
            await el.updateComplete;
            const button = el.shadowRoot!.querySelector('button')!;
            expect(button.hasAttribute('aria-label')).to.be.false;
        });

        it('should not have redundant role="button" on native <button>', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button Label</ts-button>`);
            const button = el.shadowRoot!.querySelector('button')!;
            expect(button.hasAttribute('role')).to.be.false;
        });
    });

    describe('when variant is set', () => {
        it('should have title if title attribute is set', async () => {
            const el = await fixture<TsButton>(html`<ts-button title="Test"></ts-button>`);
            await el.updateComplete;
            const button = el.shadowRoot!.querySelector<HTMLButtonElement>('[part~="base"]')!;
            expect(button.title).to.equal('Test');
        });
    });

    describe('when loading', () => {
        it('should have a spinner present', async () => {
            const el = await fixture<TsButton>(html`<ts-button loading>Button Label</ts-button>`);
            expect(el.shadowRoot!.querySelector('ts-spinner')).to.exist;
        });
    });

    describe('when caret', () => {
        it('should have a caret present', async () => {
            const el = await fixture<TsButton>(html`<ts-button caret>Button Label</ts-button>`);
            expect(el.shadowRoot!.querySelector('[part~="caret"]')).to.exist;
        });
    });

    describe('when href is present', () => {
        it('should render as an <a>', async () => {
            const el = await fixture<TsButton>(html`<ts-button href="some/path">Button Label</ts-button>`);
            expect(el.shadowRoot!.querySelector('a')).to.exist;
            expect(el.shadowRoot!.querySelector('button')).not.to.exist;
        });

        it('should render a link with rel="noreferrer noopener" when target is set and rel is not', async () => {
            const el = await fixture<TsButton>(
                html`<ts-button href="https://example.com/" target="_blank">Link</ts-button>`,
            );
            const link = el.shadowRoot!.querySelector('a')!;
            expect(link?.getAttribute('rel')).to.equal('noreferrer noopener');
        });

        it('should render a link with rel="" when a target is provided and rel is empty', async () => {
            const el = await fixture<TsButton>(
                html`<ts-button href="https://example.com/" target="_blank" rel="">Link</ts-button>`,
            );
            const link = el.shadowRoot!.querySelector('a')!;
            expect(link?.getAttribute('rel')).to.equal('');
        });

        it('should render a link with a custom rel when a custom rel is provided', async () => {
            const el = await fixture<TsButton>(
                html`<ts-button href="https://example.com/" target="_blank" rel="1">Link</ts-button>`,
            );
            const link = el.shadowRoot!.querySelector('a')!;
            expect(link?.getAttribute('rel')).to.equal('1');
        });
    });

    describe('when submitting a form', () => {
        it('should submit when the button is inside the form', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form action="" method="post">
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            const button = form.querySelector<TsButton>('ts-button')!;
            await button.updateComplete;
            const submitSpy = sinon.spy();
            const onSubmit = (event: Event) => {
                submitSpy(event as SubmitEvent);
                event.preventDefault();
            };
            form.addEventListener('submit', onSubmit);
            button.click();
            await waitUntil(() => submitSpy.calledOnce);
            expect(submitSpy).to.have.been.calledOnce;
        });

        it('should submit when the button is outside the form and has a form attribute', async () => {
            const el = await fixture(html`
                <div>
                    <form id="a" action="" method="post"></form>
                    <ts-button type="submit" form="a">Submit</ts-button>
                </div>
            `);
            const form = el.querySelector('form') as HTMLFormElement;
            const button = el.querySelector<TsButton>('ts-button')!;
            await button.updateComplete;
            const submitSpy = sinon.spy();
            const onSubmit = (event: Event) => {
                submitSpy(event as SubmitEvent);
                event.preventDefault();
            };
            form.addEventListener('submit', onSubmit);
            button.click();
            await waitUntil(() => submitSpy.calledOnce);
            expect(submitSpy).to.have.been.calledOnce;
        });

        it('should override form attributes when formaction, formmethod, formnovalidate, and formtarget are used inside a form', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form id="a" action="foo" method="post" target="_self">
                    <ts-button
                        type="submit"
                        form="a"
                        formaction="bar"
                        formmethod="get"
                        formtarget="_blank"
                        formnovalidate
                    >
                        Submit
                    </ts-button>
                </form>
            `);
            const button = form.querySelector<TsButton>('ts-button')!;
            await button.updateComplete;
            let submitter!: HTMLButtonElement;
            const submitSpy = sinon.spy();
            const onSubmit = (event: Event) => {
                submitter = (event as SubmitEvent).submitter as HTMLButtonElement;
                submitSpy(event as SubmitEvent);
                event.preventDefault();
            };
            form.addEventListener('submit', onSubmit);
            button.click();
            await waitUntil(() => submitSpy.calledOnce);
            expect(submitSpy).to.have.been.calledOnce;
            expect(submitter.formAction.endsWith('/bar')).to.equal(true);
            expect(submitter.formMethod).to.equal('get');
            expect(submitter.formTarget).to.equal('_blank');
            expect(submitter.formNoValidate).to.equal(true);
        });

        it('should override form attributes when formaction, formmethod, formnovalidate, and formtarget are used outside a form', async () => {
            const el = await fixture(html`
                <div>
                    <form id="a" action="foo" method="post" target="_self"></form>
                    <ts-button
                        type="submit"
                        form="a"
                        formaction="bar"
                        formmethod="get"
                        formtarget="_blank"
                        formnovalidate
                    >
                        Submit
                    </ts-button>
                </div>
            `);
            const form = el.querySelector('form') as HTMLFormElement;
            const button = el.querySelector<TsButton>('ts-button')!;
            await button.updateComplete;
            let submitter!: HTMLButtonElement;
            const submitSpy = sinon.spy();
            const onSubmit = (event: Event) => {
                submitter = (event as SubmitEvent).submitter as HTMLButtonElement;
                submitSpy(event as SubmitEvent);
                event.preventDefault();
            };
            form.addEventListener('submit', onSubmit);
            button.click();
            await waitUntil(() => submitSpy.calledOnce);
            expect(submitSpy).to.have.been.calledOnce;
            expect(submitter.formAction.endsWith('/bar')).to.equal(true);
            expect(submitter.formMethod).to.equal('get');
            expect(submitter.formTarget).to.equal('_blank');
            expect(submitter.formNoValidate).to.equal(true);
        });
    });

    describe('when using methods', () => {
        it('should emit ts-focus and ts-blur when the button is focused and blurred', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button</ts-button>`);
            const focusHandler = sinon.spy();
            const blurHandler = sinon.spy();
            const onFocus = () => focusHandler();
            const onBlur = () => blurHandler();
            el.addEventListener('ts-focus', onFocus);
            el.addEventListener('ts-blur', onBlur);
            el.focus();
            await waitUntil(() => focusHandler.calledOnce);
            el.blur();
            await waitUntil(() => blurHandler.calledOnce);
            expect(focusHandler).to.have.been.calledOnce;
            expect(blurHandler).to.have.been.calledOnce;
        });

        it('should emit a click event when calling click()', async () => {
            const el = await fixture<TsButton>(html`<ts-button></ts-button>`);
            await el.updateComplete;
            const clickHandler = sinon.spy();
            const onClick = () => clickHandler();
            el.addEventListener('click', onClick);
            el.click();
            await waitUntil(() => clickHandler.calledOnce);
            expect(clickHandler).to.have.been.calledOnce;
        });
    });

    describe('css Style variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsButton>(html`<ts-button>Button</ts-button>`);
            const cssText = getCssText(el);

            expect(cssText).to.include('border-width: var(--ts-semantic-size-width-sm);');
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-medium);');

            expect(cssText).to.include('var(--ts-semantic-transition-duration-xfast) background-color');
            expect(cssText).to.include('var(--ts-semantic-transition-duration-xfast) color');
            expect(cssText).to.include('var(--ts-semantic-transition-duration-xfast) border');
            expect(cssText).to.include('var(--ts-semantic-transition-duration-xfast) box-shadow');

            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-default);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-base-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-primary-default);');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-hover);');
            expect(cssText).to.not.include('border-color: var(--ts-semantic-color-border-base-hover);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-active);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-base-active);');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-default);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-primary-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-inverted-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-hover);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-primary-hover);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-active);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-primary-active);');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-success-default);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-success-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-success-hover);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-success-hover);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-success-active);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-success-active);');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-default);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-neutral-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-hover);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-neutral-hover);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-active);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-neutral-active);');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-warning-default);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-warning-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-warning-hover);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-warning-hover);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-warning-active);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-warning-active);');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-danger-default);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-danger-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-danger-hover);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-danger-hover);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-danger-active);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-danger-active);');

            expect(cssText).to.include('color: var(--ts-semantic-color-text-primary-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-primary-hover);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-primary-active);');

            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('font-size: var(--ts-font-size-200);');
            expect(cssText).to.include('font-size: var(--ts-font-size-300);');
        });
    });
});
