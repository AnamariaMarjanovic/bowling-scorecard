import { Injectable } from '@angular/core';
import { Frame } from '../models/frame.model';
import { Attempt } from '../models/attempt.model';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {

  calculateScore(frames: Frame[]): Frame[] {

    // STRIKE (X) - all pins knocked down at first attempt; 10 p + number of pins for entire next frame
    // SPARE (/) - all pins knocked down after seconf attempt; 10 p + number of pins for first attempt of next frame
    // OPEN FRAME - sum of all attempts in the frame

    const result = frames.map((frame, i) => {
      const isStrike = this.isStrike(frame);
      const isSpare = this.isSpare(frame);
      let score = null;

      if (isStrike) {
        score = 10 + this.getNextTwoPins(frames, i);
      } else if (isSpare) {
        score = 10 + this.getNextPin(frames, i);
      } else {
        score = this.calculateOpenFrame(frame.attempts);
      }

      return {
        ...frame,
        isStrike,
        isSpare,
        score
      };
    });

    return result;
  }

  private isStrike(frame: Frame): boolean {
    return frame.attempts.length === 1 && frame.attempts[0].pins === 10;
  }

  private isSpare(frame: Frame): boolean {
    return frame.attempts.length === 2 && this.calculateOpenFrame(frame.attempts) === 10;
  }

  private getNextPin(frames: Frame[], i: number): number {
    const nextFrame = frames[i + 1];
    return nextFrame?.attempts[0]?.pins ?? 0;
  }

  private getNextTwoPins(frames: Frame[], i: number): number {
    const nextFrame = frames[i + 1];
    const frameAfter = frames[i + 2];

    if (!nextFrame) return 0;

    if (nextFrame.attempts.length >= 2) {
      return nextFrame.attempts[0].pins + nextFrame.attempts[1].pins;
    } else if (nextFrame.attempts.length === 1) {
      const first = nextFrame.attempts[0].pins;
      const second = frameAfter?.attempts[0]?.pins ?? 0;
      return first + second;
    }

    return 0;
  }

  private calculateOpenFrame(attempts: Attempt[]): number {
    return attempts.reduce((sum, attempt) => sum + attempt.pins, 0);
  }
}
