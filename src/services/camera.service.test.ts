import { describe, it, expect, beforeEach, vi } from "vitest";
import { CameraService } from "./camera.service";

describe("Cameraservice Test", () => {
  let service: CameraService;

  beforeEach(() => {
    service = new CameraService();
  });

  describe("isSupported", () => {
    it("should return true if getUserMedia is supported", () => {
      const result = CameraService.isSupported();
      expect(result).toBe(false);
    });
  });

  describe("stop", () => {
    it("should stop all tracks in the stream", () => {
      const stopSpy = vi.fn();
      const mockTrack = { stop: stopSpy };

      const stream = {
        getTracks: vi.fn(() => [mockTrack]),
      } as unknown as MediaStream;

      service.stop(stream);

      expect(stopSpy).toHaveBeenCalledTimes(1);
    });
    it("should handle errors gracefully when stopping tracks", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const stream = {
        getTracks: vi.fn(() => {
          throw new Error("Testing stop Error");
        }),
      } as unknown as MediaStream;

      expect(() => service.stop(stream)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
