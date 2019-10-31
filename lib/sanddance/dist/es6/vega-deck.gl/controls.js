// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { createElement } from 'tsx-create-element';
const KeyCodes = {
    ENTER: 13
};
export const Table = (props) => {
    return (createElement("table", { className: props.className },
        props.children,
        props.rows.map((row, i) => (createElement("tr", { className: props.rowClassName || '', onClick: e => props.onRowClick && props.onRowClick(e, i), tabIndex: props.onRowClick ? 0 : -1, onKeyUp: e => {
                if (e.keyCode === KeyCodes.ENTER && props.onRowClick) {
                    props.onRowClick(e, i);
                }
            } }, row.cells.map((cell, i) => (createElement("td", { className: cell.className || '', title: cell.title || '' }, cell.content))))))));
};
