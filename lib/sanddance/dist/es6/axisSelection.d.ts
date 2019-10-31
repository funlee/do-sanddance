/// <reference types="deck.gl" />
import * as VegaDeckGl from './vega-deck.gl';
import PolygonLayer from '@deck.gl/layers/polygon-layer/polygon-layer';
import { SpecCapabilities, SpecColumns } from './specs/types';
import { SearchExpressionGroup } from './searchExpression/types';
export interface AxisSelectionHandler {
    (event: TouchEvent | MouseEvent | PointerEvent, search: SearchExpressionGroup): void;
}
export declare function axisSelectionLayer(presenter: VegaDeckGl.Presenter, specCapabilities: SpecCapabilities, columns: SpecColumns, stage: VegaDeckGl.types.Stage, clickHandler: AxisSelectionHandler, highlightColor: number[], polygonZ: number): PolygonLayer;
