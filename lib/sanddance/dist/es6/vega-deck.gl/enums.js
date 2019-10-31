// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
/**
 * HTML elements outputted by the presenter.
 */
export var PresenterElement;
(function (PresenterElement) {
    PresenterElement[PresenterElement["root"] = 0] = "root";
    PresenterElement[PresenterElement["gl"] = 1] = "gl";
    PresenterElement[PresenterElement["panel"] = 2] = "panel";
    PresenterElement[PresenterElement["legend"] = 3] = "legend";
    PresenterElement[PresenterElement["vegaControls"] = 4] = "vegaControls";
})(PresenterElement || (PresenterElement = {}));
