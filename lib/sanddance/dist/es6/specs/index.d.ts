import * as constants from './constants';
import { Chart, SpecContext } from './types';
import { SpecCreator, SpecResult } from './interfaces';
export { constants };
export declare const creators: {
    [chart in Chart]: SpecCreator;
};
export declare function create(context: SpecContext): SpecResult;
