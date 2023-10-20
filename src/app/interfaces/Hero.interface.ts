import { Orientation } from './orientation.type';

export interface Hero {
    orientation: Orientation;
    numOfArrows: number;
    hasGold: boolean;
    row: number;
    col: number;
}
