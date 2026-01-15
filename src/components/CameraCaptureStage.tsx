import React, { useRef } from "react";
import type { Position } from "../types/captcha";

interface CameraCaptureStageProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  squarePosition: Position;
  squareSize: number;
  isActive: boolean;
  error: string | null;
  onContinue: () => void;
}

export const CameraCaptureStage: React.FC<CameraCaptureStageProps> = ({
  videoRef,
  squarePosition,
  squareSize,
  isActive,
  error,
  onContinue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className='flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          Verify You're Human
        </h2>
        <p className='text-gray-600'>
          Position yourself in front of the camera, then click Continue when
          ready
        </p>
      </div>

      {/* Video Container with Square Overlay */}
      <div
        ref={containerRef}
        className='relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className='w-full h-full object-cover transform -scale-x-100'
        />
        {/* Square Overlay */}
        <div
          className='absolute border-4 border-sky-500 bg-blue-500/10 rounded-lg shadow-lg transition-all duration-300 ease-out'
          style={{
            left: `${squarePosition.x}%`,
            top: `${squarePosition.y}%`,
            width: `${squareSize}%`,
            height: `${squareSize}%`,
            transform: "translate(-50%, -50%)",
          }}>
          <div className='absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary-400' />
          <div className='absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary-400' />
          <div className='absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary-400' />
          <div className='absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary-400' />
        </div>

        {error && (
          <div className='absolute inset-0 bg-black/70 flex items-center justify-center p-6'>
            <div className='text-center text-white'>
              <svg
                className='w-16 h-16 mx-auto mb-4 text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
              <p className='text-lg font-semibold mb-2'>Camera Access Error</p>
              <p className='text-sm text-gray-300'>{error}</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onContinue}
        disabled={!isActive || !!error}
        className='px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95'>
        Continue
      </button>

      <p className='text-xs text-gray-500 text-center'>
        Your camera image is used only for captcha verification and is not
        stored.
      </p>
    </div>
  );
};
