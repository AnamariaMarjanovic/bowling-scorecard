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
        const newGame = { ...state.game };
        const currentFrame = newGame.frames[newGame.currentFrame];

        currentFrame.attempts.push({ pins });

        // Move to next frame if done
        const isFinalFrame = newGame.currentFrame === 9;
        const isComplete = checkIfFrameComplete(currentFrame, isFinalFrame);

        if (isComplete && newGame.currentFrame < 9) {
            newGame.currentFrame++;
        }

        newGame.frames = scoringService.calculateScore(newGame.frames);
        newGame.isCompleted = checkIfGameComplete(newGame);

        return { ...state, game: newGame };
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
  if (isFinalFrame) return frame.attempts.length >= 2;
  return frame.isStrike || frame.attempts.length === 2;
}

function checkIfGameComplete(game: Game): boolean {
  return game.currentFrame === 9 && game.frames[9].attempts.length >= 2;
}