import { Spec, View } from 'vega-typings';
import { SignalValues } from './specs/types';
export declare function applySignalValues(sv: SignalValues, b: Spec): void;
export declare function extractSignalValuesFromView(view: View, spec: Spec): SignalValues;
