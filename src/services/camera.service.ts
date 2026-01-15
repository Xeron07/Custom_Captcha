import type {
  CameraConfig,
  SquareArea,
  ICameraService,
} from "../types/captcha";

export class CameraService implements ICameraService {
  private mediaStream: MediaStream | null = null;

  /**
   * Initializes the camera with the given configuration.
   * @param config The camera configuration.
   * @returns A promise that resolves to the media stream.
   * @throws Error if camera access is denied or not available.
   */
  async initialize(config: CameraConfig): Promise<MediaStream> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: config.facingMode,
          width: config.width,
          height: config.height,
        },
        audio: false,
      });
      return this.mediaStream;
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          throw new Error(
            "Camera access is required for captcha verification. Please allow camera access and try again."
          );
        } else if (error.name === "NotFoundError") {
          throw new Error(
            "No camera device found. Please connect a camera and try again."
          );
        } else {
          throw new Error(
            "An unknown error occurred while accessing the camera."
          );
        }
      }
      throw new Error(
        "Unable to access your camera. Please check your settings"
      );
    }
  }

  /**
   * Stops the camera stream.
   * @param stream The media stream to stop.
   */
  stop(stream: MediaStream): void {
    try {
      stream.getTracks().forEach((track) => track.stop());

      if (this.mediaStream === stream) {
        this.mediaStream = null;
      }
    } catch (error) {
      console.warn("Error stopping camera stream:", error);
    }
  }

  /**
   * Captures a frame from the video element.
   * @param videoElement The video element to capture the frame from.
   * @param area Optional area of the video to capture. If not provided, captures the full frame.
   * @returns A promise that resolves to the captured image as a data URL.
   */
  async captureFrame(
    videoElement: HTMLVideoElement,
    area?: SquareArea
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;

        if (area) {
          const squareSizePixels =
            (area.size / 100) * Math.min(videoWidth, videoHeight);
          const xPixels =
            (area.position.x / 100) * (videoWidth - squareSizePixels);
          const yPixels =
            (area.position.y / 100) * (videoHeight - squareSizePixels);

          canvas.width = squareSizePixels;
          canvas.height = squareSizePixels;

          ctx.scale(-1, 1);
          ctx.drawImage(
            videoElement,
            -xPixels - squareSizePixels,
            yPixels,
            videoWidth,
            videoHeight,
            -squareSizePixels,
            0,
            squareSizePixels,
            squareSizePixels
          );
        } else {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          ctx.scale(-1, 1);
          ctx.drawImage(videoElement, -videoWidth, 0, videoWidth, videoHeight);
        }

        const imageUrl = canvas.toDataURL("image/png");
        resolve(imageUrl);
      } catch (error) {
        console.error("Error capturing frame:", error);
        reject(new Error("Failed to capture frame from video"));
      }
    });
  }

  /**
   * Checks if the camera is supported in the current browser.
   * @returns A boolean indicating whether the camera is supported.
   */
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}

export const cameraService = new CameraService();
