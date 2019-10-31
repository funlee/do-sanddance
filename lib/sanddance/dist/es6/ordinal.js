// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as VegaDeckGl from './vega-deck.gl';
export function assignOrdinals(columns, data, ordinalMap) {
    const uCol = columns.uid && columns.uid.name;
    if (ordinalMap) {
        data.forEach((d, i) => {
            const key = uCol ? d[uCol] : i;
            d[VegaDeckGl.constants.GL_ORDINAL] = ordinalMap[key];
        });
    }
    else {
        ordinalMap = {};
        data.forEach((d, i) => {
            d[VegaDeckGl.constants.GL_ORDINAL] = i;
            const uColValue = uCol ? d[uCol] : i;
            ordinalMap[uColValue] = i;
        });
    }
    return ordinalMap;
}
export function getSpecColumns(insight, columns) {
    function getColumnByName(name) {
        return columns.filter(c => c.name === name)[0];
    }
    return {
        color: getColumnByName(insight.columns && insight.columns.color),
        facet: getColumnByName(insight.columns && insight.columns.facet),
        group: getColumnByName(insight.columns && insight.columns.group),
        size: getColumnByName(insight.columns && insight.columns.size),
        sort: getColumnByName(insight.columns && insight.columns.sort),
        uid: getColumnByName(insight.columns && insight.columns.uid),
        x: getColumnByName(insight.columns && insight.columns.x),
        y: getColumnByName(insight.columns && insight.columns.y),
        z: getColumnByName(insight.columns && insight.columns.z)
    };
}
export function getDataIndexOfCube(cube, data) {
    const len = data.length;
    for (let i = 0; i < len; i++) {
        if (data[i][VegaDeckGl.constants.GL_ORDINAL] === cube.ordinal) {
            return i;
        }
    }
}
