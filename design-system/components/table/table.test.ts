import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import type {
    TsTableColumnDef,
    TsTablePageChangeEvent,
    TsTablePageSizeChangeEvent,
    TsTableRowClickEvent,
    TsTableSortChangeEvent,
} from '@utils/events/events.js';

import type { TsTable } from '@components/table/index.js';
import type { TsRow } from '@components/table/row/index.js';

import '@tuvsud/design-system/table';
import '@tuvsud/design-system/table/table-header';
import '@tuvsud/design-system/table/table-footer';
import '@tuvsud/design-system/table/row';
import '@tuvsud/design-system/table/cell';
import '@tuvsud/design-system/pagination';
import '@tuvsud/design-system/icon';

type Row = { id: number; name: string; group: string; salary: number };

const SAMPLE: Row[] = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: `User ${(i + 1).toString().padStart(2, '0')}`,
    group: ['A', 'B', 'C'][i % 3] as string,
    salary: 1000 * (i + 1),
}));

const COLUMNS: TsTableColumnDef[] = [
    { field: 'id', label: '#', sortable: true },
    { field: 'name', label: 'Name', sortable: true },
    { field: 'group', label: 'Group', sortable: true },
    { field: 'salary', label: 'Salary', sortable: true, align: 'right' },
];

async function mount(extra: Partial<Pick<TsTable, 'pageSize' | 'clickable' | 'striped'>> = {}): Promise<TsTable> {
    const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
    el.columns = COLUMNS as unknown as TsTable['columns'];
    el.data = SAMPLE as unknown as TsTable['data'];
    if (extra.pageSize !== undefined) el.pageSize = extra.pageSize;
    if (extra.clickable !== undefined) el.clickable = extra.clickable;
    if (extra.striped !== undefined) el.striped = extra.striped;
    await aTimeout(0);
    return el;
}

async function mountWithBars(extra: Partial<Pick<TsTable, 'pageSize'>> = {}): Promise<TsTable> {
    const el = await fixture<TsTable>(html`<ts-table show-header show-footer></ts-table>`);
    el.columns = COLUMNS as unknown as TsTable['columns'];
    el.data = SAMPLE as unknown as TsTable['data'];
    if (extra.pageSize !== undefined) el.pageSize = extra.pageSize;
    await aTimeout(0);
    return el;
}

function triggerPageClick(el: TsTable, page: number): void {
    el.shadowRoot!.querySelector('ts-table-footer')!.dispatchEvent(
        new CustomEvent('ts-page-click', { detail: { page }, bubbles: true, composed: true }),
    );
}

