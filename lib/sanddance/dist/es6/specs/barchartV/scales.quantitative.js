// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { DataNames, ScaleNames } from '../constants';
export default function () {
    const scales = [
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
                data: DataNames.QuantitativeData,
                field: 'data',
                sort: true
            }
        }
    ];
    return scales;
}
