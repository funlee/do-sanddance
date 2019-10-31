// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as _deepmerge from 'deepmerge';
const deepmerge = (_deepmerge.default || _deepmerge);
export function clone(objectToClone) {
    if (!objectToClone)
        return objectToClone;
    return deepmerge.all([objectToClone]);
}
const dontMerge = (destination, source) => source;
export function deepMerge(...objectsToMerge) {
    const objects = objectsToMerge.filter(Boolean);
    return deepmerge.all(objects, { arrayMerge: dontMerge });
}
