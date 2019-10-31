import { Column, ColumnTypeMap } from './specs/types';
import { Search } from './searchExpression/types';
export interface UserSelection {
    search: Search;
    included: object[];
    excluded: object[];
}
export declare class DataScope {
    selection: UserSelection;
    private data;
    private columns;
    filteredData: object[];
    active: object;
    isCollapsed: boolean;
    setData(data: object[], columns?: Column[]): boolean;
    getColumns(columnTypes?: ColumnTypeMap): Column[];
    currentData(): object[];
    select(search: Search): void;
    createUserSelection(search: Search, assign: boolean): UserSelection;
    deselect(): void;
    hasSelectedData(): boolean;
    collapse(collapsed: boolean, data?: object[]): void;
    activate(datum: object): void;
    deactivate(): void;
    ordinalIndexWithinSelection(ordinal: number): {
        datum: object;
        index: number;
    };
    finalize(): void;
}
