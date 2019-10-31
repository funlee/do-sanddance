// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { create } from '.';
import { inferAll } from './inference';
export function cloneVegaSpecWithData(context, currData) {
    const { specColumns } = context;
    const columns = [
        specColumns.color,
        specColumns.facet,
        specColumns.group,
        specColumns.size,
        specColumns.sort,
        specColumns.x,
        specColumns.y,
        specColumns.z
    ];
    inferAll(columns, currData);
    const specResult = create(context);
    if (!specResult.errors) {
        const data0 = specResult.vegaSpec.data[0];
        data0.values = currData;
    }
    return specResult;
}
