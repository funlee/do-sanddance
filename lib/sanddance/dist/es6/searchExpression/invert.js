// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { isSearchExpressionGroup } from './group';
function invertSearchExpressionGroup(input) {
    //this only works if all expressions in this group have the same clause
    const output = {
        expressions: input.expressions.map(invertSearchExpression)
    };
    if (input.clause) {
        output.clause = invertedClauses[input.clause];
    }
    return output;
}
const invertedOperators = {
    '!=': '==',
    '==': '!=',
    '<': '>=',
    '>=': '<',
    '<=': '>',
    '>': '<=',
    '!contains': 'contains',
    'contains': '!contains',
    '!isnullorEmpty': 'isnullorEmpty',
    'isnullorEmpty': '!isnullorEmpty',
    '!starts': 'starts',
    'starts': '!starts'
};
const invertedClauses = {
    '&&': '||',
    '||': '&&'
};
function invertSearchExpression(input) {
    const operator = invertedOperators[input.operator];
    const output = Object.assign({}, input, { operator });
    if (input.clause) {
        output.clause = invertedClauses[input.clause];
    }
    return output;
}
export function invert(search) {
    if (Array.isArray(search)) {
        return search.map(invertSearchExpressionGroup);
    }
    else if (isSearchExpressionGroup(search)) {
        return invertSearchExpressionGroup(search);
    }
    else {
        return invertSearchExpression(search);
    }
}
