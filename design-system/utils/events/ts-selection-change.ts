import type { TsTreeItem } from '../../components/tree-item/index.js';

export interface TsSelectionChangeDetail {
    /** The currently selected tree items. */
    selection: TsTreeItem[];
}

export type TsSelectionChangeEvent = CustomEvent<TsSelectionChangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-selection-change': TsSelectionChangeEvent;
    }
}
