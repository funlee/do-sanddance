import { base } from '../base';
import { Presenter } from '../presenter';
import { PresenterConfig, View } from '../interfaces';
import { RendererGl_Class } from './rendererGl';
import { Renderers, Runtime } from 'vega-typings';
/**
 * Options for the View.
 */
export interface ViewGlConfig {
    presenter?: Presenter;
    presenterConfig?: PresenterConfig;
    getView?: {
        (): View;
    };
}
/**
 * Subclass of Vega.View, with added properties for accessing a Presenter.
 * This is instantiatable by calling `new ViewGl()`. See https://vega.github.io/vega/docs/api/view/
 */
export declare const ViewGl: typeof ViewGl_Class;
/**
 * Subclass of Vega.View, with added properties for accessing a Presenter.
 * This is not instantiatable, it is the TypeScript declaration of the type.
 */
export declare class ViewGl_Class extends base.vega.View {
    presenter: Presenter;
    constructor(runtime: Runtime, config?: ViewGlConfig);
    renderer(renderer: Renderers | 'deck.gl'): this;
    _renderer: RendererGl_Class;
}
