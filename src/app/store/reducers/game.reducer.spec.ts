import { gameReducer, initialState } from './game.reducer';
import { addAttempt, resetGame } from '../actions/game.actions';

describe('GameReducer', () => {
    it('should reset game on resetGame action', () => {
        const state = gameReducer(undefined, resetGame());
        expect(state.game.frames.length).toBe(10);
        expect(state.game.currentFrame).toBe(0);
    });

    it('should add an attempt and move to next frame when frame is complete', () => {
        const stateAfterFirstRoll = gameReducer(initialState, addAttempt({ pins: 10 }));

        expect(stateAfterFirstRoll.game.currentFrame).toBe(1);
        expect(stateAfterFirstRoll.game.frames[0].attempts[0].pins).toBe(10);
    });
});
