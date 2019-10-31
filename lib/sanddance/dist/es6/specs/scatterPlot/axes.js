import { partialAxes } from '../axes';
import { ScaleNames } from '../constants';
export default function (context) {
    const { specColumns, specViewOptions } = context;
    const pa = partialAxes(specViewOptions, specColumns.x.quantitative, specColumns.y.quantitative);
    const axes = [
        Object.assign({ scale: ScaleNames.X, title: specColumns.x.name }, pa.bottom),
        Object.assign({ scale: ScaleNames.Y, title: specColumns.y.name }, pa.left)
    ];
    return axes;
}
