import { Injectable } from '@angular/core';
import { Frame } from '../models/frame.model';
import { Attempt } from '../models/attempt.model';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {

  calculateScore(frames: Frame[]): Frame[] {
    const scorredFrames = [...frames];

    for (let i = 0; i < scorredFrames.length; i++) {
      const frame = scorredFrames[i];

      // STRIKE (X) - all pins knocked down at first attempt; 10 p + number of pins for entire next frame
      // SPARE (/) - all pins knocked down after seconf attempt; 10 p + number of pins for first attempt of next frame
      // OPEN FRAME - sum of all attempts in the frame

      frame.isStrike = this.isStrike(frame);
      frame.isSpare = this.isSpare(frame);

      if (frame.isStrike) {
        frame.score = this.calculateStrike(scorredFrames, i);
      } else if (frame.isSpare) {
        frame.score = this.calculateSpare(scorredFrames, i);
      } else {
        frame.score = this.calculateOpenFrame(frame.attempts);
      }
    }

    return scorredFrames;
  }

  private isStrike(frame: Frame): boolean {
    return frame.attempts.length === 1 && frame.attempts[0].pins === 10;
  }

  private isSpare(frame: Frame): boolean {
    return frame.attempts.length === 2 && this.calculateOpenFrame(frame.attempts) === 10;
  }

  private calculateStrike(frames: Frame[], i: number): number {
    const nextFrame = frames[i + 1];

    if (!nextFrame) return 0;

    return nextFrame.attempts[0].pins + nextFrame.attempts[1].pins;
  }

  private calculateSpare(frames: Frame[], i: number): number {
    const nextFrame = frames[i + 1];
    return nextFrame?.attempts[0]?.pins ?? 0;
  }

   private calculateOpenFrame(attempts: Attempt[]): number {
    return attempts.reduce((sum, attempt) => sum + attempt.pins, 0);
  }
}
