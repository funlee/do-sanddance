/// <reference types="react" />
import { StatelessComponent } from 'tsx-create-element';
export interface TableCell {
    className?: string;
    content: string | JSX.Element;
    title?: string;
}
export interface TableRow {
    cells: TableCell[];
}
export interface TableProps {
    className?: string;
    onRowClick?: (e: Event, index: number) => void;
    rows: TableRow[];
    rowClassName?: string;
}
export declare const Table: StatelessComponent<TableProps>;
