let vega = {
    CanvasHandler: null,
    inferType: null,
    inferTypes: null,
    loader: null,
    parse: null,
    read: null,
    renderModule: null,
    Renderer: null,
    sceneVisit: null,
    scheme: null,
    View: null
};
let deck = {
    CompositeLayer: null,
    COORDINATE_SYSTEM: null,
    Deck: null,
    Layer: null,
    LinearInterpolator: null,
    OrbitView: null,
    _OrbitController: null
};
let layers = {
    IconLayer: null,
    LineLayer: null,
    PolygonLayer: null,
    TextLayer: null
};
let luma = {
    CubeGeometry: null,
    fp64: null,
    Model: null,
    Texture2D: null
};
/**
 * References to dependency libraries.
 */
export const base = {
    deck,
    layers,
    luma,
    vega
};
/**
 * Specify the dependency libraries to use for rendering.
 * @param vega Vega library.
 * @param deck deck/core library.
 * @param layers deck/layers library.
 * @param luma luma.gl library.
 */
export function use(vega, deck, layers, luma) {
    base.deck = deck;
    base.layers = layers;
    base.luma = luma;
    base.vega = vega;
}
