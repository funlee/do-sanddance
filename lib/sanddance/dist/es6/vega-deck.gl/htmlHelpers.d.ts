/**
 * Create a new element as a child of another element.
 * @param tagName Tag name of the new tag to create.
 * @param parentElement Reference of the element to append to.
 * @returns new HTMLElement.
 */
export declare function addEl(tagName: string, parentElement: HTMLElement): HTMLElement;
/**
 * Create a new div HTMLElement as a child of another element.
 * @param parentElement Reference of the element to append to.
 * @param className Optional css class name to apply to the div.
 */
export declare function addDiv(parentElement: HTMLElement, className?: string): HTMLDivElement;
/**
 * Measure the outer height and width of an HTMLElement, including margin, padding and border.
 * @param el HTML Element to measure.
 */
export declare function outerSize(el: HTMLElement): {
    height: number;
    width: number;
};
