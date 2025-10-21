import { defineComponent, h, onMounted, onBeforeUnmount, ref } from 'vue';

export const GhostLineCanvas = defineComponent({
  name: 'GhostLineCanvas',
  props: {
    width: { type: Number, default: 640 },
    height: { type: Number, default: 400 },
    lineWidth: { type: Number, default: 2 },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let drawing = false;
    let ctx: CanvasRenderingContext2D | null = null;

    const onDown = (e: PointerEvent) => {
      if (!ctx) return;
      drawing = true;
      ctx.beginPath();
      ctx.moveTo((e as any).offsetX, (e as any).offsetY);
    };

    const onMove = (e: PointerEvent) => {
      if (!drawing || !ctx) return;
      ctx.lineTo((e as any).offsetX, (e as any).offsetY);
      ctx.stroke();
    };

    const onUp = () => {
      drawing = false;
    };

    onMounted(() => {
      const c = canvasRef.value!;
      ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.lineWidth = props.lineWidth;
      ctx.lineCap = 'round';
      c.style.touchAction = 'none';

      c.addEventListener('pointerdown', onDown);
      c.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });

    onBeforeUnmount(() => {
      const c = canvasRef.value;
      if (!c) return;
      c.removeEventListener('pointerdown', onDown);
      c.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
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
