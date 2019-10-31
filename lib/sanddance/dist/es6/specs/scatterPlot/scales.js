// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { binnableColorScale, linearScale, pointScale } from '../scales';
import { ColorScaleNone, DataNames, FieldNames, ScaleNames, SignalNames } from '../constants';
export default function (context) {
    const { specColumns, insight } = context;
    const scales = [
        (specColumns.x.quantitative ?
            linearScale(ScaleNames.X, DataNames.Main, specColumns.x.name, 'width', false, false)
            :
                pointScale(ScaleNames.X, DataNames.Main, 'width', specColumns.x.name)),
        (specColumns.y.quantitative ?
            linearScale(ScaleNames.Y, DataNames.Main, specColumns.y.name, 'height', false, false)
            :
                pointScale(ScaleNames.Y, DataNames.Main, 'height', specColumns.y.name, true))
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
