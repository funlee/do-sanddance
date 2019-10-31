import { SignalNames } from './constants';
import { util } from '../vega-deck.gl';
export function partialAxes(specViewOptions, xColumnQuantitative, yColumnQuantitative) {
    const lineColor = util.colorToString(specViewOptions.colors.axisLine);
    const axisColor = {
        domainColor: lineColor,
        tickColor: lineColor,
        labelColor: util.colorToString(specViewOptions.colors.axisText)
    };
    const bottom = Object.assign({ orient: 'bottom', labelAlign: 'left', labelAngle: {
            signal: SignalNames.TextAngleX
        }, labelFontSize: {
            signal: SignalNames.TextSize
        }, titleAngle: {
            signal: SignalNames.TextAngleX
        }, titleAlign: 'left', titleFontSize: {
            signal: SignalNames.TextTitleSize
        }, titleColor: util.colorToString(specViewOptions.colors.axisText), tickSize: specViewOptions.tickSize }, axisColor);
    if (xColumnQuantitative) {
        bottom.format = '~r';
    }
    const left = Object.assign({ orient: 'left', labelAlign: 'right', labelAngle: {
            signal: SignalNames.TextAngleY
        }, labelFontSize: {
            signal: SignalNames.TextSize
        }, titleAngle: {
            signal: SignalNames.TextAngleY
        }, titleAlign: 'right', titleFontSize: {
            signal: SignalNames.TextTitleSize
        }, titleColor: util.colorToString(specViewOptions.colors.axisText), tickSize: specViewOptions.tickSize }, axisColor);
    if (yColumnQuantitative) {
        left.format = '~r';
    }
    return { left, bottom };
}
