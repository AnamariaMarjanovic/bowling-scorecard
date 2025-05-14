import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, take } from 'rxjs';
import { Frame } from '../../core/models/frame.model';
import {
  selectCurrentFrame,
  selectFrames,
  selectGame,
  selectIsGameCompleted
} from '../../store/selectors/game.selectors';
import { addAttempt, resetGame } from '../../store/actions/game.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  frames$: Observable<Frame[]>;
  currentFrame$: Observable<Frame>;
  isGameCompleted$: Observable<boolean>;
  totalScore$: Observable<number>

  constructor(private store: Store) {
    this.frames$ = this.store.select(selectFrames);
    this.isGameCompleted$ = this.store.select(selectIsGameCompleted);

    this.currentFrame$ = combineLatest([
      this.frames$,
      this.store.select(selectCurrentFrame)
    ]).pipe(
      map(([frames, index]) => frames[index])
    );

    this.totalScore$ = this.frames$.pipe(
      map(frames => frames[9]?.score ?? 0)
    );
  }

  submitAttempt(input: number | string): void {
    this.store.select(selectGame).pipe(take(1)).subscribe(game => {
      const currentFrameIndex = game.currentFrame;
      const currentFrame = game.frames[game.currentFrame];
      const isFirstAttempt = currentFrame.attempts.length === 0;
      const isTenthFrame = currentFrameIndex === 9;

      let pins: number;

      if (input === 'X') {
        if (!isFirstAttempt && !isTenthFrame) return;
        pins = 10;
      } else if (input === '/') {
        if (isFirstAttempt) return;
        const firstPins = currentFrame.attempts[currentFrame.attempts.length - 1]?.pins ?? 0;
        pins = 10 - firstPins;
      } else {
        pins = input as number;
      }

      if (isTenthFrame) {
        const attempts = currentFrame.attempts;

        if (attempts.length === 3) return;

        const first = attempts[0]?.pins ?? 0;
        const second = attempts[1]?.pins ?? 0;

        if (attempts.length === 0) {
        } else if (attempts.length === 1) {
        } else if (attempts.length === 2) {
          const isStrike = first === 10;
          const isSpare = first + second === 10;

          if (!isStrike && !isSpare) return;
        }
      }

      this.store.dispatch(addAttempt({ pins }));
    });
  }

  isSpare(frame: Frame): boolean {
    return frame.attempts.length >= 2 &&
      frame.attempts[0].pins < 10 &&
      (frame.attempts[0].pins + frame.attempts[1].pins === 10);
  }

  isStrike(frame: Frame): boolean {
    return frame.attempts.length === 1 && frame.attempts[0]?.pins === 10;
  }

  getDisabledPins(frame: Frame): boolean[] {
    const disabled = Array(11).fill(false);

    if (frame.attempts.length >= 1 && frame.attempts.length <= 2 && frame.isLastFrame) {
      return disabled;
    }

    const isSecondAttempt = frame.attempts.length === 1;
    if (isSecondAttempt) {
      const firstPins = frame.attempts[0].pins;
      for (let i = 0; i <= 10; i++) {
        if (firstPins + i > 10) {
          disabled[i] = true;
        }
      }
    }

    return disabled;
  }

  disableSpare(frame: Frame): boolean {
    return frame.attempts.length !== 1 || frame.attempts[0].pins >= 10;
  }

  disableStrike(frame: Frame): boolean {
    if (frame.isLastFrame) {
      return frame.attempts.length >= 3;
    }

    return frame.attempts.length !== 0;
  }

  shouldShowScore(frames: Frame[], index: number): boolean {
    const frame = frames[index];
    if (frame.score == null) return false;

    const isStrike = frame.attempts.length === 1 && frame.attempts[0]?.pins === 10;
    const isSpare = frame.attempts.length === 2 && (frame.attempts[0].pins + frame.attempts[1].pins === 10);
    const isOpenFrame = frame.attempts.length === 2 && (frame.attempts[0].pins + frame.attempts[1].pins < 10);
    const isTenth = index === 9;

    if (isTenth) return true;

    if (isOpenFrame) return true;

    if (isSpare) {
      return frames[index + 1]?.attempts.length >= 1;
    }

    if (isStrike) {
      const next = frames[index + 1];
      const after = frames[index + 2];

      if (next?.attempts.length >= 2) return true;
      if (next?.attempts.length === 1 && after?.attempts.length >= 1) return true;
    }

    return false;
  }

  resetGame(): void {
    this.store.dispatch(resetGame());
  }
}
