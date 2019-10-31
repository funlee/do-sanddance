import { DataScope } from './dataScope';
import { Search } from './searchExpression/types';
export declare enum DataLayoutChange {
    same = 0,
    reset = 1,
    refine = 2
}
export interface Props {
    onAnimateDataChange: (dataChange: DataLayoutChange, waitingLabel: string, handlerLabel: string) => Promise<void>;
    onDataChanged: (dataChange: DataLayoutChange, search?: Search) => void;
}
export declare class Animator {
    private dataScope;
    private props;
    constructor(dataScope: DataScope, props: Props);
    select(search: Search): Promise<void>;
    deselect(): Promise<void>;
    filter(search: Search, keepData: object[], collapseData: object[]): Promise<void>;
    reset(): Promise<void>;
    activate(datum: object): Promise<void>;
    deactivate(): Promise<void>;
}
