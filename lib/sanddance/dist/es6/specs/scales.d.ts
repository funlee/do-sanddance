import { ColorBin } from './types';
import { LinearScale, PointScale, QuantileScale, QuantizeScale, RangeBand, RangeScheme, SequentialScale } from 'vega-typings';
export declare function linearScale(name: string, data: string, field: string, range: RangeScheme, reverse: boolean, zero: boolean): LinearScale;
export declare function pointScale(name: string, data: string, range: RangeBand, field: string, reverse?: boolean): PointScale;
export declare function binnableColorScale(colorBin: ColorBin, data: string, field: string, scheme?: string): SequentialScale | QuantileScale | QuantizeScale;
