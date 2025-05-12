import { createReducer, on } from "@ngrx/store";
import { GameState } from "../state/game.state";
import { addAttempt, resetGame } from "../actions/game.actions";
import { Frame } from "../../core/models/frame.model";
import { Game } from "../../core/models/game.model";
import { ScoringService } from "../../core/services/scoring.service";

const scoringService = new ScoringService();

export const initialState: GameState = {
  game: {
    frames: Array(10).fill(null).map(() => ({
      attempts: [],
      score: null,
      isStrike: false,
      isSpare: false,
      isLastFrame: false
    })),
    currentFrame: 0,
    isCompleted: false
  }
}

export const gameReducer = createReducer(
  initialState,

  on(addAttempt, (state, { pins }) => {
    const indexCurrentFrame = state.game.currentFrame;
    const currentFrame = state.game.frames[indexCurrentFrame];

    const newFrame: Frame = {
      ...currentFrame,
      attempts: [...currentFrame.attempts, { pins }],
      isLastFrame: currentFrame.isLastFrame
    };

    const newFrames = [...state.game.frames];
    newFrames[indexCurrentFrame] = newFrame;

    const scoredFrames = scoringService.calculateScore(newFrames);

    const isFinalFrame = indexCurrentFrame === 9;
    const frameComplete = checkIfFrameComplete(newFrame, isFinalFrame);

    const nextFrameIndex = isFinalFrame ? indexCurrentFrame : (frameComplete ? indexCurrentFrame + 1 : indexCurrentFrame);

    const updatedGame: Game = {
      ...state.game,
      frames: scoredFrames,
      currentFrame: nextFrameIndex,
      isCompleted: checkIfGameComplete({ ...state.game, frames: scoredFrames })
    };

    return {
      ...state,
      game: updatedGame
    };
  }),

  on(resetGame, () => ({
    game: createInitialGame(),
  }))
);

function createInitialGame(): Game {
  return {
    frames: Array(10).fill(null).map((_, i) => ({
      attempts: [],
      score: null,
      isStrike: false,
      isSpare: false,
      isLastFrame: i === 9
    })),
    currentFrame: 0,
    isCompleted: false
  };
}

function checkIfFrameComplete(frame: Frame, isFinalFrame: boolean): boolean {
  const attempts = frame.attempts;
  const first = attempts[0]?.pins ?? 0;
  const second = attempts[1]?.pins ?? 0;

  if (!isFinalFrame) {
    return first === 10 || attempts.length === 2;
  }

  const isStrike = first === 10;
  const isSpare = first + second === 10;

  if (isStrike || isSpare || isFinalFrame) {
    return attempts.length === 3;
  }

  return attempts.length === 2;
}

function checkIfGameComplete(game: Game): boolean {
  const lastFrame = game.frames[9];

  if (!lastFrame) return false;

  const attempts = lastFrame.attempts;
  const first = attempts[0]?.pins ?? 0;
  const second = attempts[1]?.pins ?? 0;

  if (attempts.length < 2) return false;

  const isStrike = first === 10;
  const isSpare = first + second === 10;

  if (isStrike || isSpare) {
    return attempts.length === 3;
  }

  return attempts.length === 2;
}