import { Spec } from 'vega-typings';
import { SpecCapabilities, SpecContext } from './types';
/**
 * Specification result object.
 */
export interface SpecResult {
    errors?: string[];
    vegaSpec: Spec;
    specCapabilities: SpecCapabilities;
}
export interface SpecCreator {
    (context: SpecContext): SpecResult;
}
