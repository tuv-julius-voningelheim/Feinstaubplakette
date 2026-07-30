import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import logo from './tuv-algorithm.svg';

const theme = create({
    base: 'dark',
    brandTitle: 'Algorithm Design System',
    brandImage: logo,
    colorPrimary: '#0046AD',
    /*colorSecondary: '#02ECA6',
    appBg: '#333',
    appContentBg: '#1c1c1c',
    barBg: '#1c1c1c',
    barTextColor: '#fff',
    barSelectedColor: '#0046AD',*/
});

addons.setConfig({
    theme: theme,
});
