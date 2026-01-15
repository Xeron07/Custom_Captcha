// Camera related interfaces

/**
 * Camera stream configuration
 */
export interface CameraConfig {
  facingMode: "user" | "environment"; // 'user' for selfie camera
  width: number;
  height: number;
}

export interface CameraState {
  stream: MediaStream | null;
  active: boolean;
  error: string | null;
  permission: "granted" | "denied" | "pending";
}

/**
 * Abstract interface for camera operations
 */
export interface ICameraService {
  initialize(config: CameraConfig): Promise<MediaStream>;
  stop(stream: MediaStream): void;
  captureFrame(
    videoElement: HTMLVideoElement,
    area?: SquareArea
  ): Promise<string>;
}

export type WatermarkShape = "triangle" | "circle" | "square";

export interface Watermark {
  shape: WatermarkShape;
  id: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface SquareArea {
  position: Position;
  size: number;
}

export interface GridSector {
  id: string;
  row: number;
  col: number;
  watermark?: Watermark;
  selected: boolean;
}

export interface CaptchaGrid {
  sectors: GridSector[];
  rows: number;
  cols: number;
}

export type CaptchaStage = "camera_capture" | "puzzle_selection" | "result";

export interface CaptchaChallenge {
  id: string;
  targetShape: WatermarkShape;
  grid: CaptchaGrid;
  squareArea: SquareArea;
  capturedImage: string;
}

export interface ValidationResult {
  passed: boolean;
  correctSelections: number;
  totalRequired: number;
  userSelections: string[];
}

export interface ICaptchaGenerator {
  generateChallenge(): Promise<CaptchaChallenge>;
  generateSquareArea(): SquareArea;
  generateGrid(rows: number, cols: number): CaptchaGrid;
  generateWatermarks(grid: CaptchaGrid, count: number): { gridWithWatermarks: CaptchaGrid; targetShape: WatermarkShape };
}

export interface ICaptchaValidator {
  validate(challenge: CaptchaChallenge, selections: string[]): ValidationResult;
  isCorrectSelection(sector: GridSector, targetShape: WatermarkShape): boolean;
}

/**
 * Captcha state management
 */
export interface CaptchaState {
  stage: CaptchaStage;
  challenge: CaptchaChallenge | null;
  result: ValidationResult | null;
  error: string | null;
  loading: boolean;
}

export interface ICaptchaStore {
  getState(): CaptchaState;
  setState(state: Partial<CaptchaState>): void;
  reset(): void;
}
