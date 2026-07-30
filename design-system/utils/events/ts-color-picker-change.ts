export interface TsColorPickerChangeDetail {
    /** The new color value in the active format (hex, rgb, hsl, or hsv). */
    value: string;
}

/** Emitted by ts-color-picker when the color value changes. */
export type TsColorPickerChangeEvent = CustomEvent<TsColorPickerChangeDetail>;

/** Emitted by ts-color-picker on every input interaction (same detail as ts-change). */
export type TsColorPickerInputEvent = CustomEvent<TsColorPickerChangeDetail>;
