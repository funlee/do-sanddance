// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { base } from '../base';
import { defaultView } from '../defaults';
import { Presenter } from '../presenter';
import { PresenterElement } from '../enums';
import { RendererGl } from './rendererGl';
let registered = false;
//dynamic superclass lets us create a subclass at execution phase instead of declaration phase.
//This allows us to retrieve vega.View from either UMD or ES6 consumers of this class.
//pass in the SuperClass, which should be a vega.View
function _ViewGl(runtime, config) {
    //dynamic superclass, since we don't know have vega.View in the declaration phase
    class ViewGlInternal extends base.vega.View {
        constructor(runtime, config = {}) {
            super(runtime, config);
            this.config = config;
            this.presenter = config.presenter;
            config.presenterConfig = config.presenterConfig || {};
            config.presenterConfig.redraw = () => {
                this._redraw = true; //use Vega View private member _redraw
                this.run();
            };
        }
        renderer(renderer) {
            if (renderer === 'deck.gl' && !registered) {
                base.vega.renderModule('deck.gl', { handler: base.vega.CanvasHandler, renderer: RendererGl });
                registered = true;
            }
            return super.renderer(renderer);
        }
        initialize(el) {
            if (!this.presenter) {
                this.presenter = new Presenter(el);
            }
            super.initialize(this.presenter.getElement(PresenterElement.vegaControls));
            const renderer = this._renderer;
            renderer.presenterConfig = this.config.presenterConfig;
            renderer.presenter = this.presenter;
            renderer.getView = this.config && this.config.getView || (() => this.presenter.view || defaultView);
            return this;
        }
        error(e) {
            if (this.presenter.logger) {
                this.presenter.logger(e);
            }
        }
    }
    const instance = new ViewGlInternal(runtime, config);
    return instance;
}
//signature to allow this function to be used with the 'new' keyword.
//need to trick the compiler by casting to 'any'.
/**
 * Subclass of Vega.View, with added properties for accessing a Presenter.
 * This is instantiatable by calling `new ViewGl()`. See https://vega.github.io/vega/docs/api/view/
 */
export const ViewGl = _ViewGl;
