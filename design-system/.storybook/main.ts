import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import type { UserConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const useChromatic = process.env.STORYBOOK_CHROMATIC === '1';

const config = {
    stories: [
        '../storybook/documentation/*.mdx',
        '../storybook/foundation/*.mdx',
        '../storybook/components/*/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        '../storybook/examples/*/**/*.mdx',
        '../storybook/examples/*/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],
    staticDirs: [
        { from: '../storybook/assets', to: 'assets' },
        { from: './public', to: '/' },
    ],

    addons: [
        ...(useChromatic ? ['@chromatic-com/storybook'] : []),
        '@storybook/addon-themes',
        '@storybook/addon-docs',
        '@storybook/addon-a11y',
        //'@github-ui/storybook-addon-performance-panel/universal',
        //'@storybook/addon-designs',
    ],
    framework: {
        name: '@storybook/web-components-vite',
        options: {},
    },
    core: {
        disableTelemetry: true,
        builder: '@storybook/builder-vite',
    },
    async viteFinal(config: UserConfig) {
        config.build = config.build ?? {};
        config.build.chunkSizeWarningLimit = 1500;
        config.resolve = config.resolve ?? {};
        config.resolve.alias = {
            ...((config.resolve.alias as Record<string, string>) ?? {}),
            '@storybook/event-logger.js': resolve(__dirname, '../storybook/event-logger.ts'),
            '@storybook/with-label.js': resolve(__dirname, '../storybook/with-label.ts'),
            '@utils': resolve(__dirname, '../utils'),
            '@components': resolve(__dirname, '../components'),
        };
        return config;
    },
};

export default config;
