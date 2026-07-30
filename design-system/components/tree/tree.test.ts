import { aTimeout, expect, fixture, fixtureCleanup, html, triggerBlurFor, triggerFocusFor } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { clickOnElement, getCssText } from '@utils/internal/test.js';

import type { TsTree } from '@components/tree/index.js';
import type { TsTreeItem } from '@components/tree-item/index.js';

import '@tuvsud/design-system/tree';
import '@tuvsud/design-system/tree-item';

const press = async (key: string) => {
    await sendKeys({ press: key });
    await aTimeout(0);
};

const flushAll = async (root: Element) => {
    // eslint-disable-next-line
    const nodes = [root, ...Array.from(root.querySelectorAll('*'))] as any[];
    await Promise.all(
        nodes.map(n => ('updateComplete' in n && n.updateComplete ? n.updateComplete : Promise.resolve())),
    );
};

describe('<ts-tree>', () => {
    let el: TsTree;

    afterEach(() => {
        fixtureCleanup();
    });

    beforeEach(async () => {
        el = await fixture(html`
            <ts-tree>
                <ts-tree-item>Node 1</ts-tree-item>
                <ts-tree-item>Node 2</ts-tree-item>
                <ts-tree-item id="expandable">
                    Parent Node
                    <ts-tree-item>Child Node 1</ts-tree-item>
                    <ts-tree-item>
                        Child Node 2
                        <ts-tree-item>Child Node 2 - 1</ts-tree-item>
                        <ts-tree-item>Child Node 2 - 2</ts-tree-item>
                    </ts-tree-item>
                </ts-tree-item>
                <ts-tree-item>Node 3</ts-tree-item>
            </ts-tree>
        `);
        await flushAll(el);
    });

    it('should render a component', () => {
        expect(el).to.exist;
        expect(el).to.have.attribute('role', 'tree');
        expect(el).to.have.attribute('tabindex', '0');
    });

    it('should pass accessibility tests', async () => {
        await expect(el).to.be.accessible();
    });

    it('should not focus collapsed nodes', async () => {
        const parentNode = el.children[2] as TsTreeItem;
        const childNode = parentNode.children[1] as TsTreeItem;
        childNode.expanded = true;
        parentNode.expanded = false;
        await flushAll(el);
        const focusableItems = el.getFocusableItems();
        expect(focusableItems).to.have.lengthOf(4);
        expect(focusableItems).not.to.include.all.members([childNode, ...childNode.children]);
        expect(focusableItems).not.to.include.all.members([...parentNode.children]);
    });

    describe('when a custom expanded/collapsed icon is provided', () => {
        beforeEach(async () => {
            el = await fixture(html`
                <ts-tree>
                    <div slot="expand-icon"></div>
                    <div slot="collapse-icon"></div>
                    <ts-tree-item>Node 1</ts-tree-item>
                    <ts-tree-item>Node 2</ts-tree-item>
                </ts-tree>
            `);
            await flushAll(el);
        });

        it('should append a clone of the icon in the proper slot of the tree item', async () => {
            await flushAll(el);
            const treeItems = [...el.querySelectorAll('ts-tree-item')];
            treeItems.forEach(treeItem => {
                expect(treeItem.querySelector('div[slot="expand-icon"]')).to.be.ok;
                expect(treeItem.querySelector('div[slot="collapse-icon"]')).to.be.ok;
            });
        });
    });

    describe('Keyboard navigation', () => {
        describe('when ArrowDown is pressed', () => {
            it('should move the focus to the next tree item', async () => {
                el.focus();
                await flushAll(el);
                await press('ArrowDown');
                expect(el).to.have.attribute('tabindex', '-1');
                expect(el.children[0]).to.have.attribute('tabindex', '-1');
                expect(el.children[1]).to.have.attribute('tabindex', '0');
            });
        });

        describe('when ArrowUp is pressed', () => {
            it('should move the focus to the prev tree item', async () => {
                (el.children[1] as HTMLElement).focus();
                await flushAll(el);
                await press('ArrowUp');
                expect(el).to.have.attribute('tabindex', '-1');
                expect(el.children[0]).to.have.attribute('tabindex', '0');
                expect(el.children[1]).to.have.attribute('tabindex', '-1');
            });
        });

        describe('when ArrowRight is pressed', () => {
            describe('and node is a leaf', () => {
                it('should move the focus to the next tree item', async () => {
                    (el.children[0] as HTMLElement).focus();
                    await flushAll(el);
                    await press('ArrowRight');
                    expect(el).to.have.attribute('tabindex', '-1');
                    expect(el.children[0]).to.have.attribute('tabindex', '-1');
                    expect(el.children[1]).to.have.attribute('tabindex', '0');
                });
            });

            describe('and node is collapsed', () => {
                it('should expand the tree item', async () => {
                    const parentNode = el.children[2] as TsTreeItem;
                    parentNode.focus();
                    await flushAll(el);
                    await press('ArrowRight');
                    expect(el).to.have.attribute('tabindex', '-1');
                    expect(parentNode).to.have.attribute('tabindex', '0');
                    expect(parentNode).to.have.attribute('expanded');
                });
            });

            describe('and node is expanded', () => {
                it('should move the focus to the next tree item', async () => {
                    const parentNode = el.children[2] as TsTreeItem;
                    parentNode.expanded = true;
                    parentNode.focus();
                    await flushAll(el);
                    await press('ArrowRight');
                    expect(el).to.have.attribute('tabindex', '-1');
                    expect(parentNode).to.have.attribute('tabindex', '-1');
                    expect(parentNode.children[0]).to.have.attribute('tabindex', '0');
                });
            });
        });

        describe('when ArrowLeft is pressed', () => {
            describe('and node is a leaf', () => {
                it('should move the focus to the prev tree item', async () => {
                    (el.children[1] as HTMLElement).focus();
                    await flushAll(el);
                    await press('ArrowLeft');
                    expect(el).to.have.attribute('tabindex', '-1');
                    expect(el.children[0]).to.have.attribute('tabindex', '0');
                    expect(el.children[1]).to.have.attribute('tabindex', '-1');
                });
            });

            describe('and node is collapsed', () => {
                it('should move the focus to the prev tree item', async () => {
                    (el.children[2] as HTMLElement).focus();
                    await flushAll(el);
                    await press('ArrowLeft');
                    expect(el).to.have.attribute('tabindex', '-1');
                    expect(el.children[1]).to.have.attribute('tabindex', '0');
                    expect(el.children[2]).to.have.attribute('tabindex', '-1');
                });
            });

            describe('and node is expanded', () => {
                it('should collapse the tree item', async () => {
                    const parentNode = el.children[2] as TsTreeItem;
                    parentNode.expanded = true;
                    parentNode.focus();
                    await flushAll(el);
                    await press('ArrowLeft');
                    expect(el).to.have.attribute('tabindex', '-1');
                    expect(parentNode).to.have.attribute('tabindex', '0');
                    expect(parentNode).not.to.have.attribute('expanded');
                });
            });
        });

        describe('when Home is pressed', () => {
            it('should move the focus to the first tree item in the tree', async () => {
                const parentNode = el.children[3] as TsTreeItem;
                parentNode.focus();
                await flushAll(el);
                await press('Home');
                expect(el).to.have.attribute('tabindex', '-1');
                expect(el.children[0]).to.have.attribute('tabindex', '0');
                expect(el.children[3]).to.have.attribute('tabindex', '-1');
            });
        });

        describe('when End is pressed', () => {
            it('should move the focus to the last tree item in the tree', async () => {
                const parentNode = el.children[0] as TsTreeItem;
                parentNode.focus();
                await flushAll(el);
                await press('End');
                expect(el).to.have.attribute('tabindex', '-1');
                expect(el.children[0]).to.have.attribute('tabindex', '-1');
                expect(el.children[3]).to.have.attribute('tabindex', '0');
            });
        });

        describe('when Enter is pressed', () => {
            describe('and selection is "single"', () => {
                it('should select only one tree item', async () => {
                    el.selection = 'single';
                    const node = el.children[1] as TsTreeItem;
                    node.focus();
                    await flushAll(el);
                    await press('Enter');
                    await press('ArrowRight');
                    await press('Enter');
                    expect(el.selectedItems.length).to.eq(1);
                    expect(el.children[2]).to.have.attribute('selected');
                });
            });

            describe('and selection is "leaf"', () => {
                it('should select only one tree item', async () => {
                    el.selection = 'leaf';
                    const node = el.children[0] as TsTreeItem;
                    node.focus();
                    await flushAll(el);
                    await press('Enter');
                    await press('ArrowRight');
                    await press('Enter');
                    expect(el.selectedItems.length).to.eq(1);
                });

                it('should expand/collapse a parent node', async () => {
                    el.selection = 'leaf';
                    const parentNode = el.children[2] as TsTreeItem;
                    parentNode.focus();
                    await flushAll(el);
                    await press('Enter');
                    expect(el).to.have.attribute('tabindex', '-1');
                    expect(el.selectedItems.length).to.eq(0);
                    expect(parentNode).to.have.attribute('expanded');
                });
            });

            describe('and selection is "multiple"', () => {
                it('should toggle the selection on the tree item', async () => {
                    el.selection = 'multiple';
                    const node = el.children[1] as TsTreeItem;
                    node.focus();
                    await flushAll(el);
                    await press('Enter');
                    await press('ArrowRight');
                    await press('Enter');
                    expect(el.selectedItems.length).to.eq(6);
                });
            });
        });

        describe('when Space is pressed', () => {
            describe('and selection is "single"', () => {
                it('should select only one tree item', async () => {
                    el.selection = 'single';
                    const node = el.children[1] as TsTreeItem;
                    node.focus();
                    await flushAll(el);
                    await press('Space');
                    await press('ArrowRight');
                    await press('Space');
                    expect(el.selectedItems.length).to.eq(1);
                });
            });

            describe('and selection is "leaf"', () => {
                it('should select only one tree item', async () => {
                    el.selection = 'leaf';
                    const node = el.children[0] as TsTreeItem;
                    node.focus();
                    await flushAll(el);
                    await press('Space');
                    await press('ArrowRight');
                    await press('Space');
                    expect(el.selectedItems.length).to.eq(1);
                });

                it('should expand/collapse a parent node', async () => {
                    el.selection = 'leaf';
                    const parentNode = el.children[2] as TsTreeItem;
                    parentNode.focus();
                    await flushAll(el);
                    await press('Space');
                    expect(el).to.have.attribute('tabindex', '-1');
                    expect(el.selectedItems.length).to.eq(0);
                    expect(parentNode).to.have.attribute('expanded');
                });
            });

            describe('and selection is "multiple"', () => {
                it('should toggle the selection on the tree item', async () => {
                    el.selection = 'multiple';
                    const node = el.children[0] as TsTreeItem;
                    node.focus();
                    await flushAll(el);
                    await press('Space');
                    await press('ArrowRight');
                    await press('Space');
                    expect(el.selectedItems.length).to.eq(2);
                });
            });
        });
    });

    describe('Interactions', () => {
        describe('when the tree is about to receive the focus', () => {
            it('should set the focus to the last focused item', async () => {
                const node = el.children[1] as TsTreeItem;
                node.focus();
                await flushAll(el);
                triggerBlurFor(node);
                triggerFocusFor(el);
                await aTimeout(0);
                await flushAll(el);
                expect(el).to.have.attribute('tabindex', '-1');
                expect(node).to.have.attribute('tabindex', '0');
            });
        });

        describe('when the user clicks the expand button', () => {
            it('should expand the tree item', async () => {
                el.selection = 'single';
                await flushAll(el);
                const node = el.children[2] as TsTreeItem;
                await node.updateComplete;
                const expandButton: HTMLElement = node.shadowRoot!.querySelector('.tree-item__expand-button')!;
                await clickOnElement(expandButton);
                await flushAll(el);
                expect(node).to.have.attribute('expanded');
            });
        });

        describe('when the user clicks on a tree item', () => {
            describe('and selection is "single"', () => {
                it('should select only one tree item', async () => {
                    el.selection = 'single';
                    const node0 = el.children[0] as TsTreeItem;
                    const node1 = el.children[1] as TsTreeItem;
                    await flushAll(el);
                    await clickOnElement(node0);
                    await flushAll(el);
                    await clickOnElement(node1);
                    await flushAll(el);
                    expect(el.selectedItems.length).to.eq(1);
                });
            });

            describe('and selection is "leaf"', () => {
                it('should select only one tree item', async () => {
                    el.selection = 'leaf';
                    const node0 = el.children[0] as TsTreeItem;
                    const node1 = el.children[1] as TsTreeItem;
                    await flushAll(el);
                    await clickOnElement(node0);
                    await flushAll(el);
                    await clickOnElement(node1);
                    await flushAll(el);
                    expect(el.selectedItems.length).to.eq(1);
                });

                it('should expand/collapse a parent node', async () => {
                    el.selection = 'leaf';
                    const parentNode = el.children[2] as TsTreeItem;
                    await flushAll(el);
                    await clickOnElement(parentNode);
                    await parentNode.updateComplete;
                    expect(el.selectedItems.length).to.eq(0);
                    expect(parentNode).to.have.attribute('expanded');
                });
            });

            describe('and selection is "multiple"', () => {
                it('should toggle the selection on the tree item', async () => {
                    el.selection = 'multiple';
                    const node0 = el.children[0] as TsTreeItem;
                    const node1 = el.children[1] as TsTreeItem;
                    await flushAll(el);
                    await clickOnElement(node0);
                    await flushAll(el);
                    await clickOnElement(node1);
                    await flushAll(el);
                    expect(el.selectedItems.length).to.eq(2);
                });

                it('should select all the child tree items', async () => {
                    el.selection = 'multiple';
                    await flushAll(el);
                    const parentNode = el.children[2] as TsTreeItem;
                    await clickOnElement(parentNode);
                    await flushAll(el);
                    expect(parentNode).to.have.attribute('selected');
                    expect(parentNode.indeterminate).to.be.false;
                    parentNode.getChildrenItems().forEach(child => {
                        expect(child).to.have.attribute('selected');
                    });
                });

                it('should set the indeterminate state to tree items if a child is selected', async () => {
                    el.selection = 'multiple';
                    await flushAll(el);
                    const parentNode = el.children[2] as TsTreeItem;
                    const childNode = parentNode.children[0] as TsTreeItem;
                    parentNode.expanded = true;
                    await parentNode.updateComplete;
                    await aTimeout(300);
                    await clickOnElement(childNode);
                    await flushAll(el);
                    expect(parentNode).not.to.have.attribute('selected');
                    expect(parentNode.indeterminate).to.be.true;
                });
            });
        });

        describe('when selection is "single"', () => {
            describe('and user clicks on same item twice', () => {
                it('should emit `ts-selection-change` event once', async () => {
                    el.selection = 'single';
                    await flushAll(el);
                    const selectedChangeSpy = sinon.spy();
                    el.addEventListener('ts-selection-change', selectedChangeSpy);
                    const node = el.children[0] as TsTreeItem;
                    await clickOnElement(node);
                    await flushAll(el);
                    await clickOnElement(node);
                    await Promise.all([node.updateComplete, el.updateComplete]);
                    expect(selectedChangeSpy).to.have.been.calledOnce;
                    expect(selectedChangeSpy.args[0]![0]).to.deep.include({ detail: { selection: [node] } });
                });
            });
        });
    });

    describe('when selection is "leaf"', () => {
        describe('and user clicks on same leaf item twice', () => {
            it('should emit `ts-selection-change` event once', async () => {
                el.selection = 'leaf';
                await flushAll(el);
                const selectedChangeSpy = sinon.spy();
                el.addEventListener('ts-selection-change', selectedChangeSpy);
                const node = el.children[0] as TsTreeItem;
                await clickOnElement(node);
                await flushAll(el);
                await clickOnElement(node);
                await Promise.all([node.updateComplete, el.updateComplete]);
                expect(selectedChangeSpy).to.have.been.calledOnce;
                expect(selectedChangeSpy.args[0]![0]).to.deep.include({ detail: { selection: [node] } });
            });
        });

        describe('and user clicks on expandable item', () => {
            it('should not emit `ts-selection-change` event', async () => {
                el.selection = 'leaf';
                await flushAll(el);
                const selectedChangeSpy = sinon.spy();
                el.addEventListener('ts-selection-change', selectedChangeSpy);
                const node = el.querySelector<TsTreeItem>('#expandable')!;
                await clickOnElement(node);
                await Promise.all([node.updateComplete, el.updateComplete]);
                expect(selectedChangeSpy).to.not.have.been.called;
            });
        });
    });

    describe('when selection is "multiple"', () => {
        describe('and user clicks on same item twice', () => {
            it('should emit `ts-selection-change` event twice', async () => {
                el.selection = 'multiple';
                await flushAll(el);
                const selectedChangeSpy = sinon.spy();
                el.addEventListener('ts-selection-change', selectedChangeSpy);
                const node = el.children[0] as TsTreeItem;
                await clickOnElement(node);
                await Promise.all([node.updateComplete, el.updateComplete]);
                await clickOnElement(node);
                await Promise.all([node.updateComplete, el.updateComplete]);
                expect(selectedChangeSpy).to.have.been.calledTwice;
                expect(selectedChangeSpy.args[0]![0]).to.deep.include({ detail: { selection: [node] } });
                expect(selectedChangeSpy.args[1]![0]).to.deep.include({ detail: { selection: [] } });
            });
        });
    });

    describe('Checkboxes synchronization', () => {
        describe('when the tree gets initialized', () => {
            describe('and a parent node is selected', () => {
                it('should select all the nested children', async () => {
                    const tree = await fixture<TsTree>(html`
                        <ts-tree selection="multiple">
                            <ts-tree-item selected>
                                Parent Node
                                <ts-tree-item selected>Child Node 1</ts-tree-item>
                                <ts-tree-item>
                                    Child Node 2
                                    <ts-tree-item>Child Node 2 - 1</ts-tree-item>
                                    <ts-tree-item>Child Node 2 - 2</ts-tree-item>
                                </ts-tree-item>
                            </ts-tree-item>
                        </ts-tree>
                    `);
                    const treeItems = Array.from<TsTreeItem>(tree.querySelectorAll('ts-tree-item'));
                    await tree.updateComplete;
                    treeItems.forEach(treeItem => {
                        expect(treeItem).to.have.attribute('selected');
                    });
                });
            });

            describe('and a parent node is not selected', () => {
                describe('and all the children are selected', () => {
                    it('should select the parent node', async () => {
                        const tree = await fixture<TsTree>(html`
                            <ts-tree selection="multiple">
                                <ts-tree-item>
                                    Parent Node
                                    <ts-tree-item selected>Child Node 1</ts-tree-item>
                                    <ts-tree-item selected>
                                        Child Node 2
                                        <ts-tree-item>Child Node 2 - 1</ts-tree-item>
                                        <ts-tree-item>Child Node 2 - 2</ts-tree-item>
                                    </ts-tree-item>
                                </ts-tree-item>
                            </ts-tree>
                        `);
                        const treeItems = Array.from<TsTreeItem>(tree.querySelectorAll('ts-tree-item'));
                        await tree.updateComplete;
                        treeItems.forEach(treeItem => {
                            expect(treeItem).to.have.attribute('selected');
                        });
                        expect(treeItems[0]!.indeterminate).to.be.false;
                    });
                });

                describe('and some of the children are selected', () => {
                    it('should set the parent node to indeterminate state', async () => {
                        const tree = await fixture<TsTree>(html`
                            <ts-tree selection="multiple">
                                <ts-tree-item>
                                    Parent Node
                                    <ts-tree-item selected>Child Node 1</ts-tree-item>
                                    <ts-tree-item>
                                        Child Node 2
                                        <ts-tree-item>Child Node 2 - 1</ts-tree-item>
                                        <ts-tree-item>Child Node 2 - 2</ts-tree-item>
                                    </ts-tree-item>
                                </ts-tree-item>
                            </ts-tree>
                        `);
                        const treeItems = Array.from<TsTreeItem>(tree.querySelectorAll('ts-tree-item'));
                        await tree.updateComplete;
                        expect(treeItems[0]).not.to.have.attribute('selected');
                        expect(treeItems[0]!.indeterminate).to.be.true;
                        expect(treeItems[1]).to.have.attribute('selected');
                        expect(treeItems[2]).not.to.have.attribute('selected');
                        expect(treeItems[3]).not.to.have.attribute('selected');
                        expect(treeItems[4]).not.to.have.attribute('selected');
                    });
                });
            });
        });
    });

    it("Should not render 'null' if it can't find a custom icon", async () => {
        const tree = await fixture<TsTree>(html`
            <ts-tree>
                <ts-tree-item>
                    Item 1
                    <ts-icon name="1-circle" slot="expand-icon"></ts-icon>
                    <ts-tree-item> Item A </ts-tree-item>
                </ts-tree-item>
                <ts-tree-item>
                    Item 2
                    <ts-tree-item>Item A</ts-tree-item>
                    <ts-tree-item>Item B</ts-tree-item>
                </ts-tree-item>
                <ts-tree-item>
                    Item 3
                    <ts-tree-item>Item A</ts-tree-item>
                    <ts-tree-item>Item B</ts-tree-item>
                </ts-tree-item>
            </ts-tree>
        `);
        expect(tree.textContent).to.not.includes('null');
    });

    describe('<ts-tree> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsTree>(html`<ts-tree></ts-tree>`);
            const cssText = getCssText(el);

            // Indent guide variables
            expect(cssText).to.include('--indent-guide-color: var(--ts-semantic-color-border-base-default);');
            expect(cssText).to.include('--indent-size: var(--ts-semantic-size-space-600);');
        });
    });
});
