import { BaseCanvasData, CanvasLineJoin, DrawPayload, Point } from './types';
import {
  defineComponent,
  h,
  onMounted,
  onBeforeUnmount,
  ref,
  PropType,
} from 'vue';

type Emits = {
  (event: 'draw-start', payload: DrawPayload): void;
  (event: 'draw', payload: DrawPayload): void;
  (event: 'draw-end', payload: DrawPayload): void;
};

export const GhostLineCanvas = defineComponent({
  name: 'GhostLineCanvas',
  emits: {
    'draw-start': (_value: DrawPayload) => true,
    'draw': (_value: DrawPayload) => true,
    'draw-end': (_value: DrawPayload) => true,
  },
  props: {
    width: { type: Number, default: 640 },
    height: { type: Number, default: 400 },
    lineWidth: { type: Number, default: 5 },
    lineColor: { type: String, default: '#FFF200' },
    fadingTime: { type: Number, default: 850 },
    lineCap: {
      type: String as PropType<CanvasLineCap>,
      default: 'round',
    },
    lineJoin: {
      type: String as PropType<CanvasLineJoin>,
      default: 'round',
    },
    disableFade: { type: Boolean, default: false },
  },
  setup(props, context) {
    const emit = context.emit as Emits;
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const devicePixelRatio = window.devicePixelRatio || 1;
    let ctx: CanvasRenderingContext2D | null = null;
    let paintedPixels: Point[] = [];
    let drawing = false;

    const buildRawData = (): BaseCanvasData => {
      const canvas = canvasRef.value;
      return {
        width: canvas?.width ?? 0, // internal bitmap size (scaled by dpr)
        height: canvas?.height ?? 0,
        devicePixelRatio,
      };
    };

    const buildDrawPayload = (): DrawPayload => {
      return {
        ...buildRawData(),
        paintedPixels: [...paintedPixels],
        color: props.lineColor,
      };
    };

    /** Fade-out animation that triggers transitionend listener */
    const fadeOut = (
      canvas: HTMLCanvasElement,
      duration = props.fadingTime,
    ) => {
      if (!canvas) {
        return;
      }

      // Reset previous transition state to ensure new transition triggers
      canvas.style.transition = 'none';
      void canvas.offsetWidth; // force reflow
      canvas.style.transition = `opacity ${duration}ms linear`;
      canvas.style.opacity = '0';
    };

    /** Instantly restore canvas visibility */
    const revive = (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }
      canvas.style.transition = 'none';
      canvas.style.opacity = '1';
    };

    /** Drawing start **/
    const onDown = (event: PointerEvent) => {
      if (!ctx || !canvasRef.value) {
        return;
      }
      revive(canvasRef.value);
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(event.offsetX, event.offsetY);
      paintedPixels.push({ x: event.offsetX, y: event.offsetY });
      emit('draw-start', buildDrawPayload());
    };

    /** Drawing move **/
    const onMove = (event: PointerEvent) => {
      if (!drawing || !ctx) {
        return;
      }
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      paintedPixels.push({ x: event.offsetX, y: event.offsetY });
      emit('draw', buildDrawPayload());
    };

    /** Drawing end **/
    const onUp = () => {
      if (!drawing) {
        return;
      }
      drawing = false;

      if (canvasRef.value && !props.disableFade) {
        fadeOut(canvasRef.value);
      }
      emit('draw-end', buildDrawPayload());
      paintedPixels = [];
    };

    onMounted(() => {
      const canvas = canvasRef.value!;
      ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.lineWidth = props.lineWidth;
      ctx.lineCap = props.lineCap;
      ctx.lineJoin = props.lineJoin;
      ctx.strokeStyle = props.lineColor;

      canvas.style.touchAction = 'none';
      canvas.style.opacity = '1';

      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);

      // Listen for every fade end
      canvas.addEventListener('transitionend', (event) => {
        // Only handle opacity transitions
        if (event.propertyName !== 'opacity') {
          return;
        }

        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Reset opacity instantly for next draw
        canvas.style.transition = 'none';
        canvas.style.opacity = '1';
      });
    });

    onBeforeUnmount(() => {
      const canvas = canvasRef.value;
      if (!canvas) {
        return;
      }

      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    });

    return () =>
      h('canvas', {
        ref: canvasRef,
        width: props.width,
        height: props.height,
        style: `
          display:block;
          max-width:100%;
          transition:opacity ${props.fadingTime}ms linear;
        `,
      });
  },
});

export default GhostLineCanvas;
