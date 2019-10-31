import { SignalNames } from './constants';
export const defaultZProportion = 0.6;
export function textSignals(context) {
    const { specViewOptions } = context;
    const signals = [
        {
            name: SignalNames.ZProportion,
            value: defaultZProportion,
            bind: {
                name: specViewOptions.language.zScaleProportion,
                debounce: 50,
                input: 'range',
                min: 0.2,
                max: 2,
                step: 0.1
            }
        },
        {
            name: SignalNames.ZHeight,
            update: `height * ${SignalNames.ZProportion}`
        },
        {
            name: SignalNames.TextScale,
            value: 2,
            bind: {
                name: specViewOptions.language.textScaleSignal,
                debounce: 50,
                input: 'range',
                min: 1,
                max: 5,
                step: 0.5
            }
        },
        {
            name: SignalNames.TextSize,
            update: `${SignalNames.TextScale} * 10`
        },
        {
            name: SignalNames.TextTitleSize,
            update: `${SignalNames.TextScale} * 15`
        },
        {
            name: SignalNames.TextAngleX,
            value: 30,
            bind: {
                name: specViewOptions.language.xAxisTextAngleSignal,
                debounce: 50,
                input: 'range',
                min: 0,
                max: 90,
                step: 1
            }
        },
        {
            name: SignalNames.TextAngleY,
            value: 0,
            bind: {
                name: specViewOptions.language.yAxisTextAngleSignal,
                debounce: 50,
                input: 'range',
                min: -90,
                max: 0,
                step: 1
            }
        },
        {
            name: SignalNames.MarkOpacity,
            value: 1,
            bind: {
                name: specViewOptions.language.markOpacitySignal,
                debounce: 50,
                input: 'range',
                min: 0.1,
                max: 1,
                step: 0.05
            }
        }
    ];
    return signals;
}
export function colorBinCountSignal(context) {
    const { specViewOptions } = context;
    const signal = {
        name: SignalNames.ColorBinCount,
        value: 7,
        bind: {
            name: specViewOptions.language.colorBinCount,
            input: 'range',
            min: 1,
            max: specViewOptions.maxLegends + 1,
            step: 1
        }
    };
    return signal;
}
export function colorReverseSignal(context) {
    const { specViewOptions } = context;
    const signal = {
        name: SignalNames.ColorReverse,
        value: false,
        bind: {
            name: specViewOptions.language.colorReverse,
            input: 'checkbox'
        }
    };
    return signal;
}
