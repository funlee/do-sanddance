// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { base } from '../base';
//pass in the SuperClass, which should be a vega.View
function _RendererGl(loader) {
    //dynamic superclass, since we don't know have vega.View in the declaration phase
    class RendererGlInternal extends base.vega.Renderer {
        initialize(el, width, height, origin) {
            this.height = height;
            this.width = width;
            // this method will invoke resize to size the canvas appropriately
            return super.initialize(el, width, height, origin);
        }
        resize(width, height, origin) {
            super.resize(width, height, origin);
            this.origin = origin;
            this.height = height;
            this.width = width;
            //rteturn this for vega
            return this;
        }
        _render(scene, items) {
            const scene3d = scene;
            scene3d.view = this.getView();
            this.presenter.present(scene3d, this.height, this.width, this.presenterConfig);
            //return this for vega
            return this;
        }
    }
    const instance = new RendererGlInternal(loader);
    return instance;
}
//signature to allow this function to be used with the 'new' keyword.
//need to trick the compiler by casting to 'any'.
/**
 * Subclass of Vega.Renderer, with added properties for accessing a Presenter.
 * This is instantiated by ViewGl.
 */
export const RendererGl = _RendererGl;
