import { ColorValueRef, ProductionRule } from 'vega-typings';
import { SpecContext } from './types';
export declare function fill(context: SpecContext): ProductionRule<ColorValueRef>;
export declare function opacity(context: SpecContext): import("vega-typings/types").SignalRef & {
    exponent?: import("vega-typings/types").NumberValue;
    mult?: import("vega-typings/types").NumberValue;
    offset?: import("vega-typings/types").NumberValue;
    round?: boolean;
    extra?: boolean;
};
