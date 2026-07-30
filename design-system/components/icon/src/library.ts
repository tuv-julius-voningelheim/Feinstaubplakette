import defaultLibrary from '@components/icon/src/library.default.js';
import systemLibrary from '@components/icon/src/library.system.js';
import type { TsIcon } from '@components/icon/index.js';

export type IconLibraryResolver = (name: string) => string;
export type IconLibraryMutator = (svg: SVGElement) => void;
export interface IconLibrary {
    name: string;
    resolver: (
        name: string,
        options?: {
            variant?: 'outline' | 'filled';
            styleType?: 'sharp' | 'rounded';
        },
    ) => string;
    mutator?: IconLibraryMutator;
    spriteSheet?: boolean;
}

let registry: IconLibrary[] = [defaultLibrary, systemLibrary];
let watchedIcons: TsIcon[] = [];

/** Adds an icon to the list of watched icons. */
export function watchIcon(icon: TsIcon) {
    watchedIcons.push(icon);
}

/** Removes an icon from the list of watched icons. */
export function unwatchIcon(icon: TsIcon) {
    watchedIcons = watchedIcons.filter(el => el !== icon);
}

/** Returns a library from the registry. */
export function getIconLibrary(name?: string) {
    return registry.find(lib => lib.name === name);
}

/** Adds an icon library to the registry, or overrides an existing one. */
export function registerIconLibrary(name: string, options: Omit<IconLibrary, 'name'>) {
    unregisterIconLibrary(name);
    registry.push({
        name,
        resolver: options.resolver,
        mutator: options.mutator,
        spriteSheet: options.spriteSheet,
    });

    // Redraw watched icons
    watchedIcons.forEach(icon => {
        if (icon.library === name) {
            icon.setIcon();
        }
    });
}

/** Removes an icon library from the registry. */
export function unregisterIconLibrary(name: string) {
    registry = registry.filter(lib => lib.name !== name);
}
