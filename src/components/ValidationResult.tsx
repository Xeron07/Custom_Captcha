import React from "react";
import type { ValidationResult } from "../types/captcha";

interface ValidationResultProps {
  result: ValidationResult;
  onReset: () => void;
}

export const ValidationResultStage: React.FC<ValidationResultProps> = ({
  result,
  onReset,
}) => {
  const { passed, correctSelections, totalRequired } = result;

  return (
    <div className='flex flex-col items-center gap-8 w-full max-w-lg mx-auto p-8'>
      <div
        className={`w-32 h-32 rounded-full flex items-center justify-center ${
          passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}>
        {passed ? (
          <svg
            className='w-16 h-16'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={3}
              d='M5 13l4 4L19 7'
            />
          </svg>
        ) : (
          <svg
            className='w-16 h-16'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={3}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        )}
      </div>

      <div className='text-center'>
        <h2
          className={`text-3xl font-bold mb-3 ${
            passed ? "text-green-700" : "text-red-700"
          }`}>
          {passed ? "Verification Successful!" : "Verification Failed"}
        </h2>
        <p className='text-lg text-gray-700 mb-2'>
          You found {correctSelections} out of {totalRequired} correct{" "}
          {totalRequired === 1 ? "selection" : "selections"}
        </p>
        <p className='text-sm text-gray-500'>
          {passed
            ? "You have successfully proven you are human."
            : "Please try again to complete the verification."}
        </p>
      </div>

      <div className='w-full bg-gray-100 rounded-full h-4 overflow-hidden'>
        <div
          className={`h-full transition-all duration-500 ${
            passed
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : "bg-gradient-to-r from-red-400 to-red-600"
          }`}
          style={{ width: `${(correctSelections / totalRequired) * 100}%` }}
        />
      </div>

      {!passed && (
        <button
          onClick={onReset}
          className='px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95'>
          Try Again
        </button>
      )}

      {passed && (
        <div className='flex items-center gap-2 text-green-700'>
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
          <span className='font-semibold'>Captcha Complete</span>
        </div>
      )}
    </div>
  );
};
