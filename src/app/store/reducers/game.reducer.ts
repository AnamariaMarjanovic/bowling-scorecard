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

    const newFrame = {
      ...currentFrame,
      attempts: [...currentFrame.attempts, { pins }],
    };

    const newFrames = [...state.game.frames];
    newFrames[indexCurrentFrame] = newFrame;

    const scoredFrames = scoringService.calculateScore(newFrames);

    const newGame = {
      ...state.game,
      frames: scoredFrames,
      currentFrame: checkIfFrameComplete(newFrame, indexCurrentFrame === 9) ? indexCurrentFrame + 1 : indexCurrentFrame,
      isCompleted: checkIfGameComplete(state.game),
    }

    return {
      ...state,
      game: newGame
    };
  }),

  on(resetGame, () => ({
    game: createInitialGame(),
  }))
);

function createInitialGame(): Game {
  return {
    frames: Array(10).fill(null).map(() => ({
      attempts: [],
      score: null,
      isStrike: false,
      isSpare: false,
      isLastFrame: false
    })),
    currentFrame: 0,
    isCompleted: false
  };
}

function checkIfFrameComplete(frame: Frame, isFinalFrame: boolean): boolean {
  if (isFinalFrame) {
    return frame.attempts.length >= 2 || frame.attempts[0]?.pins === 10;
  }

  return frame.attempts[0]?.pins === 10 || frame.attempts.length === 2;
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