import { base } from '../base';
export interface ILinearInterpolator<T> {
    layerStartProps: T;
    layerEndProps: T;
    layerInterpolatedProps: T;
}
export declare const LinearInterpolator: typeof LinearInterpolator_Class;
export declare class LinearInterpolator_Class<T> extends base.deck.LinearInterpolator implements ILinearInterpolator<T> {
    layerStartProps: T;
    layerEndProps: T;
    layerInterpolatedProps: T;
}
