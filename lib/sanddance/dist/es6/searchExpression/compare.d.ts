import { Search, SearchExpression, SearchExpressionGroup } from './types';
export declare function compareExpression(a: SearchExpression, b: SearchExpression): boolean;
export declare function compareGroup(a: SearchExpressionGroup, b: SearchExpressionGroup): boolean;
export declare function compare(a: Search, b: Search): boolean;
