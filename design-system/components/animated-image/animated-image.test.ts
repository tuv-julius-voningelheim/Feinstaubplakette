import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { clickOnElement } from '@utils/internal/test.js';

import type { TsAnimatedImage } from '@components/animated-image/index.js';

import '@tuvsud/design-system/animated-image';
import '@utils/events/ts-load.js';
import '@utils/events/ts-error.js';

describe('<ts-animated-image>', () => {
    it.skip('should render a component', async () => {
        const animatedImage = await fixture(html`<ts-animated-image></ts-animated-image>`);
        expect(animatedImage).to.exist;
    });

    it.skip('should render be accessible', async () => {
        const animatedImage = await fixture(html`<ts-animated-image></ts-animated-image>`);
        await expect(animatedImage).to.be.accessible();
    });

    const files = ['/images/walk.gif', '/images/tie.webp'];

    files.forEach((file: string) => {
        it.skip(`should load ${file} without errors`, async () => {
            const animatedImage = await fixture<TsAnimatedImage>(html`<ts-animated-image></ts-animated-image>`);
            let errorCount = 0;
            oneEvent(animatedImage, 'ts-error').then(() => errorCount++);
            await loadImage(animatedImage, file);
            expect(errorCount).to.equal(0);
        });

        it.skip(`should play ${file} on click`, async () => {
            const animatedImage = await fixture<TsAnimatedImage>(html`<ts-animated-image></ts-animated-image>`);
            await loadImage(animatedImage, file);
            expect(animatedImage.play).not.to.be.true;
            await clickOnElement(animatedImage);
            expect(animatedImage.play).to.be.true;
        });

        it.skip(`should pause and resume ${file} on click`, async () => {
            const animatedImage = await fixture<TsAnimatedImage>(html`<ts-animated-image></ts-animated-image>`);
            await loadImage(animatedImage, file);
            animatedImage.play = true;
            await clickOnElement(animatedImage);
            expect(animatedImage.play).to.be.false;
            await clickOnElement(animatedImage);
            expect(animatedImage.play).to.be.true;
        });
    });

    it.skip('should emit an error event on invalid url', async () => {
        const animatedImage = await fixture<TsAnimatedImage>(html`<ts-animated-image></ts-animated-image>`);
        const errorPromise = oneEvent(animatedImage, 'ts-error');
        animatedImage.src = '/images/does-not-exist.png';
        await errorPromise;
    });
});

async function loadImage(animatedImage: TsAnimatedImage, file: string) {
    const loadingPromise = oneEvent(animatedImage, 'ts-load');
    animatedImage.src = file;
    await loadingPromise;
}
