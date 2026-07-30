import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = path.resolve(__dirname, '../dist/components');

let total = 0;

const formatSize = bytes => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(2)} kB` : `${(kb / 1024).toFixed(2)} MB`;
};

const walk = async dir => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(fullPath);
        } else if (entry.name === 'index.js') {
            const stats = await fs.stat(fullPath);
            total += stats.size;
            console.log(`${path.relative('.', fullPath)}: ${formatSize(stats.size)}`);
        }
    }
};

await walk(distPath);
console.log(`\nTotal: ${formatSize(total)}`);
