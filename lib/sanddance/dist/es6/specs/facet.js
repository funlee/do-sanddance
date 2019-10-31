import { DataNames, FieldNames, SignalNames } from './constants';
import { util } from '../vega-deck.gl';
const FacetColumnsSequence = 'FacetColumnsSequence';
const FacetRowsSequence = 'FacetRowsSequence';
const SequenceNumber = 'SequenceNumber';
const CellTitle = 'CellTitle';
const CellFiller = 'CellFiller';
export const facetTitleSeparator = ' - ';
export function facetSignals(context) {
    const { insight } = context;
    const { facets } = insight;
    const signals = [
        {
            name: SignalNames.FacetColumns,
            value: facets.columns,
        },
        {
            name: SignalNames.FacetRows,
            value: facets.rows,
        }
    ];
    return signals;
}
export function checkForFacetErrors(facets, errors) {
    if (facets) {
        const gridCapacity = facets.columns * facets.rows;
        if (!gridCapacity) {
            errors.push('Must set facets columns & rows to non-zero.');
        }
        if (gridCapacity < 2) {
            errors.push('Not enough facets to facet.');
        }
        if (!facets.columns || facets.columns < 1) {
            errors.push('Facet column columns must be greater than 1.');
        }
        if (!facets.rows || facets.rows < 1) {
            errors.push('Facet column rows must be greater than 1.');
        }
    }
}
export function facetSize(context) {
    const { insight, specViewOptions } = context;
    const { facets, size } = insight;
    return {
        height: (size.height - (facets.rows + 1) * (specViewOptions.tickSize + specViewOptions.facetMargins.column)) / facets.columns,
        width: (size.width - (facets.columns + 1) * (specViewOptions.tickSize + specViewOptions.facetMargins.row)) / facets.rows,
    };
}
export function layout(context) {
    const { specViewOptions } = context;
    const layout = {
        columns: {
            signal: SignalNames.FacetColumns
        },
        bounds: 'full',
        padding: {
            column: specViewOptions.facetMargins.column,
            row: specViewOptions.facetMargins.row
        }
    };
    return layout;
}
export function facetBinStep(facetColumn, facetCount) {
    const range = facetColumn.stats.max - facetColumn.stats.min;
    return range / facetCount;
}
function emptyBinsDataSource(name, facetColumn, facets) {
    const gridCapacity = facets.columns * facets.rows;
    const step = facetBinStep(facetColumn, gridCapacity);
    const steps = [];
    for (let i = 0; i < gridCapacity; i++) {
        steps[i] = facetColumn.stats.min + i * step + step / 2;
    }
    const values = steps.map(s => {
        const obj = {};
        obj[FieldNames.Collapsed] = true;
        obj[facetColumn.name] = s;
        return obj;
    });
    const data = { name, values };
    return data;
}
export function facetSourceData(facetColumn, facets, name) {
    let data;
    if (facetColumn && facetColumn.quantitative) {
        data = [
            {
                name: DataNames.Pre
            },
            emptyBinsDataSource(DataNames.EmptyBin, facetColumn, facets),
            {
                name,
                source: [DataNames.Pre, DataNames.EmptyBin]
            }
        ];
    }
    else {
        data = [{ name }];
    }
    return data;
}
export function facetGroupData(source) {
    const data = [
        {
            name: DataNames.FacetCellTitles,
            source,
            transform: [
                {
                    type: 'aggregate',
                    groupby: [CellTitle]
                }
            ]
        },
        {
            name: CellFiller,
            transform: [
                {
                    type: 'sequence',
                    start: 0,
                    step: 1,
                    stop: { signal: `${SignalNames.FacetColumns} * ${SignalNames.FacetRows} - length(data('${DataNames.FacetCellTitles}'))` }
                }
            ]
        },
        {
            name: FacetColumnsSequence,
            transform: [
                {
                    type: 'sequence',
                    start: 0,
                    stop: {
                        signal: SignalNames.FacetColumns
                    },
                    as: SequenceNumber
                }
            ]
        },
        {
            name: FacetRowsSequence,
            transform: [
                {
                    type: 'sequence',
                    start: 0,
                    stop: {
                        signal: SignalNames.FacetRows
                    },
                    as: SequenceNumber
                }
            ]
        }
    ];
    return data;
}
export function facetTransforms(facetColumn, facets) {
    let transforms;
    if (facetColumn.quantitative) {
        const gridCapacity = facets.columns * facets.rows;
        const step = facetBinStep(facetColumn, gridCapacity);
        transforms = [
            {
                type: 'bin',
                field: facetColumn.name,
                step,
                nice: false,
                extent: [facetColumn.stats.min, facetColumn.stats.max],
                as: [
                    FieldNames.FacetBin0,
                    FieldNames.FacetBin1
                ]
            },
            {
                type: 'collect',
                sort: {
                    field: FieldNames.FacetBin0
                }
            },
            {
                type: 'formula',
                expr: `format(datum.${FieldNames.FacetBin0}, '~r') + '${facetTitleSeparator}' + format(datum.${FieldNames.FacetBin1}, '~r')`,
                as: CellTitle
            }
        ];
    }
    else {
        transforms = [
            {
                type: 'formula',
                expr: `datum[${JSON.stringify(facetColumn.name)}]`,
                as: CellTitle
            }
        ];
    }
    return transforms;
}
export function facetMarks(specViewOptions, sourceDataName, childMarks, childAxes, childData) {
    //TODO: create a style
    const cellFillerLineColor = util.colorToString(specViewOptions.colors.cellFillerLine);
    const style = 'cell';
    const mark = {
        style,
        type: 'group',
        from: {
            facet: {
                name: DataNames.FacetGroupCell,
                data: sourceDataName,
                groupby: [CellTitle]
            }
        },
        title: {
            frame: 'group',
            offset: specViewOptions.facetMargins.title,
            text: {
                signal: `parent['${CellTitle}']`
            },
            limit: {
                signal: 'width'
            },
            color: util.colorToString(specViewOptions.colors.axisText),
            fontSize: {
                signal: SignalNames.TextSize
            }
        },
        encode: {
            update: {
                width: {
                    signal: 'width'
                },
                height: {
                    signal: 'height'
                }
            }
        },
        data: childData,
        marks: childMarks.map(mark => {
            if (mark.from && mark.from.data && mark.from.data === sourceDataName) {
                mark.from.data = DataNames.FacetGroupCell;
            }
            return mark;
        })
    };
    if (childAxes) {
        mark.axes = childAxes.map(axis => {
            const clone = util.clone(axis);
            //remove all labels and titles
            clone.labels = false;
            delete clone.title;
            delete clone.titleAlign;
            delete clone.titleAngle;
            delete clone.titleFontSize;
            return clone;
        });
    }
    const filler = {
        style: 'cell',
        type: 'group',
        from: { data: CellFiller },
        title: {
            frame: 'group',
            offset: specViewOptions.facetMargins.title,
            text: '',
            fontSize: {
                signal: SignalNames.TextSize
            }
        },
        encode: {
            update: {
                width: { signal: 'width' },
                height: { signal: 'height' }
            }
        }
    };
    if (childAxes) {
        filler.axes = childAxes.map(axis => {
            const clone = util.clone(axis);
            //remove all labels and titles
            clone.labels = false;
            delete clone.title;
            delete clone.titleAlign;
            delete clone.titleAngle;
            delete clone.titleFontSize;
            //change tick & domain color
            clone.tickColor = cellFillerLineColor;
            clone.domainColor = cellFillerLineColor;
            return clone;
        });
    }
    const rowHeader = {
        type: 'group',
        role: 'row-header',
        from: {
            facet: {
                name: 'row-headers',
                data: FacetRowsSequence,
                groupby: [
                    SequenceNumber
                ]
            }
        }
    };
    if (childAxes) {
        rowHeader.axes = [
            cloneAndOffsetAxis(childAxes.filter(axis => axis.orient === 'left')[0], specViewOptions.facetMargins.column)
        ];
    }
    const columnFooter = {
        type: 'group',
        role: 'column-footer',
        from: {
            facet: {
                name: 'column-footers',
                data: FacetColumnsSequence,
                groupby: [
                    SequenceNumber
                ]
            }
        }
    };
    if (childAxes) {
        columnFooter.axes = [
            cloneAndOffsetAxis(childAxes.filter(axis => axis.orient === 'bottom')[0], specViewOptions.facetMargins.row)
        ];
    }
    const marks = [
        mark,
        filler,
        rowHeader,
        columnFooter
    ];
    return marks;
}
function cloneAndOffsetAxis(axis, margin) {
    if (axis) {
        const clone = util.clone(axis);
        clone.offset = margin;
        return clone;
    }
}
