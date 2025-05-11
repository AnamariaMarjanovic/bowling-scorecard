import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GameState } from "../state/game.state";

export const selectGameState = createFeatureSelector<GameState>('gameState');

export const selectGame = createSelector(
    selectGameState,
    (state: GameState) => state.game
);

export const selectFrames = createSelector(
    selectGame,
    (game) => game.frames
);

export const selectCurrentFrame = createSelector(
    selectGame,
    (game) => game.currentFrame
);

export const selectIsGameCompleted = createSelector(
    selectGame,
    (game) => game.isCompleted
);