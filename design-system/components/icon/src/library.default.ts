import type { IconLibrary } from '@components/icon/src/library.js';

/**
 * The default library is intentionally left without a remote resolver.
 * To use named icons, register a custom icon library via `registerIconLibrary()`
 * or pass SVG content directly via the default slot.
 *
 * Example — registering a local icon library:
 *   registerIconLibrary('default', {
 *     resolver: (name, { variant, styleType }) => `/icons/${styleType}/${name}${variant === 'filled' ? '-filled' : ''}.svg`,
 *     mutator: svg => svg.setAttribute('fill', 'currentColor'),
 *   });
 */
const library: IconLibrary = {
    name: 'default',
    resolver: () => '',
    mutator: svg => svg.setAttribute('fill', 'currentColor'),
};

export default library;
