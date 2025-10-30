# 🪶 GhostLineCanvas

A lightweight Vue 3 component that lets you **draw fading highlight lines** — just like the yellow marker in Zoom or Miro.

It’s perfect for presentation overlays, teaching tools, or any interactive canvas element where you want lines to fade out smoothly after drawing.

---

## 🚀 Installation

```bash
npm install ghostline
# or
pnpm add ghostline
# or
yarn add ghostline



## Usage
```vue
<script setup>
import { GhostLineCanvas } from 'ghostline';

const handleDrawEnd = (payload) => {
  console.log('Draw ended:', payload)
}
</script>

<template>
  <GhostLineCanvas
    :width="800"
    :height="600"
    line-color="#FFF200"
    :fading-time="850"
    @draw-end="handleDrawEnd"
  />
</template>
```

## Props

- `width` (number) - Canvas width, default: 640
- `height` (number) - Canvas height, default: 400
- `lineWidth` (number) - Stroke width, default: 5
- `lineColor` (string) - Stroke color, default: '#FFF200'
- `fadingTime` (number) - Fade duration in ms, default: 850
- `lineCap` (CanvasLineCap) - Line cap style, default: 'round'
- `lineJoin` (CanvasLineJoin) - Line join style, default: 'round'
- `disableFade` (boolean) - Disable fade effect, default: false

## Events

- `@draw-start` - Emitted when drawing starts
- `@draw` - Emitted during drawing
- `@draw-end` - Emitted when drawing ends

All events receive a `DrawPayload` with canvas data and painted pixels.