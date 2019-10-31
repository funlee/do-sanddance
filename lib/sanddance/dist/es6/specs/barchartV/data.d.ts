import { Data, SourceData, Transforms } from 'vega-typings';
import { NameSpace } from './namespace';
import { SpecContext } from '../types';
export default function (context: SpecContext, namespace: NameSpace): Data[];
export declare function bucketed(context: SpecContext, namespace: NameSpace, source: string): SourceData;
export declare function stacked(namespace: NameSpace, source: string, transforms?: Transforms[]): SourceData;
