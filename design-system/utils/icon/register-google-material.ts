import { registerIconLibrary } from '@components/icon/src/library.js';

export type GoogleMaterialStyle = 'sharp' | 'rounded' | 'outlined';

export interface RegisterGoogleMaterialOptions {
    /**
     * The icon style(s) to register.
     *
     * | Style      | Registered library name(s)              |
     * |------------|-----------------------------------------|
     * | `'rounded'`  | `"material"` *(default)* + `"material-rounden"` |
     * | `'sharp'`| `"material-sharp"`                    |
     * | `'outlined'`| `"material-outlined"`                  |
     *
     * Pass an array to register multiple styles at once.
     *
     * @default ['rounded', 'sharp']
     */
    styles?: GoogleMaterialStyle | GoogleMaterialStyle[];

    /**
     * Base path that contains the `<style>/` directories.
     *
     * The default matches the output produced by `designSystemIconsVitePlugin()` and
     * `designSystemIconsWebpackPlugin`. Override only when you serve icons from a
     * custom location.
     *
     * @default '/icons/material-symbols'
     */
    basePath?: string;
}

/**
 * Maps each style to the library names it should be registered under.
 * `sharp` gets two names: `"material"` (the default short alias) and `"material-rounded"` (explicit).
 */
const LIBRARY_NAMES: Record<GoogleMaterialStyle, string[]> = {
    rounded: ['material', 'material-rounded'],
    sharp: ['material-sharp'],
    outlined: ['material-outlined'],
};

/**
 * Registers one or more Google Material Symbols icon libraries so that
 * `<ts-icon>` / `TsIcon` can resolve icons by name.
 *
 * **Usage (React — call once at your app entry-point):**
 * ```ts
 * import { registerGoogleMaterial } from '@tuvsud/design-system/react';
 *
 * // Register default styles (rounded → "material" + "material-rounded", rounded → "material-sharp"):
 * registerGoogleMaterial();
 *
 * // Register only the sharp style:
 * registerGoogleMaterial({ styles: 'sharp' });
 *
 * // Register all three styles with a custom asset path:
 * registerGoogleMaterial({
 *   styles: ['sharp', 'rounded', 'outlined'],
 *   basePath: '/assets/material-symbols',
 * });
 * ```
 *
 * **Usage (Angular — call once in `main.ts` or `app.config.ts`):**
 * ```ts
 * import { registerGoogleMaterial } from '@tuvsud/design-system';
 *
 * registerGoogleMaterial();
 * ```
 *
 * **Using icons in templates:**
 * ```html
 * <!-- rounded — short alias (default) -->
 * <ts-icon name="home" library="material"></ts-icon>
 *
 * <!-- rounded — explicit name -->
 * <ts-icon name="home" library="material-rounded"></ts-icon>
 *
 * <!-- sharp -->
 * <ts-icon name="home" library="material-sharp"></ts-icon>
 *
 * <!-- outlined (only when registered explicitly) -->
 * <ts-icon name="home" library="material-outlined"></ts-icon>
 *
 * <!-- filled variant: append "-fill" to the icon name -->
 * <ts-icon name="home-fill" library="material"></ts-icon>
 * ```
 */
export function registerGoogleMaterial(options: RegisterGoogleMaterialOptions = {}): void {
    const { basePath = '/icons/material-symbols', styles = ['rounded', 'sharp'] } = options;

    if (typeof window !== 'undefined' && basePath === '/icons/material-symbols') {
        fetch(`${basePath}/rounded/home.svg`, { method: 'HEAD' }).then(r => {
            if (!r.ok)
                console.warn(
                    '[TsIcon] Icons not found at expected path. ' +
                        'Did you add designSystemIconsVitePlugin() / designSystemIconsWebpackPlugin() to your build config?',
                );
        });
    }

    const styleList: GoogleMaterialStyle[] = Array.isArray(styles) ? styles : [styles];

    for (const style of styleList) {
        const libraryNames = LIBRARY_NAMES[style];

        for (const libraryName of libraryNames) {
            registerIconLibrary(libraryName, {
                resolver: name =>
                    // Support filled variant by appending "-fill" to the icon name.
                    // e.g. name="home-fill" → home-fill.svg
                    `${basePath}/${style}/${name}.svg`,
                mutator: svg => svg.setAttribute('fill', 'currentColor'),
            });
        }
    }
}
