// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import getAxes from './axes';
import getData from './data';
import getMarks from './marks';
import getScales from './scales';
import getSignals from './signals';
import { checkForFacetErrors, facetSize, layout } from '../facet';
import { getLegends } from '../legends';
import { SignalNames } from '../constants';
export const density = (context) => {
    const { specColumns, insight } = context;
    const errors = [];
    if (!specColumns.x)
        errors.push('Must set a field for x axis');
    if (!specColumns.y)
        errors.push('Must set a field for y axis');
    checkForFacetErrors(insight.facets, errors);
    const specCapabilities = {
        roles: [
            {
                role: 'x',
                binnable: true,
                axisSelection: specColumns.x && specColumns.x.quantitative ? 'range' : 'exact',
                signals: [SignalNames.XBins]
            },
            {
                role: 'y',
                binnable: true,
                axisSelection: specColumns.y && specColumns.y.quantitative ? 'range' : 'exact',
                signals: [SignalNames.YBins]
            },
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
    const size = specColumns.facet ? facetSize(context) : insight.size;
    var vegaSpec = {
        $schema: 'https://vega.github.io/schema/vega/v3.json',
        height: size.height,
        width: size.width,
        signals: getSignals(context),
        data: getData(context),
        scales: getScales(context),
        marks: getMarks(context)
    };
    if (!insight.hideAxes) {
        vegaSpec.axes = getAxes(context);
    }
    const legends = getLegends(context);
    if (legends) {
        vegaSpec.legends = legends;
    }
    if (specColumns.facet) {
        vegaSpec.layout = layout(context);
    }
    else {
        //use autosize only when not faceting
        vegaSpec.autosize = 'fit';
    }
    return { vegaSpec, specCapabilities };
};
