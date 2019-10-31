// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { allTruthy } from '../../array';
import { DataNames, FieldNames } from '../constants';
import { topLookup } from '../top';
export default function (context) {
    const { specColumns, specViewOptions } = context;
    const categoricalColor = specColumns.color && !specColumns.color.quantitative;
    const data = allTruthy([
        {
            name: DataNames.Main,
            transform: allTruthy([
                specColumns.sort && {
                    type: 'collect',
                    sort: { field: specColumns.sort.name }
                },
                {
                    type: 'window',
                    ops: [
                        'count'
                    ],
                    as: [
                        FieldNames.GridIndex
                    ]
                }
            ])
        }
    ], categoricalColor && topLookup(specColumns.color, specViewOptions.maxLegends));
    return data;
}
