import { base } from '../base';
import { Presenter } from '../presenter';
import { PresenterConfig, View } from '../interfaces';
/**
 * Subclass of Vega.Renderer, with added properties for accessing a Presenter.
 * This is instantiated by ViewGl.
 */
export declare const RendererGl: typeof RendererGl_Class;
/**
 * Subclass of Vega.Renderer, with added properties for accessing a Presenter.
 * This is not instantiatable, it is the TypeScript declaration of the type.
 */
export declare class RendererGl_Class extends base.vega.Renderer {
    height: number;
    width: number;
    origin: number[];
    presenter: Presenter;
    presenterConfig: PresenterConfig;
    getView: {
        (): View;
    };
}
