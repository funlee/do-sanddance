/// <reference types="deck.gl" />
import { base } from '../../base';
import { Color } from '@deck.gl/core/utils/color';
import { FontSettings } from '@deck.gl/layers/text-layer/font-atlas';
import { IconLayerProps } from '@deck.gl/layers/icon-layer/icon-layer';
import { LayerProps } from '@deck.gl/core/lib/layer';
export interface MultiIconLayerProps extends LayerProps, IconLayerProps, FontSettings {
    getPickingIndex?: (x: any) => number;
    getAnchorX?: (x: any) => number;
    getAnchorY?: (x: any) => number;
    getLengthOfQueue?: (x: any) => number;
    getShiftInQueue?: (x: any) => number;
    getHighlightColor?: (x: any) => Color;
    getPixelOffset?: (x: any) => [number, number];
}
/**
 * CubeLayer - a Deck.gl layer to render cuboids.
 * This is instantiatable by calling `new MultiIconLayer()`.
 */
export declare const MultiIconLayer: typeof MultiIconLayer_Class;
/**
 * CubeLayer - a Deck.gl layer to render cuboids.
 * This is not instantiatable, it is the TypeScript declaration of the type.
 */
export declare class MultiIconLayer_Class extends base.deck.Layer {
    id: string;
    props: MultiIconLayerProps;
    constructor(props: MultiIconLayerProps);
    constructor(...props: Partial<MultiIconLayerProps>[]);
}
