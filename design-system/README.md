# TÜV SÜD Algorithm Design System

This design system is a collection of reusable, high-performance web components built using [Shoelace](https://shoelace.style) and enhanced with TÜV SÜD custom styles and features.

The components are:

-   **Accessible** – Built with a11y best practices in mind.
-   **Customizable** – Easily themed and extended to match TÜV SÜD brand.
-   **Framework-Agnostic** – Usable in any frontend stack (e.g. React, Angular).
-   **Interactive** – Fully documented and testable through Storybook.

## Install the Package in projects
### Configure .npmrc

Create a `.npmrc` file in your project root:

```ini
registry=https://registry.npmjs.org/
always-auth=true

@tuvsud:registry=https://pkgs.dev.azure.com/tuvsud01/_packaging/design-system/npm/registry/
//pkgs.dev.azure.com/tuvsud01/_packaging/design-system/npm/registry/:_authToken=${AZURE_NPM_TOKEN}
```

### Install
```ini
npm install @tuvsud/design-system
```

## Developer guide for the design system

### Prerequisites

-   Node.js (>= 18.x recommended)
-   Access to Azure DevOps
-   Personal Access Token (PAT) in Azure DevOps for npm register

### Repository

Checkout the repo from [Azure DevOps](https://dev.azure.com/tuvsud01/ALGORITHM%20Design%20System/_git/design-system).

### Build the project

-   run `npm install` to install the dependencies
-   run `npm run build` to build the project

### Run Storybook

-   run `npm run build-storybook` to build the storybook
-   run `npm run storybook` to run the storybook

## Tech Stack

| Technology                                                   | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Lit](https://lit.dev/)                                      | Base framework for building fast, lightweight web components |
| [TypeScript](https://www.typescriptlang.org/)                | Strongly typed JavaScript for maintainable code              |
| [Storybook](https://storybook.js.org/)                       | UI component explorer and documentation platform             |
| [Style Dictionary](https://amzn.github.io/style-dictionary/) | Design token management and transformation tool              |
| [ESLint](https://eslint.org/)                                | Code linter to ensure consistent style and quality           |
| [Chromatic](https://www.chromatic.com/)                      | Visual testing and publishing for Storybook components       |

## Project structure

```
.
├── .storybook/                             // story book configuration
│   ├── main.ts
│   └── ...
│
├── components/                            // web components extended from Shoelace component
│   ├── button/
│   │   ├── index.ts
│   │   └── ...
│   └── ...
├── public/                                // public assets
│   └── fonts/
│
├── scripts/                               // script helper for build tokens and export styles
│   ├── style-build.ts
│   └── ...
│
├── storybook/                            // storybook components
│   ├── components
│   │   ├── button
│   │   │   └── Button.stories.ts
│   │   └── ...
│   ├── documentation
│   └── ...
│
├── studio-export/                        // exported studio tokens
│   ├── core
│   │   ├── dark.json
│   │   └── ...
│   └── semantic.json
│
├── theme/                                // theme and TÜV SÜD brand fonts
│   └── fonts.css
│
├── tokens/                               // token studio files
│   ├── core
│   │   ├── dark.json
│   │   └── ...
│   ├── $metadata.json
│   └── ....
│
├── utils/                                // utils for components helper
│   ├── events
│   ├── internal
│   └── ....
│
├── entry.ts                              // this entry exported to match Angular configuration
│
├── package.json                          // package.json and other project config files
└── ...
```

## Installation

```bash
npm install @tuvsud/design-system
```

## Material Icons Setup

`registerGoogleMaterial()` loads SVG icons from `/icons/material-symbols` by default. A build plugin is required to copy the SVG files to that path during your build.

### Vite / React

Add the plugin to your Vite config:

```ts
// vite.config.ts
import { designSystemIconsVitePlugin } from '@tuvsud/design-system/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), ...designSystemIconsVitePlugin()],
});
```

### Angular (webpack-based / `@angular-builders/custom-webpack`)

Install the optional peer dependency:

```bash
npm install --save-dev copy-webpack-plugin
```

Add the plugin to your custom webpack config:

```ts
// custom-webpack.config.ts
import { designSystemIconsWebpackPlugin } from '@tuvsud/design-system/webpack';

module.exports = {
  plugins: [designSystemIconsWebpackPlugin()],
};
```

### Angular (esbuild / application builder)

No extra package needed — configure `assets` in `angular.json`:

```json
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
```

### Custom base path

If you serve icons from a different location, pass `basePath` explicitly:

```ts
registerGoogleMaterial({ basePath: '/assets/material-symbols' });
```

## Contributing

We welcome contributions! To keep everything consistent and maintainable, please follow these guidelines:

### Add new Component

1. **Create a new folder** under `components/`, e.g. `components/button`.

2. **Add your component file** create index file and extend your component from Shoelace component. If it’s a new custom component, create it without extending another class.

3. **Register the component** in `index.ts`.

4. **Style the component** Override the Shoelace style variables with our own styles.

5. **Create React component** create react component in `react` folder

6. **Add new story** add new story to storybook

7. **Export component**: Export the Web Component and React wrapper in `package.json` and `entry.ts`.

### Local Test

Test your changes locally in storybook and use `npm link` to test the new changes in package before publish new version.

```ts
// run this scripts in design-system repo
npm run build

npm link

// run this script in design-system-react repo
npm link @tuvsud/design-system

npm run dev
```

### Update documentation

Keep stories and other documentation up to date.

### npm Package Version

We follow **Semantic Versioning**: `MAJOR.MINOR.PATCH`.

To update the version:

-   **Major version** (breaking changes):

    ```bash
    xx.1.0
    ```

-   **Minor version** (backward-compatible feature):

    ```bash
    1.xx.0
    ```

-   **Patch version** (bug fixes only):
    ```bash
    1.1.xx
    ```

### Update release notes

After each version update the release notes in `storybook/documentation/release-notes.mdx`

### Chromatic

To publish the new changes to Chromatic run `npm run chromatic`

### Build pipelines

Pipeline will run automatically after push to main. The new changes will be published to npm.

## Add new npm Package Users

To add new users to use the npm packages add the users to the Azure DevOps Team group `design-system-community`

## Acknowledgements
This project builds upon [Shoelace](https://shoelace.style), an open-source library by Cory LaViska, licensed under the MIT License.  
Some components are derived or modified from the original Shoelace source.

## License
Portions of this project are based on [Shoelace](https://shoelace.style) by Cory LaViska,  
licensed under the MIT License. See [licenses/shoelace/LICENSE](https://github.com/shoelace-style/shoelace?tab=MIT-1-ov-file) for the original license.
