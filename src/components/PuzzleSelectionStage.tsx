import React from "react";
import type { CaptchaChallenge, GridSector, Position } from "../types/captcha";

interface PuzzleSelectionStageProps {
  challenge: CaptchaChallenge;
  squarePosition: Position;
  squareSize: number;
  onToggleSector: (sectorId: string) => void;
  onValidate: () => void;
  onReset: () => void;
  error: string | null;
}

export const PuzzleSelectionStage: React.FC<PuzzleSelectionStageProps> = ({
  challenge,
  squarePosition,
  squareSize,
  onToggleSector,
  onValidate,
  onReset,
  error,
}) => {
  const { targetShape, grid, capturedImage } = challenge;
  const selectedCount = grid.sectors.filter((s) => s.selected === true).length;

  const renderWatermark = (sector: GridSector) => {
    if (!sector.watermark) return null;

    const { shape } = sector.watermark;
    const size = 20;
    const color = "#ffffff";

    switch (shape) {
      case "triangle":
        return (
          <svg
            width={size}
            height={size}
            viewBox='0 0 24 24'
            fill='none'
            className='opacity-70'>
            <path
              d='M12 4L4 20H20L12 4Z'
              fill={color}
              stroke='white'
              strokeWidth='1'
            />
          </svg>
        );

      case "square":
        return (
          <svg
            width={size}
            height={size}
            viewBox='0 0 24 24'
            fill='none'
            className='opacity-70'>
            <rect
              x='4'
              y='4'
              width='16'
              height='16'
              fill={color}
              stroke='white'
              strokeWidth='1'
            />
          </svg>
        );

      case "circle":
        return (
          <svg
            width={size}
            height={size}
            viewBox='0 0 24 24'
            fill='none'
            className='opacity-70'>
            <circle
              cx='12'
              cy='12'
              r='8'
              fill={color}
              stroke='white'
              strokeWidth='1'
            />
          </svg>
        );

      default:
        return null;
    }
  };

  const getShapeIcon = (shape: string) => {
    switch (shape) {
      case "triangle":
        return "▲";
      case "square":
        return "■";
      case "circle":
        return "●";
      default:
        return "";
    }
  };

  return (
    <div className='flex flex-col items-center gap-6 w-full max-w-6xl  mx-auto p-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          Select the {targetShape}s
        </h2>
        <p className='text-gray-600'>
          Click on all sectors containing the{" "}
          <span className='font-bold text-primary-600'>
            {getShapeIcon(targetShape)} {targetShape}
          </span>{" "}
          shape
        </p>
      </div>

      <div className='relative w-full aspect-video max-w-2xl bg-gray-100 rounded-2xl overflow-hidden shadow-2xl'>
        <img
          src={capturedImage}
          alt='Captured'
          className='w-full h-full object-cover'
        />

        <div
          className='absolute inset-0 grid border rounded bg-white opacity-50'
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
            gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
            gap: "0px",
            left: `${squarePosition.x}%`,
            top: `${squarePosition.y}%`,
            width: `${squareSize}%`,
            height: `${squareSize}%`,
            transform: "translate(-50%, -50%)",
          }}>
          {grid.sectors.map((sector) => (
            <button
              key={sector.id}
              onClick={() => {
                onToggleSector(sector.id);
              }}
              className='flex justify-center items-center relative '
              style={{
                borderColor: sector.selected ? "blue" : "white",
                borderWidth: "2px",
                borderStyle: "solid",
                borderRadius: "0px",
                width: "100%",
                height: "100%",
                padding: 0,
                cursor: "pointer",
                position: "relative",
                transition: "all 200ms",
              }}
              aria-label={`Sector ${sector.row},${sector.col}`}>
              {renderWatermark(sector)}

              <div
                style={{ display: sector.selected ? "block" : "none" }}
                className='absolute top-0 right-0 w-3 h-3 bg-green-600 rounded-full'
              />
            </button>
          ))}
        </div>
      </div>

      <div className='text-sm text-gray-600'>
        Selected: {selectedCount} sectors
      </div>

      {error && (
        <div className='w-full p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center'>
          {error}
        </div>
      )}

      <div className='flex gap-4'>
        <button
          onClick={onReset}
          className='px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200'>
          Start Over
        </button>
        <button
          onClick={onValidate}
          disabled={selectedCount === 0}
          className='px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95'>
          Validate
        </button>
      </div>
    </div>
  );
};
