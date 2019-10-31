/// <reference types="deck.gl" />
import { base } from '../base';
import { Color } from '@deck.gl/core/utils/color';
import { LayerProps } from '@deck.gl/core/lib/layer';
import { TextLayerDatum, TextLayerProps } from '@deck.gl/layers/text-layer/text-layer';
export interface ChromaticTextLayerProps extends TextLayerProps {
    getHighlightColor?: (x: TextLayerDatum) => Color;
}
/**
 * TextLayer - a modification of deck.gl's TextLayer.
 * This is instantiatable by calling `new TextLayer()`.
 */
export declare const ChromaticTextLayer: typeof ChromaticTextLayer_Class;
/**
 * CubeLayer - a Deck.gl layer to render cuboids.
 * This is not instantiatable, it is the TypeScript declaration of the type.
 */
export declare class ChromaticTextLayer_Class extends base.deck.Layer {
    id: string;
    props: ChromaticTextLayerProps;
    constructor(props: LayerProps & ChromaticTextLayerProps);
}
