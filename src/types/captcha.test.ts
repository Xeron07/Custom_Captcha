import type { GridSector, WatermarkShape } from "./captcha";
import { describe, it, expect } from "vitest";

describe("Type Defination and basic test", () => {
  it("should define GridSector type", () => {
    const sector: GridSector = {
      id: "test-sector-1",
      row: 0,
      col: 0,
      selected: false,
    };
    expect(sector).toBeDefined();
    expect(sector.id).toBe("test-sector-1");
  });

  it("should define WatermarkShape type", () => {
    const shape: WatermarkShape = "circle";
    expect(shape).toBeDefined();
    expect(shape).toBe("circle");
  });
});
