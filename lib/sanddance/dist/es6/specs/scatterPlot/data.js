// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { allTruthy } from '../../array';
import { DataNames } from '../constants';
import { facetGroupData, facetSourceData, facetTransforms } from '../facet';
import { topLookup } from '../top';
export default function (context) {
    const { specColumns, insight, specViewOptions } = context;
    const categoricalColor = specColumns.color && !specColumns.color.quantitative;
    const ScatterDataName = 'SandDanceScatterPlotData';
    const data = allTruthy(facetSourceData(specColumns.facet, insight.facets, ScatterDataName), [
        {
            name: DataNames.Main,
            source: ScatterDataName,
            transform: allTruthy(filterInvalidWhenNumeric(specColumns.x), filterInvalidWhenNumeric(specColumns.y), filterInvalidWhenNumeric(specColumns.z), specColumns.facet && facetTransforms(specColumns.facet, insight.facets))
        }
    ], categoricalColor && topLookup(specColumns.color, specViewOptions.maxLegends), specColumns.facet && facetGroupData(DataNames.Main));
    return data;
}
function filterInvalidWhenNumeric(column) {
    if (column && column.quantitative) {
        const transforms = [
            {
                type: 'filter',
                expr: `datum[${JSON.stringify(column.name)}] != null`
            }
        ];
        return transforms;
    }
}
