import * as VegaDeckGl from './vega-deck.gl';
import { Column, Insight, SpecColumns } from './specs/types';
import { OrdinalMap } from './types';
export declare function assignOrdinals(columns: SpecColumns, data: object[], ordinalMap?: OrdinalMap): OrdinalMap;
export declare function getSpecColumns(insight: Insight, columns: Column[]): SpecColumns;
export declare function getDataIndexOfCube(cube: VegaDeckGl.types.Cube, data: object[]): number;
