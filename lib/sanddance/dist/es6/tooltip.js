// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { createElement } from 'tsx-create-element';
import { GL_ORDINAL } from './vega-deck.gl/constants';
import { isInternalFieldName } from './util';
import { outerSize } from './vega-deck.gl/htmlHelpers';
import { Table } from './vega-deck.gl/controls';
export class Tooltip {
    constructor(props) {
        const renderProps = {
            cssPrefix: props.cssPrefix,
            rows: getRows(props.item, props.options)
        };
        this.element = renderTooltip(renderProps);
        if (this.element) {
            this.element.style.position = 'absolute';
            this.child = this.element.firstChild;
            document.body.appendChild(this.element);
            //measure and move as necessary
            let m = outerSize(this.child);
            while (m.height > document.documentElement.clientHeight) {
                let tr = this.child.querySelector('tr:last-child');
                if (tr) {
                    tr.parentElement.removeChild(tr);
                }
                else {
                    break;
                }
                m = outerSize(this.child);
            }
            if (props.position.clientX + m.width >= document.documentElement.clientWidth) {
                this.child.style.right = '0';
            }
            let moveTop = true;
            if (props.position.clientY + m.height >= document.documentElement.clientHeight) {
                if (props.position.clientY - m.height > 0) {
                    this.child.style.bottom = '0';
                }
                else {
                    moveTop = false;
                }
            }
            if (moveTop) {
                this.element.style.top = `${props.position.clientY}px`;
            }
            this.element.style.left = `${props.position.clientX}px`;
        }
    }
    finalize() {
        if (this.element) {
            document.body.removeChild(this.element);
        }
        this.element = null;
    }
}
function getRows(item, options) {
    const rows = [];
    for (let columnName in item) {
        if (columnName === GL_ORDINAL) {
            continue;
        }
        if (isInternalFieldName(columnName)) {
            continue;
        }
        if (options && options.exclude) {
            if (options.exclude(columnName)) {
                continue;
            }
        }
        let value = item[columnName];
        let content;
        if (options && options.displayValue) {
            content = options.displayValue(value);
        }
        else {
            switch (value) {
                case null:
                    content = createElement("i", null, "null");
                    break;
                case undefined:
                    content = createElement("i", null, "undefined");
                    break;
                default:
                    content = value.toString();
            }
        }
        rows.push({
            cells: [
                { content: columnName + ':' },
                { content }
            ]
        });
    }
    return rows;
}
const renderTooltip = (props) => {
    return props.rows.length === 0 ? null : (createElement("div", { className: `${props.cssPrefix}tooltip` }, Table({ rows: props.rows })));
};
