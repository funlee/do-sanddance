// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { allTruthy } from '../../array';
import { colorBinCountSignal, colorReverseSignal, textSignals } from '../signals';
import { ColumnCount, RowCount, Total } from './constants';
import { DataNames } from '../constants';
import { facetSignals } from '../facet';
export default function (context) {
    const { insight } = context;
    const signals = allTruthy(textSignals(context), [
        colorBinCountSignal(context),
        {
            name: Total,
            update: `data('${DataNames.Main}').length`
        },
        {
            name: ColumnCount,
            update: `ceil(sqrt((width/height)*${Total}))`
        },
        {
            name: RowCount,
            update: `${Total}/${ColumnCount}`
        },
        colorReverseSignal(context)
    ], insight.columns && insight.columns.facet && facetSignals(context));
    return signals;
}
