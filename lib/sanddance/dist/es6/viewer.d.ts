import * as VegaDeckGl from './vega-deck.gl';
import { ColorContext, RenderOptions, RenderResult, SelectionState, ViewerOptions } from './types';
import { Insight, SignalValues, SpecCapabilities } from './specs/types';
import { Search } from './searchExpression/types';
import { Spec } from 'vega-typings';
import { ViewGl_Class } from './vega-deck.gl/vega-classes/viewGl';
/**
 * Component to view a SandDance data visualization.
 */
export declare class Viewer {
    element: HTMLElement;
    /**
     * Default Viewer options.
     */
    static defaultViewerOptions: ViewerOptions;
    /**
     * Behavior specified by the visualization type.
     */
    specCapabilities: SpecCapabilities;
    /**
     * Viewer options object.
     */
    options: ViewerOptions;
    /**
     * Vega specification.
     */
    vegaSpec: Spec;
    /**
     * Vega View instance.
     */
    vegaViewGl: ViewGl_Class;
    /**
     * Presenter which does the rendering.
     */
    presenter: VegaDeckGl.Presenter;
    /**
     * Insight object from current rendering.
     */
    insight: Insight;
    /**
     * Color contexts. There is only one color context until data is filtered, after which colors may be re-mapped in another color context.
     */
    colorContexts: ColorContext[];
    /**
     * Index of current color context. Change this and then call renderSameLayout().
     */
    currentColorContext: number;
    private _specColumns;
    private _signalValues;
    private _dataScope;
    private _animator;
    private _details;
    private _tooltip;
    private _shouldSaveColorContext;
    private _lastColorOptions;
    /**
     * Instantiate a new Viewer.
     * @param element Parent HTMLElement to present within.
     * @param options Optional viewer options object.
     */
    constructor(element: HTMLElement, options?: Partial<ViewerOptions>);
    private changeColorContexts;
    private applyLegendColorContext;
    private onAnimateDataChange;
    private onDataChanged;
    private renderNewLayout;
    /**
     * Render the same layout with new options.
     * @param newViewerOptions New options object.
     */
    renderSameLayout(newViewerOptions?: Partial<ViewerOptions>): void;
    private getView;
    /**
     * Render data into a visualization.
     * @param insight Object to create a visualization specification.
     * @param data Array of data objects.
     * @param view Optional View to specify camera type.
     * @param ordinalMap Optional map of ordinals to assign to the data such that the same cubes can be re-used for new data.
     */
    render(insight: Insight, data: object[], options?: RenderOptions): Promise<RenderResult>;
    private shouldViewstateTransition;
    private configForSignalCapture;
    private _render;
    private preStage;
    private onCubeClick;
    private onCubeHover;
    private onTextHover;
    private createConfig;
    /**
     * Filter the data and animate.
     * @param search Filter expression, see https://vega.github.io/vega/docs/expressions/
     */
    filter(search: Search): Promise<void>;
    /**
     * Remove any filtration and animate.
     */
    reset(): Promise<void>;
    /**
     * Select cubes by a filter expression.
     * @param search Filter expression, see https://vega.github.io/vega/docs/expressions/
     */
    select(search: Search): Promise<void>;
    /**
     * Removes any selection.
     */
    deselect(): Promise<void>;
    /**
     * Gets the current selection.
     */
    getSelection(): SelectionState;
    /**
     * Set one data row to the active state.
     */
    activate(datum: object): Promise<void>;
    /**
     * Deactivate item.
     */
    deActivate(): Promise<void>;
    /**
     * Gets the current insight with signal values.
     */
    getInsight(): Insight;
    /**
     * Gets current signal values.
     */
    getSignalValues(): SignalValues;
    finalize(): void;
}
