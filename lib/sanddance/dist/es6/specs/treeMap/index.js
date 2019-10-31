// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import getData, { treemapTransforms } from './data';
import getMarks from './marks';
import getScales from './scales';
import getSignals from './signals';
import { checkForFacetErrors, facetMarks, facetSize, layout } from '../facet';
import { DataNames, SignalNames } from '../constants';
import { getLegends } from '../legends';
export const treemap = (context) => {
    const { specColumns, insight, specViewOptions } = context;
    const errors = [];
    if (!specColumns.size)
        errors.push('Must set a field for size');
    checkForFacetErrors(insight.facets, errors);
    const specCapabilities = {
        roles: [
            {
                role: 'size',
                excludeCategoric: true
            },
            {
                role: 'group',
                allowNone: true
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
                role: 'facet',
                allowNone: true
            }
        ],
        signals: [SignalNames.TreeMapMethod]
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
    const TreeMapName = 'SandDanceTreeMapFaceted';
    const data = getData(context);
    let marks = getMarks(context, specColumns.facet ? TreeMapName : dataName);
    if (specColumns.facet) {
        const childData = {
            name: TreeMapName,
            source: DataNames.FacetGroupCell,
            transform: treemapTransforms(insight)
        };
        marks = facetMarks(specViewOptions, dataName, marks, null, [childData]);
        marks[0].marks;
    }
    const size = specColumns.facet ? facetSize(context) : insight.size;
    var vegaSpec = {
        $schema: 'https://vega.github.io/schema/vega/v3.json',
        height: size.height,
        width: size.width,
        signals: getSignals(context),
        data,
        scales: getScales(context),
        marks
    };
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
