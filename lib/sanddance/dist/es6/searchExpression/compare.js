// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { ensureSearchExpressionGroupArray } from './group';
const expressionKeys = Object.keys({
    clause: null,
    name: null,
    operator: null,
    value: null
});
export function compareExpression(a, b) {
    for (let k = 0; k < expressionKeys.length; k++) {
        let key = expressionKeys[k];
        if (a[key] != b[key])
            return false;
    }
    return true;
}
const groupKeys = Object.keys({
    clause: null
});
export function compareGroup(a, b) {
    for (let k = 0; k < groupKeys.length; k++) {
        let key = groupKeys[k];
        if (a[key] != b[key])
            return false;
    }
    if (a.expressions.length != b.expressions.length)
        return false;
    for (let i = 0; i < a.expressions.length; i++) {
        if (!compareExpression(a.expressions[i], b.expressions[i]))
            return false;
    }
    return true;
}
export function compare(a, b) {
    if (a == b)
        return true;
    if (!a || !b)
        return false;
    let arrs = [a, b].map(ensureSearchExpressionGroupArray);
    let [arrA, arrB] = arrs;
    if (arrA.length != arrB.length)
        return false;
    for (let i = 0; i < arrA.length; i++) {
        if (!compareGroup(arrA[i], arrB[i]))
            return false;
    }
    return true;
}
