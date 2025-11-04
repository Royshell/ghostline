# 🪶 GhostLineCanvas

A lightweight Vue 3 component that lets you **draw fading highlight lines** — just like the yellow marker in Zoom or Miro.

It's perfect for presentation overlays, teaching tools, or any interactive canvas element where you want lines to fade out smoothly after drawing.

---

## 🎬 Demo

![Basic drawing demo - [INSERT docs/gifs/basic-draw.gif HERE]](![./docs/gifs/basic-draw.gif](https://res.cloudinary.com/drehggl5c/image/upload/v1762258801/ghostlineexample1.gif))

**Try it live:** [CodeSandbox Demo Link](PLACEHOLDER_CODESANDBOX_URL)

---

## 🚀 Installation

```bash
npm install ghostline
# or
pnpm add ghostline
# or
yarn add ghostline
```

---

## 💡 Quick Start

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

---

## 📚 Examples

### Example 1: Basic Drawing
![Basic drawing example - [INSERT docs/gifs/example-basic.gif HERE]](./docs/gifs/example-basic.gif)

```vue
<GhostLineCanvas
  :width="640"
  :height="480"
  line-color="#FFF200"
/>
```

### Example 2: Presentation Mode (Fast Fade)
![Fast fade presentation mode - [INSERT docs/gifs/example-presentation.gif HERE]](./docs/gifs/example-presentation.gif)

```vue
<GhostLineCanvas
  :width="1280"
  :height="720"
  line-color="#FF6B6B"
  :fading-time="500"
  :line-width="8"
/>
```

### Example 3: Teaching/Annotation (Slow Fade)
![Slow fade teaching mode - [INSERT docs/gifs/example-teaching.gif HERE]](./docs/gifs/example-teaching.gif)

```vue
<GhostLineCanvas
  :width="800"
  :height="600"
  line-color="#4ECDC4"
  :fading-time="2000"
  :line-width="3"
/>
```

### Example 4: Thick Lines with Custom Cap
![Thick lines example - [INSERT docs/gifs/example-thick.gif HERE]](./docs/gifs/example-thick.gif)

```vue
<GhostLineCanvas
  :width="800"
  :height="600"
  line-color="#FFD700"
  :line-width="12"
  line-cap="round"
  :fading-time="1200"
/>
```

---

## 🔧 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | 640 | Canvas width in pixels |
| `height` | `number` | 400 | Canvas height in pixels |
| `lineWidth` | `number` | 5 | Stroke width in pixels |
| `lineColor` | `string` | '#FFF200' | Stroke color (hex or rgb) |
| `fadingTime` | `number` | 850 | Fade-out duration in milliseconds (0 = no fade) |
| `lineCap` | `CanvasLineCap` | 'round' | Line cap style: `'butt'`, `'round'`, or `'square'` |
| `lineJoin` | `CanvasLineJoin` | 'round' | Line join style: `'bevel'`, `'round'`, or `'miter'` |
| `disableFade` | `boolean` | false | Completely disable fade effect (lines stay forever) |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `@draw-start` | `DrawPayload` | Emitted when user starts drawing |
| `@draw` | `DrawPayload` | Emitted continuously while drawing |
| `@draw-end` | `DrawPayload` | Emitted when user finishes drawing |

#### DrawPayload Structure
```typescript
interface DrawPayload {
  canvasData: ImageData;
  paintedPixels: number;
  timestamp: number;
}
```

---

## 🎨 Color Palette Ideas

```vue
<!-- Warm & Energetic -->
<GhostLineCanvas line-color="#FF6B6B" />

<!-- Cool & Professional -->
<GhostLineCanvas line-color="#4ECDC4" />

<!-- Classic Highlight -->
<GhostLineCanvas line-color="#FFF200" />

<!-- Gold & Premium -->
<GhostLineCanvas line-color="#FFD700" />

<!-- Neon Green -->
<GhostLineCanvas line-color="#39FF14" />
```

---

## ⌨️ Keyboard Shortcuts & Interactions

| Action | Behavior |
|--------|----------|
| **Click & Drag** | Draw lines on canvas |
| **Release Mouse** | Line fades out over `fadingTime` duration |
| **Multiple Strokes** | Each line fades independently |
| **Disable Fade** | Set `disableFade="true"` to keep lines permanently |

---

## 📊 Performance Tips

- **Large Canvas?** Use smaller `line-width` (3-5px) for better performance
- **Many Lines?** Reduce `fadingTime` to prevent memory buildup
- **High DPI Screens?** Consider using `width="1280" height="720"` instead of larger values
- **Multiple Instances?** Limit to 2-3 components per page for smooth performance

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 60+ | ✅ Full |
| Firefox | 55+ | ✅ Full |
| Safari | 12+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Internet Explorer | All | ❌ Not supported |

---

## 🐛 Troubleshooting

### Lines Not Appearing?
- Ensure `line-color` is a valid hex/rgb color
- Check that canvas dimensions (`width`, `height`) are set
- Verify that you're clicking and dragging on the canvas area

### Fade Effect Not Working?
- Make sure `disableFade` is not set to `true`
- Check `fadingTime` value (0 = no fade)
- Ensure `fadingTime` is in milliseconds (e.g., 850 = 0.85 seconds)

### Performance Issues?
- Reduce `line-width` to decrease rendering load
- Decrease canvas `width`/`height` if possible
- Lower `fadingTime` to prevent memory accumulation
- Limit the number of simultaneous components

### Color Looks Different?
- Different displays render colors differently
- Test with `#FFF200` (guaranteed yellow) as baseline
- Use RGB format if more control needed: `rgb(255, 178, 0)`

---

## 📝 Advanced Usage

### Capturing Canvas Data

```vue
<script setup>
const canvasRef = ref();

const handleDrawEnd = (payload) => {
  // Access raw canvas image data
  const imageData = payload.canvasData;
  const pixelsPainted = payload.paintedPixels;
  
  // Convert to blob for saving
  canvasRef.value.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawing.png';
    a.click();
  });
}
</script>

<template>
  <GhostLineCanvas
    ref="canvasRef"
    @draw-end="handleDrawEnd"
  />
</template>
```

### Dynamic Color Changes

```vue
<script setup>
import { ref } from 'vue';
import { GhostLineCanvas } from 'ghostline';

const markerColor = ref('#FFF200');

const colors = ['#FFF200', '#FF6B6B', '#4ECDC4', '#FFD700'];

const changeColor = () => {
  markerColor.value = colors[Math.floor(Math.random() * colors.length)];
}
</script>

<template>
  <div>
    <button @click="changeColor">Change Color</button>
    <GhostLineCanvas :line-color="markerColor" />
  </div>
</template>
```

---

## 📦 File Structure Reference

```
project-root/
├── README.md
├── docs/
│   ├── gifs/
│   │   ├── basic-draw.gif              [INSERT YOUR GIF HERE]
│   │   ├── example-basic.gif            [INSERT YOUR GIF HERE]
│   │   ├── example-presentation.gif     [INSERT YOUR GIF HERE]
│   │   ├── example-teaching.gif         [INSERT YOUR GIF HERE]
│   │   └── example-thick.gif            [INSERT YOUR GIF HERE]
│   ├── api.md
│   ├── examples.md
│   └── troubleshooting.md
├── src/
│   ├── components/
│   │   └── GhostLineCanvas.vue
│   └── index.ts
└── package.json
```

---

## 🤝 Contributing

Found a bug or have a feature request? [Open an issue](PLACEHOLDER_GITHUB_ISSUES_URL)

---

## 📄 License

MIT © [Your Name/Organization]

---

## 🙌 Credits

Inspired by presentation tools like Zoom, Miro, and FigJam.

**Last Updated:** [DATE]