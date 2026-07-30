/**
 * Returns the deeply nested active element, traversing shadow roots.
 */
const getDeepActiveElement = (): Element | null => {
    let active: Element | null = document.activeElement;
    while (active?.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active;
};

/**
 * Calls the blur method on the current active element if it is a child of the provided element.
 * Traverses shadow roots to find the truly focused element.
 * Needed for fixing a11y errors in console.
 * @see https://github.com/xxx-style/shoelace/issues/2283
 * @param elm The element to check
 */
export const blurActiveElement = (elm: HTMLElement) => {
    const active = getDeepActiveElement();
    if (active && elm.contains(active)) {
        (active as HTMLElement).blur();
        return;
    }
    // Fallback: also check document.activeElement in case shadow DOM traversal missed it
    const { activeElement } = document;
    if (activeElement && elm.contains(activeElement)) {
        (activeElement as HTMLElement).blur();
    }
};
