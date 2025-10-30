import { BaseCanvasData, CanvasLineJoin, DrawPayload, Point } from '../types';
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
    // NEW: Allow responsive behavior
    responsive: { type: Boolean, default: false },
  },
  setup(props, context) {
    const emit = context.emit as Emits;
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const devicePixelRatio = window.devicePixelRatio || 1;
    let ctx: CanvasRenderingContext2D | null = null;
    let paintedPixels: Point[] = [];
    let drawing = false;
    let scale = 1; // Track current scale for coordinate conversion

    const buildRawData = (): BaseCanvasData => {
      const canvas = canvasRef.value;
      return {
        width: canvas?.width ?? 0,
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

    /**
     * Get canvas point with proper scaling correction
     * This accounts for CSS scaling of the canvas
     */
    const getCanvasPoint = (event: PointerEvent): Point => {
      const canvas = canvasRef.value!;
      const rect = canvas.getBoundingClientRect();

      // Get mouse position relative to canvas
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Scale to canvas internal coordinates
      // This fixes the issue when CSS size != canvas bitmap size
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: x * scaleX,
        y: y * scaleY,
      };
    };

    /** Resize canvas to match display size */
    const resizeCanvas = () => {
      if (!canvasRef.value || !props.responsive) return;

      const canvas = canvasRef.value;
      const rect = canvas.getBoundingClientRect();

      // Set internal size to match display size (accounting for devicePixelRatio)
      const displayWidth = rect.width;
      const displayHeight = rect.height;

      if (
        canvas.width !== displayWidth * devicePixelRatio ||
        canvas.height !== displayHeight * devicePixelRatio
      ) {
        canvas.width = displayWidth * devicePixelRatio;
        canvas.height = displayHeight * devicePixelRatio;

        // Reconfigure context after resize
        if (ctx) {
          ctx.scale(devicePixelRatio, devicePixelRatio);
          ctx.lineWidth = props.lineWidth;
          ctx.lineCap = props.lineCap;
          ctx.lineJoin = props.lineJoin;
          ctx.strokeStyle = props.lineColor;
        }
      }
    };

    const fadeOut = (
      canvas: HTMLCanvasElement,
      duration = props.fadingTime,
    ) => {
      if (!canvas) return;
      canvas.style.transition = 'none';
      void canvas.offsetWidth;
      canvas.style.transition = `opacity ${duration}ms linear`;
      canvas.style.opacity = '0';
    };

    const revive = (canvas: HTMLCanvasElement) => {
      if (!canvas) return;
      canvas.style.transition = 'none';
      canvas.style.opacity = '1';
    };

    const onDown = (event: PointerEvent) => {
      if (!ctx || !canvasRef.value) return;

      revive(canvasRef.value);
      const point = getCanvasPoint(event);
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      paintedPixels.push({ x: point.x, y: point.y });
      emit('draw-start', buildDrawPayload());
    };

    const onMove = (event: PointerEvent) => {
      if (!drawing || !ctx) return;

      const point = getCanvasPoint(event);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      paintedPixels.push({ x: point.x, y: point.y });
      emit('draw', buildDrawPayload());
    };

    const onUp = () => {
      if (!drawing) return;
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

      if (!ctx) return;

      // Initial setup
      if (props.responsive) {
        resizeCanvas();
      } else {
        // Scale context for devicePixelRatio
        ctx.scale(devicePixelRatio, devicePixelRatio);
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

      // Add resize observer if responsive
      let resizeObserver: ResizeObserver | null = null;
      if (props.responsive) {
        resizeObserver = new ResizeObserver(() => {
          resizeCanvas();
        });
        resizeObserver.observe(canvas);
      }

      canvas.addEventListener('transitionend', (event) => {
        if (event.propertyName !== 'opacity') return;

        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }

        canvas.style.transition = 'none';
        canvas.style.opacity = '1';
      });

      // Cleanup function
      onBeforeUnmount(() => {
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);

        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      });
    });

    return () =>
      h('canvas', {
        ref: canvasRef,
        width: props.responsive ? undefined : props.width,
        height: props.responsive ? undefined : props.height,
        style: props.responsive
          ? `
            display: block;
            width: 100%;
            height: 100%;
            transition: opacity ${props.fadingTime}ms linear;
          `
          : `
            display: block;
            max-width: 100%;
            transition: opacity ${props.fadingTime}ms linear;
          `,
      });
  },
});

export default GhostLineCanvas;
