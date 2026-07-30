import { html } from 'lit';

import type { StoryContext, StoryFn } from 'storybook/internal/types';

import type { Preview } from '@storybook/web-components-vite';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import darkStyles from '../dist/tokens/bundle-dark.css?raw';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import lightStyles from '../dist/tokens/bundle-light.css?raw';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import './global.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import '../dist/theme/fonts.css';
// Pre-import all translations so they self-register with @shoelace-style/localize
import '../utils/translations/ar.js';
import '../utils/translations/cs.js';
import '../utils/translations/da.js';
import '../utils/translations/de-ch.js';
import '../utils/translations/de.js';
import '../utils/translations/en-gb.js';
import '../utils/translations/en.js';
import '../utils/translations/es.js';
import '../utils/translations/fa.js';
import '../utils/translations/fi.js';
import '../utils/translations/fr.js';
import '../utils/translations/he.js';
import '../utils/translations/hr.js';
import '../utils/translations/hu.js';
import '../utils/translations/id.js';
import '../utils/translations/it.js';
import '../utils/translations/ja.js';
import '../utils/translations/nb.js';
import '../utils/translations/nl.js';
import '../utils/translations/nn.js';
import '../utils/translations/pl.js';
import '../utils/translations/pt.js';
import '../utils/translations/ru.js';
import '../utils/translations/sl.js';
import '../utils/translations/sv.js';
import '../utils/translations/tr.js';
import '../utils/translations/uk.js';
import '../utils/translations/zh-cn.js';
import '../utils/translations/zh-tw.js';

type MarkedCSSStyleSheet = CSSStyleSheet & { theme?: boolean };

/** Language metadata used for toolbar display and dir/lang attribute updates. */
/**const LANG_META: Record<string, { title: string; dir: 'ltr' | 'rtl' }> = {
    en: { title: 'English', dir: 'ltr' },
    'en-gb': { title: 'English (GB)', dir: 'ltr' },
    ar: { title: 'العربية', dir: 'rtl' },
    cs: { title: 'Čeština', dir: 'ltr' },
    da: { title: 'Dansk', dir: 'ltr' },
    de: { title: 'Deutsch', dir: 'ltr' },
    'de-ch': { title: 'Deutsch (CH)', dir: 'ltr' },
    es: { title: 'Español', dir: 'ltr' },
    fa: { title: 'فارسی', dir: 'rtl' },
    fi: { title: 'Suomi', dir: 'ltr' },
    fr: { title: 'Français', dir: 'ltr' },
    he: { title: 'עברית', dir: 'rtl' },
    hr: { title: 'Hrvatski', dir: 'ltr' },
    hu: { title: 'Magyar', dir: 'ltr' },
    id: { title: 'Bahasa Indonesia', dir: 'ltr' },
    it: { title: 'Italiano', dir: 'ltr' },
    ja: { title: '日本語', dir: 'ltr' },
    nb: { title: 'Norsk Bokmål', dir: 'ltr' },
    nl: { title: 'Nederlands', dir: 'ltr' },
    nn: { title: 'Norsk Nynorsk', dir: 'ltr' },
    pl: { title: 'Polski', dir: 'ltr' },
    pt: { title: 'Português', dir: 'ltr' },
    ru: { title: 'Русский', dir: 'ltr' },
    sl: { title: 'Slovenščina', dir: 'ltr' },
    sv: { title: 'Svenska', dir: 'ltr' },
    tr: { title: 'Türkçe', dir: 'ltr' },
    uk: { title: 'Українська', dir: 'ltr' },
    'zh-cn': { title: '中文 (简体)', dir: 'ltr' },
    'zh-tw': { title: '中文 (繁體)', dir: 'ltr' },
};**/

const themeStyles = { light: [lightStyles], dark: [darkStyles] };

function setThemeSheet(theme: keyof typeof themeStyles) {
    const sheets = themeStyles[theme].map(str => {
        const s = new CSSStyleSheet() as MarkedCSSStyleSheet;
        s.theme = true;
        s.replaceSync(str);
        return s;
    });
    document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets.filter(s => !(s as MarkedCSSStyleSheet).theme),
        ...sheets,
    ];
}

