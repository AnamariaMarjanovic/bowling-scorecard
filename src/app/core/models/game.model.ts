import { Frame } from "./frame.model";

export interface Game {
    frames: Frame[];
    currentFrame: number;
}