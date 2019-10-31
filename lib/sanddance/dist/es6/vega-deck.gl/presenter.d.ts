import { DeckGL_Class } from './deck.gl-classes/deckgl';
import { Cube, PresenterConfig, PresenterStyle, QueuedAnimationOptions, Scene3d, Stage, View } from './interfaces';
import { PresenterElement } from './enums';
/**
 * Class which presents a Stage of chart data using Deck.gl to render.
 */
export declare class Presenter {
    el: HTMLElement;
    private OrbitControllerClass;
    /**
     * Handle of the timer for animation.
     */
    animationTimer: number;
    /**
     * Deck.gl instance for rendering WebGL.
     */
    deckgl: DeckGL_Class;
    /**
     * Logger, such as console.log
     */
    logger: (message?: any, ...optionalParams: any[]) => void;
    /**
     * Get the previously rendered Stage object.
     */
    readonly stage: Stage;
    /**
     * Options for styling the output.
     */
    style: PresenterStyle;
    /**
     * Get the current View camera type.
     */
    readonly view: View;
    private queuedAnimationOptions;
    private _last;
    private _showGuides;
    /**
     * Instantiate a new Presenter.
     * @param el Parent HTMLElement to present within.
     * @param style Optional PresenterStyle styling options.
     */
    constructor(el: HTMLElement, style?: PresenterStyle);
    /**
     * Cancels any pending animation, calling animationCanceled() on original queue.
     */
    animationCancel(): void;
    /**
     * Stops the current animation and queues a new animation.
     * @param handler Function to invoke when timeout is complete.
     * @param timeout Length of time to wait before invoking the handler.
     * @param options Optional QueuedAnimationOptions object.
     */
    animationQueue(handler: () => void, timeout: number, options?: QueuedAnimationOptions): void;
    /**
     * Retrieve a sub-element of the rendered output.
     * @param type PresenterElement type of the HTMLElement to retrieve.
     */
    getElement(type: PresenterElement): HTMLElement;
    /**
     * Present the Vega Scene, or Stage object using Deck.gl.
     * @param sceneOrStage Vega Scene object, or Stage object containing chart layout info.
     * @param height Height of the rendering area.
     * @param width Width of the rendering area.
     * @param config Optional presentation configuration object.
     */
    present(sceneOrStage: Scene3d | Stage, height: number, width: number, config?: PresenterConfig): void;
    /**
     * Present the same recently rendered Stage with only slight modifications such as a color change,
     * using the previous Stage values as a basis.
     * @param stage Partially populated Stage object containing changes.
     * @param modifyConfig Optional presentation configuration object.
     */
    rePresent(stage: Partial<Stage>, modifyConfig?: PresenterConfig): void;
    private isNewBounds;
    private lastBounds;
    private setDeckProps;
    /**
     * Home the camera to the last initial position.
     */
    homeCamera(): void;
    /**
     * Get cube data array from the cubes layer.
     */
    getCubeData(): Cube[];
    /**
     * Show guidelines of rendering height/width and center of OrbitView.
     */
    showGuides(): void;
    finalize(): void;
}
