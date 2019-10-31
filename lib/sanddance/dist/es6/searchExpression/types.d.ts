export declare type SearchExpressionClause = '&&' | '||';
export declare type SearchExpressionStringSearchOperators = 'starts' | '!starts' | 'contains' | '!contains';
export declare type SearchExpressionOperators = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'isnullorEmpty' | '!isnullorEmpty' | SearchExpressionStringSearchOperators;
export interface SearchExpression {
    clause?: SearchExpressionClause;
    name: string;
    operator: SearchExpressionOperators;
    value?: boolean | Date | number | string;
}
export interface SearchExpressionGroup<T extends SearchExpression = SearchExpression> {
    clause?: SearchExpressionClause;
    expressions: T[];
}
export declare type Search = SearchExpression | SearchExpressionGroup | SearchExpressionGroup[];
