import CopyPlugin from 'copy-webpack-plugin';
import { createRequire } from 'module';
import path from 'path';

import type { Compiler } from 'webpack';

const require = createRequire(import.meta.url);

const SVG_SRC = '@material-symbols/svg-400';
const DEST = 'icons/material-symbols';

/**
 * Webpack plugin that copies Material Symbols SVG files to the build output,
 * so `registerGoogleMaterial()` works in Angular (webpack-based) production builds.
 *
 * **Usage (custom-webpack.config.ts):**
 * ```ts
 * import { designSystemIconsWebpackPlugin } from '@tuvsud/design-system/webpack';
 *
 * module.exports = {
 *   plugins: [designSystemIconsWebpackPlugin()],
 * };
 * ```
 *
 * @param styles - Icon styles to include. Defaults to `['rounded', 'sharp']`.
 */
export function designSystemIconsWebpackPlugin(styles: ('rounded' | 'sharp' | 'outlined')[] = ['rounded', 'sharp']) {
    return {
        apply(compiler: Compiler) {
            const patterns = styles.map(style => ({
                from: path.join(require.resolve(`${SVG_SRC}/package.json`), '..', style),
                to: path.join(DEST, style),
            }));

            new CopyPlugin({ patterns }).apply(compiler);
        },
    };
}
