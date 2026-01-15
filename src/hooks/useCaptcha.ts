import { useCallback, useRef, useState } from "react";
import type { CaptchaState, GridSector, SquareArea } from "../types/captcha";
import { captchaGeneratorService } from "../services/captcha-generator.service";
import { captchaValidatorService } from "../services/captcha-validator.service";

export interface IUseCaptcha {
  state: CaptchaState;
  startChallenge: (imageData: string, squareArea: SquareArea) => Promise<void>;
  selectSector: (sectorId: string) => void;
  validateSelections: () => void;
  reset: () => void;
}
export function useCaptcha(): IUseCaptcha {
  const [state, setState] = useState<CaptchaState>({
    stage: "camera_capture",
    challenge: null,
    result: null,
    error: null,
    loading: false,
  });

  const startTimeRef = useRef<number>(0);

  const startChallenge = useCallback(
    async (imageData: string, squareArea: SquareArea) => {
      try {
        setState((prevState: CaptchaState) => ({
          ...prevState,
          error: null,
          loading: true,
        }));

        const challenge = await captchaGeneratorService.generateChallenge();
        const updatedChallenge = {
          ...challenge,
          capturedImage: imageData,
          squareArea,
        };

        setState({
          stage: "puzzle_selection",
          challenge: updatedChallenge,
          result: null,
          error: null,
          loading: false,
        });

        startTimeRef.current = Date.now();
      } catch (error) {
        console.error("Error starting CAPTCHA challenge:", error);
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to start CAPTCHA challenge";
        setState((prevState: CaptchaState) => ({
          ...prevState,
          error: errorMsg,
          loading: false,
        }));
      }
    },
    []
  );

  const selectSector = useCallback((sectorId: string) => {
    setState((prev: CaptchaState) => {
      if (!prev.challenge) return prev;
      const updatedSectors = prev.challenge.grid.sectors.map((sector) =>
        sector.id === sectorId
          ? { ...sector, selected: !sector.selected }
          : sector
      );

      return {
        ...prev,
        challenge: {
          ...prev.challenge,
          grid: {
            ...prev.challenge.grid,
            sectors: updatedSectors,
          },
        },
      };
    });
  }, []);

  const validateSelections = useCallback(() => {
    if (!state.challenge) return;

    const timeElapsed = Date.now() - startTimeRef.current;
    if (timeElapsed < 3000) {
      setState({
        ...state,
        error: "Please take your time to select the correct pieces.",
      });
      return;
    }

    const selectedIds: string[] = state.challenge.grid.sectors
      .filter((sector: GridSector) => sector.selected)
      .map((sector: GridSector) => sector.id);
    const result = captchaValidatorService.validate(
      state.challenge,
      selectedIds
    );
    setState({
      stage: "result",
      challenge: state.challenge,
      result,
      error: null,
      loading: false,
    });
  }, [state]);

  const reset = useCallback(() => {
    setState({
      stage: "camera_capture",
      challenge: null,
      result: null,
      error: null,
      loading: false,
    });
    startTimeRef.current = 0;
  }, []);

  return {
    state,
    startChallenge,
    selectSector,
    validateSelections,
    reset,
  };
}
