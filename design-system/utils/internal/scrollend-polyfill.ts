type GenericCallback = (this: unknown, ...args: unknown[]) => unknown;

type MethodOf<T, K extends keyof T> = T[K] extends (...args: infer A) => unknown
    ? (this: T, ...args: A) => unknown
    : never;

const debounce = <T extends GenericCallback>(fn: T, delay: number) => {
    let timerId = 0;

    return function (this: unknown, ...args: unknown[]) {
        window.clearTimeout(timerId);
        timerId = window.setTimeout(() => {
            fn.call(this, ...args);
        }, delay);
    };
};

const decorate = <T, M extends keyof T>(
    proto: T,
    method: M,
    decorateFn: (this: T, superFn: MethodOf<T, M>, ...args: Parameters<MethodOf<T, M>>) => ReturnType<MethodOf<T, M>>,
) => {
    const superFn = proto[method] as MethodOf<T, M>;

    const wrapped = function (this: T, ...args: unknown[]) {
        superFn.call(this, ...(args as Parameters<MethodOf<T, M>>));
        return decorateFn.call(this, superFn, ...(args as Parameters<MethodOf<T, M>>));
    } as MethodOf<T, M>;

    proto[method] = wrapped as T[M];
};

(() => {
    if (typeof window === 'undefined') return;
    if ('onscrollend' in window) return;

    const pointers = new Set<number>();
    const scrollHandlers = new WeakMap<EventTarget, EventListenerOrEventListenerObject>();

    const handlePointerDown = (event: TouchEvent) => {
        for (const touch of event.changedTouches) {
            pointers.add(touch.identifier);
        }
    };

    const handlePointerUp = (event: TouchEvent) => {
        for (const touch of event.changedTouches) {
            pointers.delete(touch.identifier);
        }
    };

    document.addEventListener('touchstart', handlePointerDown, true);
    document.addEventListener('touchend', handlePointerUp, true);
    document.addEventListener('touchcancel', handlePointerUp, true);

    decorate<EventTarget, 'addEventListener'>(
        EventTarget.prototype,
        'addEventListener',
        function (this, addEventListener, type) {
            if (type !== 'scrollend') return;

            const handleScrollEnd = debounce(() => {
                if (!pointers.size) {
                    this.dispatchEvent(new Event('scrollend'));
                } else {
                    handleScrollEnd();
                }
            }, 100);

            addEventListener.call(this, 'scroll', handleScrollEnd, { passive: true });
            scrollHandlers.set(this, handleScrollEnd);
        },
    );

    decorate<EventTarget, 'removeEventListener'>(
        EventTarget.prototype,
        'removeEventListener',
        function (this, removeEventListener, type) {
            if (type !== 'scrollend') return;

            const scrollHandler = scrollHandlers.get(this);
            if (scrollHandler) {
                removeEventListener.call(this, 'scroll', scrollHandler, {
                    passive: true,
                } as EventListenerOptions);
            }
        },
    );
})();

export {};
