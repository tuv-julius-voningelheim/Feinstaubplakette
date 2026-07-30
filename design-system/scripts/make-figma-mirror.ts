import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const outDir = path.resolve('dist-figma');
const outDistDir = path.join(outDir, 'dist');

if (!fs.existsSync(distDir)) {
    console.error(`Missing ${distDir}. Run "npm run build" first.`);
    process.exit(1);
}

const rootPkgPath = path.resolve('package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8')) as Record<string, unknown>;

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// Copy dist/ into dist-figma/dist/
fs.mkdirSync(outDistDir, { recursive: true });
fs.cpSync(distDir, outDistDir, { recursive: true });

const keep = [
    'version',
    'description',
    'keywords',
    'author',
    'license',
    'homepage',
    'repository',
    'bugs',
    'funding',
    'type',
    'main',
    'module',
    'types',
    'exports',
    'sideEffects',
    'files',
    'bin',
    'engines',
    'dependencies',
    'peerDependencies',
    'optionalDependencies',
    'bundledDependencies',
] as const;

const mirrorPkg: Record<string, unknown> = { name: '@tuvsud-figma/design-system' };

for (const key of keep) {
    const value = rootPkg[key];
    if (value !== undefined) mirrorPkg[key] = value;
}

mirrorPkg.private = false;

const publishConfig = (rootPkg.publishConfig ?? {}) as Record<string, unknown>;
mirrorPkg.publishConfig = {
    ...publishConfig,
    registry: 'https://registry.figma.com/npm/47b70d29-1b38-4307-bc23-1c0fda0d77f3/registry/',
};

// Ensure files includes "dist" (in case it doesn’t)
const files = Array.isArray(rootPkg.files) ? (rootPkg.files as unknown[]) : [];
if (!files.includes('dist')) files.unshift('dist');
mirrorPkg.files = files;

fs.writeFileSync(path.join(outDir, 'package.json'), `${JSON.stringify(mirrorPkg, null, 2)}\n`, 'utf8');

for (const file of ['README.md', 'LICENSE', 'LICENSE.md']) {
    const src = path.resolve(file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(outDir, file));
}

console.log(`Created ${outDir}/package.json`);

console.log(`name: ${mirrorPkg.name}`);

console.log(`version: ${mirrorPkg.version}`);
