import type { WatermarkShape } from "./../types/captcha";
/**
 * Default captcha configuration
 */
export const DEFAULT_CAPTCHA_CONFIG = {
  gridRows: 3, // 3X3 grid style (9 sectors/ squrare)
  gridCols: 3,
  squareSizePercent: 40, // Main Square is 40% of main video size
  watermarkRatio: 0.5, // half of the sector will have watermarks
  movementIntervalMs: 1500, // square movement interval
  selectionTimeoutMs: 60000, // duration to complete selection
};

export const DEFAULT_CAMERA_CONFIG = {
  facingMode: "user" as const,
  width: 1280,
  height: 720,
};

/**
 * Validation Rules
 */
export const MINIMUM_CORRECT_SELECTIONS = Math.round(
  (DEFAULT_CAPTCHA_CONFIG.gridRows * DEFAULT_CAPTCHA_CONFIG.gridCols) / 3
); //min required selection to pass captcha
export const MAXIMUM_INCORRECT_SELECTIONS = 1; //max allowed incorrect selection to pass captcha

export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
};

/**
 * Grid Styling Constants
 */
export const GRID_STYLING = {
  BORDER_WIDTH: 2,
  SECTOR_GAP: 4,
  WATERMARK_SIZE: 20,
  WATERMARK_OPACITY: 0.7,
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  CAMERA_ACCESS_DENIED:
    "Camera access is required for captcha verification. Please allow camera access and try again.",
  CAMERA_NOT_AVAILABLE: "No camera device found on your system.",
  CAMERA_IN_USE: "Camera is already in use by another application.",
  STREAM_ERROR:
    "Unable to access camera stream. Please check your permissions.",
  CAPTURE_FAILED: "Failed to capture image. Please try again.",
  VALIDATION_ERROR: "Validation failed. Please try again.",
  TIMEOUT: "Session timed out. Please start over.",
  UNKNOWN: "An unexpected error occurred. Please try again.",
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  CAPTCHA_PASSED: "Verification successful! You are human.",
  CAPTCHA_FAILED: "Verification failed. Please try again.",
} as const;

export const CaptchaStage = {
  CAMERA_CAPTURE: "camera_capture", // Step 1: Camera with moving square
  PUZZLE_SELECTION: "puzzle_selection", // Step 2: Select watermarked sectors
  RESULT: "result", // Step 3: Pass/fail result
};

export const WatermarkShapes: WatermarkShape[] = [
  "triangle",
  "circle",
  "square",
];
