import { BarChartScaleNames, BarChartSignalNames } from './constants';
import { partialAxes } from '../axes';
import { ScaleNames } from '../constants';
export default function (context) {
    const { specColumns, specViewOptions } = context;
    const pa = partialAxes(specViewOptions, specColumns.x.quantitative, true);
    const axes = [
        Object.assign({ scale: ScaleNames.X, title: specColumns.x.name }, pa.bottom),
        Object.assign({ scale: BarChartScaleNames.levelScale, title: specViewOptions.language.count, encode: {
                labels: {
                    update: {
                        text: {
                            signal: `${BarChartSignalNames.compartmentsPerLevelSignal} * datum.value`
                        }
                    }
                }
            } }, pa.left)
    ];
    return axes;
}
