import { useState, useCallback, useEffect, useRef } from "react";
import type { Position } from "../types/captcha";
import { squareMoverService } from "../services/square-mover.service";
import { DEFAULT_CAPTCHA_CONFIG } from "../config/constants";

export interface UseSquareMovementReturn {
  position: Position;
  lockedPosition: Position;
  isMoving: boolean;
  start: () => void;
  stop: () => void;
  lockPosition: () => Position;
}

/**
 * Hook for managing square area movement
 * @returns Position and control functions
 */
export function useSquareMovement(): UseSquareMovementReturn {
  const [lockedPosition, setLockedPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isMoving, setIsMoving] = useState(false);
  const isStartedRef = useRef(false);

  /**
   * Start automatic movement
   */
  const start = useCallback(() => {
    if (isStartedRef.current) return;
    isStartedRef.current = true;
    setIsMoving(true);

    squareMoverService.start(
      {
        interval: DEFAULT_CAPTCHA_CONFIG.movementIntervalMs,
        transitionDuration: 300,
        boundaryPadding: 10,
      },
      (newPosition) => {
        setPosition({ ...newPosition });
      }
    );
  }, []);

  /**
   * Stop movement and return current position
   */
  const stop = useCallback(() => {
    isStartedRef.current = false;
    setIsMoving(false);
    squareMoverService.stop();
  }, []);

  /**
   * Lock current position (for capture)
   */
  const lockPosition = useCallback(() => {
    stop();
    const position = squareMoverService.getCurrentPosition();
    setLockedPosition(position);
    return position;
  }, [stop]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      squareMoverService.stop();
    };
  }, []);

  return {
    position,
    isMoving,
    lockedPosition,
    start,
    stop,
    lockPosition,
  };
}
