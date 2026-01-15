import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_CAMERA_CONFIG } from "../config/constants";
import type { CameraConfig, CameraState, SquareArea } from "../types/captcha";
import { cameraService } from "../services/camera.service";

interface IUseCamera {
  state: CameraState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  initialize: () => Promise<void>;
  capture: (area?: SquareArea) => Promise<string>;
  stop: () => void;
}

export function useCamera(
  config: CameraConfig = DEFAULT_CAMERA_CONFIG
): IUseCamera {
  const [state, setState] = useState<CameraState>({
    stream: null,
    active: false,
    error: null,
    permission: "pending",
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initialize = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null, permission: "pending" }));
      const stream = await cameraService.initialize(config);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setState((prev: CameraState) => ({
        ...prev,
        stream,
        active: true,
        permission: "granted",
      }));
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to initialize camera";

      setState((prev: CameraState) => ({
        ...prev,
        stream: null,
        active: false,
        error: errorMsg,
        permission: "denied",
      }));
    }
  }, [config]);

  const stop = useCallback(() => {
    if (streamRef.current) {
      cameraService.stop(streamRef.current);
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState((prev: CameraState) => ({
      ...prev,
      stream: null,
      active: false,
      error: null,
      permission: "pending",
    }));
  }, []);

  const capture = useCallback(
    async (area?: SquareArea) => {
      if (!videoRef.current || !state.active) {
        throw new Error("Camera is not active");
      }
      return cameraService.captureFrame(videoRef.current, area);
    },
    [state.active]
  );

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    state,
    videoRef,
    initialize,
    capture,
    stop,
  };
}
