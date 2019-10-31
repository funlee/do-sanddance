// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import getData from './data';
import getMarks from './marks';
import getScales from './scales';
import getSignals from './signals';
import { DataNames } from '../constants';
import { getLegends } from '../legends';
export const grid = (context) => {
    const { specColumns, insight } = context;
    const errors = [];
    const specCapabilities = {
        roles: [
            {
                role: 'z',
                allowNone: true
            },
            {
                role: 'color',
                allowNone: true
            },
            {
                role: 'sort',
                allowNone: true
            }
        ]
    };
    if (errors.length) {
        return {
            errors,
            specCapabilities,
            vegaSpec: null,
        };
    }
    const categoricalColor = specColumns.color && !specColumns.color.quantitative;
    const dataName = categoricalColor ? DataNames.Legend : DataNames.Main;
    const size = insight.size;
    var vegaSpec = {
        $schema: 'https://vega.github.io/schema/vega/v3.json',
        height: size.height,
        width: size.width,
        signals: getSignals(context),
        scales: getScales(context),
        data: getData(context),
        marks: getMarks(context, dataName)
    };
    const legends = getLegends(context);
    if (legends) {
        vegaSpec.legends = legends;
    }
    //use autosize only when not faceting
    vegaSpec.autosize = 'fit';
    return { vegaSpec, specCapabilities };
};
