/**
 *  This entry file exports all the React wrappers of the components.
 *  It allows importing all React components from a single file.
 *  Used for React projects.
 */

export { TsAccordion } from './components/accordion/react/index.js';
export { TsAccordionItem } from './components/accordion-item/react/index.js';
export { TsAlert } from './components/alert/react/index.js';
export { TsAnimatedImage } from './components/animated-image/react/index.js';
export { TsAnimation } from './components/animation/react/index.js';
export { TsAvatar } from './components/avatar/react/index.js';
export { TsAvatarGroup } from './components/avatar-group/react/index.js';
export { TsBadge } from './components/badge/react/index.js';
export { TsBreadcrumb } from './components/breadcrumb/react/index.js';
export { TsBreadcrumbItem } from './components/breadcrumb-item/react/index.js';
export { TsButton } from './components/button/react/index.js';
export { TsButtonGroup } from './components/button-group/react/index.js';
export { TsCalendarStatic } from './components/calendar-static/react/index.js';
export { TsCard } from './components/card/react/index.js';
export { TsCarousel } from './components/carousel/react/index.js';
export { TsCarouselItem } from './components/carousel-item/react/index.js';
export { TsCheckbox } from './components/checkbox/react/index.js';
export { TsColorPicker } from './components/color-picker/react/index.js';
export { TsCombobox } from './components/combobox/react/index.js';
export { TsCopyButton } from './components/copy-button/react/index.js';
export { TsDatePicker } from './components/date-picker/react/index.js';
export { TsDateRange } from './components/date-range/react/index.js';
export { TsDetails } from './components/details/react/index.js';
export { TsDialog } from './components/dialog/react/index.js';
export { TsDivider } from './components/divider/react/index.js';
export { TsDrawer } from './components/drawer/react/index.js';
export { TsDropdown } from './components/dropdown/react/index.js';
export { TsDropzone } from './components/dropzone/react/index.js';
export { TsFormatBytes } from './components/format-bytes/react/index.js';
export { TsFormatDate } from './components/format-date/react/index.js';
export { TsFormatNumber } from './components/format-number/react/index.js';
export { TsIban } from './components/iban/react/index.js';
export { TsIcon } from './components/icon/react/index.js';
export { TsIconButton } from './components/icon-button/react/index.js';
export { TsImageComparer } from './components/image-comparer/react/index.js';
export { TsInput } from './components/input/react/index.js';
export { TsLink } from './components/link/react/index.js';
export { TsMenu } from './components/menu/react/index.js';
export { TsMenuItem } from './components/menu-item/react/index.js';
export { TsMenuLabel } from './components/menu-label/react/index.js';
export { TsMutationObserver } from './components/mutation-observer/react/index.js';
export { TsOption } from './components/option/react/index.js';
export { TsPagination } from './components/pagination/react/index.js';
export { TsPaginationItem } from './components/pagination-item/react/index.js';
export { TsPopup } from './components/popup/react/index.js';
export { TsProgressBar } from './components/progress-bar/react/index.js';
export { TsProgressRing } from './components/progress-ring/react/index.js';
export { TsQrCode } from './components/qr-code/react/index.js';
export { TsRadio } from './components/radio/react/index.js';
export { TsRadioButton } from './components/radio-button/react/index.js';
export { TsRadioGroup } from './components/radio-group/react/index.js';
export { TsRange } from './components/range/react/index.js';
export { TsRating } from './components/rating/react/index.js';
export { TsRelativeTime } from './components/relative-time/react/index.js';
export { TsResizeObserver } from './components/resize-observer/react/index.js';
export { TsSelect } from './components/select/react/index.js';
export { TsSkeleton } from './components/skeleton/react/index.js';
export { TsSpinner } from './components/spinner/react/index.js';
export { TsSplitPanel } from './components/split-panel/react/index.js';
export { TsStep } from './components/step/react/index.js';
export { TsStepper } from './components/stepper/react/index.js';
export { TsSwitch } from './components/switch/react/index.js';
export { TsTab } from './components/tab/react/index.js';
export { TsTabGroup } from './components/tab-group/react/index.js';
export { TsTabPanel } from './components/tab-panel/react/index.js';
export { TsCell } from './components/table/cell/react/index.js';
export { TsColumn } from './components/table/column/react/index.js';
export { TsTable } from './components/table/react/index.js';
export { TsRow } from './components/table/row/react/index.js';
export { TsTableFooter } from './components/table/table-footer/react/index.js';
export { TsTableHeader } from './components/table/table-header/react/index.js';
export { TsTag } from './components/tag/react/index.js';
export { TsTextarea } from './components/textarea/react/index.js';
export { TsToast } from './components/toast/react/index.js';
export { TsTooltip } from './components/tooltip/react/index.js';
export { TsTree } from './components/tree/react/index.js';
export { TsTreeItem } from './components/tree-item/react/index.js';
export { TsVisuallyHidden } from './components/visually-hidden/react/index.js';

// Utilities
export * from './utils/events/events.js';
export * from './utils/helper/form.js';
export {
    type GoogleMaterialStyle,
    registerGoogleMaterial,
    type RegisterGoogleMaterialOptions,
} from './utils/icon/register-google-material.js';

// Icon library
export { registerIconLibrary, unregisterIconLibrary } from './components/icon/src/library.js';
