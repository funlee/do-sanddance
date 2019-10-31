import { Animator } from './animator';
import { DataScope, UserSelection } from './dataScope';
import { Language } from './types';
export declare class Details {
    private language;
    private animator;
    private dataScope;
    private colorMapHandler;
    private hasColorMaps;
    element: HTMLElement;
    private state;
    constructor(parentElement: HTMLElement, language: Language, animator: Animator, dataScope: DataScope, colorMapHandler: (remap: boolean) => void, hasColorMaps: () => boolean);
    finalize(): void;
    clear(): void;
    clearSelection(): void;
    populate(userSelection: UserSelection, index?: number): void;
    private selectByNameValue;
    private remapChanged;
    private handleAction;
    render(): void;
}
