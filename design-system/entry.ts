/**
 *  This entry file exports all the components of the library.
 *  It allows importing all components from a single file.
 *  Used for Angular projects. Not needed for React.
 */

export { TsAccordion } from './components/accordion/index.js';
export { TsAccordionItem } from './components/accordion-item/index.js';
export { TsAlert } from './components/alert/index.js';
export { TsAnimatedImage } from './components/animated-image/index.js';
export { TsAnimation } from './components/animation/index.js';
export { TsAvatar } from './components/avatar/index.js';
export { TsAvatarGroup } from './components/avatar-group/index.js';
export { TsBadge } from './components/badge/index.js';
export { TsBreadcrumb } from './components/breadcrumb/index.js';
export { TsBreadcrumbItem } from './components/breadcrumb-item/index.js';
export { TsButton } from './components/button/index.js';
export { TsButtonGroup } from './components/button-group/index.js';
export { TsCalendarStatic } from './components/calendar-static/index.js';
export { TsCard } from './components/card/index.js';
export { TsCarousel } from './components/carousel/index.js';
export { TsCarouselItem } from './components/carousel-item/index.js';
export { TsCheckbox } from './components/checkbox/index.js';
export { TsColorPicker } from './components/color-picker/index.js';
export { TsCombobox } from './components/combobox/index.js';
export { TsCopyButton } from './components/copy-button/index.js';
export { TsDatePicker } from './components/date-picker/index.js';
export { TsDateRange } from './components/date-range/index.js';
export { TsDetails } from './components/details/index.js';
export { TsDialog } from './components/dialog/index.js';
export { TsDivider } from './components/divider/index.js';
export { TsDrawer } from './components/drawer/index.js';
export { TsDropdown } from './components/dropdown/index.js';
export { TsDropzone } from './components/dropzone/index.js';
export { TsFormatBytes } from './components/format-bytes/index.js';
export { TsFormatDate } from './components/format-date/index.js';
export { TsFormatNumber } from './components/format-number/index.js';
export { TsIban } from './components/iban/index.js';
export { TsIcon } from './components/icon/index.js';
export { TsIconButton } from './components/icon-button/index.js';
export { TsImageComparer } from './components/image-comparer/index.js';
export { TsInput } from './components/input/index.js';
export { TsLink } from './components/link/index.js';
export { TsMenu } from './components/menu/index.js';
export { TsMenuItem } from './components/menu-item/index.js';
export { TsMenuLabel } from './components/menu-label/index.js';
export { TsMutationObserver } from './components/mutation-observer/index.js';
export { TsOption } from './components/option/index.js';
export { TsPagination } from './components/pagination/index.js';
export { TsPaginationItem } from './components/pagination-item/index.js';
export { TsPopup } from './components/popup/index.js';
export { TsProgressBar } from './components/progress-bar/index.js';
export { TsProgressRing } from './components/progress-ring/index.js';
export { TsQrCode } from './components/qr-code/index.js';
export { TsRadio } from './components/radio/index.js';
export { TsRadioButton } from './components/radio-button/index.js';
export { TsRadioGroup } from './components/radio-group/index.js';
export { TsRange } from './components/range/index.js';
export { TsRating } from './components/rating/index.js';
export { TsRelativeTime } from './components/relative-time/index.js';
export { TsResizeObserver } from './components/resize-observer/index.js';
export { TsSelect } from './components/select/index.js';
export { TsSkeleton } from './components/skeleton/index.js';
export { TsSpinner } from './components/spinner/index.js';
export { TsSplitPanel } from './components/split-panel/index.js';
export { TsStep } from './components/step/index.js';
export { TsStepper } from './components/stepper/index.js';
export { TsSwitch } from './components/switch/index.js';
export { TsTab } from './components/tab/index.js';
export { TsTabGroup } from './components/tab-group/index.js';
export { TsTabPanel } from './components/tab-panel/index.js';
export { TsCell } from './components/table/cell/index.js';
export { TsColumn } from './components/table/column/index.js';
export { TsTable } from './components/table/index.js';
export { TsRow } from './components/table/row/index.js';
export { TsTableFooter } from './components/table/table-footer/index.js';
export { TsTableHeader } from './components/table/table-header/index.js';
export { TsTag } from './components/tag/index.js';
export { TsTextarea } from './components/textarea/index.js';
export { TsToast } from './components/toast/index.js';
export { TsTooltip } from './components/tooltip/index.js';
export { TsTree } from './components/tree/index.js';
export { TsTreeItem } from './components/tree-item/index.js';
export { TsVisuallyHidden } from './components/visually-hidden/index.js';

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
