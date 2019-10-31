// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { allTruthy } from '../../array';
import { colorBinCountSignal, colorReverseSignal, textSignals } from '../signals';
import { facetSignals } from '../facet';
import { SignalNames } from '../constants';
export default function (context) {
    const { insight, specViewOptions } = context;
    const signals = allTruthy(textSignals(context), [
        colorBinCountSignal(context),
        {
            name: SignalNames.TreeMapMethod,
            value: 'squarify',
            bind: {
                name: specViewOptions.language.treeMapMethod,
                input: 'select',
                options: [
                    'squarify', 'binary'
                ]
            }
        },
        colorReverseSignal(context)
    ], insight.columns.facet && facetSignals(context));
    return signals;
}
