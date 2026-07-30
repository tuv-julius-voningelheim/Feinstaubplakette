import { transform } from 'lightningcss';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const studioExportStylesDir = path.resolve(rootDir, 'tokens');
const distTokensDir = path.resolve(rootDir, 'dist', 'tokens');

mkdirSync(distTokensDir, { recursive: true });

for (const filename of ['bundle-light.css', 'bundle-dark.css']) {
    const sourcePath = path.resolve(studioExportStylesDir, filename);
    const destPath = path.resolve(distTokensDir, filename);
    const source = readFileSync(sourcePath);

    const { code } = transform({
        filename,
        code: source,
        minify: true,
    });
    writeFileSync(destPath, code);
    console.log(`✓ Minified ${filename} → dist/tokens/${filename}`);
}

const fontsSrc = path.resolve(rootDir, 'dist', 'theme', 'fonts.css');
const fontsSource = readFileSync(fontsSrc);
const { code: fontsMinified } = transform({
    filename: 'fonts.css',
    code: fontsSource,
    minify: true,
});
writeFileSync(fontsSrc, fontsMinified);
console.log('✓ Minified fonts.css');
