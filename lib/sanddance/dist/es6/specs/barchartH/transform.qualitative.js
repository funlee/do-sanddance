// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { BarChartSignalNames } from './constants';
import { FieldNames } from '../constants';
export default function (context) {
    const { specColumns } = context;
    const stackTransform = {
        type: 'stack',
        groupby: [
            {
                field: specColumns.y.name
            }
        ],
        as: [
            FieldNames.BarChartStack0,
            FieldNames.BarChartStack1
        ]
    };
    if (specColumns.sort) {
        stackTransform.sort = {
            field: specColumns.sort.name
        };
    }
    const transforms = [
        stackTransform,
        {
            type: 'extent',
            signal: BarChartSignalNames.levelExtentSignal,
            field: FieldNames.BarChartStack1
        }
    ];
    return transforms;
}
