import * as VegaDeckGl from './vega-deck.gl';
import { Column } from './specs/types';
import { SearchExpression, SearchExpressionGroup, SearchExpressionOperators } from './searchExpression/types';
export declare function notNice(niceValue: string | number): string;
export declare function selectNullOrEmpty(column: Column): SearchExpression;
export declare function selectExact(column: Column, value: string): SearchExpression;
export declare function selectNone(column: Column, values: string[]): SearchExpressionGroup<SearchExpression>;
export declare function selectExactAxis(axis: VegaDeckGl.types.Axis, column: Column, i: number): SearchExpression;
export declare function selectBetween(column: Column, lowValue: string, highValue: string, lowOperator?: SearchExpressionOperators, highOperator?: SearchExpressionOperators): SearchExpressionGroup<SearchExpression>;
export declare function selectBetweenAxis(axis: VegaDeckGl.types.Axis, column: Column, i: number): SearchExpressionGroup<SearchExpression>;
export declare function selectBetweenFacet(column: Column, title: string, isFirst: boolean, isLast: boolean): SearchExpressionGroup<SearchExpression>;
