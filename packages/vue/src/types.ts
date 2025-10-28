// ===== Shared Types =====
export type Point = {
  x: number;
  y: number;
};

export type CanvasLineCap = 'butt' | 'square' | 'round';

export type CanvasLineJoin = 'bevel' | 'round' | 'miter';

// ===== Common Event Payloads =====
export interface BaseCanvasData {
  width: number;
  height: number;
  devicePixelRatio: number;
}

export interface DrawPayload extends BaseCanvasData {
  color: string;
  paintedPixels: Point[];
}

// ===== Component-specific Props =====
export interface GhostLineCanvasProps {
  width?: number;
  height?: number;
  lineWidth?: number;
  lineColor?: string;
  fadingTime?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
  disableFade?: boolean;
}

export interface SignatureCanvasProps {
  width?: number;
  height?: number;
  lineWidth?: number;
  lineColor?: string;
  backgroundColor?: string;
}

// ===== Future: Shared utilities =====
export interface CanvasStroke {
  points: Point[];
  color: string;
  width: number;
  timestamp: number;
}
