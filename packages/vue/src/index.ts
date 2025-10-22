import { defineComponent, h, onMounted, onBeforeUnmount, ref } from 'vue';

const YELLOW_HIGHLIGHT_COLOR = '#FFF200';
export const GhostLineCanvas = defineComponent({
  name: 'GhostLineCanvas',
  props: {
    width: { type: Number, default: 640 },
    height: { type: Number, default: 400 },
    lineWidth: { type: Number, default: 5 },
    markerColor: { type: String, default:  YELLOW_HIGHLIGHT_COLOR },
    fadeDuration: { type: Number, default: 1800 },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let isDrawing = false;
    let ctx: CanvasRenderingContext2D | null = null;

    // Begin drawing on pointer down
    const handlePointerDown = (event: PointerEvent) => {
      if (!ctx) {
        return;
      }
      isDrawing = true;
      ctx.strokeStyle = props.markerColor;
      ctx.beginPath();
      ctx.moveTo(event.offsetX, event.offsetY);
    };

    // Stroke while moving
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDrawing || !ctx) {
        return;
      }
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    };

    // Finish stroke and fade out
    const handlePointerUp = () => {
      isDrawing = false;
      fadeOut(props.fadeDuration);
    };

    // CSS-opacity fade of the entire canvas, then clear bitmap
    const fadeOut = (duration: number) => {
      const canvas = canvasRef.value;
      if (!canvas) return;

      // Reset transition, ensure fully opaque before starting
      canvas.style.transition = 'none';
      canvas.style.opacity = '1';

      // Kick off transition in next frame
      requestAnimationFrame(() => {
        canvas.style.transition = `opacity ${duration}ms linear`;
        canvas.style.opacity = '0';
      });

      const handleTransitionEnd = () => {
        const localCtx = canvas.getContext('2d');
        if (localCtx) localCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.transition = 'none';
        canvas.style.opacity = '1';
        canvas.removeEventListener('transitionend', handleTransitionEnd);
      };

      canvas.addEventListener('transitionend', handleTransitionEnd, { once: true });
    };

    onMounted(() => {
      const canvas = canvasRef.value!;
      ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Basic stroke setup
      ctx.lineWidth = props.lineWidth;
      ctx.lineCap = 'round';

      // Prevent browser gestures
      canvas.style.touchAction = 'none';

      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      window.addEventListener('pointerleave', handlePointerUp);
    });

    onBeforeUnmount(() => {
      const canvas = canvasRef.value;
      if (!canvas) return;

      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('pointerleave', handlePointerUp);
    });

    return () =>
      h('canvas', {
        ref: (el: HTMLCanvasElement | null) => {
          canvasRef.value = el;
        },
        width: props.width,
        height: props.height,
        style: 'border:1px solid #ddd; display:block; max-width:100%;',
      });
  },
});

export default GhostLineCanvas;
