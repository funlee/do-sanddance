import { Column } from '../specs/types';
import { Search } from './types';
export declare class Exec {
    private columns;
    private groups;
    constructor(search: Search, columns: Column[]);
    private getColumn;
    private runExpressionOnColumn;
    private runExpression;
    private runGroup;
    run(datum: object): any;
}
