// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { createElement } from 'tsx-create-element';
import { Table } from './controls';
export const LegendView = (props) => {
    const rows = [];
    const addRow = (row, i) => {
        const fn = symbolMap[row.symbol.shape];
        let jsx;
        if (fn) {
            jsx = fn(row.symbol);
        }
        else {
            jsx = createElement("span", null, "x");
            //console.log(`need to render ${row.symbol.shape} symbol shape`);
        }
        rows.push({
            cells: [
                { className: 'symbol', content: jsx },
                { className: 'label', content: row.label, title: row.label }
            ]
        });
    };
    var sorted = Object.keys(props.legend.rows).sort((a, b) => +a - +b);
    sorted.forEach(i => addRow(props.legend.rows[i], +i));
    if (sorted.length) {
        return (createElement(Table, { rows: rows, rowClassName: "legend-row", onRowClick: (e, i) => props.onClick(e, props.legend, i) }, props.legend.title !== void 0 && createElement("tr", { onClick: e => props.onClick(e, props.legend, null) },
            createElement("th", { colSpan: 2 }, props.legend.title))));
    }
};
const symbolMap = {
    square: function (symbol) {
        return (createElement("div", { style: {
                height: `${symbol.bounds.y2 - symbol.bounds.y1}px`,
                width: `${symbol.bounds.x2 - symbol.bounds.x1}px`,
                backgroundColor: symbol.fill,
                borderColor: symbol.fill
            } }));
    }
};
