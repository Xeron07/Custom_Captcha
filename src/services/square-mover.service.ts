import type { Position } from "../types/captcha";

interface IMovementConfig {
  interval: number;
  transitionDuration: number;
  boundaryPadding: number;
}

export class SquareMoverService {
  private intervalId: number | null = null;
  private currentPosition: Position = { x: 0, y: 0 };
  private targetPosition: Position = { x: 0, y: 0 };
  private isAnimating = false;

  private animateToTarget(onUpdate: (position: Position) => void): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const startTime = performance.now();
    const initialPosition = { ...this.currentPosition };
    const deltaX = this.targetPosition.x - initialPosition.x;
    const deltaY = this.targetPosition.y - initialPosition.y;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / 300, 1);

      this.currentPosition.x = initialPosition.x + deltaX * progress;
      this.currentPosition.y = initialPosition.y + deltaY * progress;

      onUpdate(this.currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };

    requestAnimationFrame(animate);
  }

  private setTargetPosition(
    position: Position,
    onUpdate: (position: Position) => void
  ): void {
    this.targetPosition = position;
    this.animateToTarget(onUpdate);
  }

  generateRandomPosition(padding: number): Position {
    const maxPosition = 100 - padding;
    const minPosition = padding;
    return {
      x: Math.random() * (maxPosition - minPosition) + minPosition,
      y: Math.random() * (maxPosition - minPosition) + minPosition,
    };
  }

  getCurrentPosition(): Position {
    return this.currentPosition;
  }

  start(config: IMovementConfig, onUpdate: (position: Position) => void): void {
    this.stop();
    this.currentPosition = this.generateRandomPosition(config.boundaryPadding);
    this.targetPosition = { ...this.currentPosition };
    onUpdate(this.currentPosition);

    this.intervalId = setInterval(() => {
      const newPosition = this.generateRandomPosition(config.boundaryPadding);
      this.setTargetPosition(newPosition, onUpdate);
    }, config.interval);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isAnimating = false;
  }
}

export const squareMoverService = new SquareMoverService();
