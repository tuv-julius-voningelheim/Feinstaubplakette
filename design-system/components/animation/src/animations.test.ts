import { expect } from '@open-wc/testing';
import * as animations from '@shoelace-style/animations';

import { getAnimationNames, getEasingNames } from '@components/animation/src/animations.js';

describe('animation utils', () => {
    it('returns all animation names except easings', () => {
        const names = getAnimationNames();
        const expected = Object.keys(animations).filter(k => k !== 'easings');
        expect(names).to.deep.equal(expected);
    });

    it('returns all easing names', () => {
        const names = getEasingNames();
        const expected = Object.keys(animations.easings);
        expect(names).to.deep.equal(expected);
    });
});
