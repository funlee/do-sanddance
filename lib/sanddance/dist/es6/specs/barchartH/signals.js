// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { allTruthy } from '../../array';
import { BarChartScaleNames, BarChartSignalNames } from './constants';
import { colorBinCountSignal, colorReverseSignal, textSignals } from '../signals';
import { facetSignals } from '../facet';
import { ScaleNames, SignalNames } from '../constants';
export default function (context) {
    const { specColumns, specViewOptions } = context;
    const signals = allTruthy(textSignals(context), [
        {
            name: SignalNames.XDomain,
            update: `domain('${ScaleNames.X}')`
        },
        specColumns.y.quantitative && {
            name: SignalNames.YBins,
            value: 7,
            bind: {
                name: specViewOptions.language.YBinSize,
                input: 'range',
                min: 1,
                max: 20,
                step: 1
            }
        },
        {
            name: BarChartSignalNames.compartmentHeightSignal,
            update: `bandwidth('${specColumns.y.quantitative ? ScaleNames.Y : BarChartScaleNames.bucketScale}')`
        },
        {
            name: BarChartSignalNames.aspectRatioSignal,
            update: `${BarChartSignalNames.compartmentHeightSignal}/width`
        },
        {
            name: BarChartSignalNames.compartmentsPerLevelSignal,
            update: `ceil(sqrt(${BarChartSignalNames.aspectRatioSignal}*${BarChartSignalNames.levelExtentSignal}[1]))`
        },
        colorBinCountSignal(context),
        colorReverseSignal(context)
    ], specColumns.facet && facetSignals(context));
    return signals;
}
