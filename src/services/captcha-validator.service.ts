import {
  MAXIMUM_INCORRECT_SELECTIONS,
  MINIMUM_CORRECT_SELECTIONS,
} from "../config/constants";
import type {
  CaptchaChallenge,
  GridSector,
  ICaptchaValidator,
  ValidationResult,
  WatermarkShape,
} from "../types/captcha";

export class CaptchaValidatorService implements ICaptchaValidator {
  validate(
    challenge: CaptchaChallenge,
    selections: string[]
  ): ValidationResult {
    const { grid, targetShape } = challenge;

    const selectedSectors = grid.sectors.filter((sector) =>
      selections.includes(sector.id)
    );

    let correctSelections = 0;
    let inCorrectSelections = 0;

    selectedSectors.forEach((sector) => {
      if (this.isCorrectSelection(sector, targetShape)) {
        correctSelections++;
      } else {
        inCorrectSelections++;
      }
    });

    const passed =
      correctSelections >= MINIMUM_CORRECT_SELECTIONS &&
      inCorrectSelections <= MAXIMUM_INCORRECT_SELECTIONS;

    const totalRequired = grid.sectors.filter(
      (sector) => sector.watermark?.shape === targetShape
    ).length;

    return {
      passed,
      correctSelections,
      totalRequired,
      userSelections: selections,
    };
  }
  isCorrectSelection(sector: GridSector, targetShape: WatermarkShape): boolean {
    return sector.watermark?.shape === targetShape;
  }

  calculateScore(result: ValidationResult): number {
    const { passed, correctSelections, totalRequired } = result;
    if (!passed || totalRequired === 0) return 0;
    return Math.round((correctSelections / totalRequired) * 100);
  }

  getFeedBack(result: ValidationResult): string {
    if (result.passed) {
      return `Great job! You correctly selected ${result.correctSelections} out of ${result.totalRequired} required sectors.`;
    }

    const score = this.calculateScore(result);
    if (score === 0) {
      return `Unfortunately, you didn't select any correct sectors. Please try again.`;
    } else if (score < 50) {
      return `You selected ${result.correctSelections} out of ${result.totalRequired} required sectors. Keep trying!`;
    } else {
      return `So Close! You selected ${result.correctSelections} out of ${result.totalRequired} required sectors. Try once more.`;
    }
  }
}

export const captchaValidatorService = new CaptchaValidatorService();
