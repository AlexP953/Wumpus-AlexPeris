import { Orientation, Action } from './index';

export interface MovementResponse {
    orientation: Orientation;
    additionalAction?: Action;
}
