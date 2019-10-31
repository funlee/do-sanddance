import { PresenterElement } from './enums';
import { PresenterStyle } from './interfaces';
export interface IPresenter {
    el: HTMLElement;
    style: PresenterStyle;
}
export declare function initializePanel(presenter: IPresenter): void;
export declare function className(type: PresenterElement, presenter: IPresenter): string;
