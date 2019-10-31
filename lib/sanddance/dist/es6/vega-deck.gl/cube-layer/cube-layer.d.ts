/// <reference types="deck.gl" />
import { base } from '../base';
import { Cube } from '../interfaces';
import { LayerProps } from '@deck.gl/core/lib/layer';
import { LinearInterpolator_Class } from '../deck.gl-classes/linearInterpolator';
export interface CubeLayerDefaultProps {
    lightingMix: number;
    fp64?: boolean;
    getColor?: (o: Cube) => number[];
    getSize?: (o: Cube) => number[];
    getPosition?: (o: Cube) => number[];
}
export interface CubeLayerDataProps {
    data: Cube[];
    interpolator?: LinearInterpolator_Class<CubeLayerInterpolatedProps>;
}
export interface CubeLayerInterpolatedProps {
    lightingMix: number;
}
export declare type CubeLayerProps = LayerProps & CubeLayerDefaultProps & CubeLayerDataProps;
/**
 * CubeLayer - a Deck.gl layer to render cuboids.
 * This is instantiatable by calling `new CubeLayer()`.
 */
export declare const CubeLayer: typeof CubeLayer_Class;
/**
 * CubeLayer - a Deck.gl layer to render cuboids.
 * This is not instantiatable, it is the TypeScript declaration of the type.
 */
export declare class CubeLayer_Class extends base.deck.Layer {
    id: string;
    props: CubeLayerProps;
}
