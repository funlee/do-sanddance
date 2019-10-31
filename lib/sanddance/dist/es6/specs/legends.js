import { ScaleNames } from './constants';
function legend(column) {
    const legend = {
        orient: 'none',
        title: column.name,
        fill: ScaleNames.Color,
        encode: {
            symbols: {
                update: {
                    shape: {
                        value: 'square'
                    }
                }
            }
        }
    };
    if (column.quantitative) {
        legend.type = 'symbol';
        legend.format = '~r';
    }
    return legend;
}
export function getLegends(context) {
    const { specColumns, insight } = context;
    if (specColumns.color && !insight.hideLegend && !insight.directColor && !specColumns.color.isColorData) {
        return [legend(specColumns.color)];
    }
}
