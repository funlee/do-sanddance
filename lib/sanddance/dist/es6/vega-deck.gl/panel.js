// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { createElement, mount } from 'tsx-create-element';
import { minHeight, minWidth } from './defaults';
import { PresenterElement } from './enums';
export function initializePanel(presenter) {
    const rootDiv = (createElement("div", { className: className(PresenterElement.root, presenter) },
        createElement("div", { className: className(PresenterElement.gl, presenter), style: { minHeight, minWidth } }),
        createElement("div", { className: className(PresenterElement.panel, presenter) },
            createElement("div", { className: className(PresenterElement.vegaControls, presenter) }),
            createElement("div", { className: className(PresenterElement.legend, presenter) }))));
    mount(rootDiv, presenter.el);
}
export function className(type, presenter) {
    return `${presenter.style.cssPrefix}${PresenterElement[type]}`;
}
