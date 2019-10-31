import { _OrbitController, CompositeLayer, COORDINATE_SYSTEM, Deck, IconLayer, Layer, LinearInterpolator, LineLayer, OrbitView, PolygonLayer, TextLayer } from 'deck.gl';
import { CanvasHandler, inferType, inferTypes, loader, parse, read, Renderer, renderModule, sceneVisit, scheme, View } from 'vega-typings';
import { CubeGeometry, fp64, Model, Texture2D } from 'luma.gl';
/**
 * Vega library dependency.
 */
export interface VegaBase {
    CanvasHandler: CanvasHandler;
    inferType: typeof inferType;
    inferTypes: typeof inferTypes;
    loader: typeof loader;
    parse: typeof parse;
    read: typeof read;
    renderModule: typeof renderModule;
    Renderer: typeof Renderer;
    sceneVisit: typeof sceneVisit;
    scheme: typeof scheme;
    View: typeof View;
}
/**
 * deck.gl/core dependency.
 */
export interface DeckBase {
    CompositeLayer: typeof CompositeLayer;
    COORDINATE_SYSTEM: typeof COORDINATE_SYSTEM;
    Deck: typeof Deck;
    Layer: typeof Layer;
    LinearInterpolator: typeof LinearInterpolator;
    OrbitView: typeof OrbitView;
    _OrbitController: typeof _OrbitController;
}
/**
 * deck.gl/layers dependency.
 */
export interface DeckLayerBase {
    IconLayer: typeof IconLayer;
    LineLayer: typeof LineLayer;
    PolygonLayer: typeof PolygonLayer;
    TextLayer: typeof TextLayer;
}
/**
 * luma.gl dependency.
 */
export interface LumaBase {
    CubeGeometry: typeof CubeGeometry;
    fp64: typeof fp64;
    Model: typeof Model;
    Texture2D: typeof Texture2D;
}
/**
 * References to dependency libraries.
 */
export interface Base {
    deck: DeckBase;
    layers: DeckLayerBase;
    luma: LumaBase;
    vega: VegaBase;
}
/**
 * References to dependency libraries.
 */
export declare const base: Base;
/**
 * Specify the dependency libraries to use for rendering.
 * @param vega Vega library.
 * @param deck deck/core library.
 * @param layers deck/layers library.
 * @param luma luma.gl library.
 */
export declare function use(vega: VegaBase, deck: DeckBase, layers: DeckLayerBase, luma: LumaBase): void;
