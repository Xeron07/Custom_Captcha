import {
  MINIMUM_CORRECT_SELECTIONS,
  WatermarkShapes,
} from "./../config/constants";
import { DEFAULT_CAPTCHA_CONFIG } from "../config/constants";
import type {
  CaptchaChallenge,
  CaptchaGrid,
  ICaptchaGenerator,
  SquareArea,
  GridSector,
  WatermarkShape,
} from "../types/captcha";

export class CaptchaGeneratorService implements ICaptchaGenerator {
  /**
   * Get an array of unique random indices.
   * @param max The maximum value (exclusive) for the random indices.
   * @param count The number of unique random indices to generate.
   * @returns An array of unique random indices.
   */
  private getRandomIndex(max: number, count: number): number[] {
    const indices: Set<number> = new Set();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * max));
    }
    return Array.from(indices);
  }

  /**
   * Get a random integer within a range.
   * @param min The minimum value (inclusive) for the random integer.
   * @param max The maximum value (inclusive) for the random integer.
   * @returns A random integer within the specified range.
   */
  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateId(): string {
    return `id-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a CAPTCHA challenge.
   * @returns A promise that resolves to a CaptchaChallenge object.
   */
  async generateChallenge(): Promise<CaptchaChallenge> {
    const squareArea = this.generateSquareArea();

    const grid = this.generateGrid(
      DEFAULT_CAPTCHA_CONFIG.gridRows,
      DEFAULT_CAPTCHA_CONFIG.gridCols
    );

    const { gridWithWatermarks, targetShape } = this.generateWatermarks(
      grid,
      Math.floor(grid.sectors.length * DEFAULT_CAPTCHA_CONFIG.watermarkRatio)
    );

    return {
      id: this.generateId(),
      targetShape,
      grid: gridWithWatermarks,
      squareArea,
      capturedImage: "",
    };
  }

  /**
   * Generate a square area for the CAPTCHA.
   * @returns A SquareArea object representing the generated square area.
   */
  generateSquareArea(): SquareArea {
    const size = DEFAULT_CAPTCHA_CONFIG.squareSizePercent;

    const maxPosition = 100 - size;

    return {
      size,
      position: {
        x: this.randomInRange(0, maxPosition),
        y: this.randomInRange(0, maxPosition),
      },
    };
  }

  /**
   * Generate a grid for the CAPTCHA.
   * @param rows The number of rows in the grid.
   * @param cols The number of columns in the grid.
   * @returns A CaptchaGrid object representing the generated grid.
   */
  generateGrid(rows: number, cols: number): CaptchaGrid {
    const sectors: GridSector[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        sectors.push({
          id: `sector-${row}${col}`,
          row,
          col,
          selected: false,
        });
      }
    }
    return { sectors, rows, cols };
  }

  /**
   * Generate watermarks for the CAPTCHA grid.
   * @param grid The CAPTCHA grid to add watermarks to.
   * @param count The number of watermarks to generate.
   * @returns An object containing the new CaptchaGrid with watermarks and the target shape.
   */

  generateWatermarks(
    grid: CaptchaGrid,
    count: number
  ): { gridWithWatermarks: CaptchaGrid; targetShape: WatermarkShape } {
    const sectors = [...grid.sectors];
    const selectedIndexs = this.getRandomIndex(sectors.length, count);
    const requiredNumber = MINIMUM_CORRECT_SELECTIONS;
    const shapes: WatermarkShape[] = WatermarkShapes;

    // Randomly select which shape will be the target
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];

    // Assign the target shape to the required number of sectors
    const targetIndices = selectedIndexs.slice(0, requiredNumber);
    targetIndices.forEach((index) => {
      sectors[index] = {
        ...sectors[index],
        watermark: {
          shape: targetShape,
          id: `watermark-${index}`,
        },
      };
    });

    // Assign random shapes to the remaining watermark positions
    const remainingIndices = selectedIndexs.slice(requiredNumber);
    remainingIndices.forEach((index) => {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      sectors[index] = {
        ...sectors[index],
        watermark: {
          shape: randomShape,
          id: `watermark-${index}`,
        },
      };
    });

    return { gridWithWatermarks: { ...grid, sectors }, targetShape };
  }
}

export const captchaGeneratorService = new CaptchaGeneratorService();
