/// <reference types="deck.gl" />
import { OrbitViewState } from '@deck.gl/core/views/orbit-view';
import { View } from './interfaces';
export declare const viewStateProps: string[];
export declare function targetViewState(height: number, width: number, view: View): OrbitViewState;
