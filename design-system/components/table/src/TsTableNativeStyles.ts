const nativeModeStyles = /* css */ `
ts-table[native] > table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: auto;
    background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
    font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    color: var(--ts-semantic-color-text-base-default);
}

ts-table[native] {
    overflow-x: auto;
}

ts-table[native] > table > caption {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
}

/* Header cells */
ts-table[native] > table th {
    padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-400, 12px);
    vertical-align: middle;
    height: var(--ts-table-row-height, 40px);
    font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    font-size: var(--ts-font-size-200, 14px);
    font-weight: var(--ts-font-weight-bold, 700);
    letter-spacing: 0.02em;
    text-align: left;
    white-space: nowrap;
    background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
    color: var(--ts-table-header-color, #fff);
    border-bottom: 1px solid var(--ts-table-header-border, var(--ts-semantic-color-border-primary-default));
    user-select: none;
    box-sizing: border-box;
    position: relative;
}

/* Body cells */
ts-table[native] > table td {
    padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-400, 12px);
    vertical-align: middle;
    height: var(--ts-table-row-height, 40px);
    font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    font-size: var(--ts-font-size-200, 14px);
    font-weight: var(--ts-font-weight-regular, 400);
    line-height: var(--ts-line-height-300, 1.5);
    color: var(--ts-semantic-color-text-base-default);
    border-bottom: 1px solid var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
    background: inherit;
    box-sizing: border-box;
}

/* Sticky header */
ts-table[native][sticky-header] > table thead th {
    position: sticky;
    top: 0;
    z-index: 4;
}

ts-table[native][hover] > table tbody tr:hover td {
    background: var(--ts-table-row-hover-bg, var(--ts-semantic-color-background-base-hover));
}

/* Striped */
ts-table[native][striped] > table tbody tr:nth-child(even) td {
    background: var(--ts-table-row-stripe-bg, var(--ts-semantic-color-background-neutral-subtle-default));
}

/* Clickable rows  */
ts-table[native][clickable] > table tbody tr {
    cursor: pointer;
}
ts-table[native][clickable] > table tbody tr:hover td {
    background: var(--ts-table-row-hover-bg, var(--ts-semantic-color-background-base-hover));
}

/* Selected row  */
ts-table[native][clickable] > table tbody tr.ts-table-selected td {
    background: var(--ts-table-row-selected-bg,
        var(--ts-semantic-color-background-primary-subtle-default)) !important;
}

/* Alignment helpers */
ts-table[native] > table th.ts-align-center,
ts-table[native] > table td.ts-align-center { text-align: center; }
ts-table[native] > table th.ts-align-right,
ts-table[native] > table td.ts-align-right  { text-align: right;  }

/* Fixed columns  */
ts-table[native] > table th.ts-fixed-left {
    position: sticky; left: 0; z-index: 5;
    background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
    box-shadow: 1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
}
ts-table[native] > table td.ts-fixed-left {
    position: sticky; left: 0; z-index: 2;
    background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
    box-shadow: 1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
}
ts-table[native] > table th.ts-fixed-right {
    position: sticky; right: 0; z-index: 5;
    background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
    box-shadow: -1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
}
ts-table[native] > table td.ts-fixed-right {
    position: sticky; right: 0; z-index: 2;
    background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
    box-shadow: -1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
}
ts-table[native][sticky-header] > table thead th.ts-fixed-left,
ts-table[native][sticky-header] > table thead th.ts-fixed-right { z-index: 6; }

/* Make wrappers transparent so native elements sit in the real table grid */
ts-row[has-tr]    { display: contents !important; }
ts-column[has-th] { display: contents !important; }
ts-cell[has-td]   { display: contents !important; }

ts-row[has-tr] > tr {
    background: transparent;
}
ts-row[has-tr][header] > tr {
    background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
    color: var(--ts-table-header-color, #fff);
    font-weight: var(--ts-font-weight-bold, 700);
    position: var(--ts-table-header-position, relative);
    top: 0;
    z-index: 4;
}
ts-row[has-tr][fixed='top'] > tr    { position: sticky; top: 0;    z-index: 3; }
ts-row[has-tr][fixed='bottom'] > tr {
    position: sticky; bottom: 0; z-index: 3;
    background: var(--ts-semantic-color-background-base-default);
    border-top: 1px solid var(--ts-semantic-color-border-base-default);
}
ts-row[has-tr][clickable] > tr  { cursor: pointer; }
ts-row[has-tr][selected]  > tr  {
    background: var(--ts-table-row-selected-bg,
        var(--ts-semantic-color-background-primary-subtle-default)) !important;
}

ts-table[hover] ts-row[has-tr]:not([header]) > tr:hover td {
    background: var(--ts-table-row-hover-bg, var(--ts-semantic-color-background-base-hover));
}

ts-column[has-th] > th {
    padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-400, 12px);
    vertical-align: middle;
    height: var(--ts-table-row-height, 40px);
    font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    font-size: var(--ts-font-size-200, 14px);
    font-weight: var(--ts-font-weight-bold, 700);
    letter-spacing: 0.02em;
    text-align: left;
    white-space: nowrap;
    background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
    color: var(--ts-table-header-color, #fff);
    border-bottom: 1px solid var(--ts-table-header-border, var(--ts-semantic-color-border-primary-default));
    user-select: none;
    box-sizing: border-box;
    position: relative;
}
ts-column[has-th][align='center'] > th { text-align: center; }
ts-column[has-th][align='right']  > th { text-align: right;  }
ts-column[has-th][fixed='left']  > th  { position: sticky; left:  0; z-index: 5; }
ts-column[has-th][fixed='right'] > th  { position: sticky; right: 0; z-index: 5; }

ts-cell[has-td] > td {
    padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-400, 12px);
    vertical-align: middle;
    height: var(--ts-table-row-height, 40px);
    font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    font-size: var(--ts-font-size-200, 14px);
    font-weight: var(--ts-font-weight-regular, 400);
    line-height: var(--ts-line-height-300, 1.5);
    color: var(--ts-semantic-color-text-base-default);
    border-bottom: 1px solid var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
    background: inherit;
    box-sizing: border-box;
}
ts-cell[has-td][align='center'] > td { text-align: center; }
ts-cell[has-td][align='right']  > td { text-align: right;  }
ts-cell[has-td][fixed='left']  > td {
    position: sticky; left: 0; z-index: 1;
    background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
    box-shadow: 1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
}
ts-cell[has-td][fixed='right'] > td {
    position: sticky; right: 0; z-index: 1;
    background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
    box-shadow: -1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
}

/* Bordered table without a footer: remove the last row's bottom border to
   avoid a double/thick line where the cell border meets the outer wrapper border. */
ts-table[native][bordered]:not([has-footer]) > table tbody tr:last-child td {
    border-bottom: none;
}
`;

export default nativeModeStyles;
