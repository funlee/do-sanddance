import { Search, SearchExpression, SearchExpressionGroup } from './types';
export declare function isSearchExpressionGroup(search: Search): boolean;
export declare function createGroupFromExpression(input: SearchExpression): SearchExpressionGroup<SearchExpression>;
export declare function ensureSearchExpressionGroupArray(search: Search): SearchExpressionGroup[];
