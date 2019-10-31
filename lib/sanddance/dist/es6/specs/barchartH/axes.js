import { BarChartScaleNames, BarChartSignalNames } from './constants';
import { partialAxes } from '../axes';
import { ScaleNames } from '../constants';
export default function (context) {
    const { specColumns, specViewOptions } = context;
    const pa = partialAxes(specViewOptions, true, specColumns.y.quantitative);
    const axes = [
        Object.assign({ scale: ScaleNames.Y, title: specColumns.y.name }, pa.left),
        Object.assign({ scale: BarChartScaleNames.levelScale, title: specViewOptions.language.count, encode: {
                labels: {
                    update: {
                        text: {
                            signal: `${BarChartSignalNames.compartmentsPerLevelSignal} * datum.value`
                        }
                    }
                }
            } }, pa.bottom)
    ];
    return axes;
}
