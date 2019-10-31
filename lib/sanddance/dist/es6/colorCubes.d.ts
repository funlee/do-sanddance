import * as VegaDeckGl from './vega-deck.gl';
import { ColorContext, ColorMap, ColorMethod, ViewerOptions } from './types';
export declare function getSelectedColorMap(currentData: object[], showSelectedData: boolean, showActive: boolean, viewerOptions: ViewerOptions): ColorMap;
export declare function colorMapFromCubes(cubes: VegaDeckGl.types.Cube[]): ColorMap;
export declare function populateColorContext(colorContext: ColorContext, presenter: VegaDeckGl.Presenter): void;
export declare function applyColorMapToCubes(maps: ColorMap[], cubes: VegaDeckGl.types.Cube[], unselectedColorMethod?: ColorMethod): void;
