/// <reference types="deck.gl" />
import { DeckProps } from '@deck.gl/core/lib/deck';
import { base } from '../base';
import { OrbitController_Class, OrbitControllerClassOptions } from './orbitController';
export interface InteractiveState {
    isDragging: boolean;
    onCube: boolean;
    onText: boolean;
    onAxisSelection: boolean;
}
export declare type DeckGLInternalProps = DeckProps & {
    container?: HTMLElement;
    getCursor?: (interactiveState: InteractiveState) => string;
};
export interface DeckGLClassesForPresenter {
    OrbitControllerClass: typeof OrbitController_Class;
    DeckGL_Class: typeof DeckGL_Class;
}
/**
 * Creates Deck.gl classes for rendering WebGL.
 * DEck.gl is instantiatable by calling `new createDeckGLClassesForPresenter(controlleroptions)(deckProps)`.
 */
export declare function createDeckGLClassesForPresenter(factoryOptions: OrbitControllerClassOptions): DeckGLClassesForPresenter;
/**
 * Deck.gl instance for rendering WebGL.
 * This is not instantiatable, it is the TypeScript declaration of the type.
 */
export declare class DeckGL_Class extends base.deck.Deck {
    interactiveState: InteractiveState;
}
