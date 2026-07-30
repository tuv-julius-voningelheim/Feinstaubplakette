import { build } from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distComponentsPath = path.resolve(__dirname, '../dist/components');
const tempOutdir = path.resolve(__dirname, '../.size-analysis');

const formatSize = bytes => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(2)} kB` : `${(kb / 1024).toFixed(2)} MB`;
};

const gzipSize = buffer =>
    new Promise((resolve, reject) => {
        zlib.gzip(buffer, (err, result) => {
            if (err) reject(err);
            else resolve(result.length);
        });
    });

const brotliSize = buffer =>
    new Promise((resolve, reject) => {
        zlib.brotliCompress(
            buffer,
            {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            (err, result) => {
                if (err) reject(err);
                else resolve(result.length);
            },
        );
    });

async function exists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function getComponentEntries() {
    const entries = await fs.readdir(distComponentsPath, { withFileTypes: true });
    const result = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const componentName = entry.name;
        const wcEntry = path.join(distComponentsPath, componentName, 'index.js');
        const reactEntry = path.join(distComponentsPath, componentName, 'react', 'index.js');

        if (await exists(wcEntry)) {
            result.push({
                type: 'wc',
                name: componentName,
                entry: wcEntry,
            });
        }

        if (await exists(reactEntry)) {
            result.push({
                type: 'react',
                name: componentName,
                entry: reactEntry,
            });
        }
    }

    return result.sort((a, b) => {
        if (a.name === b.name) return a.type.localeCompare(b.type);
        return a.name.localeCompare(b.name);
    });
}

async function analyzeEntry(item) {
    const outfile = path.join(tempOutdir, item.type, `${item.name}.bundle.js`);

    await fs.mkdir(path.dirname(outfile), { recursive: true });

    const result = await build({
        entryPoints: [item.entry],
        bundle: true,
        minify: true,
        format: 'esm',
        platform: 'browser',
        target: ['es2020'],
        outfile,
        metafile: true,
        treeShaking: true,
        legalComments: 'none',
        sourcemap: false,
        write: true,
        logLevel: 'silent',
    });

    const code = await fs.readFile(outfile);
    const raw = code.length;
    const gzip = await gzipSize(code);
    const brotli = await brotliSize(code);

    const inputs = Object.entries(result.metafile.inputs)
        .map(([file, meta]) => ({
            file,
            bytes: meta.bytes,
        }))
        .sort((a, b) => b.bytes - a.bytes);

    return {
        ...item,
        raw,
        gzip,
        brotli,
        inputs,
    };
}

async function main() {
    await fs.rm(tempOutdir, { recursive: true, force: true });

    const entries = await getComponentEntries();
    const results = [];

    for (const entry of entries) {
        try {
            const analyzed = await analyzeEntry(entry);
            results.push(analyzed);
        } catch (error) {
            results.push({
                ...entry,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    const sortBySize = arr => [...arr].sort((a, b) => (b.brotli ?? 0) - (a.brotli ?? 0));

    const wcResults = sortBySize(results.filter(r => r.type === 'wc'));
    const reactResults = sortBySize(results.filter(r => r.type === 'react'));

    const printGroup = group => {
        for (const item of group) {
            if (item.error) {
                console.log(`${item.type.padEnd(5)} ${item.name.padEnd(24)} ERROR: ${item.error}`);
                continue;
            }

            console.log(
                `${item.type.padEnd(5)} ${item.name.padEnd(24)} raw ${formatSize(item.raw).padStart(10)} | gzip ${formatSize(item.gzip).padStart(10)} | br ${formatSize(item.brotli).padStart(10)}`,
            );
        }
    };

    console.log('\nWeb components (sorted by brotli size, largest first)\n');
    printGroup(wcResults);

    console.log('\nReact wrappers (sorted by brotli size, largest first)\n');
    printGroup(reactResults);

    const toSummaryEntry = r => ({
        type: r.type,
        name: r.name,
        rawBytes: r.raw,
        gzipBytes: r.gzip,
        brotliBytes: r.brotli,
        topInputs: r.inputs.slice(0, 10),
    });

    // summary.json: original order (alphabetical by name, then type)
    const summary = results.filter(r => !r.error).map(toSummaryEntry);

    // sorted-report.json: sorted by brotliBytes descending
    const sortedSummary = [...summary].sort((a, b) => b.brotliBytes - a.brotliBytes);

    const outDir = path.resolve(__dirname, '../.size-analysis');
    await fs.mkdir(outDir, { recursive: true });

    const summaryFile = path.join(outDir, 'summary.json');
    await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2), 'utf8');

    const sortedFile = path.join(outDir, 'sorted-report.json');
    await fs.writeFile(sortedFile, JSON.stringify(sortedSummary, null, 2), 'utf8');

    console.log(`\nSaved alphabetical report to : ${summaryFile}`);
    console.log(`Saved sorted report to       : ${sortedFile}`);
}

await main();
