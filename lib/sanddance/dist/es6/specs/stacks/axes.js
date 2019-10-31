import { partialAxes } from '../axes';
export default function (context) {
    const { specColumns, specViewOptions } = context;
    const pa = partialAxes(specViewOptions, specColumns.x.quantitative, specColumns.y.quantitative);
    const axes = [
        Object.assign({ scale: 'xband', title: specColumns.x.name, bandPosition: 0.5, grid: true, labelFlush: true }, pa.bottom),
        Object.assign({ scale: 'yband', title: specColumns.y.name, bandPosition: specColumns.y.quantitative ? 0 : 0.5, grid: true, labelFlush: true }, pa.left)
    ];
    return axes;
}
