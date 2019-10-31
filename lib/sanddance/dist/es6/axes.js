// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as VegaDeckGl from './vega-deck.gl';
function cloneAxis(axes, axisColor, axisTextColor) {
    return axes.map(axis => {
        const newAxis = VegaDeckGl.util.deepMerge(axis);
        newAxis.domain.color = axisColor;
        newAxis.title.color = axisTextColor;
        newAxis.ticks.forEach(t => { t.color = axisColor; });
        newAxis.tickText.forEach(t => { t.color = axisTextColor; });
        return newAxis;
    });
}
function cloneTextData(textData, color) {
    return textData.map(t => {
        return Object.assign({}, t, { color });
    });
}
function colorEquals(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
export function recolorAxes(stage, oldColors, newColors) {
    const hasNewLineColor = newColors.axisLine && !colorEquals(newColors.axisLine, oldColors.axisLine);
    const hasNewTextColor = newColors.axisText && !colorEquals(newColors.axisText, oldColors.axisText);
    let axes;
    let textData;
    if (hasNewLineColor || hasNewTextColor) {
        const lineColor = newColors.axisLine || oldColors.axisLine;
        const textColor = newColors.axisText || oldColors.axisText;
        axes = {
            x: cloneAxis(stage.axes.x, lineColor, textColor),
            y: cloneAxis(stage.axes.y, lineColor, textColor)
        };
    }
    if (hasNewTextColor) {
        textData = cloneTextData(stage.textData, newColors.axisText);
    }
    return { axes, textData };
}
