import { ColorScaleNone, ScaleNames, SignalNames } from './constants';
export function linearScale(name, data, field, range, reverse, zero) {
    const scale = {
        name,
        type: 'linear',
        range,
        round: true,
        reverse,
        domain: {
            data,
            field
        },
        zero,
        nice: true
    };
    return scale;
}
export function pointScale(name, data, range, field, reverse) {
    const scale = {
        name,
        type: 'point',
        range,
        domain: {
            data,
            field,
            sort: true
        },
        padding: 0.5
    };
    if (reverse !== undefined) {
        scale.reverse = reverse;
    }
    return scale;
}
export function binnableColorScale(colorBin, data, field, scheme) {
    scheme = scheme || ColorScaleNone;
    const name = ScaleNames.Color;
    const domain = {
        data,
        field
    };
    const range = {
        scheme
    };
    const reverse = { signal: SignalNames.ColorReverse };
    if (colorBin !== 'continuous') {
        range.count = { signal: SignalNames.ColorBinCount };
    }
    switch (colorBin) {
        case 'continuous': {
            const sequentialScale = {
                name,
                type: 'sequential',
                domain,
                range,
                reverse
            };
            return sequentialScale;
        }
        case 'quantile': {
            const quantileScale = {
                name,
                type: 'quantile',
                domain,
                range,
                reverse
            };
            return quantileScale;
        }
        default: {
            const quantizeScale = {
                name,
                type: 'quantize',
                domain,
                range,
                reverse
            };
            return quantizeScale;
        }
    }
}
