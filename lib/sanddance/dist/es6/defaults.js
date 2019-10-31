import { defaultPresenterConfig, defaultPresenterStyle } from './vega-deck.gl/defaults';
import { desaturate } from './vega-deck.gl/color';
export const defaultViewerOptions = {
    colors: {
        activeCube: [128, 0, 128, 255],
        defaultCube: defaultPresenterStyle.defaultCubeColor,
        hoveredCube: defaultPresenterStyle.highlightColor,
        selectedCube: [255, 255, 0, 255],
        axisSelectHighlight: [128, 128, 128, 128],
        axisLine: [0, 0, 0, 255],
        axisText: [0, 0, 0, 255],
        cellFillerLine: [128, 128, 128, 255],
        unselectedColorMethod: (color) => {
            const c = desaturate(color, 0.05);
            c[3] = 171;
            return c;
        }
    },
    language: {
        headers: {
            chart: 'Chart',
            details: 'Details',
            legend: 'Legend',
            selection: 'Select & Filter'
        },
        bing: 'bing',
        newColorMap: 'remap color to filtered items',
        oldColorMap: 'keep same colors',
        deselect: 'deselect',
        exclude: 'exclude',
        isolate: 'isolate',
        legendOther: 'other',
        nextDetail: '>',
        previousDetail: '<',
        reset: 'reset',
        colorBinCount: 'Color bin count',
        colorReverse: 'Color reverse',
        count: 'Count',
        scatterPointSize: 'Point size',
        XBinSize: 'X axis bin size',
        YBinSize: 'Y axis bin size',
        XGridSize: 'X grid size',
        YGridSize: 'Y grid size',
        InnerPaddingSize: 'Inner padding size',
        OuterPaddingSize: 'Outer padding size',
        treeMapMethod: 'Method',
        facetColumns: 'Facet columns',
        facetRows: 'Facet rows',
        markOpacitySignal: 'Mark opacity',
        textScaleSignal: 'Text scale',
        xAxisTextAngleSignal: 'X axis text angle',
        yAxisTextAngleSignal: 'Y axis text angle',
        zScaleProportion: 'Z scale proportion to Y',
        selectionCount: count => `${count} items selected`
    },
    maxLegends: 19,
    onError: (errors) => {
        //console.log(`UnitVisViewer errors: ${errors.join('\n')}`);
    },
    transitionDurations: Object.assign({}, defaultPresenterConfig.transitionDurations, { scope: 600 }),
    selectionPolygonZ: -1,
    tickSize: 10,
    facetMargins: {
        column: 40,
        row: 40,
        title: 40
    }
};
export function getPresenterStyle(options) {
    var style = {
        cssPrefix,
        fontFamily: options.fontFamily,
        defaultCubeColor: options.colors.defaultCube
    };
    if (options.colors.hoveredCube) {
        style.highlightColor = options.colors.hoveredCube;
    }
    if (options.lightSettings) {
        style.lightSettings = options.lightSettings;
    }
    return style;
}
export const cssPrefix = 'sanddance-';
export const dualColorSchemeColors = {
    black: '#212121',
    gray: '#D2D2D2',
    blue: '#0060F0',
    green: '#00C000',
    orange: '#FF9900',
    red: '#E00000'
};
