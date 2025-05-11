import { createAction, props } from "@ngrx/store";

export const addAttempt = createAction(
    '[Game] Add Attempt',
    props<{ pins: number }>()
);

export const resetGame = createAction(
    '[Game] Reset Game');
