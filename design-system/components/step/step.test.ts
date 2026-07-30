import { expect, fixture, html } from '@open-wc/testing';

import type { TsStep } from '@components/step/index.js';

import '@tuvsud/design-system/step';

describe('step component <ts-step>', () => {
    describe('accessibility tests', () => {
        it('should be accessible when wrapped in a list', async () => {
            // ts-step host has role="none"; the inner .step div has role="listitem".
            // Wrapping in a <ul> satisfies axe's aria-required-parent rule for the
            // flat a11y tree, and also mirrors how the stepper renders things.
            const el = await fixture<TsStep>(html`
                <ul role="list" style="list-style:none;padding:0;margin:0;display:flex">
                    <ts-step label="Step 1"></ts-step>
                </ul>
            `);
            await expect(el).to.be.accessible();
        });

        it('should have role="none" on the host', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Step 1"></ts-step>`);
            expect(el.getAttribute('role')).to.equal('none');
        });

        it('should have role="listitem" on the inner .step div', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Step 1"></ts-step>`);
            await el.updateComplete;
            const inner = el.shadowRoot!.querySelector('.step');
            expect(inner?.getAttribute('role')).to.equal('listitem');
        });

        it('should have aria-current="step" on inner div when active', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Step 1" active></ts-step>`);
            await el.updateComplete;
            const inner = el.shadowRoot!.querySelector('.step');
            expect(inner?.getAttribute('aria-current')).to.equal('step');
        });

        it('should have aria-current="false" on inner div when not active', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Step 1"></ts-step>`);
            await el.updateComplete;
            const inner = el.shadowRoot!.querySelector('.step');
            expect(inner?.getAttribute('aria-current')).to.equal('false');
        });

        it('should have aria-disabled="true" on inner div when disabled', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Step 1" disabled></ts-step>`);
            await el.updateComplete;
            const inner = el.shadowRoot!.querySelector('.step');
            expect(inner?.getAttribute('aria-disabled')).to.equal('true');
        });

        it('should have aria-posinset and aria-setsize on inner div when totalSteps is set', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Step 1" index="1" total-steps="4"></ts-step>`);
            await el.updateComplete;
            const inner = el.shadowRoot!.querySelector('.step');
            expect(inner?.getAttribute('aria-posinset')).to.equal('2');
            expect(inner?.getAttribute('aria-setsize')).to.equal('4');
        });
    });

    describe('when provided no parameters', () => {
        it('should have default values', async () => {
            const el = await fixture<TsStep>(html`<ts-step></ts-step>`);

            expect(el.active).to.be.false;
            expect(el.state).to.equal('default');
            expect(el.last).to.be.false;
            expect(el.index).to.equal(0);
            expect(el.disabled).to.be.false;
            expect(el.label).to.equal('');
            expect(el.description).to.equal('');
            expect(el.orientation).to.equal('horizontal');
            expect(el.variant).to.equal('primary');
        });
    });

    describe('when properties are set', () => {
        it('should reflect active state', async () => {
            const el = await fixture<TsStep>(html`<ts-step active></ts-step>`);
            expect(el.active).to.be.true;
            expect(el.hasAttribute('active')).to.be.true;
        });

        it('should reflect state property', async () => {
            const el = await fixture<TsStep>(html`<ts-step state="done"></ts-step>`);
            expect(el.state).to.equal('done');
        });

        it('should reflect disabled state', async () => {
            const el = await fixture<TsStep>(html`<ts-step disabled></ts-step>`);
            expect(el.disabled).to.be.true;
            expect(el.hasAttribute('disabled')).to.be.true;
        });

        it('should display label text', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Test Step"></ts-step>`);
            await el.updateComplete;
            const label = el.shadowRoot!.querySelector('.step__label');
            expect(label?.textContent).to.contain('Test Step');
        });

        it('should display description text', async () => {
            const el = await fixture<TsStep>(html`<ts-step description="Test Description"></ts-step>`);
            await el.updateComplete;
            const description = el.shadowRoot!.querySelector('.step__description');
            expect(description?.textContent).to.contain('Test Description');
        });
    });

    describe('events', () => {
        // ts-select-step is emitted by the parent <ts-stepper>, not by <ts-step> alone.
        // Clicking a step inside a stepper (with navigation) emits the event once from the stepper.
        // See stepper.test.ts for full navigation event coverage.

        it('should not emit ts-select-step when clicked in isolation', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Step 1"></ts-step>`);
            let eventFired = false;
            el.addEventListener('ts-select-step', () => {
                eventFired = true;
            });

            const step = el.shadowRoot!.querySelector('.step') as HTMLElement;
            step.click();
            await el.updateComplete;

            expect(eventFired).to.be.false;
        });

        it('should not emit ts-select-step when disabled and clicked', async () => {
            const el = await fixture<TsStep>(html`<ts-step label="Step 1" disabled></ts-step>`);
            let eventFired = false;
            el.addEventListener('ts-select-step', () => {
                eventFired = true;
            });

            const step = el.shadowRoot!.querySelector('.step') as HTMLElement;
            step.click();
            await el.updateComplete;

            expect(eventFired).to.be.false;
        });
    });

    describe('visual states', () => {
        it('should render step number by default', async () => {
            const el = await fixture<TsStep>(html`<ts-step index="2"></ts-step>`);
            await el.updateComplete;
            const number = el.shadowRoot!.querySelector('.step__number');
            expect(number?.textContent).to.equal('3'); // index + 1
        });

        it('should render check icon when state is done', async () => {
            const el = await fixture<TsStep>(html`<ts-step state="done"></ts-step>`);
            await el.updateComplete;
            const icon = el.shadowRoot!.querySelector('ts-icon[name="check"]');
            expect(icon).to.exist;
        });

        it('should render warning icon when state is warning', async () => {
            const el = await fixture<TsStep>(html`<ts-step state="warning"></ts-step>`);
            await el.updateComplete;
            const icon = el.shadowRoot!.querySelector('ts-icon[name="warning"]');
            expect(icon).to.exist;
        });

        it('should render error icon when state is error', async () => {
            const el = await fixture<TsStep>(html`<ts-step state="error"></ts-step>`);
            await el.updateComplete;
            const icon = el.shadowRoot!.querySelector('ts-icon[name="close"]');
            expect(icon).to.exist;
        });
    });

    describe('orientations', () => {
        it('should apply horizontal orientation class', async () => {
            const el = await fixture<TsStep>(html`<ts-step orientation="horizontal"></ts-step>`);
            await el.updateComplete;
            const step = el.shadowRoot!.querySelector('.step');
            expect(step?.classList.contains('step--horizontal')).to.be.true;
        });

        it('should apply vertical orientation class', async () => {
            const el = await fixture<TsStep>(html`<ts-step orientation="vertical"></ts-step>`);
            await el.updateComplete;
            const step = el.shadowRoot!.querySelector('.step');
            expect(step?.classList.contains('step--vertical')).to.be.true;
        });
    });
});
