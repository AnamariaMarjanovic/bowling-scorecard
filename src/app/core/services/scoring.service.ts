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

    const result: Frame[] = [];
    let runningTotal = 0;

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const isTenth = i === 9;
      let frameScore = null;

      if (isTenth) {
        frameScore = this.calculateOpenFrame(frame.attempts);
        runningTotal += frameScore;

        result.push({
          ...frame,
          isStrike: this.isStrike(frame),
          isSpare: this.isSpare(frame),
          score: runningTotal,
          isLastFrame: true
        });
        continue;
      }

      const isStrike = this.isStrike(frame);
      const isSpare = this.isSpare(frame);

      if (isStrike) {
        frameScore = 10 + this.getNextTwoPins(frames, i);
      } else if (isSpare) {
        frameScore = 10 + this.getNextPin(frames, i);
      } else {
        frameScore = this.calculateOpenFrame(frame.attempts);
      }

      const isScorable = (isStrike && this.getNextTwoPins(frames, i) !== 0) ||
        (isSpare && this.getNextPin(frames, i) !== 0) ||
        (!isStrike && !isSpare);

      if (isScorable) {
        runningTotal += frameScore;
      }

      result.push({
        ...frame,
        isStrike,
        isSpare,
        score: isScorable ? runningTotal : null,
        isLastFrame: frame.isLastFrame
      });
    }

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
