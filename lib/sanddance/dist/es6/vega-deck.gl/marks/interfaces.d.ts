/// <reference types="deck.gl" />
import { Axis, FacetRect, Stage } from '../interfaces';
import { Color } from '@deck.gl/core/utils/color';
import { Scene, SceneGroup } from 'vega-typings';
export declare enum GroupType {
    none = 0,
    legend = 1,
    xAxis = 2,
    yAxis = 3
}
export interface MarkStagerOptions {
    offsetX: number;
    offsetY: number;
    maxOrdinal: number;
    ordinalsSpecified: boolean;
    currAxis: Axis;
    currFacetRect: FacetRect;
    defaultCubeColor: Color;
}
export declare type SceneGroup2 = SceneGroup & {
    datum?: any;
};
export interface LabelDatum {
    value: any;
}
export interface MarkStager {
    (options: MarkStagerOptions, stage: Stage, scene: Scene, x: number, y: number, groupType: GroupType): void;
}
