// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
/**
 * Create a new element as a child of another element.
 * @param tagName Tag name of the new tag to create.
 * @param parentElement Reference of the element to append to.
 * @returns new HTMLElement.
 */
export function addEl(tagName, parentElement) {
    const el = document.createElement(tagName);
    parentElement.appendChild(el);
    return el;
}
/**
 * Create a new div HTMLElement as a child of another element.
 * @param parentElement Reference of the element to append to.
 * @param className Optional css class name to apply to the div.
 */
export function addDiv(parentElement, className) {
    const div = addEl('div', parentElement);
    if (className) {
        div.className = className;
    }
    return div;
}
/**
 * Measure the outer height and width of an HTMLElement, including margin, padding and border.
 * @param el HTML Element to measure.
 */
export function outerSize(el) {
    const cs = getComputedStyle(el);
    const height = parseFloat(cs.marginTop) + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth) + el.offsetHeight + parseFloat(cs.borderBottomWidth) + parseFloat(cs.paddingBottom) + parseFloat(cs.marginBottom);
    const width = parseFloat(cs.marginLeft) + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth) + el.offsetWidth + parseFloat(cs.borderRightWidth) + parseFloat(cs.paddingRight) + parseFloat(cs.marginRight);
    return { height, width };
}