describe('<ts-table>', () => {
    describe('rendering', () => {
        it('has sensible property defaults', async () => {
            const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
            await aTimeout(0);
            expect(el.variant).to.equal('primary');
            expect(el.hover).to.be.false;
            expect(el.striped).to.be.false;
            expect(el.bordered).to.be.true;
            expect(el.stickyHeader).to.be.true;
            expect(el.pageSize).to.equal(10);
            expect(el.showHeader).to.be.false;
            expect(el.showFooter).to.be.false;
        });

        it('renders a semantic <table>/<thead>/<tbody> in data mode', async () => {
            const el = await mount();
            const root = el.shadowRoot!;
            const table = root.querySelector('[role="grid"].table');
            expect(table).to.exist;
            expect(table!.querySelector('[role="rowgroup"].header-rows')).to.exist;
            expect(table!.querySelector('[role="rowgroup"].body-rows')).to.exist;
            expect(table!.querySelectorAll('[role="columnheader"]').length).to.equal(COLUMNS.length);
            expect(table!.querySelectorAll('[role="row"]:not(.row--header)').length).to.be.greaterThan(0);
        });

        it('renders a div[role=table] with a <slot> in composition mode', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>cell-a</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('.table--composition')).to.exist;
            expect(el.shadowRoot!.querySelector('.table--composition > slot')).to.exist;
            expect(el.shadowRoot!.querySelector('thead')).to.not.exist;
            expect(el.querySelector('ts-cell')!.textContent).to.contain('cell-a');
        });

        it('detects native mode when a <table> element is slotted', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ada</td>
                            </tr>
                        </tbody>
                    </table>
                </ts-table>
            `);
            await aTimeout(0);
            expect(el.hasAttribute('native')).to.be.true;
            expect(el.shadowRoot!.querySelector('table.table')).to.not.exist;
            expect(el.shadowRoot!.querySelector('.table--composition')).to.not.exist;
        });

        it('reflects header-variant property to the host attribute', async () => {
            const el = await fixture<TsTable>(html`<ts-table header-variant="dark"></ts-table>`);
            await aTimeout(0);
            expect(el.getAttribute('header-variant')).to.equal('dark');
            el.variant = 'light';
            await aTimeout(0);
            expect(el.getAttribute('header-variant')).to.equal('light');
        });

        it('renders the empty-text when data is empty', async () => {
            const el = await fixture<TsTable>(html`<ts-table empty-text="Nothing here"></ts-table>`);
            el.columns = COLUMNS as unknown as TsTable['columns'];
            el.data = [];
            await aTimeout(0);
            const empty = el.shadowRoot!.querySelector('.empty-state');
            expect(empty).to.exist;
            expect(empty!.textContent).to.contain('Nothing here');
        });

        it('exposes aria-sort="none" on all sortable <th> elements', async () => {
            const el = await mount();
            el.shadowRoot!.querySelectorAll('thead th').forEach(th => {
                expect(th.getAttribute('aria-sort')).to.equal('none');
                expect(th.getAttribute('scope')).to.equal('col');
            });
        });

        it('renders a sort button inside each sortable <th>', async () => {
            const el = await mount();
            el.shadowRoot!.querySelectorAll('thead th').forEach(th => {
                expect(th.querySelector('button.sort-button')).to.exist;
            });
        });

        it('does NOT render a sort button on non-sortable columns', async () => {
            const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
            el.columns = [{ field: 'id', label: '#' }] as unknown as TsTable['columns'];
            el.data = SAMPLE.slice(0, 3) as unknown as TsTable['data'];
            await aTimeout(0);
            const th = el.shadowRoot!.querySelector('[role="columnheader"][data-field="id"]')!;
            expect(th.querySelector('button.sort-button')).to.not.exist;
        });
    });

    describe('header and footer visibility', () => {
        it('shows ts-table-header when show-header is true and no custom slot', async () => {
            const el = await mountWithBars();
            expect(el.shadowRoot!.querySelector('ts-table-header')).to.exist;
        });

        it('hides ts-table-header when show-header is false', async () => {
            const el = await mountWithBars();
            el.showHeader = false;
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('ts-table-header')).to.not.exist;
        });

        it('hides ts-table-footer when show-footer is false', async () => {
            const el = await mountWithBars();
            el.showFooter = false;
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('ts-table-footer')).to.not.exist;
        });

        it('replaces ts-table-header with a custom slot="header" element', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table show-header>
                    <div slot="header" id="custom-hdr">My toolbar</div>
                </ts-table>
            `);
            el.columns = COLUMNS as unknown as TsTable['columns'];
            el.data = SAMPLE as unknown as TsTable['data'];
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('ts-table-header')).to.not.exist;
            const headerSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="header"]')!;
            expect(headerSlot).to.exist;
            expect(headerSlot.assignedElements()[0]!.id).to.equal('custom-hdr');
        });

        it('custom slot wins over show-header when both are active', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table show-header>
                    <div slot="header">Override</div>
                </ts-table>
            `);
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('ts-table-header')).to.not.exist;
        });

        it('replaces ts-table-footer with a custom slot="footer" element', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table show-footer>
                    <div slot="footer" id="custom-ftr">My footer</div>
                </ts-table>
            `);
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('ts-table-footer')).to.not.exist;
            const footerSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="footer"]')!;
            expect(footerSlot.assignedElements()[0]!.id).to.equal('custom-ftr');
        });
    });

    describe('pagination', () => {
        it('slices rendered rows to pageSize', async () => {
            const el = await mount({ pageSize: 5 });
            expect(el.shadowRoot!.querySelectorAll('[role="rowgroup"].body-rows > [role="row"].row').length).to.equal(
                5,
            );
        });

        it('passes correct pageCount and total to ts-table-footer', async () => {
            const el = await mountWithBars({ pageSize: 10 });
            const footer = el.shadowRoot!.querySelector('ts-table-footer') as HTMLElement & {
                pageCount: number;
                total: number;
            };
            expect(footer.pageCount).to.equal(3); // ceil(23/10)
            expect(footer.total).to.equal(23);
        });

        it('emits ts-table-page-change when a page button is clicked', async () => {
            const el = await mountWithBars({ pageSize: 5 });
            const handler = sinon.spy();
            el.addEventListener('ts-table-page-change', handler);

            triggerPageClick(el, 2);
            await aTimeout(0);

            expect(handler).to.have.been.calledOnce;
            expect((handler.firstCall.args[0] as TsTablePageChangeEvent).detail.page).to.equal(2);
        });

        it('advances to the correct page after ts-page-click', async () => {
            const el = await mountWithBars({ pageSize: 5 });
            triggerPageClick(el, 2);
            await aTimeout(0);

            const footer = el.shadowRoot!.querySelector('ts-table-footer') as HTMLElement & {
                currentPage: number;
            };
            expect(footer.currentPage).to.equal(2);
        });
    });

    describe('sort', () => {
        it('cycles asc → desc → none when the same column header is clicked three times', async () => {
            const el = await mount();
            const handler = sinon.spy();
            el.addEventListener('ts-table-sort-change', handler);

            const button = el.shadowRoot!.querySelector('[data-field="name"] button.sort-button') as HTMLButtonElement;

            button.click();
            await aTimeout(0);
            button.click();
            await aTimeout(0);
            button.click();
            await aTimeout(0);

            expect(handler.callCount).to.equal(3);
            const dirs = handler.getCalls().map(c => (c.args[0] as TsTableSortChangeEvent).detail.direction);
            expect(dirs).to.deep.equal(['asc', 'desc', 'none']);
        });

        it('updates aria-sort to reflect the current direction', async () => {
            const el = await mount();
            const th = el.shadowRoot!.querySelector('[data-field="name"]')!;
            const button = th.querySelector('button.sort-button') as HTMLButtonElement;

            button.click();
            await aTimeout(0);
            expect(th.getAttribute('aria-sort')).to.equal('ascending');

            button.click();
            await aTimeout(0);
            expect(th.getAttribute('aria-sort')).to.equal('descending');

            button.click();
            await aTimeout(0);
            expect(th.getAttribute('aria-sort')).to.equal('none');
        });

        it('sorts rows ascending by the clicked column', async () => {
            const el = await mount({ pageSize: 23 });
            const button = el.shadowRoot!.querySelector(
                '[data-field="salary"] button.sort-button',
            ) as HTMLButtonElement;
            button.click();
            await aTimeout(0);

            const firstRowCells = el
                .shadowRoot!.querySelectorAll('[role="rowgroup"].body-rows > [role="row"].row')[0]!
                .querySelectorAll('[role="gridcell"].cell');
            expect(firstRowCells[0]!.textContent!.trim()).to.equal('1'); // smallest salary → id=1
        });

        it('sorts rows descending after a second click on the same column', async () => {
            const el = await mount({ pageSize: 23 });
            const button = el.shadowRoot!.querySelector(
                '[data-field="salary"] button.sort-button',
            ) as HTMLButtonElement;
            button.click();
            await aTimeout(0);
            button.click();
            await aTimeout(0);

            const firstRowCells = el
                .shadowRoot!.querySelectorAll('[role="rowgroup"].body-rows > [role="row"].row')[0]!
                .querySelectorAll('[role="gridcell"].cell');
            expect(firstRowCells[0]!.textContent!.trim()).to.equal('23'); // largest salary → id=23
        });

        it('emits ts-table-sort-change with the correct field and direction', async () => {
            const el = await mount();
            const handler = sinon.spy();
            el.addEventListener('ts-table-sort-change', handler);

            (el.shadowRoot!.querySelector('[data-field="group"] button.sort-button') as HTMLButtonElement).click();
            await aTimeout(0);

            const detail = (handler.firstCall.args[0] as TsTableSortChangeEvent).detail;
            expect(detail.field).to.equal('group');
            expect(detail.direction).to.equal('asc');
        });
    });

    describe.skip('page size change', () => {
        it('updates pageSize and resets to page 1', async () => {
            const el = await mountWithBars({ pageSize: 5 });
            const handler = sinon.spy();
            el.addEventListener('ts-table-page-size-change', handler);

            el.shadowRoot!.querySelector('ts-table-header')!.dispatchEvent(
                new CustomEvent('ts-table-page-size-change', {
                    detail: { pageSize: 25 },
                    bubbles: true,
                    composed: true,
                }),
            );
            await aTimeout(0);

            expect(handler).to.have.been.calledOnce;
            expect((handler.firstCall.args[0] as TsTablePageSizeChangeEvent).detail.pageSize).to.equal(25);
            expect(el.pageSize).to.equal(25);
        });
    });

    describe('striped', () => {
        it('adds table--striped class to the native table in data mode', async () => {
            const el = await mount({ striped: true });
            expect(el.shadowRoot!.querySelector('.table--striped')).to.exist;
        });

        it('removes table--striped class when striped is false', async () => {
            const el = await mount({ striped: false });
            expect(el.shadowRoot!.querySelector('.table--striped')).to.not.exist;
        });

        it('sets striped attribute on even body ts-rows in composition mode', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table striped>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 1</ts-cell></ts-row>
                    <ts-row><ts-cell>row 2</ts-cell></ts-row>
                    <ts-row><ts-cell>row 3</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);

            const bodyRows = Array.from(el.querySelectorAll<TsRow>('ts-row:not([header])'));
            expect(bodyRows[0]!.striped).to.be.false;
            expect(bodyRows[1]!.striped).to.be.true;
            expect(bodyRows[2]!.striped).to.be.false;
        });

        it('removes striped attribute from composition rows when striped is toggled off', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table striped>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 1</ts-cell></ts-row>
                    <ts-row><ts-cell>row 2</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            el.striped = false;
            await aTimeout(0);

            Array.from(el.querySelectorAll<TsRow>('ts-row:not([header])')).forEach(r => expect(r.striped).to.be.false);
        });
    });

    describe('clickable rows', () => {
        it('emits ts-table-row-click with rowIndex when a body row is clicked', async () => {
            const el = await mount({ clickable: true });
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);

            (el.shadowRoot!.querySelector('[role="rowgroup"].body-rows > [role="row"].row') as HTMLElement).click();

            expect(handler).to.have.been.calledOnce;
            const detail = (handler.firstCall.args[0] as TsTableRowClickEvent).detail;
            expect(detail.rowIndex).to.equal(0);
        });

        it('applies row--selected class to the clicked row', async () => {
            const el = await mount({ clickable: true });
            const firstRow = el.shadowRoot!.querySelector(
                '[role="rowgroup"].body-rows > [role="row"].row',
            ) as HTMLElement;
            firstRow.click();
            await aTimeout(0);
            expect(firstRow.classList.contains('row--selected')).to.be.true;
        });

        it('deselects the row when clicked a second time', async () => {
            const el = await mount({ clickable: true });
            const firstRow = el.shadowRoot!.querySelector(
                '[role="rowgroup"].body-rows > [role="row"].row',
            ) as HTMLElement;
            firstRow.click();
            await aTimeout(0);
            firstRow.click();
            await aTimeout(0);
            expect(firstRow.classList.contains('row--selected')).to.be.false;
        });

        it('moves row--selected to the newly clicked row', async () => {
            const el = await mount({ clickable: true, pageSize: 23 });
            const rows = el.shadowRoot!.querySelectorAll<HTMLElement>('[role="rowgroup"].body-rows > [role="row"].row');
            rows[0]!.click();
            await aTimeout(0);
            rows[1]!.click();
            await aTimeout(0);
            expect(rows[0]!.classList.contains('row--selected')).to.be.false;
            expect(rows[1]!.classList.contains('row--selected')).to.be.true;
        });

        it('does NOT emit ts-table-row-click when clickable is false', async () => {
            const el = await mount({ clickable: false });
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            (el.shadowRoot!.querySelector('[role="rowgroup"].body-rows > [role="row"].row') as HTMLElement).click();
            expect(handler).to.not.have.been.called;
        });
    });

    describe('custom renderer', () => {
        it('invokes column.render for each cell and renders the returned string', async () => {
            const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
            const render = sinon.spy((row: Record<string, unknown>) => `r-${row['id']}`);
            el.columns = [{ field: 'id', label: '#', render }] as unknown as TsTable['columns'];
            el.data = SAMPLE.slice(0, 3) as unknown as TsTable['data'];
            await aTimeout(0);

            expect(render.callCount).to.equal(3);
            const cells = el.shadowRoot!.querySelectorAll('[role="rowgroup"].body-rows [role="gridcell"].cell');
            expect(cells[0]!.textContent!.trim()).to.equal('r-1');
            expect(cells[1]!.textContent!.trim()).to.equal('r-2');
        });
    });

    // ─── TableDataMixin ────────────────────────────────────────────────────────

    describe('filteredData (TableDataMixin)', () => {
        it('returns all rows when query is empty', async () => {
            const el = await mount({ pageSize: 23 });
            expect(el.shadowRoot!.querySelectorAll('[role="rowgroup"].body-rows > [role="row"].row').length).to.equal(
                23,
            );
        });

        it('filters rows based on search query', async () => {
            const el = await mount({ pageSize: 23 });
            el.shadowRoot!.dispatchEvent(
                new CustomEvent('ts-table-search-change', {
                    detail: { query: 'User 01' },
                    bubbles: true,
                    composed: true,
                }),
            );
            // dispatch handleSearch directly
            (el as unknown as { handleSearch: (e: CustomEvent<{ query: string }>) => void }).handleSearch(
                new CustomEvent('ts-table-search-change', { detail: { query: 'User 01' } }),
            );
            await aTimeout(0);
            expect(
                el.shadowRoot!.querySelectorAll('[role="rowgroup"].body-rows > [role="row"].row').length,
            ).to.be.lessThan(23);
        });

        it('resets to page 1 and emits ts-table-search-change when handleSearch is called', async () => {
            const el = await mountWithBars({ pageSize: 5 });
            triggerPageClick(el, 3);
            await aTimeout(0);

            const handler = sinon.spy();
            el.addEventListener('ts-table-search-change', handler);

            (el as unknown as { handleSearch: (e: CustomEvent<{ query: string }>) => void }).handleSearch(
                new CustomEvent('x', { detail: { query: 'User 01' } }),
            );
            await aTimeout(0);

            expect(handler).to.have.been.calledOnce;
            expect(handler.firstCall.args[0].detail.query).to.equal('User 01');
            // page is reset to 1
            expect(
                (el.shadowRoot!.querySelector('ts-table-footer') as HTMLElement & { currentPage: number }).currentPage,
            ).to.equal(1);
        });
    });

    describe('sortedData null-value branches (TableDataMixin)', () => {
        it('sorts rows with null values to the front in ascending order', async () => {
            const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
            el.columns = [{ field: 'val', label: 'Val', sortable: true }] as unknown as TsTable['columns'];
            el.data = [{ val: 'b' }, { val: null }, { val: 'a' }] as unknown as TsTable['data'];
            await aTimeout(0);

            (el.shadowRoot!.querySelector('[data-field="val"] button.sort-button') as HTMLButtonElement).click();
            await aTimeout(0);

            const cells = el.shadowRoot!.querySelectorAll('[role="rowgroup"].body-rows [role="gridcell"].cell');
            // null sorts first in ascending
            expect(cells[0]!.textContent!.trim()).to.equal('');
        });

        it('sorts rows with null values to the end in descending order', async () => {
            const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
            el.columns = [{ field: 'val', label: 'Val', sortable: true }] as unknown as TsTable['columns'];
            el.data = [{ val: 'b' }, { val: null }, { val: 'a' }] as unknown as TsTable['data'];
            await aTimeout(0);

            const btn = el.shadowRoot!.querySelector('[data-field="val"] button.sort-button') as HTMLButtonElement;
            btn.click();
            await aTimeout(0);
            btn.click();
            await aTimeout(0);

            const cells = el.shadowRoot!.querySelectorAll('[role="rowgroup"].body-rows [role="gridcell"].cell');
            expect(cells[cells.length - 1]!.textContent!.trim()).to.equal('');
        });
    });

    describe('cycleSort else branch (TableDataMixin)', () => {
        it('sets direction to asc when cycling from none on same field', async () => {
            const el = await mount();
            const handler = sinon.spy();
            el.addEventListener('ts-table-sort-change', handler);

            const mixin = el as unknown as {
                cycleSort: (f: string) => void;
                sortField: string | null;
                sortDirection: string;
            };

            // Force state: same field, direction = 'none'
            mixin.sortField = 'name';
            mixin.sortDirection = 'none';
            mixin.cycleSort('name');
            await aTimeout(0);

            // The else branch: sortDirection was 'none' so it cycles to 'asc'
            expect(mixin.sortDirection).to.equal('asc');
            expect(handler).to.have.been.calledOnce;
        });
    });

    describe('handlePageSize (TableDataMixin)', () => {
        it('updates pageSize, resets page and emits ts-table-page-size-change', async () => {
            const el = await mountWithBars({ pageSize: 5 });
            triggerPageClick(el, 3);
            await aTimeout(0);

            const handler = sinon.spy();
            el.addEventListener('ts-table-page-size-change', handler);

            (el as unknown as { handlePageSize: (e: CustomEvent<{ pageSize: number }>) => void }).handlePageSize(
                new CustomEvent('x', { detail: { pageSize: 25 } }),
            );
            await aTimeout(0);

            expect(handler).to.have.been.calledOnce;
            expect(el.pageSize).to.equal(25);
            expect(
                (el.shadowRoot!.querySelector('ts-table-footer') as HTMLElement & { currentPage: number }).currentPage,
            ).to.equal(1);
        });
    });

    describe('handleNavClick (TableDataMixin)', () => {
        it('clamps page to 1 when navigating below 1', async () => {
            const el = await mountWithBars({ pageSize: 5 });
            const handler = sinon.spy();
            el.addEventListener('ts-table-page-change', handler);

            el.shadowRoot!.querySelector('ts-table-footer')!.dispatchEvent(
                new CustomEvent('ts-prev-click', { detail: { page: 0 }, bubbles: true, composed: true }),
            );
            await aTimeout(0);

            expect(handler).to.have.been.calledOnce;
            expect(handler.firstCall.args[0].detail.page).to.equal(1);
        });

        it('clamps page to pageCount when navigating beyond it', async () => {
            const el = await mountWithBars({ pageSize: 5 });
            const handler = sinon.spy();
            el.addEventListener('ts-table-page-change', handler);

            el.shadowRoot!.querySelector('ts-table-footer')!.dispatchEvent(
                new CustomEvent('ts-next-click', { detail: { page: 999 }, bubbles: true, composed: true }),
            );
            await aTimeout(0);

            expect(handler).to.have.been.calledOnce;
            // pageCount = ceil(23/5) = 5
            expect(handler.firstCall.args[0].detail.page).to.equal(5);
        });
    });

    describe('rovingIndex (TableDataMixin)', () => {
        it('returns focusedRowIndex when set', async () => {
            const el = await mount({ clickable: true });
            const mixin = el as unknown as { focusedRowIndex: number | null; rovingIndex: number };
            mixin.focusedRowIndex = 3;
            expect(mixin.rovingIndex).to.equal(3);
        });

        it('returns selectedRowIndex when focusedRowIndex is null', async () => {
            const el = await mount({ clickable: true });
            const mixin = el as unknown as {
                focusedRowIndex: number | null;
                selectedRowIndex: number | null;
                rovingIndex: number;
            };
            mixin.focusedRowIndex = null;
            mixin.selectedRowIndex = 2;
            expect(mixin.rovingIndex).to.equal(2);
        });

        it('returns 0 when both focusedRowIndex and selectedRowIndex are null', async () => {
            const el = await mount({ clickable: true });
            const mixin = el as unknown as {
                focusedRowIndex: number | null;
                selectedRowIndex: number | null;
                rovingIndex: number;
            };
            mixin.focusedRowIndex = null;
            mixin.selectedRowIndex = null;
            expect(mixin.rovingIndex).to.equal(0);
        });
    });

    describe('handleDataRowKeydown (TableDataMixin)', () => {
        async function mountClickable(pageSize = 5): Promise<TsTable> {
            return mount({ clickable: true, pageSize });
        }

        it('ArrowDown moves focus to the next row', async () => {
            const el = await mountClickable();
            const mixin = el as unknown as {
                handleDataRowKeydown: (e: KeyboardEvent, row: Record<string, unknown>, index: number) => void;
                focusedRowIndex: number | null;
            };
            const e = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
            mixin.handleDataRowKeydown(e, {}, 0);
            expect(e.defaultPrevented).to.be.true;
        });

        it('ArrowUp moves focus to the previous row', async () => {
            const el = await mountClickable();
            const mixin = el as unknown as {
                handleDataRowKeydown: (e: KeyboardEvent, row: Record<string, unknown>, index: number) => void;
                focusedRowIndex: number | null;
            };
            const e = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
            mixin.handleDataRowKeydown(e, {}, 2);
            expect(e.defaultPrevented).to.be.true;
        });

        it('Home moves focus to row 0', async () => {
            const el = await mountClickable();
            const mixin = el as unknown as {
                handleDataRowKeydown: (e: KeyboardEvent, row: Record<string, unknown>, index: number) => void;
                focusedRowIndex: number | null;
            };
            const e = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });
            mixin.handleDataRowKeydown(e, {}, 3);
            expect(e.defaultPrevented).to.be.true;
        });

        it('End moves focus to the last row', async () => {
            const el = await mountClickable();
            const mixin = el as unknown as {
                handleDataRowKeydown: (e: KeyboardEvent, row: Record<string, unknown>, index: number) => void;
                focusedRowIndex: number | null;
            };
            const e = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
            mixin.handleDataRowKeydown(e, {}, 0);
            expect(e.defaultPrevented).to.be.true;
        });

        it('Enter triggers row click', async () => {
            const el = await mountClickable();
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            const mixin = el as unknown as {
                handleDataRowKeydown: (e: KeyboardEvent, row: Record<string, unknown>, index: number) => void;
            };
            const e = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
            mixin.handleDataRowKeydown(e, { id: 1 }, 0);
            expect(handler).to.have.been.calledOnce;
        });

        it('Space triggers row click', async () => {
            const el = await mountClickable();
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            const mixin = el as unknown as {
                handleDataRowKeydown: (e: KeyboardEvent, row: Record<string, unknown>, index: number) => void;
            };
            const e = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
            mixin.handleDataRowKeydown(e, { id: 1 }, 0);
            expect(handler).to.have.been.calledOnce;
        });
    });

    describe('column resize (TableDataMixin)', () => {
        it('handleResizeDown sets resizing state and registers window listeners', async () => {
            const el = await mount();
            const mixin = el as unknown as {
                handleResizeDown: (e: PointerEvent, field: string, startWidth: number) => void;
                resizingField: string | null;
                resizeStartX: number;
                resizeStartWidth: number;
            };
            const e = new PointerEvent('pointerdown', { clientX: 100, cancelable: true });
            mixin.handleResizeDown(e, 'name', 120);
            expect(mixin.resizingField).to.equal('name');
            expect(mixin.resizeStartX).to.equal(100);
            expect(mixin.resizeStartWidth).to.equal(120);
        });

        it('handleResizeMove updates columnWidths when resizing', async () => {
            const el = await mount();
            const mixin = el as unknown as {
                handleResizeDown: (e: PointerEvent, field: string, startWidth: number) => void;
                handleResizeMove: (e: PointerEvent) => void;
                columnWidths: Record<string, string>;
                resizingField: string | null;
            };
            mixin.handleResizeDown(new PointerEvent('pointerdown', { clientX: 100, cancelable: true }), 'name', 120);
            mixin.handleResizeMove(new PointerEvent('pointermove', { clientX: 150 }));
            expect(mixin.columnWidths['name']).to.equal('170px');
        });

        it('handleResizeMove does nothing when resizingField is null', async () => {
            const el = await mount();
            const mixin = el as unknown as {
                handleResizeMove: (e: PointerEvent) => void;
                columnWidths: Record<string, string>;
                resizingField: string | null;
            };
            mixin.resizingField = null;
            const before = { ...mixin.columnWidths };
            mixin.handleResizeMove(new PointerEvent('pointermove', { clientX: 200 }));
            expect(mixin.columnWidths).to.deep.equal(before);
        });

        it('handleResizeUp clears resizingField and emits ts-column-resize', async () => {
            const el = await mount();
            const handler = sinon.spy();
            el.addEventListener('ts-column-resize', handler);
            const mixin = el as unknown as {
                handleResizeDown: (e: PointerEvent, field: string, startWidth: number) => void;
                handleResizeMove: (e: PointerEvent) => void;
                handleResizeUp: () => void;
                resizingField: string | null;
            };
            mixin.handleResizeDown(new PointerEvent('pointerdown', { clientX: 100, cancelable: true }), 'name', 120);
            mixin.handleResizeMove(new PointerEvent('pointermove', { clientX: 140 }));
            mixin.handleResizeUp();
            expect(mixin.resizingField).to.be.null;
            expect(handler).to.have.been.calledOnce;
            expect(handler.firstCall.args[0].detail.field).to.equal('name');
        });

        it('handleResizeUp does nothing when resizingField is null', async () => {
            const el = await mount();
            const handler = sinon.spy();
            el.addEventListener('ts-column-resize', handler);
            const mixin = el as unknown as { handleResizeUp: () => void; resizingField: string | null };
            mixin.resizingField = null;
            mixin.handleResizeUp();
            expect(handler).to.not.have.been.called;
        });
    });

    // ─── TableCompositionMixin ─────────────────────────────────────────────────

    describe('handleCompositionRowClick (TableCompositionMixin)', () => {
        async function mountCompositionClickable(): Promise<TsTable> {
            const el = await fixture<TsTable>(html`
                <ts-table clickable>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                    <ts-row><ts-cell>row 1</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            return el;
        }

        it('does nothing when clickable is false', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            const mixin = el as unknown as { handleCompositionRowClick: (e: MouseEvent) => void };
            mixin.handleCompositionRowClick(new MouseEvent('click', { bubbles: true, composed: true }));
            expect(handler).to.not.have.been.called;
        });

        it('emits ts-table-row-click when a ts-row is clicked in composition mode', async () => {
            const el = await mountCompositionClickable();
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);

            const row = el.querySelectorAll<HTMLElement>('ts-row:not([header])')[0]!;
            row.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
            await aTimeout(0);

            expect(handler).to.have.been.calledOnce;
            expect(handler.firstCall.args[0].detail.rowIndex).to.equal(0);
        });

        it('toggles selection off when the same row is clicked twice', async () => {
            const el = await mountCompositionClickable();
            const mixin = el as unknown as {
                handleCompositionRowClick: (e: MouseEvent) => void;
                selectedRowIndex: number | null;
            };

            const row = el.querySelectorAll<HTMLElement>('ts-row:not([header])')[0]!;
            const evt = () => new MouseEvent('click', { bubbles: true, composed: true });

            row.dispatchEvent(evt());
            await aTimeout(0);
            expect(mixin.selectedRowIndex).to.equal(0);

            row.dispatchEvent(evt());
            await aTimeout(0);
            expect(mixin.selectedRowIndex).to.be.null;
        });
    });

    describe('handleCompositionKeydown (TableCompositionMixin)', () => {
        async function mountCompositionClickable(): Promise<TsTable> {
            const el = await fixture<TsTable>(html`
                <ts-table clickable>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                    <ts-row><ts-cell>row 1</ts-cell></ts-row>
                    <ts-row><ts-cell>row 2</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            return el;
        }

        it('does nothing when clickable is false', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const mixin = el as unknown as {
                handleCompositionKeydown: (e: KeyboardEvent) => void;
                focusedRowIndex: number | null;
            };
            mixin.focusedRowIndex = null;
            const e = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
            mixin.handleCompositionKeydown(e);
            expect(e.defaultPrevented).to.be.false;
        });

        it('ArrowDown moves focused composition row down', async () => {
            const el = await mountCompositionClickable();
            const mixin = el as unknown as {
                handleCompositionKeydown: (e: KeyboardEvent) => void;
                focusedRowIndex: number | null;
            };
            mixin.focusedRowIndex = 0;
            const e = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
            mixin.handleCompositionKeydown(e);
            expect(e.defaultPrevented).to.be.true;
        });

        it('ArrowUp moves focused composition row up', async () => {
            const el = await mountCompositionClickable();
            const mixin = el as unknown as {
                handleCompositionKeydown: (e: KeyboardEvent) => void;
                focusedRowIndex: number | null;
            };
            mixin.focusedRowIndex = 2;
            const e = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
            mixin.handleCompositionKeydown(e);
            expect(e.defaultPrevented).to.be.true;
        });

        it('Home moves focused composition row to index 0', async () => {
            const el = await mountCompositionClickable();
            const mixin = el as unknown as { handleCompositionKeydown: (e: KeyboardEvent) => void };
            const e = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });
            mixin.handleCompositionKeydown(e);
            expect(e.defaultPrevented).to.be.true;
        });

        it('End moves focused composition row to last index', async () => {
            const el = await mountCompositionClickable();
            const mixin = el as unknown as { handleCompositionKeydown: (e: KeyboardEvent) => void };
            const e = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
            mixin.handleCompositionKeydown(e);
            expect(e.defaultPrevented).to.be.true;
        });

        it('Enter activates the focused composition row', async () => {
            const el = await mountCompositionClickable();
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            const mixin = el as unknown as {
                handleCompositionKeydown: (e: KeyboardEvent) => void;
                focusedRowIndex: number | null;
            };
            mixin.focusedRowIndex = 0;
            const e = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
            mixin.handleCompositionKeydown(e);
            await aTimeout(0);
            expect(handler).to.have.been.calledOnce;
        });

        it('Space activates the focused composition row', async () => {
            const el = await mountCompositionClickable();
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            const mixin = el as unknown as {
                handleCompositionKeydown: (e: KeyboardEvent) => void;
                focusedRowIndex: number | null;
            };
            mixin.focusedRowIndex = 1;
            const e = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
            mixin.handleCompositionKeydown(e);
            await aTimeout(0);
            expect(handler).to.have.been.calledOnce;
        });
    });

    describe('handleCompositionRowActivate (TableCompositionMixin)', () => {
        it('does nothing for out-of-range index', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table clickable>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            const mixin = el as unknown as { handleCompositionRowActivate: (i: number) => void };
            mixin.handleCompositionRowActivate(-1);
            mixin.handleCompositionRowActivate(99);
            expect(handler).to.not.have.been.called;
        });

        it('toggles selectedRowIndex and emits ts-table-row-click', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table clickable>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            const mixin = el as unknown as {
                handleCompositionRowActivate: (i: number) => void;
                selectedRowIndex: number | null;
            };
            mixin.handleCompositionRowActivate(0);
            await aTimeout(0);
            expect(handler).to.have.been.calledOnce;
            expect(mixin.selectedRowIndex).to.equal(0);

            mixin.handleCompositionRowActivate(0);
            await aTimeout(0);
            expect(mixin.selectedRowIndex).to.be.null;
        });
    });

    describe('handleCompositionFocusIn (TableCompositionMixin)', () => {
        it('does nothing when clickable is false', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const mixin = el as unknown as {
                handleCompositionFocusIn: (e: FocusEvent) => void;
                focusedRowIndex: number | null;
            };
            mixin.focusedRowIndex = null;
            mixin.handleCompositionFocusIn(new FocusEvent('focusin'));
            expect(mixin.focusedRowIndex).to.be.null;
        });
    });

    describe('handleHostFocusOut (TableCompositionMixin)', () => {
        it('does nothing when clickable is false', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const mixin = el as unknown as {
                handleHostFocusOut: (e: FocusEvent) => void;
                focusedRowIndex: number | null;
            };
            mixin.focusedRowIndex = 0;
            mixin.handleHostFocusOut(new FocusEvent('focusout', { relatedTarget: null }));
            // no change because clickable = false
            expect(mixin.focusedRowIndex).to.equal(0);
        });

        it('clears focusedRowIndex when focus leaves the host', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table clickable>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const mixin = el as unknown as {
                handleHostFocusOut: (e: FocusEvent) => void;
                focusedRowIndex: number | null;
            };
            mixin.focusedRowIndex = 1;
            // relatedTarget is null → focus left
            mixin.handleHostFocusOut(new FocusEvent('focusout', { relatedTarget: null }));
            expect(mixin.focusedRowIndex).to.be.null;
        });
    });

    describe('handleNativeTableClick (TableCompositionMixin)', () => {
        it('emits ts-table-row-click when a native tbody row is clicked in native mode', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table clickable>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ada</td>
                            </tr>
                            <tr>
                                <td>Bob</td>
                            </tr>
                        </tbody>
                    </table>
                </ts-table>
            `);
            await aTimeout(0);

            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);

            const tr = el.querySelector('tbody tr') as HTMLTableRowElement;
            tr.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
            await aTimeout(0);

            expect(handler).to.have.been.calledOnce;
            expect(handler.firstCall.args[0].detail.rowIndex).to.equal(0);
        });

        it('does nothing when clickable is false in native mode', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <table>
                        <tbody>
                            <tr>
                                <td>Ada</td>
                            </tr>
                        </tbody>
                    </table>
                </ts-table>
            `);
            await aTimeout(0);
            const handler = sinon.spy();
            el.addEventListener('ts-table-row-click', handler);
            const mixin = el as unknown as { handleNativeTableClick: (e: MouseEvent) => void };
            mixin.handleNativeTableClick(new MouseEvent('click', { bubbles: true, composed: true }));
            expect(handler).to.not.have.been.called;
        });
    });

    describe('isNativeMode / peekSlottedTable (TableCompositionMixin)', () => {
        it('isNativeMode returns true when a <table> is slotted and not in data mode', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <table>
                        <tbody>
                            <tr>
                                <td>cell</td>
                            </tr>
                        </tbody>
                    </table>
                </ts-table>
            `);
            await aTimeout(0);
            const mixin = el as unknown as { isNativeMode: boolean };
            expect(mixin.isNativeMode).to.be.true;
        });

        it('isNativeMode returns false when data mode is active', async () => {
            const el = await mount();
            const mixin = el as unknown as { isNativeMode: boolean };
            expect(mixin.isNativeMode).to.be.false;
        });
    });

    // ─── TableRenderMixin ──────────────────────────────────────────────────────

    describe('loading state (TableRenderMixin)', () => {
        it('renders a loading overlay when loading is true', async () => {
            const el = await fixture<TsTable>(html`<ts-table loading></ts-table>`);
            el.columns = COLUMNS as unknown as TsTable['columns'];
            el.data = SAMPLE as unknown as TsTable['data'];
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('.table-loading-overlay')).to.exist;
        });

        it('does not render loading overlay when loading is false', async () => {
            const el = await mount();
            expect(el.shadowRoot!.querySelector('.table-loading-overlay')).to.not.exist;
        });
    });

    describe('skeleton state (TableRenderMixin)', () => {
        it('renders skeleton rows when skeleton is true in data mode', async () => {
            const el = await fixture<TsTable>(html`<ts-table skeleton skeleton-rows="3"></ts-table>`);
            el.columns = COLUMNS as unknown as TsTable['columns'];
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('.skeleton-row')).to.exist;
            expect(el.shadowRoot!.querySelectorAll('.skeleton-row').length).to.be.greaterThan(0);
        });

        it('renders generic skeleton when skeleton is true and no columns are defined', async () => {
            const el = await fixture<TsTable>(html`<ts-table skeleton skeleton-rows="2"></ts-table>`);
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('.skeleton-row')).to.exist;
        });

        it('renders skeleton with split layout when maxHeight and stickyHeader are set', async () => {
            const el = await fixture<TsTable>(html`<ts-table skeleton skeleton-rows="3" max-height="200"></ts-table>`);
            el.columns = COLUMNS as unknown as TsTable['columns'];
            el.data = SAMPLE as unknown as TsTable['data'];
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('.table-split-wrapper')).to.exist;
            expect(el.shadowRoot!.querySelector('.skeleton-row')).to.exist;
        });
    });

    describe('custom empty slot (TableRenderMixin)', () => {
        it('renders the custom empty slot when provided and data is empty', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <span slot="empty" id="custom-empty">No results found</span>
                </ts-table>
            `);
            el.columns = COLUMNS as unknown as TsTable['columns'];
            el.data = [];
            await aTimeout(0);
            const emptySlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="empty"]');
            expect(emptySlot).to.exist;
            expect(emptySlot!.assignedElements()[0]!.id).to.equal('custom-empty');
        });
    });

    describe('resizable columns (TableRenderMixin)', () => {
        it('renders a resize handle on a resizable column', async () => {
            const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
            el.columns = [
                { field: 'id', label: '#', sortable: true, resizable: true },
            ] as unknown as TsTable['columns'];
            el.data = SAMPLE.slice(0, 2) as unknown as TsTable['data'];
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('.resize-handle')).to.exist;
        });

        it('does not render a resize handle on a non-resizable column', async () => {
            const el = await mount();
            expect(el.shadowRoot!.querySelector('.resize-handle')).to.not.exist;
        });
    });

    describe('split layout with maxHeight (TableRenderMixin)', () => {
        it('renders table-split-wrapper when maxHeight is set and stickyHeader is true', async () => {
            const el = await fixture<TsTable>(html`<ts-table max-height="300"></ts-table>`);
            el.columns = COLUMNS as unknown as TsTable['columns'];
            el.data = SAMPLE as unknown as TsTable['data'];
            await aTimeout(0);
            expect(el.shadowRoot!.querySelector('.table-split-wrapper')).to.exist;
            expect(el.shadowRoot!.querySelector('.table-split-header')).to.exist;
            expect(el.shadowRoot!.querySelector('.table-split-body')).to.exist;
        });

        it('does not render table-split-wrapper when maxHeight is not set', async () => {
            const el = await mount();
            expect(el.shadowRoot!.querySelector('.table-split-wrapper')).to.not.exist;
        });
    });

    describe('caption (TableRenderMixin)', () => {
        it('sets aria-label on the grid when caption is provided', async () => {
            const el = await fixture<TsTable>(html`<ts-table caption="My Table"></ts-table>`);
            el.columns = COLUMNS as unknown as TsTable['columns'];
            el.data = SAMPLE.slice(0, 3) as unknown as TsTable['data'];
            await aTimeout(0);
            const grid = el.shadowRoot!.querySelector('[role="grid"]');
            expect(grid!.getAttribute('aria-label')).to.equal('My Table');
        });
    });

    describe('_gridTemplate (TableDataMixin)', () => {
        it('uses columnWidths override when set', async () => {
            const el = await mount();
            const mixin = el as unknown as {
                columnWidths: Record<string, string>;
                _gridTemplate: string;
            };
            mixin.columnWidths = { id: '80px' };
            expect(mixin._gridTemplate).to.include('80px');
        });

        it('falls back to col.width then minmax when no override is set', async () => {
            const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
            el.columns = [{ field: 'id', label: '#', width: '50px' }] as unknown as TsTable['columns'];
            el.data = [];
            await aTimeout(0);
            const mixin = el as unknown as { _gridTemplate: string };
            expect(mixin._gridTemplate).to.include('50px');
        });
    });

    describe('handleSort via ts-column-sort (TableDataMixin)', () => {
        it('handles ts-column-sort event in composition mode and emits ts-table-sort-change', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table sortable>
                    <ts-row header><ts-column field="a" sortable>A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const handler = sinon.spy();
            el.addEventListener('ts-table-sort-change', handler);

            el.shadowRoot!.querySelector('[role="grid"]')!.dispatchEvent(
                new CustomEvent('ts-column-sort', {
                    detail: { field: 'a', direction: 'asc' },
                    bubbles: true,
                    composed: false,
                }),
            );
            await aTimeout(0);
            expect(handler).to.have.been.calledOnce;
            expect(handler.firstCall.args[0].detail.field).to.equal('a');
        });
    });

    describe('handleSlotChange state transition (TableCompositionMixin)', () => {
        it('resets hasSlottedTable to false when no table is found in slot', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const mixin = el as unknown as {
                handleSlotChange: () => void;
                hasSlottedTable: boolean;
            };
            // Force hasSlottedTable to true while no <table> is actually slotted
            mixin.hasSlottedTable = true;
            mixin.handleSlotChange();
            expect(mixin.hasSlottedTable).to.be.false;
        });
    });

    describe('handleCompositionFocusIn with matching row (TableCompositionMixin)', () => {
        it('sets focusedRowIndex when a row is found in the composedPath', async () => {
            const el = await fixture<TsTable>(html`
                <ts-table clickable>
                    <ts-row header><ts-column field="a">A</ts-column></ts-row>
                    <ts-row><ts-cell>row 0</ts-cell></ts-row>
                    <ts-row><ts-cell>row 1</ts-cell></ts-row>
                </ts-table>
            `);
            await aTimeout(0);
            const mixin = el as unknown as {
                handleCompositionFocusIn: (e: FocusEvent) => void;
                focusedRowIndex: number | null;
                getCompositionBodyRows: () => Element[];
            };
            const rows = mixin.getCompositionBodyRows();
            mixin.focusedRowIndex = null;
            // Fake a FocusEvent whose composedPath includes the second body row
            const fakeEvent = { composedPath: () => [rows[1]!] } as unknown as FocusEvent;
            mixin.handleCompositionFocusIn(fakeEvent);
            expect(mixin.focusedRowIndex).to.equal(1);
        });
    });

    describe('resize handle pointerdown (TableRenderMixin)', () => {
        it('pointerdown on the resize handle element triggers handleResizeDown', async () => {
            const el = await fixture<TsTable>(html`<ts-table></ts-table>`);
            el.columns = [
                { field: 'id', label: '#', sortable: true, resizable: true },
            ] as unknown as TsTable['columns'];
            el.data = SAMPLE.slice(0, 2) as unknown as TsTable['data'];
            await aTimeout(0);

            const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
            expect(handle).to.exist;

            const mixin = el as unknown as { resizingField: string | null };
            handle.dispatchEvent(
                new PointerEvent('pointerdown', { clientX: 100, cancelable: true, bubbles: true, composed: true }),
            );
            expect(mixin.resizingField).to.equal('id');
        });
    });
});
