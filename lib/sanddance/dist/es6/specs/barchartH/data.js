// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import getQualitative from './transform.qualitative';
import getQuantitative from './transform.quantitative';
import { allTruthy } from '../../array';
import { BarChartSignalNames } from './constants';
import { DataNames, FieldNames } from '../constants';
import { facetGroupData, facetSourceData, facetTransforms } from '../facet';
import { topLookup } from '../top';
export default function (context, namespace) {
    const { specColumns, insight, specViewOptions } = context;
    const categoricalColor = specColumns.color && !specColumns.color.quantitative;
    const nestedDataName = specColumns.facet && specColumns.facet.quantitative ? DataNames.Pre : DataNames.Main;
    const data = allTruthy(facetSourceData(specColumns.facet, insight.facets, DataNames.Main), categoricalColor && topLookup(specColumns.color, specViewOptions.maxLegends), [
        bucketed(context, namespace, categoricalColor ? DataNames.Legend : nestedDataName),
        stacked(namespace, namespace.bucket, specColumns.facet && facetTransforms(specColumns.facet, insight.facets))
    ], specColumns.y.quantitative && [
        {
            name: DataNames.QuantitativeData,
            transform: [
                {
                    type: 'sequence',
                    start: {
                        signal: `${BarChartSignalNames.quantitativeBinSignal}.start`
                    },
                    stop: {
                        signal: `${BarChartSignalNames.quantitativeBinSignal}.stop`
                    },
                    step: {
                        signal: `${BarChartSignalNames.quantitativeBinSignal}.step`
                    }
                }
            ]
        }
    ], specColumns.facet && facetGroupData(namespace.stacked));
    return data;
}
export function bucketed(context, namespace, source) {
    const { specColumns: columns } = context;
    const data = {
        name: namespace.bucket,
        source,
        transform: columns.y.quantitative ?
            getQuantitative(context, columns.facet)
            :
                getQualitative(context)
    };
    return data;
}
export function stacked(namespace, source, transforms) {
    const data = {
        name: namespace.stacked,
        source,
        transform: allTruthy(transforms, xy(namespace))
    };
    return data;
}
function xy(namespace) {
    const transforms = [
        {
            type: 'formula',
            expr: `floor(datum.${FieldNames.BarChartStack0} / ${BarChartSignalNames.compartmentsPerLevelSignal})`,
            as: namespace.__level
        },
        {
            type: 'formula',
            expr: `datum.${FieldNames.BarChartStack0} % ${BarChartSignalNames.compartmentsPerLevelSignal}`,
            as: namespace.__compartment
        }
    ];
    return transforms;
}
