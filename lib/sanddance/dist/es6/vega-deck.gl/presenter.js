// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { base } from './base';
import { box } from './marks/rule';
import { className, initializePanel } from './panel';
import { colorToString } from './color';
import { createDeckGLClassesForPresenter } from './deck.gl-classes/deckgl';
import { createStage, defaultPresenterConfig, defaultPresenterStyle } from './defaults';
import { deepMerge } from './clone';
import { easeExpInOut } from 'd3-ease';
import { getCubeLayer, getCubes, getLayers } from './layers';
import { LegendView } from './legend';
import { LinearInterpolator } from './deck.gl-classes/linearInterpolator';
import { mount } from 'tsx-create-element';
import { patchCubeArray } from './patchedCubeArray';
import { PresenterElement } from './enums';
import { sceneToStage } from './stagers';
import { targetViewState, viewStateProps } from './viewState';
/**
 * Class which presents a Stage of chart data using Deck.gl to render.
 */
export class Presenter {
    /**
     * Instantiate a new Presenter.
     * @param el Parent HTMLElement to present within.
     * @param style Optional PresenterStyle styling options.
     */
    constructor(el, style) {
        this.el = el;
        this.style = deepMerge(defaultPresenterStyle, style);
        initializePanel(this);
        this._last = { view: null, height: null, width: null, cubeCount: null, stage: null };
    }
    /**
     * Get the previously rendered Stage object.
     */
    get stage() {
        return this._last.stage;
    }
    /**
     * Get the current View camera type.
     */
    get view() {
        return this._last.view;
    }
    /**
     * Cancels any pending animation, calling animationCanceled() on original queue.
     */
    animationCancel() {
        if (this.animationTimer) {
            clearTimeout(this.animationTimer);
            this.animationTimer = null;
            if (this.logger) {
                this.logger(`canceling animation ${(this.queuedAnimationOptions && this.queuedAnimationOptions.handlerLabel) || 'handler'}`);
            }
            if (this.queuedAnimationOptions && this.queuedAnimationOptions.animationCanceled) {
                this.queuedAnimationOptions.animationCanceled.call(null);
            }
        }
    }
    /**
     * Stops the current animation and queues a new animation.
     * @param handler Function to invoke when timeout is complete.
     * @param timeout Length of time to wait before invoking the handler.
     * @param options Optional QueuedAnimationOptions object.
     */
    animationQueue(handler, timeout, options) {
        if (this.logger) {
            this.logger(`queueing animation ${(options && options.waitingLabel) || 'waiting'}...`);
        }
        this.animationCancel();
        this.animationTimer = setTimeout(() => {
            if (this.logger) {
                this.logger(`queueing animation ${(options && options.handlerLabel) || 'handler'}...`);
            }
            handler();
        }, timeout);
    }
    /**
     * Retrieve a sub-element of the rendered output.
     * @param type PresenterElement type of the HTMLElement to retrieve.
     */
    getElement(type) {
        const elements = this.el.getElementsByClassName(className(type, this));
        if (elements && elements.length) {
            return elements[0];
        }
    }
    /**
     * Present the Vega Scene, or Stage object using Deck.gl.
     * @param sceneOrStage Vega Scene object, or Stage object containing chart layout info.
     * @param height Height of the rendering area.
     * @param width Width of the rendering area.
     * @param config Optional presentation configuration object.
     */
    present(sceneOrStage, height, width, config) {
        this.animationCancel();
        let scene = sceneOrStage;
        let stage;
        let options = {
            offsetX: 0,
            offsetY: 0,
            maxOrdinal: -1,
            ordinalsSpecified: false,
            currAxis: null,
            currFacetRect: null,
            defaultCubeColor: this.style.defaultCubeColor
        };
        //determine if this is a vega scene
        if (scene.marktype) {
            stage = createStage(scene.view);
            sceneToStage(options, stage, scene);
        }
        else {
            stage = sceneOrStage;
        }
        if (!this.deckgl) {
            const classes = createDeckGLClassesForPresenter({
                doubleClickHandler: () => {
                    this.homeCamera();
                }
            });
            this.OrbitControllerClass = classes.OrbitControllerClass;
            const deckProps = {
                onLayerClick: config && config.onLayerClick,
                views: [new base.deck.OrbitView({ controller: this.OrbitControllerClass })],
                container: this.getElement(PresenterElement.gl),
                getCursor: (interactiveState) => {
                    if (interactiveState.onText || interactiveState.onAxisSelection) {
                        return 'pointer';
                    }
                    else if (interactiveState.onCube) {
                        return 'default';
                    }
                    else {
                        return 'grab';
                    }
                }
            };
            if (stage.backgroundColor) {
                deckProps.style = { 'background-color': colorToString(stage.backgroundColor) };
            }
            this.deckgl = new classes.DeckGL_Class(deckProps);
        }
        let cubeCount = Math.max(this._last.cubeCount, stage.cubeData.length);
        if (options.ordinalsSpecified) {
            cubeCount = Math.max(cubeCount, options.maxOrdinal + 1);
            const empty = {
                isEmpty: true,
                color: [0, 0, 0, 0] // possibly a bug in Deck.gl? set color to invisible.
            };
            stage.cubeData = patchCubeArray(cubeCount, empty, stage.cubeData);
        }
        this.setDeckProps(stage, height, width, cubeCount, config);
        mount(LegendView({ legend: stage.legend, onClick: config && config.onLegendClick }), this.getElement(PresenterElement.legend));
        if (config && config.onPresent) {
            config.onPresent();
        }
    }
    /**
     * Present the same recently rendered Stage with only slight modifications such as a color change,
     * using the previous Stage values as a basis.
     * @param stage Partially populated Stage object containing changes.
     * @param modifyConfig Optional presentation configuration object.
     */
    rePresent(stage, modifyConfig) {
        const newStage = Object.assign({}, this._last.stage, stage);
        this.setDeckProps(newStage, this._last.height, this._last.width, this._last.cubeCount, modifyConfig);
    }
    isNewBounds(view, height, width, cubeCount) {
        const lastBounds = this.lastBounds();
        for (let prop in lastBounds) {
            if (lastBounds[prop] === null)
                return true;
        }
        const newBounds = { cubeCount, height, view, width };
        for (let prop in lastBounds) {
            if (lastBounds[prop] !== newBounds[prop])
                return true;
        }
    }
    lastBounds() {
        const { cubeCount, height, view, width } = this._last;
        return { cubeCount, height, view, width };
    }
    setDeckProps(stage, height, width, cubeCount, modifyConfig) {
        const config = deepMerge(defaultPresenterConfig, modifyConfig);
        const newBounds = this.isNewBounds(stage.view, height, width, cubeCount);
        let lightSettings = this.style.lightSettings[stage.view];
        let lightingMix = stage.view === '3d' ? 1.0 : 0.0;
        let linearInterpolator;
        //choose the current OrbitView viewstate if possible
        let viewState = (this.deckgl.viewState && Object.keys(this.deckgl.viewState).length && this.deckgl.viewState.OrbitView)
            //otherwise use the initial viewstate if any
            || this.deckgl.props.viewState;
        if (!viewState || newBounds || config.shouldViewstateTransition && config.shouldViewstateTransition()) {
            viewState = targetViewState(height, width, stage.view);
            const oldCubeLayer = getCubeLayer(this.deckgl.props);
            if (oldCubeLayer) {
                linearInterpolator = new LinearInterpolator(viewStateProps);
                linearInterpolator.layerStartProps = { lightingMix: oldCubeLayer.props.lightingMix };
                linearInterpolator.layerEndProps = { lightingMix };
                viewState.transitionDuration = config.transitionDurations.view;
                viewState.transitionEasing = easeExpInOut;
                viewState.transitionInterpolator = linearInterpolator;
            }
            if (stage.view === '2d') {
                lightSettings = this.style.lightSettings['3d'];
            }
        }
        const guideLines = this._showGuides && box(0, 0, height, width, '#0f0', 1, true);
        config.preLayer && config.preLayer(stage);
        const layers = getLayers(this, config, stage, lightSettings, lightingMix, linearInterpolator, guideLines);
        const deckProps = {
            views: [new base.deck.OrbitView({ controller: this.OrbitControllerClass })],
            viewState,
            layers
        };
        if (config && config.preStage) {
            config.preStage(stage, deckProps);
        }
        this.deckgl.setProps(deckProps);
        delete stage.cubeData;
        this._last = {
            cubeCount,
            height,
            width,
            stage: stage,
            view: stage.view
        };
    }
    /**
     * Home the camera to the last initial position.
     */
    homeCamera() {
        const viewState = targetViewState(this._last.height, this._last.width, this._last.view);
        viewState.transitionDuration = defaultPresenterConfig.transitionDurations.view;
        viewState.transitionEasing = easeExpInOut;
        viewState.transitionInterpolator = new LinearInterpolator(viewStateProps);
        const deckProps = {
            views: this.deckgl.props.views,
            viewState,
            layers: this.deckgl.props.layers
        };
        this.deckgl.setProps(deckProps);
    }
    /**
     * Get cube data array from the cubes layer.
     */
    getCubeData() {
        return getCubes(this.deckgl.props);
    }
    /**
     * Show guidelines of rendering height/width and center of OrbitView.
     */
    showGuides() {
        this._showGuides = true;
        this.getElement(PresenterElement.gl).classList.add('show-center');
        this.rePresent(Object.assign({}, this._last.stage, { cubeData: this.getCubeData() }));
    }
    finalize() {
        this.animationCancel();
        if (this.deckgl)
            this.deckgl.finalize();
        if (this.el)
            this.el.innerHTML = '';
        this._last = null;
        this.deckgl = null;
        this.el = null;
        this.logger = null;
        this.queuedAnimationOptions = null;
    }
}
