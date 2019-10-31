// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { base } from '../base';
import { colorFromString } from '../color';
import { lineZ } from '../defaults';
const markStager = (options, stage, scene, x, y, groupType) => {
    base.vega.sceneVisit(scene, function (item) {
        var x1, y1, x2, y2;
        x1 = item.x || 0;
        y1 = item.y || 0;
        x2 = item.x2 != null ? item.x2 : x1;
        y2 = item.y2 != null ? item.y2 : y1;
        const lineItem = styledLine(x1 + x - options.offsetX, y1 + y - options.offsetY, x2 + x - options.offsetX, y2 + y - options.offsetY, item.stroke, item.strokeWidth);
        if (item.mark.role === 'axis-tick') {
            options.currAxis.ticks.push(lineItem);
        }
        else if (item.mark.role === 'axis-domain') {
            options.currAxis.domain = lineItem;
        }
        else {
            stage.gridLines.push(lineItem);
        }
    });
};
function styledLine(x1, y1, x2, y2, stroke, strokeWidth) {
    const line = {
        sourcePosition: [x1, -y1, lineZ],
        targetPosition: [x2, -y2, lineZ],
        color: colorFromString(stroke),
        strokeWidth: strokeWidth * 10 //translate width to deck.gl
    };
    return line;
}
export function box(gx, gy, height, width, stroke, strokeWidth, diagonals = false) {
    const lines = [
        styledLine(gx, gy, gx + width, gy, stroke, strokeWidth),
        styledLine(gx + width, gy, gx + width, gy + height, stroke, strokeWidth),
        styledLine(gx + width, gy + height, gx, gy + height, stroke, strokeWidth),
        styledLine(gx, gy + height, gx, gy, stroke, strokeWidth)
    ];
    if (diagonals) {
        lines.push(styledLine(gx, gy, gx + width, gy + height, stroke, strokeWidth));
        lines.push(styledLine(gx, gy + height, gx + width, gy, stroke, strokeWidth));
    }
    return lines;
}
export default markStager;
