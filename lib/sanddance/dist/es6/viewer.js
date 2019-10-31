// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as searchExpression from './searchExpression';
import * as VegaDeckGl from './vega-deck.gl';
import { Animator, DataLayoutChange } from './animator';
import { applyColorMapToCubes, colorMapFromCubes, getSelectedColorMap, populateColorContext } from './colorCubes';
import { applySignalValues, extractSignalValuesFromView } from './signals';
import { assignOrdinals, getDataIndexOfCube, getSpecColumns } from './ordinal';
import { axisSelectionLayer } from './axisSelection';
import { cloneVegaSpecWithData } from './specs/clone';
import { DataScope } from './dataScope';
import { defaultView } from './vega-deck.gl/defaults';
import { defaultViewerOptions, getPresenterStyle } from './defaults';
import { Details } from './details';
import { ensureHeaders } from './headers';
import { finalizeLegend } from './legend';
import { mount } from 'tsx-create-element';
import { recolorAxes } from './axes';
import { registerColorSchemes } from './colorSchemes';
import { Tooltip } from './tooltip';
let didRegisterColorSchemes = false;
/**
 * Component to view a SandDance data visualization.
 */
export class Viewer {
    /**
     * Instantiate a new Viewer.
     * @param element Parent HTMLElement to present within.
     * @param options Optional viewer options object.
     */
    constructor(element, options) {
        this.element = element;
        this.options = VegaDeckGl.util.deepMerge(defaultViewerOptions, options);
        this.presenter = new VegaDeckGl.Presenter(element, getPresenterStyle(this.options));
        this._dataScope = new DataScope();
        this._animator = new Animator(this._dataScope, {
            onDataChanged: this.onDataChanged.bind(this),
            onAnimateDataChange: this.onAnimateDataChange.bind(this)
        });
        this._details = new Details(this.presenter.getElement(VegaDeckGl.PresenterElement.panel), this.options.language, this._animator, this._dataScope, remap => {
            this.currentColorContext = ~~remap;
            this.renderSameLayout();
        }, () => this.insight && this.insight.columns && !!this.insight.columns.color && this.colorContexts && this.colorContexts.length > 1);
        this.insight = {};
        this._signalValues = {};
    }
    changeColorContexts(colorContexts) {
        this.colorContexts = colorContexts;
        this.currentColorContext = 0;
        this.options.onColorContextChange && this.options.onColorContextChange();
    }
    applyLegendColorContext(colorContext) {
        mount(colorContext.legendElement, this.presenter.getElement(VegaDeckGl.PresenterElement.legend));
        this.presenter.stage.legend = colorContext.legend;
    }
    onAnimateDataChange(dataChange, waitingLabel, handlerLabel) {
        if (dataChange === DataLayoutChange.refine) {
            const oldColorContext = this.colorContexts[this.currentColorContext];
            this.renderNewLayout({
                preStage: (stage, deckProps) => {
                    finalizeLegend(this.insight.colorBin, this._specColumns.color, stage.legend, this.options.language);
                    applyColorMapToCubes([oldColorContext.colorMap], VegaDeckGl.util.getCubes(deckProps));
                    if (this.options.onStage) {
                        this.options.onStage(stage, deckProps);
                    }
                }
            });
            //apply old legend
            this.applyLegendColorContext(oldColorContext);
        }
        else {
            this.renderNewLayout({
                preStage: (stage, deckProps) => {
                    finalizeLegend(this.insight.colorBin, this._specColumns.color, stage.legend, this.options.language);
                    if (this.options.onStage) {
                        this.options.onStage(stage, deckProps);
                    }
                }
            });
        }
        return new Promise((resolve, reject) => {
            this.presenter.animationQueue(resolve, this.options.transitionDurations.position, { waitingLabel, handlerLabel, animationCanceled: reject });
        });
    }
    onDataChanged(dataLayout, filter) {
        switch (dataLayout) {
            case DataLayoutChange.same: {
                this.renderSameLayout();
                break;
            }
            case DataLayoutChange.refine: {
                //save cube colors
                const oldColorContext = this.colorContexts[this.currentColorContext];
                let colorMap;
                this.renderNewLayout({
                    preStage: (stage, deckProps) => {
                        //save off the spec colors
                        colorMap = colorMapFromCubes(stage.cubeData);
                        applyColorMapToCubes([oldColorContext.colorMap], VegaDeckGl.util.getCubes(deckProps));
                        this.preStage(stage, deckProps);
                    },
                    onPresent: () => {
                        //save new legend
                        const newColorContext = {
                            colorMap,
                            legend: VegaDeckGl.util.clone(this.presenter.stage.legend),
                            legendElement: this.presenter.getElement(VegaDeckGl.PresenterElement.legend).children[0]
                        };
                        //apply old legend
                        this.applyLegendColorContext(oldColorContext);
                        this.changeColorContexts([oldColorContext, newColorContext]);
                    }
                });
                this.insight.filter = searchExpression.narrow(this.insight.filter, filter);
                if (this.options.onDataFilter) {
                    this.options.onDataFilter(this.insight.filter, this._dataScope.currentData());
                }
                break;
            }
            case DataLayoutChange.reset: {
                const colorContext = {
                    colorMap: null,
                    legend: null,
                    legendElement: null
                };
                this.changeColorContexts([colorContext]);
                this.renderNewLayout({
                    onPresent: () => {
                        populateColorContext(colorContext, this.presenter);
                    }
                });
                delete this.insight.filter;
                if (this.options.onDataFilter) {
                    this.options.onDataFilter(null, null);
                }
                break;
            }
        }
        if (this.options.onSelectionChanged) {
            const sel = this.getSelection();
            this.options.onSelectionChanged((sel && sel.search) || null);
        }
    }
    renderNewLayout(c, view) {
        const currData = this._dataScope.currentData();
        const context = { specColumns: this._specColumns, insight: this.insight, specViewOptions: this.options };
        const specResult = cloneVegaSpecWithData(context, currData);
        if (!specResult.errors) {
            const uiValues = extractSignalValuesFromView(this.vegaViewGl, this.vegaSpec);
            this._signalValues = Object.assign({}, this._signalValues, uiValues, this.insight.signalValues);
            applySignalValues(this._signalValues, specResult.vegaSpec);
            this.vegaSpec = specResult.vegaSpec;
            this.options.onVegaSpec && this.options.onVegaSpec(this.vegaSpec);
            this.specCapabilities = specResult.specCapabilities;
            const config = this.createConfig(c);
            if (view) {
                config.getView = () => view;
            }
            if (!didRegisterColorSchemes) {
                registerColorSchemes(VegaDeckGl.base.vega);
                didRegisterColorSchemes = true;
            }
            try {
                const runtime = VegaDeckGl.base.vega.parse(this.vegaSpec);
                this.vegaViewGl = new VegaDeckGl.ViewGl(runtime, config)
                    .renderer('deck.gl')
                    .initialize(this.element)
                    .run();
                //capture new color color contexts via signals
                this.configForSignalCapture(config.presenterConfig);
            }
            catch (e) {
                specResult.errors = [e.message];
            }
            if (!specResult.errors) {
                ensureHeaders(this.presenter, this.options.language.headers);
            }
        }
        if (specResult.errors) {
            if (this.options.onError) {
                this.options.onError(specResult.errors);
            }
            else if (this.presenter.logger) {
                this.presenter.logger(`errors rendering Vega spec:${specResult.errors.join('\n')}`);
            }
        }
        return specResult;
    }
    /**
     * Render the same layout with new options.
     * @param newViewerOptions New options object.
     */
    renderSameLayout(newViewerOptions) {
        const colorContext = this.colorContexts[this.currentColorContext];
        const clonedCubes = this.presenter.getCubeData().map(cube => {
            return Object.assign({}, cube);
        });
        this.applyLegendColorContext(colorContext);
        let { axes, textData } = this.presenter.stage;
        let recoloredAxes;
        if (newViewerOptions) {
            if (newViewerOptions.colors) {
                recoloredAxes = recolorAxes(this.presenter.stage, this._lastColorOptions, newViewerOptions.colors);
                axes = recoloredAxes.axes || axes;
                textData = recoloredAxes.textData || textData;
            }
            this.options = VegaDeckGl.util.deepMerge(this.options, newViewerOptions);
        }
        let colorMaps = [colorContext.colorMap];
        let colorMethod;
        const hasSelectedData = this._dataScope.hasSelectedData();
        const hasActive = !!this._dataScope.active;
        if (hasSelectedData || hasActive) {
            const selectedColorMap = getSelectedColorMap(this._dataScope.currentData(), hasSelectedData, hasActive, this.options);
            colorMaps.push(selectedColorMap);
            colorMethod = this.options.colors.unselectedColorMethod;
        }
        applyColorMapToCubes(colorMaps, clonedCubes, colorMethod);
        const stage = { cubeData: clonedCubes, axes, textData };
        this.vegaViewGl.presenter.rePresent(stage, this.createConfig().presenterConfig);
    }
    getView(view) {
        if (view === undefined) {
            if (this.presenter.view === null) {
                return defaultView;
            }
            else {
                return this.presenter.view;
            }
        }
        else {
            return view;
        }
    }
    /**
     * Render data into a visualization.
     * @param insight Object to create a visualization specification.
     * @param data Array of data objects.
     * @param view Optional View to specify camera type.
     * @param ordinalMap Optional map of ordinals to assign to the data such that the same cubes can be re-used for new data.
     */
    render(insight, data, options = {}) {
        return new Promise((resolve, reject) => {
            let result;
            const layout = () => {
                result = this._render(insight, data, options);
            };
            //see if refine expression has changed
            if (!searchExpression.compare(insight.filter, this.insight.filter)) {
                if (insight.filter) {
                    //refining
                    layout();
                    this.presenter.animationQueue(() => {
                        this.filter(insight.filter);
                    }, this.options.transitionDurations.position, { waitingLabel: 'layout before refine', handlerLabel: 'refine after layout' });
                }
                else {
                    //not refining
                    this._dataScope.filteredData = null;
                    layout();
                    this.presenter.animationQueue(() => {
                        this.reset();
                    }, 0, { waitingLabel: 'layout before reset', handlerLabel: 'reset after layout' });
                }
            }
            else {
                layout();
            }
            resolve(result);
        });
    }
    shouldViewstateTransition(newInsight, oldInsight) {
        if (!oldInsight.columns)
            return false;
        if (oldInsight.chart !== newInsight.chart)
            return true;
        if (oldInsight.size.height !== newInsight.size.height)
            return true;
        if (oldInsight.size.width !== newInsight.size.width)
            return true;
        if (oldInsight.columns.facet !== newInsight.columns.facet)
            return true;
        return false;
    }
    configForSignalCapture(presenterConfig) {
        const colorContext = {
            colorMap: null,
            legend: null,
            legendElement: null
        };
        //now be ready to capture color changing signals 
        presenterConfig.preStage = (stage, deckProps) => {
            if (this._shouldSaveColorContext()) {
                //save off the colors from Vega layout
                colorContext.colorMap = colorMapFromCubes(stage.cubeData);
            }
            this.preStage(stage, deckProps);
        };
        presenterConfig.onPresent = () => {
            if (this._shouldSaveColorContext()) {
                populateColorContext(colorContext, this.presenter);
                this.changeColorContexts([colorContext]);
                this._dataScope.deselect();
            }
        };
    }
    _render(insight, data, options) {
        if (this._tooltip) {
            this._tooltip.finalize();
            this._tooltip = null;
        }
        if (this._dataScope.setData(data, options.columns)) {
            //data is different, reset the signal value cache
            this._signalValues = {};
        }
        this._specColumns = getSpecColumns(insight, this._dataScope.getColumns(options.columnTypes));
        const ordinalMap = assignOrdinals(this._specColumns, data, options.ordinalMap);
        this.insight = VegaDeckGl.util.clone(insight);
        this._lastColorOptions = VegaDeckGl.util.clone(this.options.colors);
        this._shouldSaveColorContext = () => !options.initialColorContext;
        const colorContext = options.initialColorContext || {
            colorMap: null,
            legend: null,
            legendElement: null
        };
        const specResult = this.renderNewLayout({
            preStage: (stage, deckProps) => {
                if (this._shouldSaveColorContext()) {
                    //save off the colors from Vega layout
                    colorContext.colorMap = colorMapFromCubes(stage.cubeData);
                }
                else {
                    //apply passed colorContext
                    applyColorMapToCubes([colorContext.colorMap], VegaDeckGl.util.getCubes(deckProps));
                }
                //if items are selected, repaint
                const hasSelectedData = !!this._dataScope.hasSelectedData();
                const hasActive = !!this._dataScope.active;
                if (this._dataScope.hasSelectedData() || this._dataScope.active) {
                    const selectedColorMap = getSelectedColorMap(this._dataScope.currentData(), hasSelectedData, hasActive, this.options);
                    applyColorMapToCubes([colorContext.colorMap, selectedColorMap], stage.cubeData, this.options.colors.unselectedColorMethod);
                }
                this.preStage(stage, deckProps);
            },
            onPresent: () => {
                if (this._shouldSaveColorContext()) {
                    populateColorContext(colorContext, this.presenter);
                    this.changeColorContexts([colorContext]);
                }
                else {
                    //apply passed colorContext
                    this.applyLegendColorContext(colorContext);
                }
            },
            shouldViewstateTransition: () => this.shouldViewstateTransition(insight, this.insight)
        }, this.getView(insight.view));
        //future signal changes should save the color context
        this._shouldSaveColorContext = () => !options.discardColorContextUpdates || !options.discardColorContextUpdates();
        this._details.render();
        const result = { ordinalMap, specResult };
        return result;
    }
    preStage(stage, deckProps) {
        const onClick = (e, search) => {
            if (this.options.onAxisClick) {
                this.options.onAxisClick(e, search);
            }
            else {
                this.select(search);
            }
        };
        const polygonLayer = axisSelectionLayer(this.presenter, this.specCapabilities, this._specColumns, stage, onClick, this.options.colors.axisSelectHighlight, this.options.selectionPolygonZ);
        const order = 1; //after textlayer but before others
        deckProps.layers.splice(order, 0, polygonLayer);
        finalizeLegend(this.insight.colorBin, this._specColumns.color, stage.legend, this.options.language);
        if (this.options.onStage) {
            this.options.onStage(stage, deckProps);
        }
    }
    onCubeClick(e, cube) {
        const hasSelectedData = this._dataScope.hasSelectedData();
        if (hasSelectedData && this._dataScope.selection.included.length > 1) {
            //if active is within selection, keep the selection and activate the one.
            const indexWithinSelection = this._dataScope.ordinalIndexWithinSelection(cube.ordinal);
            if (indexWithinSelection.index >= 0) {
                this.activate(indexWithinSelection.datum);
                this._details.populate(this._dataScope.selection, indexWithinSelection.index);
                if (this.options.onSelectionChanged) {
                    const sel = this.getSelection();
                    this.options.onSelectionChanged(sel.search, indexWithinSelection.index);
                }
                return;
            }
        }
        if (hasSelectedData && this._dataScope.selection.included.length === 1 && this._dataScope.selection.included[0][VegaDeckGl.constants.GL_ORDINAL] === cube.ordinal) {
            this.deselect();
            return;
        }
        const search = {
            name: VegaDeckGl.constants.GL_ORDINAL,
            operator: '==',
            value: cube.ordinal
        };
        this.select(search);
    }
    onCubeHover(e, cube) {
        if (this._tooltip) {
            this._tooltip.finalize();
            this._tooltip = null;
        }
        if (!cube) {
            return;
        }
        const currentData = this._dataScope.currentData();
        const index = getDataIndexOfCube(cube, currentData);
        if (index >= 0) {
            this._tooltip = new Tooltip({
                options: this.options.tooltipOptions,
                item: currentData[index],
                position: e,
                cssPrefix: this.presenter.style.cssPrefix
            });
        }
    }
    onTextHover(e, t) {
        //return true if highlight color is different
        if (!t || !this.options.getTextColor || !this.options.getTextHighlightColor)
            return false;
        return !VegaDeckGl.util.colorIsEqual(this.options.getTextColor(t), this.options.getTextHighlightColor(t));
    }
    createConfig(c) {
        const { getTextColor, getTextHighlightColor, onTextClick } = this.options;
        const defaultPresenterConfig = {
            getTextColor,
            getTextHighlightColor,
            onTextClick,
            onCubeClick: this.onCubeClick.bind(this),
            onCubeHover: this.onCubeHover.bind(this),
            onTextHover: this.onTextHover.bind(this),
            preStage: this.preStage.bind(this),
            onPresent: this.options.onPresent,
            onLayerClick: (info, pickedInfos, e) => {
                if (!info) {
                    this.deselect();
                }
            },
            onLegendClick: (e, legend, clickedIndex) => {
                const legendRow = clickedIndex !== null && legend.rows[clickedIndex];
                if (legendRow) {
                    if (this.options.onLegendRowClick) {
                        this.options.onLegendRowClick(e, legendRow);
                    }
                    else {
                        this.select(legendRow.search);
                    }
                }
                else if (this.options.onLegendHeaderClick) {
                    //header clicked
                    this.options.onLegendHeaderClick(e);
                }
            }
        };
        if (this.options.onBeforeCreateLayers) {
            defaultPresenterConfig.preLayer = stage => this.options.onBeforeCreateLayers(stage, this.specCapabilities);
        }
        const config = {
            presenter: this.presenter,
            presenterConfig: Object.assign(defaultPresenterConfig, c)
        };
        if (this.options.transitionDurations) {
            config.presenterConfig.transitionDurations = this.options.transitionDurations;
        }
        return config;
    }
    /**
     * Filter the data and animate.
     * @param search Filter expression, see https://vega.github.io/vega/docs/expressions/
     */
    filter(search) {
        const u = this._dataScope.createUserSelection(search, false);
        return new Promise((resolve, reject) => {
            this._animator.filter(search, u.included, u.excluded).then(() => {
                this._details.clear();
                this._details.clearSelection();
                this._details.populate(this._dataScope.selection);
                resolve();
            });
        });
    }
    /**
     * Remove any filtration and animate.
     */
    reset() {
        return new Promise((resolve, reject) => {
            this._animator.reset().then(() => {
                this._details.clear();
                this._details.clearSelection();
                resolve();
            });
        });
    }
    /**
     * Select cubes by a filter expression.
     * @param search Filter expression, see https://vega.github.io/vega/docs/expressions/
     */
    select(search) {
        return new Promise((resolve, reject) => {
            this._animator.select(search).then(() => {
                this._details.populate(this._dataScope.selection);
                resolve();
            });
        });
    }
    /**
     * Removes any selection.
     */
    deselect() {
        return new Promise((resolve, reject) => {
            this._animator.deselect().then(() => {
                this._details.clearSelection();
                resolve();
            });
        });
    }
    /**
     * Gets the current selection.
     */
    getSelection() {
        if (!this._dataScope)
            return null;
        const selectionState = {
            search: (this._dataScope.selection && this._dataScope.selection.search) || null,
            selectedData: (this._dataScope.selection && this._dataScope.selection.included) || null,
            active: this._dataScope.active
        };
        return selectionState;
    }
    /**
     * Set one data row to the active state.
     */
    activate(datum) {
        return new Promise((resolve, reject) => {
            this._animator.activate(datum).then(() => {
                this._details.render();
                resolve();
            });
        });
    }
    /**
     * Deactivate item.
     */
    deActivate() {
        return new Promise((resolve, reject) => {
            if (this._dataScope && this._dataScope.active) {
                this._animator.deactivate().then(() => {
                    this._details.render();
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
    /**
     * Gets the current insight with signal values.
     */
    getInsight() {
        const insight = Object.assign({}, this.insight);
        insight.signalValues = this.getSignalValues();
        return insight;
    }
    /**
     * Gets current signal values.
     */
    getSignalValues() {
        return extractSignalValuesFromView(this.vegaViewGl, this.vegaSpec);
    }
    finalize() {
        if (this._dataScope)
            this._dataScope.finalize();
        if (this._details)
            this._details.finalize();
        if (this._tooltip)
            this._tooltip.finalize();
        if (this.vegaViewGl)
            this.vegaViewGl.finalize();
        if (this.presenter)
            this.presenter.finalize();
        if (this.element)
            this.element.innerHTML = '';
        this.colorContexts = null;
        this.element = null;
        this.options = null;
        this.presenter = null;
        this.vegaSpec = null;
        this.vegaViewGl = null;
        this._animator = null;
        this._dataScope = null;
        this._details = null;
        this._tooltip = null;
    }
}
/**
 * Default Viewer options.
 */
Viewer.defaultViewerOptions = defaultViewerOptions;
