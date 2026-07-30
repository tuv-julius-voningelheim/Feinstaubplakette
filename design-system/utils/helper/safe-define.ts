// Description: Safely define a custom element if not already defined
// Usage: safeDefine('my-element', MyElementClass);
// SSR-safe: skips registration when customElements API is not available (e.g. Angular SSR / Node)
export const safeDefine = (t: string, c: CustomElementConstructor) => {
    if (typeof customElements !== 'undefined' && !customElements.get(t)) {
        customElements.define(t, c);
    }
};
