// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as VegaDeckGl from './vega-deck.gl';
import { FieldNames } from './specs/constants';
export function getSelectedColorMap(currentData, showSelectedData, showActive, viewerOptions) {
    function getSelectionColorItem(datum) {
        let item;
        if (showSelectedData) {
            item = datum[FieldNames.Selected] ?
                { color: viewerOptions.colors.selectedCube }
                :
                    { unSelected: true };
        }
        if (showActive && datum[FieldNames.Active]) {
            item = { color: viewerOptions.colors.activeCube };
        }
        return item;
    }
    const colorMap = {};
    currentData.forEach(datum => {
        const selectionColor = getSelectionColorItem(datum);
        if (selectionColor) {
            const ordinal = datum[VegaDeckGl.constants.GL_ORDINAL];
            colorMap[ordinal] = selectionColor;
        }
    });
    return colorMap;
}
export function colorMapFromCubes(cubes) {
    const map = {};
    cubes.forEach(cube => {
        map[cube.ordinal] = { color: cube.color };
    });
    return map;
}
export function populateColorContext(colorContext, presenter) {
    if (!colorContext.colorMap) {
        const cubes = presenter.getCubeData();
        colorContext.colorMap = colorMapFromCubes(cubes);
    }
    colorContext.legend = VegaDeckGl.util.clone(presenter.stage.legend);
    colorContext.legendElement = presenter.getElement(VegaDeckGl.PresenterElement.legend).children[0];
}
export function applyColorMapToCubes(maps, cubes, unselectedColorMethod) {
    Object.keys(maps[0]).forEach(ordinal => {
        const cube = cubes[+ordinal];
        if (cube && !cube.isEmpty) {
            const actualColorMappedItem = maps[0][ordinal];
            if (maps.length > 1) {
                const selectedColorMappedItem = maps[1][ordinal];
                if (selectedColorMappedItem) {
                    if (selectedColorMappedItem.unSelected && unselectedColorMethod) {
                        cube.color = unselectedColorMethod(actualColorMappedItem.color);
                    }
                    else {
                        cube.color = selectedColorMappedItem.color;
                    }
                    return;
                }
            }
            cube.color = actualColorMappedItem.color;
        }
    });
}
