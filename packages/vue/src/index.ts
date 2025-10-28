import { defineComponent, h, onMounted, onBeforeUnmount, ref, PropType } from 'vue';
type Point = {
  x: number;
  y: number; 
}
export const GhostLineCanvas = defineComponent({
  name: 'GhostLineCanvas',
  emits: ['draw-start', 'draw','draw-end'],
  props: {
    width: { type: Number, default: 640 },
    height: { type: Number, default: 400 },
    lineWidth: { type: Number, default: 5 },
    lineColor: { type: String, default: '#FFF200' },
    fadingTime: { type: Number, default: 850 },
    lineCap: { type: String as PropType<'butt' | 'square' | 'round'>, default: 'round'},
    diasbleFade: {type: Boolean, default: false}
  },
  setup(props,{ emit }) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const devicePixelRatio = window.devicePixelRatio || 1;
    let ctx: CanvasRenderingContext2D | null = null;
    let paintedPixels: Point[] = [];
    let drawing = false;

    const buildRawData = () => {
      const canvas = canvasRef.value;
      return {
        width:  canvas?.width ?? 0,     // internal bitmap size (scaled by dpr)
        height: canvas?.height ?? 0,
        color:  props.lineColor,
        devicePixelRatio
      };
    };

    /** Fade-out animation that triggers transitionend listener */
    const fadeOut = (canvas: HTMLCanvasElement, duration = props.fadingTime) => {
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
      if (!canvas)  {
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
      paintedPixels.push({x:event.offsetX, y:event.offsetY })
      emit('draw-start', {...buildRawData(), paintedPixels});
    };

    /** Drawing move **/
    const onMove = (event: PointerEvent) => {
      if (!drawing || !ctx) {
        return;
      }
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      emit('draw', {...buildRawData(), paintedPixels});
      paintedPixels.push({x:event.offsetX, y:event.offsetY })
    };

    /** Drawing end **/
    const onUp = () => {
      if (!drawing) {
        return;
      }
      drawing = false;
      
      if (canvasRef.value && !props.diasbleFade) {
        fadeOut(canvasRef.value);
      }
      emit('draw-end', {...buildRawData(), paintedPixels});
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
        if (context) {context.clearRect(0, 0, canvas.width, canvas.height);}

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
