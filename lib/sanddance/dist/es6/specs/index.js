// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as constants from './constants';
import { barchartH } from './barchartH';
import { barchartV } from './barchartV';
import { density } from './density';
import { grid } from './grid';
import { scatterplot } from './scatterPlot';
import { stacks } from './stacks';
import { treemap } from './treeMap';
export { constants };
export const creators = {
    barchart: barchartV,
    barchartH,
    barchartV,
    density,
    grid,
    scatterplot,
    stacks,
    treemap
};
export function create(context) {
    const { insight } = context;
    const creator = creators[insight.chart];
    if (creator) {
        const specResult = creator(context);
        //TODO: find why Vega is doing this. fixup for facets
        if (specResult.vegaSpec && insight.columns && insight.columns.facet && insight.facets.columns === 2 && insight.facets.rows === 1) {
            specResult.vegaSpec.width = insight.size.width / 3;
        }
        return specResult;
    }
}
