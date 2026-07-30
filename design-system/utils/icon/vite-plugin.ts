import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { URL } from 'url';

import type { Plugin, ResolvedConfig } from 'vite';

const require = createRequire(import.meta.url);

const ICONS_DEST = 'icons/material-symbols';
const DEFAULT_SVG_PKG = '@material-symbols/svg-400';

/** Resolves the actual on-disk root of the material-symbols package regardless of hoisting. */
function resolveSvgSrc(pkg: string): string {
    try {
        return path.dirname(require.resolve(`${pkg}/package.json`));
    } catch {
        throw new Error(`[DesignSystem] Cannot find package "${pkg}". Make sure it is installed: npm install ${pkg}`);
    }
}

type Style = 'rounded' | 'sharp' | 'outlined';

// Maps library attribute values to their SVG style folder
const LIBRARY_TO_STYLE: Record<string, Style> = {
    material: 'rounded',
    'material-rounded': 'rounded',
    'material-sharp': 'sharp',
    'material-outlined': 'outlined',
};

// Matches <ts-icon/TsIcon/ts-icon-button/TsIconButton elements (including multiline attributes)
const TS_ICON_RE = /<(?:ts-icon(?:-button)?|TsIcon(?:Button)?)\b([\s\S]*?)(?:\/>|>)/g;
// Group 1: direct string  name="x" or name='x'
// Group 2: JS expression  name={...any expression...}
const NAME_ATTR_RE = /\bname=(?:["']([a-z0-9][a-z0-9_-]*)["']|\{([^}]*)\})/;
const LIBRARY_ATTR_RE = /\blibrary=(?:["']([a-z][a-z0-9-]*)["']|\{([^}]*)\})/;

// Extracts every string literal from a JS expression (ternaries, template literals, etc.)
const STRING_LITERAL_RE = /["'`]([a-z0-9][a-z0-9_-]*)["'`]/g;

function extractValues(match: RegExpExecArray): string[] {
    if (match[1]) return [match[1]];
    if (match[2]) return [...match[2].matchAll(STRING_LITERAL_RE)].map(m => m[1] ?? '').filter(Boolean);
    return [];
}

/**
 * Vite plugin that copies **only the Material Symbols SVGs your app actually uses**
 * to the build output, and serves them in dev mode.
 *
 * During the build it scans all source modules for `<ts-icon>` / `<TsIcon>` / `<ts-icon-button>` /
 * `<TsIconButton>` elements, extracts their `name` and `library` attributes, and emits only
 * the matching SVG files — per style. Icons with `library="system"` are skipped.
 * Styles are auto-detected from the `library` attribute; no manual configuration needed.
 *
 * **Usage (vite.config.ts):**
 * ```ts
 * import { designSystemIconsVitePlugin } from '@tuvsud/design-system/vite';
 *
 * export default defineConfig({
 *   base: '/usermanagement/',   // sub-path deployment — plugin reads this automatically
 *   plugins: [react(), ...designSystemIconsVitePlugin()],
 * });
 * ```
 *
 * The plugin auto-detects Vite's `base` config and mounts the dev middleware at the correct
 * sub-path. You only need to pass `basePath` to `registerGoogleMaterial()` to match:
 * ```ts
 * registerGoogleMaterial({ basePath: '/usermanagement/icons/material-symbols' });
 * ```
 *
 * **Different icon weight:**
 * ```ts
 * designSystemIconsVitePlugin({ package: '@material-symbols/svg-200' })
 * registerGoogleMaterial({ basePath: '/icons/material-symbols', package: '@material-symbols/svg-200' })
 * ```
 *
 * **Dynamic icon names:**
 * ```ts
 * designSystemIconsVitePlugin({ additionalIcons: [{ name: 'home', style: 'rounded' }] })
 * ```
 *
 * @param options.package         - npm package to use. Defaults to `@material-symbols/svg-400`.
 * @param options.additionalIcons - Extra icons for dynamic/runtime names that can't be statically detected.
 */
export function designSystemIconsVitePlugin(
    options: {
        package?: string;
        additionalIcons?: { name: string; style: Style }[];
    } = {},
): Plugin[] {
    const svgPkg = options.package ?? DEFAULT_SVG_PKG;
    const usedIcons = new Map<Style, Set<string>>();
    let resolvedConfig: ResolvedConfig;

    const getOrCreate = (style: Style) => {
        if (!usedIcons.has(style)) usedIcons.set(style, new Set());
        return usedIcons.get(style)!;
    };

    for (const { name, style } of options.additionalIcons ?? []) {
        getOrCreate(style).add(name);
    }

    const buildPlugin: Plugin = {
        name: 'design-system-icons-build',
        enforce: 'pre', // run before JSX/TSX compilation so we see original <TsIcon> tags
        apply: 'build',

        configResolved(config) {
            resolvedConfig = config;
        },

        buildStart() {
            // Reset on every build (watch mode re-runs buildStart)
            usedIcons.clear();
            for (const { name, style } of options.additionalIcons ?? []) {
                getOrCreate(style).add(name);
            }
        },

        transform(code) {
            for (const [, attrs] of code.matchAll(TS_ICON_RE)) {
                if (!attrs) continue;

                const libraryMatch = LIBRARY_ATTR_RE.exec(attrs);
                const libraries = libraryMatch ? extractValues(libraryMatch) : ['material'];

                for (const library of libraries) {
                    const style = LIBRARY_TO_STYLE[library];
                    if (!style) continue; // library="system" or unknown — skip

                    const nameMatch = NAME_ATTR_RE.exec(attrs);
                    if (nameMatch) {
                        for (const iconName of extractValues(nameMatch)) {
                            getOrCreate(style).add(iconName);
                        }
                    }
                }
            }
        },

        generateBundle() {
            if (usedIcons.size === 0) {
                this.warn(
                    '[DesignSystem] No material icon usages detected. If you use dynamic icon names, ' +
                        'pass them via additionalIcons option.',
                );
                return;
            }

            const svgSrc = resolveSvgSrc(svgPkg);
            let emitted = 0;
            for (const [style, names] of usedIcons) {
                for (const iconName of names) {
                    const filePath = path.join(svgSrc, style, `${iconName}.svg`);
                    if (fs.existsSync(filePath)) {
                        this.emitFile({
                            type: 'asset',
                            fileName: `${ICONS_DEST}/${style}/${iconName}.svg`,
                            source: fs.readFileSync(filePath, 'utf-8'),
                        });
                        emitted++;
                    } else {
                        this.warn(
                            `[DesignSystem] Icon not found: ${style}/${iconName}.svg — check the icon name or add it to additionalIcons.`,
                        );
                    }
                }
            }

            const summary = [...usedIcons.entries()].map(([style, names]) => `${names.size} ${style}`).join(', ');
            this.info(`[DesignSystem] Emitted ${emitted} icon SVG(s) (${summary}).`);
        },
    };

    const devPlugin: Plugin = {
        name: 'design-system-icons-dev-serve',
        apply: 'serve',

        configResolved(config) {
            resolvedConfig = config;
        },

        configureServer(server) {
            const svgSrc = resolveSvgSrc(svgPkg);

            // Vite's base is e.g. '/usermanagement/' or '/'.
            // We mount the middleware at: /<base>/icons/material-symbols
            // so that dev requests to /usermanagement/icons/material-symbols/rounded/x.svg work.
            const base = (resolvedConfig?.base ?? '/').replace(/\/$/, ''); // strip trailing slash
            const mountPath = `${base}/${ICONS_DEST}`;

            server.middlewares.use(mountPath, (req, res, next) => {
                // Parse only the pathname to strip query strings, then decode
                const rawPathname = new URL(req.url ?? '/', 'http://localhost').pathname;
                const decoded = decodeURIComponent(rawPathname);

                // Prevent path traversal
                const resolved = path.resolve(svgSrc, decoded.replace(/^\//, ''));
                if (!resolved.startsWith(svgSrc + path.sep) && resolved !== svgSrc) {
                    res.statusCode = 403;
                    res.end();
                    return;
                }

                if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
                    res.setHeader('Content-Type', 'image/svg+xml');
                    fs.createReadStream(resolved).pipe(res);
                } else {
                    next();
                }
            });
        },
    };

    return [buildPlugin, devPlugin];
}
