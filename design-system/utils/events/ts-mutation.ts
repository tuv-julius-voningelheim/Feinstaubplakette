export type TsMutationEvent = CustomEvent<{ mutationList: MutationRecord[] }>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-mutation': TsMutationEvent;
    }
}
