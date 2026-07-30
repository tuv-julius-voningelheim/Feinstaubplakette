import { expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';

import type { TsTreeItem } from '@components/tree-item/index.js';

import '@tuvsud/design-system/tree';
import '@tuvsud/design-system/tree-item';

describe('<ts-tree-item>', () => {
    let leafItem: TsTreeItem;
    let parentItem: TsTreeItem;

    beforeEach(async () => {
        leafItem = await fixture(html` <ts-tree-item>Node 1</ts-tree-item> `);
        parentItem = await fixture(html`
            <ts-tree-item>
                Parent Node
                <ts-tree-item>Node 1</ts-tree-item>
                <ts-tree-item>Node 1</ts-tree-item>
            </ts-tree-item>
        `);
    });

    it('should render a component', () => {
        expect(leafItem).to.exist;
        expect(parentItem).to.exist;

        expect(leafItem).to.have.attribute('role', 'treeitem');
        expect(leafItem).to.have.attribute('aria-selected', 'false');
        expect(leafItem).to.have.attribute('aria-disabled', 'false');
    });

    describe('when it contains child tree items', () => {
        it('should set isLeaf to false', () => {
            // Assert
            expect(parentItem.isLeaf).to.be.false;
        });

        it('should show the expand button', () => {
            // Arrange
            const expandButton = parentItem.shadowRoot?.querySelector('.tree-item__expand-button');

            // Act

            // Assert
            expect(expandButton?.childElementCount).to.be.greaterThan(0);
        });

        it('should set the aria-expanded attribute', () => {
            expect(parentItem).to.have.attribute('aria-expanded', 'false');
        });
    });

    describe('when the user clicks the expand button', () => {
        describe('and the item is collapsed', () => {
            it('should emit ts-expand and ts-after-expand events', async () => {
                // Arrange
                const expandSpy = sinon.spy();
                const afterExpandSpy = sinon.spy();

                parentItem.addEventListener('ts-expand', expandSpy);
                parentItem.addEventListener('ts-after-expand', afterExpandSpy);

                // Act
                parentItem.expanded = true;
                await waitUntil(() => expandSpy.calledOnce);
                await waitUntil(() => afterExpandSpy.calledOnce);

                // Assert
                expect(expandSpy).to.have.been.calledOnce;
                expect(afterExpandSpy).to.have.been.calledOnce;
            });
        });

        describe('and the item is expanded', () => {
            it('should emit ts-collapse and ts-after-collapse events', async () => {
                // Arrange
                const collapseSpy = sinon.spy();
                const afterCollapseSpy = sinon.spy();

                parentItem.addEventListener('ts-collapse', collapseSpy);
                parentItem.addEventListener('ts-after-collapse', afterCollapseSpy);

                parentItem.expanded = true;
                await oneEvent(parentItem, 'ts-after-expand');

                // Act
                parentItem.expanded = false;
                await waitUntil(() => collapseSpy.calledOnce);
                await waitUntil(() => afterCollapseSpy.calledOnce);

                // Assert
                expect(collapseSpy).to.have.been.calledOnce;
                expect(afterCollapseSpy).to.have.been.calledOnce;
            });

            describe('and the item is disabled', () => {
                it('should not expand', async () => {
                    // Arrange
                    const expandButton: HTMLElement =
                        parentItem.shadowRoot!.querySelector('.tree-item__expand-button')!;
                    parentItem.disabled = true;

                    // Act
                    expandButton.click();
                    await parentItem.updateComplete;

                    // Assert
                    expect(parentItem).not.to.have.attribute('expanded');
                    expect(parentItem).to.have.attribute('aria-expanded', 'false');
                });
            });
        });
    });

    describe('when the item is selected', () => {
        it('should update the aria-selected attribute', async () => {
            // Act
            leafItem.selected = true;
            await leafItem.updateComplete;

            // Assert
            expect(leafItem).to.have.attribute('aria-selected', 'true');
        });

        it('should set item--selected part', async () => {
            // Act
            leafItem.selected = true;
            await leafItem.updateComplete;

            // Assert
            expect(leafItem.shadowRoot?.querySelector('.tree-item__item')?.part.contains('item--selected')).to.be.true;
        });
    });

    describe('when the item is disabled', () => {
        it('should update the aria-disabled attribute', async () => {
            // Act
            leafItem.disabled = true;
            await leafItem.updateComplete;

            // Assert
            expect(leafItem).to.have.attribute('aria-disabled', 'true');
        });

        it('should set item--disabled part', async () => {
            // Act
            leafItem.disabled = true;
            await leafItem.updateComplete;

            // Assert
            expect(leafItem.shadowRoot?.querySelector('.tree-item__item')?.part.contains('item--disabled')).to.be.true;
        });
    });

    describe('when the item is expanded', () => {
        it('should set item--expanded part', async () => {
            // Act
            leafItem.expanded = true;
            await leafItem.updateComplete;

            // Assert
            expect(leafItem.shadowRoot?.querySelector('.tree-item__item')?.part.contains('item--expanded')).to.be.true;
        });
    });

    describe('when the item is lazy', () => {
        it('should emit ts-lazy-change when the lazy attribute is added and removed', async () => {
            // Arrange
            const lazyChangeSpy = sinon.spy();

            parentItem.addEventListener('ts-lazy-change', lazyChangeSpy);
            parentItem.lazy = true;

            // Act
            await waitUntil(() => lazyChangeSpy.calledOnce);
            parentItem.lazy = false;
            await waitUntil(() => lazyChangeSpy.calledOnce);

            // Assert
            expect(lazyChangeSpy).to.have.been.calledTwice;
        });
    });

    describe('<ts-tree-item> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsTreeItem>(html`<ts-tree-item>Item</ts-tree-item>`);
            const cssText = getCssText(el);

            // Expand button
            expect(cssText).to.include('color: var(--ts-semantic-color-icon-base-default);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-200);');

            // Label
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');
            expect(cssText).to.include('line-height: var(--ts-line-height-200);');

            // Selection
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-subtle-default);');
            expect(cssText).to.include('border-inline-start-color: var(--ts-semantic-color-border-primary-default);');

            // Indentation guides
            expect(cssText).to.include(
                'border-inline-end: var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);',
            );
            expect(cssText).to.include('font-size: calc(1em + var(--indent-size, var(--ts-semantic-size-space-400)));');
        });
    });
});
