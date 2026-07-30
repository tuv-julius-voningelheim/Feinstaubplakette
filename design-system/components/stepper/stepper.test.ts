import { expect, fixture, html } from '@open-wc/testing';

import type { TsStep } from '@components/step/index.js';
import type { TsStepper } from '@components/stepper/index.js';

import '@tuvsud/design-system/stepper';
import '@tuvsud/design-system/step';

/** Wait for one microtask + one animation frame to let Lit updates and
 *  MutationObserver callbacks flush completely. */
async function nextFrame() {
    await new Promise(resolve => requestAnimationFrame(resolve));
}

describe('stepper component <ts-stepper>', () => {
    describe('accessibility tests', () => {
        it('should be accessible with steps', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();
            await expect(el).to.be.accessible();
        });

        it('should have role="list" on the steps container', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            const list = el.shadowRoot!.querySelector('.stepper__steps');
            expect(list?.getAttribute('role')).to.equal('list');
        });

        it('should apply a default aria-label to the steps container', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            const list = el.shadowRoot!.querySelector('.stepper__steps');
            expect(list?.getAttribute('aria-label')).to.equal('Progress steps');
        });

        it('should use a custom aria-label when provided', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper aria-label="Checkout process">
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            const list = el.shadowRoot!.querySelector('.stepper__steps');
            expect(list?.getAttribute('aria-label')).to.equal('Checkout process');
        });

        it('should have an aria-live status region in the shadow DOM', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            const live = el.shadowRoot!.querySelector('[aria-live="polite"]');
            expect(live).to.exist;
            expect(live?.getAttribute('role')).to.equal('status');
        });
    });

    describe('when provided no parameters', () => {
        it('should have default values', async () => {
            const el = await fixture<TsStepper>(html`<ts-stepper></ts-stepper>`);

            expect(el.orientation).to.equal('horizontal');
            expect(el.currentStep).to.equal(0);
            expect(el.navigation).to.be.false;
            expect(el.variant).to.equal('primary');
        });
    });

    describe('step management', () => {
        it('should set the correct index for each step', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            const steps = Array.from(el.querySelectorAll('ts-step')) as TsStep[];
            expect(steps[0]!.index).to.equal(0);
            expect(steps[1]!.index).to.equal(1);
            expect(steps[2]!.index).to.equal(2);
        });

        it('should mark the current step as active', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper current-step="1">
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            const steps = Array.from(el.querySelectorAll('ts-step')) as TsStep[];
            expect(steps[0]!.active).to.be.false;
            expect(steps[1]!.active).to.be.true;
            expect(steps[2]!.active).to.be.false;
        });

        it('should mark the last step correctly', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            const steps = Array.from(el.querySelectorAll('ts-step')) as TsStep[];
            expect(steps[0]!.last).to.be.false;
            expect(steps[1]!.last).to.be.false;
            expect(steps[2]!.last).to.be.true;
        });

        it('should propagate orientation to steps', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper orientation="vertical">
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            const steps = Array.from(el.querySelectorAll('ts-step')) as TsStep[];
            steps.forEach(step => {
                expect(step.orientation).to.equal('vertical');
            });
        });

        it('should propagate variant to steps', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper variant="secondary">
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            const steps = Array.from(el.querySelectorAll('ts-step')) as TsStep[];
            steps.forEach(step => {
                expect(step.variant).to.equal('secondary');
            });
        });
    });

    describe('navigation', () => {
        it('should allow step selection when navigation is enabled', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper navigation>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            const selectPromise = new Promise<CustomEvent>(resolve =>
                el.addEventListener('ts-select-step', resolve as EventListener, { once: true }),
            );

            const step2 = el.querySelectorAll('ts-step')[1] as TsStep;
            step2.click();

            const event = await selectPromise;
            await el.updateComplete;

            expect(event.detail.index).to.equal(1);
            expect(el.currentStep).to.equal(1);
        });

        it('should not allow step selection when navigation is disabled', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            let eventFired = false;
            el.addEventListener('ts-select-step', () => {
                eventFired = true;
            });

            const step2 = el.querySelectorAll('ts-step')[1] as TsStep;
            step2.click();
            await el.updateComplete;

            expect(eventFired).to.be.false;
            expect(el.currentStep).to.equal(0);
        });

        it('should not navigate to disabled steps', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper navigation>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2" disabled></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            const step2 = el.querySelectorAll('ts-step')[1] as TsStep;
            step2.click();
            await el.updateComplete;

            expect(el.currentStep).to.equal(0);
        });
    });

    describe('keyboard navigation', () => {
        it('should move to next step on ArrowRight when navigation is enabled', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper navigation>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            await el.updateComplete;

            expect(el.currentStep).to.equal(1);
        });

        it('should move to previous step on ArrowLeft when navigation is enabled', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper navigation current-step="2">
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
            await el.updateComplete;

            expect(el.currentStep).to.equal(1);
        });

        it('should jump to first step on Home key', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper navigation current-step="2">
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
            await el.updateComplete;

            expect(el.currentStep).to.equal(0);
        });

        it('should jump to last step on End key', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper navigation>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                    <ts-step label="Step 3"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
            await el.updateComplete;

            expect(el.currentStep).to.equal(2);
        });

        it('should not respond to arrow keys when navigation is disabled', async () => {
            const el = await fixture<TsStepper>(html`
                <ts-stepper>
                    <ts-step label="Step 1"></ts-step>
                    <ts-step label="Step 2"></ts-step>
                </ts-stepper>
            `);
            await el.updateComplete;
            await nextFrame();

            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            await el.updateComplete;

            expect(el.currentStep).to.equal(0);
        });

        describe('secondary variant navigation', () => {
            it('should render navigation buttons in secondary variant', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper variant="secondary">
                        <ts-step label="Step 1"></ts-step>
                        <ts-step label="Step 2"></ts-step>
                        <ts-step label="Step 3"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;

                const prevButton = el.shadowRoot!.querySelector('[part="prev-button"]');
                const nextButton = el.shadowRoot!.querySelector('[part="next-button"]');

                expect(prevButton).to.exist;
                expect(nextButton).to.exist;
            });

            it('should navigate to next step when next button is clicked', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper variant="secondary">
                        <ts-step label="Step 1"></ts-step>
                        <ts-step label="Step 2"></ts-step>
                        <ts-step label="Step 3"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;

                const nextButton = el.shadowRoot!.querySelector('[part="next-button"]') as HTMLElement;
                nextButton.click();
                await el.updateComplete;

                expect(el.currentStep).to.equal(1);
            });

            it('should navigate to previous step when prev button is clicked', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper variant="secondary" current-step="1">
                        <ts-step label="Step 1"></ts-step>
                        <ts-step label="Step 2"></ts-step>
                        <ts-step label="Step 3"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;
                await nextFrame();

                const prevButton = el.shadowRoot!.querySelector('[part="prev-button"]') as HTMLElement;
                prevButton.click();
                await el.updateComplete;

                expect(el.currentStep).to.equal(0);
            });

            it('should disable prev button on first step', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper variant="secondary">
                        <ts-step label="Step 1"></ts-step>
                        <ts-step label="Step 2"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;

                const prevButton = el.shadowRoot!.querySelector('[part="prev-button"]');
                expect(prevButton?.hasAttribute('disabled')).to.be.true;
            });

            it('should disable next button on last step', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper variant="secondary" current-step="1">
                        <ts-step label="Step 1"></ts-step>
                        <ts-step label="Step 2"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;
                await nextFrame();

                const nextButton = el.shadowRoot!.querySelector('[part="next-button"]');
                expect(nextButton?.hasAttribute('disabled')).to.be.true;
            });
        });

        describe('events', () => {
            it('should emit ts-select-step once with correct details when next button is clicked', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper variant="secondary">
                        <ts-step label="Step 1"></ts-step>
                        <ts-step label="Step 2"></ts-step>
                        <ts-step label="Step 3"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;

                let eventCount = 0;
                let lastEvent: CustomEvent | null = null;

                el.addEventListener('ts-select-step', (e: Event) => {
                    eventCount++;
                    lastEvent = e as CustomEvent;
                });

                const nextButton = el.shadowRoot!.querySelector('[part="next-button"]') as HTMLElement;
                nextButton.click();
                await el.updateComplete;

                expect(eventCount).to.equal(1);
                expect(lastEvent!.detail.index).to.equal(1);
                expect(lastEvent!.detail.previousIndex).to.equal(0);
            });

            it('should emit ts-select-step exactly once when a step is clicked', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper navigation>
                        <ts-step label="Step 1"></ts-step>
                        <ts-step label="Step 2"></ts-step>
                        <ts-step label="Step 3"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;
                await nextFrame();

                let eventCount = 0;
                el.addEventListener('ts-select-step', () => {
                    eventCount++;
                });

                const step2 = el.querySelectorAll('ts-step')[1] as TsStep;
                step2.click();
                await el.updateComplete;

                expect(eventCount).to.equal(1);
            });
        });

        describe('variants', () => {
            it('should apply primary variant class', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper variant="primary">
                        <ts-step label="Step 1"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;

                const stepper = el.shadowRoot!.querySelector('.stepper');
                expect(stepper?.classList.contains('stepper--primary')).to.be.true;
            });

            it('should apply secondary variant class', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper variant="secondary">
                        <ts-step label="Step 1"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;

                const stepper = el.shadowRoot!.querySelector('.stepper');
                expect(stepper?.classList.contains('stepper--secondary')).to.be.true;
            });
        });

        describe('orientations', () => {
            it('should apply horizontal orientation class', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper orientation="horizontal">
                        <ts-step label="Step 1"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;

                const stepper = el.shadowRoot!.querySelector('.stepper');
                expect(stepper?.classList.contains('stepper--horizontal')).to.be.true;
            });

            it('should apply vertical orientation class', async () => {
                const el = await fixture<TsStepper>(html`
                    <ts-stepper orientation="vertical">
                        <ts-step label="Step 1"></ts-step>
                    </ts-stepper>
                `);
                await el.updateComplete;

                const stepper = el.shadowRoot!.querySelector('.stepper');
                expect(stepper?.classList.contains('stepper--vertical')).to.be.true;
            });
        });
    });
});
