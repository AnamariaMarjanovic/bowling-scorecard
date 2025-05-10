import { Attempt } from "./attempt.model";

export interface Frame {
    attempts: Attempt[];
    score: number | null;
    isStrike: boolean;
    isSpare: boolean;
    isLastFrame: boolean;
}