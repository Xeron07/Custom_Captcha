import React, { useEffect } from "react";
import { CaptchaStage } from "../config/constants";
import { useCamera } from "../hooks/useCamera";
import { useCaptcha } from "../hooks/useCaptcha";
import { useSquareMovement } from "../hooks/useSquareMovement";
import { CameraCaptureStage } from "./CameraCaptureStage";
import { PuzzleSelectionStage } from "./PuzzleSelectionStage";
import { ValidationResultStage } from "./ValidationResult";
import { LoadingSpinner } from "./LoadingSpinner";
import { CameraService } from "../services/camera.service";
import { DEFAULT_CAPTCHA_CONFIG } from "../config/constants";

export interface CaptchaProps {
  onSuccess?: () => void;
  onFailure?: () => void;
  onRetry?: () => void;
}

/**
 * Main Captcha Component
 * Manages the complete captcha flow from camera to validation
 */
export const Captcha: React.FC<CaptchaProps> = ({
  onSuccess,
  onFailure,
  onRetry,
}) => {
  // Camera hook
  const camera = useCamera();

  // Captcha state hook
  const captcha = useCaptcha();

  // Square movement hook
  const squareMovement = useSquareMovement();

  // Initialize camera on mount
  useEffect(() => {
    if (CameraService.isSupported()) {
      camera.initialize();
    }
    //eslint-disable-next-line
  }, []);

  // Start square movement when camera is active
  useEffect(() => {
    if (
      camera.state.active &&
      captcha.state.stage === CaptchaStage.CAMERA_CAPTURE
    ) {
      squareMovement.start();
    }
    //eslint-disable-next-line
  }, [camera.state.active, captcha.state.stage]);

  // Trigger callbacks based on validation result
  useEffect(() => {
    if (captcha.state.stage === CaptchaStage.RESULT && captcha.state.result) {
      if (captcha.state.result.passed && onSuccess) {
        onSuccess();
      } else if (!captcha.state.result.passed && onFailure) {
        onFailure();
      }
    }
    //eslint-disable-next-line
  }, [captcha.state.stage, captcha.state.result]);

  /**
   * Handle continue button click (camera stage)
   */
  const handleContinue = async () => {
    try {
      // Lock square position
      squareMovement.lockPosition();

      // Capture frame from camera
      const squareArea = {
        position: squareMovement.lockedPosition,
        size: 40,
      };

      const imageData = await camera.capture();

      // Stop camera to free resources
      camera.stop();

      // Start puzzle selection stage
      await captcha.startChallenge(imageData, squareArea);
    } catch (error) {
      console.error("Failed to capture:", error);
    }
  };

  /**
   * Handle retry/reset
   */
  const handleReset = () => {
    captcha.reset();

    // Re-initialize camera
    camera.initialize();

    if (onRetry) {
      onRetry();
    }
  };

  // Show loading spinner
  if (captcha.state.loading) {
    return (
      <div className='flex items-center justify-center min-h-[600px]'>
        <LoadingSpinner size='large' message='Preparing captcha...' />
      </div>
    );
  }

  // Show camera support error
  if (!CameraService.isSupported()) {
    return (
      <div className='flex items-center justify-center min-h-[600px]'>
        <div className='text-center p-8 bg-red-50 rounded-2xl'>
          <h3 className='text-xl font-bold text-red-700 mb-2'>
            Camera Not Supported
          </h3>
          <p className='text-gray-600'>
            Your browser does not support camera access. Please use a modern
            browser.
          </p>
        </div>
      </div>
    );
  }

  // Render based on current stage
  switch (captcha.state.stage) {
    case CaptchaStage.CAMERA_CAPTURE:
      return (
        <CameraCaptureStage
          videoRef={camera.videoRef}
          squarePosition={squareMovement.position}
          squareSize={DEFAULT_CAPTCHA_CONFIG.squareSizePercent}
          isActive={camera.state.active}
          error={camera.state.error}
          onContinue={handleContinue}
        />
      );

    case CaptchaStage.PUZZLE_SELECTION:
      return captcha.state.challenge ? (
        <PuzzleSelectionStage
          squarePosition={squareMovement.lockedPosition}
          squareSize={DEFAULT_CAPTCHA_CONFIG.squareSizePercent}
          challenge={captcha.state.challenge}
          onToggleSector={captcha.selectSector}
          onValidate={captcha.validateSelections}
          onReset={handleReset}
          error={captcha.state.error}
        />
      ) : null;

    case CaptchaStage.RESULT:
      return captcha.state.result ? (
        <ValidationResultStage
          result={captcha.state.result}
          onReset={handleReset}
        />
      ) : null;

    default:
      return null;
  }
};
