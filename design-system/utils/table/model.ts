/**
 * Localization model for `<ts-table>`, `<ts-table-header>` and `<ts-table-footer>`.
 */

export interface TableLangData {
    /** Placeholder text for the search input. */
    searchPlaceholder: string;
    /** Accessible label for the search input (used as aria-label on the native element). */
    searchAriaLabel: string;
    /** Label preceding the page-size selector. */
    pageSizeLabel: string;
    /** Suffix after the page-size selector. */
    pageSizeSuffix: string;
    /** Accessible label for the page-size selector (used as aria-label on the native element). */
    pageSizeAriaLabel: string;
    /**
     * Entries-info template for the footer.
     * Tokens: `{from}`, `{to}`, `{total}`.
     */
    showingEntries: (from: number, to: number, total: number) => string;
    /** Text shown in the body when there is no data. */
    noData: string;
}
