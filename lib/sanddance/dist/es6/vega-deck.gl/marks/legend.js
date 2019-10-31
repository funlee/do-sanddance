// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { base } from '../base';
const legendMap = {
    'legend-title': function (legend, textItem) {
        legend.title = textItem.text;
    },
    'legend-symbol': function (legend, symbol) {
        const { bounds, fill, shape } = symbol;
        //this object is safe for serialization
        const legendRowSymbol = { bounds, fill, shape };
        const i = symbol.datum.index;
        legend.rows[i] = legend.rows[i] || {};
        legend.rows[i].symbol = legendRowSymbol;
    },
    'legend-label': function (legend, label) {
        const i = label.datum.index;
        legend.rows[i] = legend.rows[i] || {};
        const row = legend.rows[i];
        row.label = label.text;
        row.value = label.datum.value;
    }
};
const markStager = (options, stage, scene, x, y, groupType) => {
    base.vega.sceneVisit(scene, function (item) {
        const fn = legendMap[item.mark.role];
        if (fn) {
            fn(stage.legend, item);
        }
        else {
            //console.log(`need to render legend ${item.mark.role}`);
        }
    });
};
export default markStager;
