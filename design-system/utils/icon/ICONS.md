# TÜV SÜD Design System — Icon Guide

## Table of Contents

1. [Overview](#overview)
2. [The Production Problem](#the-production-problem)
3. [How Icons Are Resolved](#how-icons-are-resolved)
4. [Icon Libraries & Styles](#icon-libraries--styles)
5. [Setup by Framework](#setup-by-framework)
    - [React + Vite — default (no sub-path)](#react--vite--default-no-sub-path)
    - [React + Vite — sub-path deployment](#react--vite--sub-path-deployment)
    - [React + Vite — custom icon package](#react--vite--custom-icon-package)
    - [React + Vite — sub-path + custom package](#react--vite--sub-path--custom-package)
    - [Angular (esbuild — default)](#angular-esbuild--default)
    - [Angular (webpack-based)](#angular-webpack-based)
    - [Native JS / No Framework](#native-js--no-framework)
6. [Vite Plugin Options Reference](#vite-plugin-options-reference)
7. [registerGoogleMaterial Options Reference](#registergooglematerial-options-reference)
8. [Static Analysis — What Gets Detected](#static-analysis--what-gets-detected)
9. [additionalIcons — Dynamic Names](#additionalicons--dynamic-names)
10. [Edge Cases & Troubleshooting](#edge-cases--troubleshooting)

---

## Overview

`<ts-icon>` fetches SVG icons at runtime via HTTP. For Material Symbols icons (`library="material"`), the SVG files come from the npm package `@material-symbols/svg-400`, which is installed as a dependency of the design system.

The key requirement: **the SVG files must be physically reachable by the browser at a known HTTP path in every environment** — dev, staging, and production.

---

## The Production Problem

### Why it broke

The old default `basePath` was:

```
/node_modules/@material-symbols/svg-400
```

This accidentally worked in **Vite dev mode only** because Vite's dev server intentionally serves `node_modules/` over HTTP as a convenience.

In **any production build**, `node_modules/` is never copied to the output folder (`dist/`). The browser requested:

```
GET /node_modules/@material-symbols/svg-400/rounded/home.svg
→ 404 Not Found ❌
```

The same problem existed in Angular (both esbuild and webpack).

### The fix

1. The default `basePath` was changed to `/icons/material-symbols`.
2. Framework-specific plugins/config copy the SVG files to that path during the build.
3. The Vite plugin also handles dev mode so the same path works in every environment.

---

## How Icons Are Resolved

```
registerGoogleMaterial({ basePath: '/icons/material-symbols' })
    ↓
<ts-icon name="home" library="material">
    ↓
browser fetches: GET /icons/material-symbols/rounded/home.svg
    ↓
plugin/config already copied that file to dist/ ✅
```

---

## Icon Libraries & Styles

`registerGoogleMaterial()` maps `library` attribute values to SVG style folders:

| `library="..."` attribute | Style folder | Notes                                         |
| ------------------------- | ------------ | --------------------------------------------- |
| `material`                | `rounded/`   | Default — short alias                         |
| `material-rounded`        | `rounded/`   | Explicit alias                                |
| `material-sharp`          | `sharp/`     |                                               |
| `material-outlined`       | `outlined/`  |                                               |
| `system`                  | —            | Built-in inline SVGs, no file fetching needed |

---

## Setup by Framework

### React + Vite — default (no sub-path)

App hosted at `/`. No extra npm packages needed.

**`vite.config.ts`**

```ts
import { designSystemIconsVitePlugin } from '@tuvsud/design-system/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), ...designSystemIconsVitePlugin()],
});
```

**`main.tsx`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial(); // basePath defaults to '/icons/material-symbols'
```

Works in:

- `vite` (dev) ✅
- `vite build` (production) ✅
- `vite preview` ✅

---

### React + Vite — sub-path deployment

App hosted at `/custompath/` (not at root `/`).

The Vite plugin **automatically reads** the `base` config — no extra plugin options needed.

**`vite.config.ts`**

```ts
import { designSystemIconsVitePlugin } from '@tuvsud/design-system/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/custompath/', // ← plugin reads this automatically
    plugins: [react(), ...designSystemIconsVitePlugin()],
});
```

**`main.tsx`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial({
    basePath: '/custompath/icons/material-symbols', // base + /icons/material-symbols
});
```

> **Rule:** `basePath` = Vite `base` (no trailing slash) + `/icons/material-symbols`

---

### React + Vite — custom icon package

Use a lighter-weight icon variant like `@material-symbols/svg-200`.

**Install first:**

```bash
npm install @material-symbols/svg-200
```

**`vite.config.ts`**

```ts
import { designSystemIconsVitePlugin } from '@tuvsud/design-system/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), ...designSystemIconsVitePlugin({ package: '@material-symbols/svg-200' })],
});
```

**`main.tsx`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial(); // basePath stays the same — the output path doesn't change
```

> The `package` option tells the plugin **where to find the SVGs on disk**. The browser-facing path (`/icons/material-symbols`) stays the same regardless of which weight package you use.

---

### React + Vite — sub-path + custom package

**`vite.config.ts`**

```ts
import { designSystemIconsVitePlugin } from '@tuvsud/design-system/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/custompath/',
    plugins: [react(), ...designSystemIconsVitePlugin({ package: '@material-symbols/svg-200' })],
});
```

**`main.tsx`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial({
    basePath: '/custompath/icons/material-symbols',
});
```

---

### Angular (esbuild — default)

Angular's application builder (esbuild) has no plugin API. Use the native `assets` configuration in `angular.json` — **no extra npm package needed**.

**`angular.json`** — add entries inside your build target's `"assets"` array:

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "**/*.svg",
    "input": "node_modules/@material-symbols/svg-400/rounded",
    "output": "icons/material-symbols/rounded"
  },
  {
    "glob": "**/*.svg",
    "input": "node_modules/@material-symbols/svg-400/sharp",
    "output": "icons/material-symbols/sharp"
  }
]
```

Only add the styles you actually use. The `output` path must match the `basePath` in `registerGoogleMaterial()`.

**`main.ts`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system';

registerGoogleMaterial(); // basePath defaults to '/icons/material-symbols'
```

**Sub-path deployment (`angular.json` + `main.ts`):**

```json
{
    "glob": "**/*.svg",
    "input": "node_modules/@material-symbols/svg-400/rounded",
    "output": "icons/material-symbols/rounded"
}
```

```ts
// The output path in angular.json is always relative to the app root.
// Only registerGoogleMaterial needs the full sub-path prefix:
registerGoogleMaterial({
    basePath: '/custompath/icons/material-symbols',
});
```

> ⚠️ **Note:** This copies all ~3,000 SVGs for each configured style. There is no tree-shaking for Angular esbuild. Only include the styles you need.

---

### Angular (webpack-based)

Used when you have `@angular-builders/custom-webpack` configured.

**Install the optional peer dependency:**

```bash
npm install --save-dev copy-webpack-plugin
```

**`custom-webpack.config.ts`**

```ts
import { designSystemIconsWebpackPlugin } from '@tuvsud/design-system/webpack';

module.exports = {
    plugins: [
        designSystemIconsWebpackPlugin(), // copies rounded + sharp by default
    ],
};
```

Pass only the styles you use:

```ts
module.exports = {
    plugins: [designSystemIconsWebpackPlugin(['rounded'])],
};
```

**`main.ts`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system';

registerGoogleMaterial();
```

**Sub-path deployment:**

```ts
// custom-webpack.config.ts — no change needed, output path is always relative
module.exports = {
    plugins: [designSystemIconsWebpackPlugin()],
};

// main.ts
registerGoogleMaterial({
    basePath: '/custompath/icons/material-symbols',
});
```

> ⚠️ **Note:** Copies all SVGs for the configured styles — no tree-shaking.

---

### Native JS / No Framework

**Option A — CDN**

```html
<script type="module">
    import { registerGoogleMaterial } from 'https://cdn.example.com/@tuvsud/design-system/icon-libraries';

    registerGoogleMaterial({
        basePath: 'https://cdn.example.com/icons/material-symbols',
    });
</script>
```

**Option B — self-hosted, copy manually**

```bash
cp -r node_modules/@material-symbols/svg-400/rounded public/icons/material-symbols/rounded
cp -r node_modules/@material-symbols/svg-400/sharp   public/icons/material-symbols/sharp
```

```js
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial(); // default basePath matches
```

---

## Vite Plugin Options Reference

```ts
designSystemIconsVitePlugin({
    // Which @material-symbols package to read SVGs from.
    // Default: '@material-symbols/svg-400'
    package: '@material-symbols/svg-200',

    // Icons that cannot be detected by static analysis (runtime/dynamic names).
    // See "additionalIcons" section below.
    additionalIcons: [
        { name: 'home', style: 'rounded' },
        { name: 'arrow_forward', style: 'sharp' },
    ],
});
```

> **Sub-path deployments:** do NOT pass a `basePath` option to the plugin. Instead, set `base` in your Vite config — the plugin reads it automatically. Only `registerGoogleMaterial({ basePath })` needs to be set manually.

| Option            | Type                               | Default                       | Description                           |
| ----------------- | ---------------------------------- | ----------------------------- | ------------------------------------- |
| `package`         | `string`                           | `'@material-symbols/svg-400'` | npm package to read SVGs from         |
| `additionalIcons` | `{ name: string, style: Style }[]` | `[]`                          | Extra icons for dynamic/runtime names |

---

## registerGoogleMaterial Options Reference

```ts
registerGoogleMaterial({
    // Which styles to register.
    // Default: ['rounded', 'sharp']
    styles: ['rounded', 'sharp', 'outlined'],

    // Base URL where the browser fetches SVGs from.
    // Default: '/icons/material-symbols'
    // For sub-path apps: '<base>/icons/material-symbols'
    // For CDN: 'https://cdn.example.com/icons/material-symbols'
    basePath: '/custompath/icons/material-symbols',
});
```

| Option     | Type               | Default                     | Description              |
| ---------- | ------------------ | --------------------------- | ------------------------ |
| `styles`   | `Style \| Style[]` | `['rounded', 'sharp']`      | Icon styles to register  |
| `basePath` | `string`           | `'/icons/material-symbols'` | Base URL for SVG fetches |

### Quick reference — what `basePath` to use

| Deployment              | Vite `base`      | `registerGoogleMaterial basePath`                  |
| ----------------------- | ---------------- | -------------------------------------------------- |
| Root `/` (default)      | _(not set)_      | `/icons/material-symbols`                          |
| Sub-path `/custompath/` | `'/custompath/'` | `/custompath/icons/material-symbols`               |
| CDN                     | —                | `'https://cdn.example.com/icons/material-symbols'` |

---

## Static Analysis — What Gets Detected

The Vite plugin scans every source file **before JSX/TSX compilation** and extracts icon names from `<ts-icon>`, `<TsIcon>`, `<ts-icon-button>`, and `<TsIconButton>` elements.

### Detected automatically ✅

```tsx
// Plain string attributes
<TsIcon name="home" />
<TsIcon name='search' />

// JSX curly-brace strings — all quote styles
<TsIcon name={"home"} />
<TsIcon name={'search'} />
<TsIcon name={`settings`} />

// Ternary expressions — both values extracted
<TsIcon name={isActive ? 'home' : 'close'} />
<TsIcon name={hasError ? "warning" : "check_circle"} />

// ts-icon-button is also scanned
<TsIconButton name="settings" />
<ts-icon-button name="delete"></ts-icon-button>

// Style auto-detected from library attribute
<TsIcon name="home" library="material" />          // → rounded/home.svg
<TsIcon name="home" library="material-sharp" />    // → sharp/home.svg
<TsIcon name="home" library="material-outlined" /> // → outlined/home.svg
<TsIcon name="home" />                             // → rounded/home.svg (default)

// Icons with digit-prefixed names
<TsIcon name="10k" library="material" />
<TsIcon name="360" library="material" />

// library="system" is intentionally skipped — no file needed
<TsIcon name="x-circle" library="system" />        // skipped ✅
```

### NOT detected — use `additionalIcons` ❌

```tsx
const icon = getIconFromApi();
<TsIcon name={icon} />                   // variable — undetectable

const icon = iconMap[user.role];
<TsIcon name={icon} />                   // object lookup — undetectable

const icon = `${prefix}_arrow`;
<TsIcon name={icon} />                   // interpolated template literal — undetectable

<TsIcon name={props.iconName} />         // prop — undetectable
```

---

## additionalIcons — Dynamic Names

Use `additionalIcons` in the plugin config to ensure icons with dynamic/runtime names are always copied to the build output.

### Basic example

```ts
// vite.config.ts
designSystemIconsVitePlugin({
    additionalIcons: [
        { name: 'home', style: 'rounded' },
        { name: 'settings', style: 'rounded' },
        { name: 'arrow_forward', style: 'sharp' },
    ],
});
```

### Real-world example — status icon map

```tsx
// Component
const STATUS_ICONS = {
    success: 'check_circle',
    error: 'cancel',
    warning: 'warning',
    info: 'info',
};

<TsIcon name={STATUS_ICONS[status]} library="material" />;
```

```ts
// vite.config.ts — list all possible values
designSystemIconsVitePlugin({
    additionalIcons: [
        { name: 'check_circle', style: 'rounded' },
        { name: 'cancel', style: 'rounded' },
        { name: 'warning', style: 'rounded' },
        { name: 'info', style: 'rounded' },
    ],
});
```

### Mixing static detection + additionalIcons

Static analysis and `additionalIcons` stack together. The plugin detects all hardcoded names automatically; you only need to add the dynamic ones:

```ts
designSystemIconsVitePlugin({
    additionalIcons: [
        // Only the icons that can't be statically detected
        { name: 'dynamic_icon_a', style: 'rounded' },
        { name: 'dynamic_icon_b', style: 'rounded' },
    ],
});
```

---

## Edge Cases & Troubleshooting

### Runtime warning in console

```
[TsIcon] Icons not found at expected path.
Did you add designSystemIconsVitePlugin() / designSystemIconsWebpackPlugin() to your build config?
```

This means either:

- The plugin is missing from `vite.config.ts` / `custom-webpack.config.ts`
- The `basePath` in `registerGoogleMaterial()` doesn't match where the SVGs were copied
- For Angular esbuild: the `angular.json` assets entry is missing

---

### Build log: "Emitted 0 icon SVG(s)"

```
[DesignSystem] No material icon usages detected.
```

All icon names are dynamic. Add them via `additionalIcons`.

---

### Build log: "Emitted N icon SVG(s)" but icons still 404 in production

The plugin copied the files, but `registerGoogleMaterial({ basePath })` points to the wrong URL. Make sure:

```
basePath = Vite base (no trailing slash) + '/icons/material-symbols'
```

Example for app at `/custompath/`:

```ts
registerGoogleMaterial({ basePath: '/custompath/icons/material-symbols' });
```

---

### Only some icons detected (not all)

The plugin uses static analysis — it can only detect **hardcoded string names**. Icons with variable names like `name={iconName}` are invisible to the plugin. Use `additionalIcons` for those.

---

### `vite preview`

`vite preview` serves the `dist/` folder. Since the plugin copies SVGs into `dist/` during the build, icons work with no extra config.

---

### SSR / Server-Side Rendering

`registerGoogleMaterial()` is safe to call in Node.js — the runtime path warning is guarded with `typeof window !== 'undefined'`. No special SSR handling needed.

---

### Monorepo

Each app configures the plugin independently in its own `vite.config.ts` or `angular.json`. The default `basePath` in `registerGoogleMaterial()` is consistent across all apps — only override it for sub-path deployments.

---

## Overview

`<ts-icon>` fetches SVG icons at runtime via HTTP. For Material Symbols icons (`library="material"`), the SVG files come from the npm package `@material-symbols/svg-400`, which is installed as a dependency.

The key requirement: **the SVG files must be physically reachable by the browser at a known HTTP path in every environment** — dev, staging, and production.

---

## The Production Problem

### Why it broke

The old default `basePath` was:

```
/node_modules/@material-symbols/svg-400
```

This accidentally worked in **Vite dev mode only** because Vite's dev server intentionally serves `node_modules/` over HTTP as a convenience.

In **any production build**, `node_modules/` is never copied to the output folder (`dist/`). The browser requested:

```
GET /node_modules/@material-symbols/svg-400/rounded/home.svg
→ 404 Not Found ❌
```

The same problem existed in Angular (both esbuild and webpack).

### The fix

1. The default `basePath` was changed to `/icons/material-symbols`.
2. Framework-specific plugins/config copy the SVG files to that path during the build.
3. The Vite plugin also handles dev mode so the same path works everywhere.

---

## How Icons Are Resolved

```
registerGoogleMaterial()
    ↓
registers basePath = '/icons/material-symbols'
    ↓
<ts-icon name="home" library="material">
    ↓
browser fetches: GET /icons/material-symbols/rounded/home.svg
     ↓
plugin/config already copied that file to dist/ ✅
```

---

## Icon Libraries & Styles

`registerGoogleMaterial()` maps library names to SVG style folders:

| `library="..."` attribute | Style folder | Notes                                         |
| ------------------------- | ------------ | --------------------------------------------- |
| `material`                | `rounded/`   | Default — short alias                         |
| `material-rounded`        | `rounded/`   | Explicit alias                                |
| `material-sharp`          | `sharp/`     |                                               |
| `material-outlined`       | `outlined/`  |                                               |
| `system`                  | —            | Built-in inline SVGs, no file fetching needed |

### Call `registerGoogleMaterial()` once at your app entry point

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

// Default — registers rounded and sharp
registerGoogleMaterial();

// Only rounded
registerGoogleMaterial({ styles: 'rounded' });

// All styles
registerGoogleMaterial({ styles: ['rounded', 'sharp', 'outlined'] });

// Custom basePath — e.g. app deployed at a sub-path
registerGoogleMaterial({ basePath: '/usermanagement/icons/material-symbols' });

// CDN
registerGoogleMaterial({ basePath: 'https://cdn.example.com/icons/material-symbols' });
```

---

## Setup by Framework

### React + Vite

No extra dependencies needed — the plugin is built into the design system.

**`vite.config.ts`**

```ts
import { designSystemIconsVitePlugin } from '@tuvsud/design-system/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), ...designSystemIconsVitePlugin()],
});
```

**`main.tsx`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial();
```

#### How the Vite plugin works

- **Dev mode**: a middleware intercepts requests to `/icons/material-symbols/...` and serves SVGs directly from `node_modules/` on the fly — no copying, instant.
- **Build mode**: scans all source files for `<ts-icon>`, `<TsIcon>`, `<ts-icon-button>`, `<TsIconButton>` elements, detects which icon names and styles are actually used, and emits **only those SVG files** into `dist/icons/material-symbols/<style>/`.

Example build log:

```
[DesignSystem] Emitted 12 icon SVG(s) (8 rounded, 4 sharp).
```

---

### Angular (esbuild — default)

Angular's application builder (esbuild) has no plugin API. Use the native `assets` configuration in `angular.json`.

**No extra npm package needed.**

**`angular.json`** — add entries inside your build target's `"assets"` array:

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
     "glob": "**/*.svg",
     "input": "node_modules/@material-symbols/svg-400/rounded",
     "output": "icons/material-symbols/rounded"
  }
]
```

Only add the styles you actually use. Add a second entry for `sharp` if you use `library="material-sharp"`.

**`main.ts`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial();
```

> ⚠️ **Note:** This copies all ~3,000 SVGs for the configured style. There is no tree-shaking for Angular esbuild builds. Only include the styles you need.

---

### Angular (webpack-based)

Used when you have `@angular-builders/custom-webpack` configured.

**Install the optional peer dependency:**

```bash
npm install --save-dev copy-webpack-plugin
```

**`custom-webpack.config.ts`**

```ts
import { designSystemIconsWebpackPlugin } from '@tuvsud/design-system/webpack';

module.exports = {
    plugins: [
        designSystemIconsWebpackPlugin(['rounded']), // only styles you use
    ],
};
```

**`main.ts`**

```ts
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial();
```

> ⚠️ **Note:** Same as Angular esbuild — copies all SVGs for the configured styles. Only pass what you need.

---

### Native JS / No Framework

**Option A — CDN**

```html
<script type="module">
    import { registerGoogleMaterial } from 'https://cdn.example.com/@tuvsud/design-system/icon-libraries';

    registerGoogleMaterial({
        basePath: 'https://cdn.example.com/material-symbols',
    });
</script>
```

**Option B — self-hosted**

Copy the SVG folders manually to your server's public directory:

```bash
cp -r node_modules/@material-symbols/svg-400/rounded public/icons/material-symbols/rounded
```

```js
import { registerGoogleMaterial } from '@tuvsud/design-system/icon-libraries';

registerGoogleMaterial(); // default basePath matches
```

---

## Vite Plugin Options

```ts
designSystemIconsVitePlugin({
    // Which @material-symbols package to use.
    // Default: '@material-symbols/svg-400'
    // Use '@material-symbols/svg-200' for lighter weight icons.
    package: '@material-symbols/svg-400',

    // Must match the basePath passed to registerGoogleMaterial().
    // Only needed if your app is deployed at a sub-path.
    // Default: '/icons/material-symbols'
    basePath: '/usermanagement/icons/material-symbols',

    // Icons that cannot be detected by static analysis (runtime/dynamic names).
    additionalIcons: [
        { name: 'home', style: 'rounded' },
        { name: 'arrow_forward', style: 'sharp' },
    ],
});
```

### Using `svg-200`

```bash
npm install @material-symbols/svg-200
```

```ts
// vite.config.ts
designSystemIconsVitePlugin({ package: '@material-symbols/svg-200' });

// main.tsx — no change needed
registerGoogleMaterial();
```

### Sub-path deployment

```ts
// vite.config.ts
designSystemIconsVitePlugin({
    basePath: '/usermanagement/icons/material-symbols',
});

// main.tsx
registerGoogleMaterial({
    basePath: '/usermanagement/icons/material-symbols',
});
```

Both `basePath` values must match.

---

## Static Analysis — What Gets Detected

The Vite plugin scans every source file **before JSX compilation** and detects icon names from `<ts-icon>`, `<TsIcon>`, `<ts-icon-button>`, and `<TsIconButton>` elements.

### Detected automatically ✅

```tsx
// String literals — all quote styles
<TsIcon name="home" />
<TsIcon name='home' />
<TsIcon name={"home"} />
<TsIcon name={'home'} />
<TsIcon name={`home`} />

// Ternary expressions — both values are extracted
<TsIcon name={isActive ? 'home' : 'close'} />
<TsIcon name={hasError ? "warning" : "check_circle"} />

// ts-icon-button also scanned
<TsIconButton name="settings" />
<ts-icon-button name="delete"></ts-icon-button>

// Style auto-detected from library attribute
<TsIcon name="home" library="material" />         // → rounded/home.svg
<TsIcon name="home" library="material-sharp" />   // → sharp/home.svg
<TsIcon name="home" />                            // → rounded/home.svg (default)

// library="system" is skipped — no file needed
<TsIcon name="x-circle" library="system" />       // ❌ skipped (correct)
```

### NOT detected — use `additionalIcons` ❌

```tsx
// Runtime variable
const icon = getIconFromApi();
<TsIcon name={icon} />;

// Value from object/map
const icon = iconMap[user.role];
<TsIcon name={icon} />;

// Dynamic template literal with interpolation
const icon = `${prefix}_arrow`;
<TsIcon name={icon} />;
```

**Fix:**

```ts
// vite.config.ts
designSystemIconsVitePlugin({
    additionalIcons: [
        { name: 'home', style: 'rounded' },
        { name: 'close', style: 'rounded' },
        { name: 'settings', style: 'rounded' },
    ],
});
```

---

## Edge Cases

### Runtime warning

If icons cannot be resolved at the default path, a console warning appears:

```
[TsIcon] Icons not found at expected path.
Did you add designSystemIconsVitePlugin() / designSystemIconsWebpackPlugin() to your build config?
```

This means the plugin is missing, misconfigured, or the `basePath` doesn't match.

---

### `vite preview`

`vite preview` serves the `dist/` folder. Since the plugin copies SVGs into `dist/` during the build, icons work correctly in preview with no extra config.

---

### SSR / Server-Side Rendering

`registerGoogleMaterial()` is safe to call in Node.js — the runtime warning is guarded with `typeof window !== 'undefined'` and `registerIconLibrary` is a no-op server-side. No special SSR handling needed.

---

### Monorepo

Each app configures the plugin independently in its own `vite.config.ts` or `angular.json`. `registerGoogleMaterial()` needs no changes — the default `basePath` is consistent across all apps.

---

### `vite build` emits 0 icons

```
[DesignSystem] Emitted 0 icon SVG(s) (2 rounded).
```

This means icon names were detected but the SVG files were not found. Possible causes:

1. **`@material-symbols/svg-400` not installed** in the consumer app — run `npm install @material-symbols/svg-400`.
2. **Using a different weight** (`svg-200`) — set `package: '@material-symbols/svg-200'` in the plugin options.
3. **Wrong icon name** — the name doesn't exist in the package. Check the [Material Symbols library](https://fonts.google.com/icons).
