import minifyHTMLLiterals from '@lit-labs/rollup-plugin-minify-html-literals';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { globby } from 'globby';

// ──────────────────────────────────────────────────────────────────
// Externals — must be provided by the host application.
// ──────────────────────────────────────────────────────────────────
const EXTERNAL = [
    /^lit($|\/)/,
    /^@lit\//,
    /^lit-html($|\/)/,
    /^lit-element($|\/)/,
    /^react($|\/)/,
    /^react-dom($|\/)/,
    /^@shoelace-style\/localize($|\/)/,
    // Plugin peer deps — must be provided by the consumer's build environment
    'vite',
    /^vite-plugin-static-copy($|\/)/,
    'webpack',
    /^copy-webpack-plugin($|\/)/,
    'path',
    'fs',
];

const isExternal = id => EXTERNAL.some(r => (typeof r === 'string' ? id === r : r.test(id)));

// ──────────────────────────────────────────────────────────────────
// Shared plugins
// ──────────────────────────────────────────────────────────────────
const sharedPlugins = [
    resolve({
        exportConditions: ['import', 'module', 'default'],
    }),
    minifyHTMLLiterals(),
    typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
        declarationMap: false,
        sourceMap: false,
        inlineSources: false,
        outputToFilesystem: true,
    }),
    terser({
        module: true,
        compress: {
            passes: 2,
            pure_getters: true,
            unsafe_comps: false,
        },
        format: {
            comments: false,
        },
    }),
];

// ──────────────────────────────────────────────────────────────────
// Build input map
// ──────────────────────────────────────────────────────────────────
async function buildInputs() {
    const componentIndexes = await globby('components/*/index.ts');
    const reactIndexes = await globby('components/*/react/index.ts');

    const inputs = {
        entry: 'entry.ts',
        'entry-react': 'entry-react.ts',
        'utils/helper/form': 'utils/helper/form.ts',
        'utils/icon/vite-plugin': 'utils/icon/vite-plugin.ts',
        'utils/icon/webpack-plugin': 'utils/icon/webpack-plugin.ts',
    };

    for (const file of componentIndexes) {
        inputs[file.replace(/\.ts$/, '')] = file;
    }
    for (const file of reactIndexes) {
        inputs[file.replace(/\.ts$/, '')] = file;
    }

    return inputs;
}

export default async function () {
    const input = await buildInputs();

    return [
        {
            input,
            external: isExternal,
            // Suppress Rollup's default per-file info logs (entry point names, etc.)
            // while still surfacing warnings and errors.
            logLevel: 'warn',
            output: {
                dir: 'dist',
                format: 'es',
                preserveModules: true,
                preserveModulesRoot: '.',
                entryFileNames: '[name].js',
                generatedCode: { constBindings: true },
            },
            plugins: [...sharedPlugins],
            treeshake: {
                moduleSideEffects: id => id.includes('/components/') && id.endsWith('index.ts'),
                propertyReadSideEffects: false,
                unknownGlobalSideEffects: false,
            },
        },
    ];
}
