import { selectCurrentFrame, selectIsGameCompleted } from "./game.selectors"

describe('Game Selectors', () => {
    const mockState = {
        gameState: {
            game: {
                frames: Array(10).fill({ attempts: [], score: null }),
                currentFrame: 3,
                isCompleted: false
            }
        }
    }

    it('should select current frame', () => {
        const result = selectCurrentFrame(mockState);
        expect(result).toBe(3);
    })

    it('should return is game completed status', () => {
        const result = selectIsGameCompleted(mockState);
        expect(result).toBe(false);
    })
})