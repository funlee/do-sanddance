import { FieldNames, ScaleNames, SignalNames } from './constants';
import { util } from '../vega-deck.gl';
export function fill(context) {
    const { specColumns, insight, specViewOptions } = context;
    const colorColumn = specColumns.color;
    return colorColumn ?
        colorColumn.isColorData || insight.directColor ?
            {
                field: colorColumn.name
            }
            :
                {
                    scale: ScaleNames.Color,
                    field: colorColumn.quantitative ? colorColumn.name : FieldNames.Top
                }
        :
            {
                value: util.colorToString(specViewOptions.colors.defaultCube)
            };
}
export function opacity(context) {
    const result = {
        signal: SignalNames.MarkOpacity
    };
    return result;
}
