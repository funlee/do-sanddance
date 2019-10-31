// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { binnableColorScale, linearScale, pointScale } from '../scales';
import { ColorScaleNone, DataNames, FieldNames, ScaleNames, SignalNames } from '../constants';
import { ColumnCount, RowCount } from './constants';
export default function (context) {
    const { specColumns, insight } = context;
    const scales = [
        {
            name: ScaleNames.X,
            type: 'band',
            domain: {
                signal: `sequence(0, ${ColumnCount}, 1)`
            },
            range: 'width',
            paddingInner: 0.1,
            paddingOuter: 0
        },
        {
            name: ScaleNames.Y,
            type: 'band',
            domain: {
                signal: `sequence(0, ${RowCount}, 1)`
            },
            range: 'height',
            paddingInner: 0.1,
            paddingOuter: 0
        }
    ];
    if (specColumns.color && !specColumns.color.isColorData && !insight.directColor) {
        if (specColumns.color.quantitative) {
            scales.push(binnableColorScale(insight.colorBin, DataNames.Main, specColumns.color.name, insight.scheme));
        }
        else {
            scales.push({
                name: ScaleNames.Color,
                type: 'ordinal',
                domain: {
                    data: DataNames.Legend,
                    field: FieldNames.Top,
                    sort: true
                },
                range: {
                    scheme: insight.scheme || ColorScaleNone
                },
                reverse: { signal: SignalNames.ColorReverse }
            });
        }
    }
    if (specColumns.z) {
        const zRange = [0, { signal: SignalNames.ZHeight }];
        scales.push(specColumns.z.quantitative ?
            linearScale(ScaleNames.Z, DataNames.Main, specColumns.z.name, zRange, false, false)
            :
                pointScale(ScaleNames.Z, DataNames.Main, zRange, specColumns.z.name));
    }
    return scales;
}
