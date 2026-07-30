import { css } from 'lit';

export default css`
  :host {
    --grid-width: 280px;
    --grid-height: 200px;
    --grid-handle-size: 16px;
    --slider-height: 15px;
    --slider-handle-size: 17px;
    --swatch-size: 25px;

    display: inline-block;
  }

  .color-picker {
    width: var(--grid-width);
    font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    font-size: var(--ts-semantic-typography-ui-font-size-sm);
    font-weight: var(--ts-semantic-typography-font-weight-regular);
    color: var(--color);
    background-color: var(--ts-semantic-color-background-base-default);
    border-radius: var(--ts-semantic-size-radius-md);
    user-select: none;
    -webkit-user-select: none;
  }

  .color-picker--inline {
    border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-base-default);
  }

  .color-picker--inline:focus-visible {
      outline: solid 3px var(--ts-semantic-color-border-primary-focused);
      outline-offset: 1px;
  }

  .color-picker__grid {
    position: relative;
    height: var(--grid-height);
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%),
      linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    border-top-left-radius: var(--ts-semantic-size-radius-md);
    border-top-right-radius: var(--ts-semantic-size-radius-md);
    cursor: crosshair;
    forced-color-adjust: none;
  }

  .color-picker__grid-handle {
    position: absolute;
    width: var(--grid-handle-size);
    height: var(--grid-handle-size);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    border: solid 2px white;
    margin-top: calc(var(--grid-handle-size) / -2);
    margin-left: calc(var(--grid-handle-size) / -2);
    transition: var(--ts-semantic-transition-duration-fast) scale;
  }

  .color-picker__grid-handle--dragging {
    cursor: none;
    scale: 1.5;
  }

  .color-picker__grid-handle:focus-visible {
      outline: solid 3px var(--ts-semantic-color-border-primary-focused);
  }

  .color-picker__controls {
    padding: var(--ts-semantic-size-space-400);
    display: flex;
    align-items: center;
  }

  .color-picker__sliders {
    flex: 1 1 auto;
  }

  .color-picker__slider {
    position: relative;
    height: var(--slider-height);
    border-radius: var(--ts-semantic-size-radius-pill);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    forced-color-adjust: none;
  }

  .color-picker__slider:not(:last-of-type) {
    margin-bottom: var(--ts-semantic-size-space-400);
  }

  .color-picker__slider-handle {
    position: absolute;
    top: calc(50% - var(--slider-handle-size) / 2);
    width: var(--slider-handle-size);
    height: var(--slider-handle-size);
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    margin-left: calc(var(--slider-handle-size) / -2);
  }

  .color-picker__slider-handle:focus-visible {
      outline: solid 3px var(--ts-semantic-color-border-primary-focused);
  }

  .color-picker__hue {
    background-image: linear-gradient(
      to right,
      rgb(255, 0, 0) 0%,
      rgb(255, 255, 0) 17%,
      rgb(0, 255, 0) 33%,
      rgb(0, 255, 255) 50%,
      rgb(0, 0, 255) 67%,
      rgb(255, 0, 255) 83%,
      rgb(255, 0, 0) 100%
    );
  }

  .color-picker__alpha .color-picker__alpha-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .color-picker__preview {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 2.25rem;
    height: 2.25rem;
    border: none;
    border-radius: var(--ts-semantic-size-radius-pill);
    background: none;
    margin-left: var(--ts-semantic-size-space-600);
    cursor: copy;
    forced-color-adjust: none;
  }

  .color-picker__preview:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);

    /* We use a custom property in lieu of currentColor because of https://bugs.webkit.org/show_bug.cgi?id=216780 */
    background-color: var(--preview-color);
  }

  .color-picker__preview:focus-visible {
      outline: solid 3px var(--ts-semantic-color-border-primary-focused);
      outline-offset: 1px;
  }

  .color-picker__preview-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
  }

  .color-picker__preview-color--copied {
    animation: pulse 0.75s;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--ts-semantic-color-icon-primary-default);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  .color-picker__user-input {
    display: flex;
    padding: 0 var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-100);
  }

  .color-picker__user-input ts-input {
    min-width: 0; /* fix input width in Safari */
    flex: 1 1 auto;
  }

  .color-picker__user-input ts-button-group {
    margin-left: var(--ts-semantic-size-space-100);
  }

  .color-picker__user-input ts-button {
    min-width: 3.25rem;
    max-width: 3.25rem;
    font-size: 1rem;
  }

  .color-picker__swatches {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 0.5rem;
    justify-items: center;
    border-top: solid 1px var(--ts-semantic-color-border-base-default);
    padding: var(--ts-semantic-size-space-100);
    forced-color-adjust: none;
  }

  .color-picker__swatch {
    position: relative;
    width: var(--swatch-size);
    height: var(--swatch-size);
    border-radius: var(--ts-semantic-size-radius-sm);
  }

  .color-picker__swatch .color-picker__swatch-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
    border-radius: inherit;
    cursor: pointer;
  }

  .color-picker__swatch:focus-visible {
      outline: solid 3px var(--ts-semantic-color-border-primary-focused);
      outline-offset: 1px;
  }

  .color-picker__transparent-bg {
    background-image: linear-gradient(45deg, var(--ts-semantic-color-charts-neutral-300) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--ts-semantic-color-charts-neutral-300) 75%),
      linear-gradient(45deg, transparent 75%, var(--ts-semantic-color-charts-neutral-300) 75%),
      linear-gradient(45deg, var(--ts-semantic-color-charts-neutral-300) 25%, transparent 25%);
    background-size: 10px 10px;
    background-position:
      0 0,
      0 0,
      -5px -5px,
      5px 5px;
  }

  .color-picker--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .color-picker--disabled .color-picker__grid,
  .color-picker--disabled .color-picker__grid-handle,
  .color-picker--disabled .color-picker__slider,
  .color-picker--disabled .color-picker__slider-handle,
  .color-picker--disabled .color-picker__preview,
  .color-picker--disabled .color-picker__swatch,
  .color-picker--disabled .color-picker__swatch-color {
    pointer-events: none;
  }

  /*
   * Color dropdown
   */

  .color-dropdown::part(panel) {
    max-height: none;
    background-color: var(--ts-semantic-color-background-base-default);
    border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-base-default);
    border-radius: var(--ts-semantic-size-radius-md);
    overflow: visible;
  }

  .color-dropdown__trigger {
    display: inline-block;
    position: relative;
    background-color: transparent;
    border: none;
    cursor: pointer;
    forced-color-adjust: none;
  }

  .color-dropdown__trigger.color-dropdown__trigger--small {
    width: var(--ts-semantic-size-space-900);
    height: var(--ts-semantic-size-space-900);
    border-radius: var(--ts-semantic-size-radius-pill);
  }

  .color-dropdown__trigger.color-dropdown__trigger--medium {
    width: var(--ts-semantic-size-space-1100);
    height: var(--ts-semantic-size-space-1100);
    border-radius: var(--ts-semantic-size-radius-pill);
  }

  .color-dropdown__trigger.color-dropdown__trigger--large {
    width: var(--ts-semantic-size-space-1100);
    height: var(--ts-semantic-size-space-1100);
    border-radius: var(--ts-semantic-size-radius-pill);
  }

  .color-dropdown__trigger:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: currentColor;
    box-shadow:
      inset 0 0 0 2px var(--ts-semantic-color-border-base-default);
      inset 0 0 0 4px var(--ts-semantic-color-background-base-default);
  }

  .color-dropdown__trigger--empty:before {
    background-color: transparent;
  }

  .color-dropdown__trigger:focus-visible {
    outline: none;
  }

  .color-dropdown__trigger:focus-visible:not(.color-dropdown__trigger--disabled) {
      outline: solid 3px var(--ts-semantic-color-border-primary-focused);
      outline-offset: 1px;
  }

  .color-dropdown__trigger.color-dropdown__trigger--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
