export function isSearchExpressionGroup(search) {
    if (!search) {
        return false;
    }
    return !!search.expressions;
}
export function createGroupFromExpression(input) {
    const output = {
        expressions: [input]
    };
    return output;
}
export function ensureSearchExpressionGroupArray(search) {
    if (Array.isArray(search)) {
        return [...search];
    }
    else if (isSearchExpressionGroup(search)) {
        return [search];
    }
    else {
        return [createGroupFromExpression(search)];
    }
}
