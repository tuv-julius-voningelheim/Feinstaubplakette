import type { Meta, StoryObj } from '@storybook/web-components';

// This allows us to easily pass a label Storybook arg for text/HTML children content inside the component
export type MetaWithLabel<T> = Meta<T & { label?: string; triggerText?: string }>;
export type StoryObjWithLabel<T> = StoryObj<T & { label?: string; triggerText?: string }>;
