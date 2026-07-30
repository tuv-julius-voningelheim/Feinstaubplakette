import { aTimeout, expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsAvatar } from '@components/avatar/index.js';

import type { TsAvatarGroup } from './index.js';

import '@tuvsud/design-system/avatar-group';
import '@tuvsud/design-system/avatar';

describe('<ts-avatar-group>', () => {
    it('renders a group container with role="group"', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group>
                <ts-avatar initials="A"></ts-avatar>
            </ts-avatar-group>
        `);

        const base = el.shadowRoot!.querySelector('[part~="base"]') as HTMLElement;
        expect(base).to.exist;
        expect(base.getAttribute('role')).to.equal('group');
    });

    it('applies shape to all slotted avatars', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group shape="rounded">
                <ts-avatar initials="A"></ts-avatar>
                <ts-avatar initials="B"></ts-avatar>
                <ts-avatar initials="C"></ts-avatar>
            </ts-avatar-group>
        `);

        const avatars = Array.from(el.querySelectorAll<TsAvatar>('ts-avatar'));
        expect(avatars.length).to.equal(3);
        avatars.forEach(a => expect(a.getAttribute('shape')).to.equal('rounded'));
    });

    it('shows all avatars when max=0', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group max="0">
                <ts-avatar initials="A"></ts-avatar>
                <ts-avatar initials="B"></ts-avatar>
                <ts-avatar initials="C"></ts-avatar>
            </ts-avatar-group>
        `);

        const avatars = Array.from(el.querySelectorAll<TsAvatar>('ts-avatar'));
        avatars.forEach(a => {
            expect((a as HTMLElement).style.display).to.not.equal('none');
        });

        const overflow = el.shadowRoot!.querySelector('ts-avatar.overflow');
        expect(overflow).to.equal(null);
    });

    it('hides avatars beyond max and renders a +X overflow avatar', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group max="2">
                <ts-avatar initials="A"></ts-avatar>
                <ts-avatar initials="B"></ts-avatar>
                <ts-avatar initials="C"></ts-avatar>
                <ts-avatar initials="D"></ts-avatar>
            </ts-avatar-group>
        `);

        const slotted = Array.from(el.querySelectorAll<TsAvatar>('ts-avatar'));
        expect((slotted[0] as HTMLElement).style.display).to.not.equal('none');
        expect((slotted[1] as HTMLElement).style.display).to.not.equal('none');
        expect((slotted[2] as HTMLElement).style.display).to.equal('none');
        expect((slotted[3] as HTMLElement).style.display).to.equal('none');

        const overflow = el.shadowRoot!.querySelector('ts-avatar.overflow') as TsAvatar;
        expect(overflow).to.exist;
        expect(overflow.getAttribute('initials')).to.equal('+2');
        expect(overflow.getAttribute('label')).to.equal('2 more');
        expect(overflow.getAttribute('shape')).to.equal('circle');
    });

    it('sets ring CSS custom properties on each slotted avatar', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group>
                <ts-avatar initials="A"></ts-avatar>
                <ts-avatar initials="B"></ts-avatar>
            </ts-avatar-group>
        `);

        const avatars = Array.from(el.querySelectorAll<HTMLElement>('ts-avatar'));
        avatars.forEach(a => {
            expect(a.style.getPropertyValue('--ts-avatar-ring-width')).to.equal('var(--avatar-group-ring-width)');
            expect(a.style.getPropertyValue('--ts-avatar-ring-color')).to.equal('var(--avatar-group-ring-color)');
        });
    });

    it('assigns z-index in increasing order and overflow avatar gets last z-index', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group max="2">
                <ts-avatar initials="A"></ts-avatar>
                <ts-avatar initials="B"></ts-avatar>
                <ts-avatar initials="C"></ts-avatar>
            </ts-avatar-group>
        `);

        const slotted = Array.from(el.querySelectorAll<HTMLElement>('ts-avatar'));
        expect(slotted[0]!.style.zIndex).to.equal('1');
        expect(slotted[1]!.style.zIndex).to.equal('2');
        expect(slotted[2]!.style.zIndex).to.equal('3');

        const overflow = el.shadowRoot!.querySelector('ts-avatar.overflow') as HTMLElement;
        expect(overflow.style.zIndex).to.equal('4');
    });

    it('sets --overlap on the host from the overlap property and updates when overlap changes', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group overlap="1rem">
                <ts-avatar initials="A"></ts-avatar>
            </ts-avatar-group>
        `);

        expect(el.style.getPropertyValue('--overlap')).to.equal('1rem');

        el.overlap = '0.25rem';
        await el.updateComplete;

        expect(el.style.getPropertyValue('--overlap')).to.equal('0.25rem');
    });

    it('reacts to slot changes by syncing newly added avatars', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group shape="square" max="1">
                <ts-avatar initials="A"></ts-avatar>
            </ts-avatar-group>
        `);

        const avatar2 = document.createElement('ts-avatar') as TsAvatar;
        avatar2.setAttribute('initials', 'B');
        el.append(avatar2);

        await aTimeout(0);
        await el.updateComplete;

        expect(avatar2.getAttribute('shape')).to.equal('square');
        expect((avatar2 as HTMLElement).style.display).to.equal('none');

        const overflow = el.shadowRoot!.querySelector('ts-avatar.overflow') as TsAvatar;
        expect(overflow).to.exist;
        expect(overflow.getAttribute('initials')).to.equal('+1');
    });

    it('uses the expected CSS variables in styles', async () => {
        const el = await fixture<TsAvatarGroup>(html`
            <ts-avatar-group>
                <ts-avatar initials="A"></ts-avatar>
            </ts-avatar-group>
        `);

        const cssText = getCssText(el);
        expect(cssText).to.include('--overlap');
        expect(cssText).to.include('--avatar-group-ring-width');
        expect(cssText).to.include('--avatar-group-ring-color');
    });
});
