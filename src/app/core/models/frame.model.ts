import { Attempt } from "./attempt.model";

export interface Frame {
    attempts: Attempt[];
    score: number | null;
}