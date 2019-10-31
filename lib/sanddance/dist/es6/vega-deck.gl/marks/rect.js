// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { base } from '../base';
import { colorFromString } from '../color';
import { min3dDepth } from '../defaults';
const markStager = (options, stage, scene, x, y, groupType) => {
    let i = 0;
    base.vega.sceneVisit(scene, function (item) {
        //for orthographic (2d) - always use 0 or else Deck will not show them
        const z = stage.view === '2d' ? 0 : (item.z || 0);
        const depth = (stage.view === '2d' ? 0 : (item.depth || 0)) + min3dDepth;
        //change direction of y from SVG to GL
        const ty = -1;
        let ordinal = i;
        if (item.datum.GL_ORDINAL !== void 0) {
            options.ordinalsSpecified = true;
            ordinal = item.datum.GL_ORDINAL;
            if (ordinal > options.maxOrdinal) {
                options.maxOrdinal = ordinal;
            }
        }
        const cube = {
            ordinal,
            size: [item.width, item.height, depth],
            position: [x + (item.x || 0) - options.offsetX, ty * (y + (item.y || 0) - options.offsetY) - item.height, z],
            color: colorFromString(item.fill) || options.defaultCubeColor || [128, 128, 128, 128]
        };
        cube.color[3] = item.opacity === undefined ? 255 : 255 * item.opacity;
        stage.cubeData.push(cube);
        i++;
    });
};
export default markStager;
