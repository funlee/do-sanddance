// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { BarChartScaleNames } from './constants';
import { ScaleNames } from '../constants';
export default function (context, namespace) {
    const { specColumns } = context;
    const scales = [
        {
            name: BarChartScaleNames.bucketScale,
            type: 'band',
            range: 'width',
            domain: {
                data: namespace.bucket,
                field: specColumns.x.name,
                sort: true
            }
        },
        {
            name: ScaleNames.X,
            type: 'band',
            range: [
                0,
                {
                    signal: 'width'
                }
            ],
            padding: 0.01,
            domain: {
                data: namespace.stacked,
                field: specColumns.x.name,
                sort: true
            }
        }
    ];
    return scales;
}
