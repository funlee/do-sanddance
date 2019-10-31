import { Axis } from 'vega-typings';
import { SpecViewOptions } from './types';
export declare function partialAxes(specViewOptions: SpecViewOptions, xColumnQuantitative: boolean, yColumnQuantitative: boolean): {
    left: Partial<Axis>;
    bottom: Partial<Axis>;
};
