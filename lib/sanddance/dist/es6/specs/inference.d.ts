import { Column, ColumnTypeMap } from './types';
/**
 * Derive column metadata from the data array.
 * @param data Array of data objects.
 */
export declare function getColumnsFromData(data: object[], columnTypes?: ColumnTypeMap): Column[];
/**
 * Populate columns with type inferences and stats.
 * @param columns Array of columns.
 * @param data Array of data objects.
 */
export declare function inferAll(columns: Column[], data: object[]): void;