function applyThemeClass(theme: 'light' | 'dark') {
    const root = document.documentElement;
    root.classList.toggle('ts-theme-light', theme === 'light');
    root.classList.toggle('ts-theme-dark', theme === 'dark');
}

/*const withLang = (story: StoryFn, context: StoryContext) => {
    const lang = ((context.globals.lang as string) || 'en').toLowerCase();
    const meta = LANG_META[lang] ?? LANG_META['en'];
    document.documentElement.lang = lang;
    document.documentElement.dir = meta!.dir;
    return html`${story(context.arg, context)}`;
};
*/

const withTheme = (story: StoryFn, context: StoryContext) => {
    const theme = ((context.parameters.theme || context.globals.theme) as 'light' | 'dark') || 'light';
    setThemeSheet(theme);
    applyThemeClass(theme);
    const storyEl = ((context.canvasElement as HTMLCanvasElement).closest('.docs-story') ||
        (context.canvasElement as HTMLCanvasElement).closest('.sb-show-main')) as HTMLElement;
    if (storyEl) storyEl.style.setProperty('background', theme === 'dark' ? '#333' : '#fff', 'important');
    return html`${story(context.arg, context)}`;
};

const preview: Preview = {
    //decorators: [withTheme, withLang], withLang will activate the lang button in storybook
    decorators: [withTheme],
    globalTypes: {
        theme: {
            name: 'Theme',
            description: 'Global theme for components',
            defaultValue: 'light',
            toolbar: {
                icon: 'contrast',
                items: [
                    { value: 'light', icon: 'circlehollow', title: 'light' },
                    { value: 'dark', icon: 'circle', title: 'dark' },
                ],
            },
        },
        // uncomment to activate the language toolbar button in Storybook
        // lang: {
        //     name: 'Language',
        //     description: 'Global language / locale for components',
        //     defaultValue: 'en',
        //     toolbar: {
        //         icon: 'globe',
        //         items: Object.entries(LANG_META).map(([value, { title }]) => ({ value, title })),
        //         dynamicTitle: true,
        //     },
        // },
    },
    parameters: {
        controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
        storySort: {
            order: [
                'get-started',
                'Foundation',
                ['Best Practices', 'React', 'Themes', 'Typography', 'Icons', 'Localization'],
                'Components',
            ],
        },
        docs: {
            codePanel: true,
            source: {
                type: 'dynamic',
                transform: (src: string) =>
                    src
                        // Remove story layout wrapper divs (not part of component API)
                        .replace(/<div class="sb-story-wrapper">([\s\S]*?)<\/div>/g, (_, inner) =>
                            inner.replace(/^ {4}/gm, '').trim(),
                        )
                        .replace(/<div class="sb-story-wrapper--column">([\s\S]*?)<\/div>/g, (_, inner) =>
                            inner.replace(/^ {4}/gm, '').trim(),
                        )
                        // Remove Lit .property bindings — internal, not HTML
                        .replace(/[ \t]*\.[a-zA-Z][\w]*=\$\{[^}]+}\n?/g, '')
                        // Remove boolean attrs that are false: ?attr="false" or ?attr=""
                        .replace(/[ \t]*\?[\w-]+="(?:false|)"[ \t]*\n?/g, '')
                        // Simplify boolean attrs that are true: attr="" → attr
                        .replace(/([\w-]+)=""/g, '$1')
                        // Remove empty string attrs: attr=""
                        .replace(/[ \t]*[\w-]+=""[ \t]*\n?/g, '')
                        // Remove undefined/nothing attrs
                        .replace(/[ \t]*[\w-]+="undefined"[ \t]*\n?/g, '')
                        // Collapse multiple blank lines into one
                        .replace(/\n(\s*\n){2,}/g, '\n'),
            },
        },
    },
};

export default preview;
