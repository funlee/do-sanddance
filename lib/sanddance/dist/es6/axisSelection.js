// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as VegaDeckGl from './vega-deck.gl';
import { selectBetweenAxis, selectBetweenFacet, selectExact, selectExactAxis, selectNullOrEmpty } from './expression';
export function axisSelectionLayer(presenter, specCapabilities, columns, stage, clickHandler, highlightColor, polygonZ) {
    const polygons = [];
    const xRole = specCapabilities.roles.filter(r => r.role === 'x')[0];
    if (xRole && xRole.axisSelection) {
        stage.axes.x.filter(axis => axis.tickText.length).forEach(axis => {
            polygons.push.apply(polygons, axisSelectionPolygons(axis, false, xRole.axisSelection, columns.x));
        });
    }
    const yRole = specCapabilities.roles.filter(r => r.role === 'y')[0];
    if (yRole && yRole.axisSelection) {
        stage.axes.y.filter(axis => axis.tickText.length).forEach(axis => {
            polygons.push.apply(polygons, axisSelectionPolygons(axis, true, yRole.axisSelection, columns.y));
        });
    }
    if (stage.facets) {
        polygons.push.apply(polygons, facetSelectionPolygons(stage.facets, columns.facet));
    }
    //move polygons to Z
    polygons.forEach(datum => {
        datum.polygon.forEach(p => {
            p[2] = polygonZ;
        });
    });
    const onClick = (o, e) => clickHandler(e.srcEvent, o.object.search);
    const polygonLayer = new VegaDeckGl.base.layers.PolygonLayer({
        autoHighlight: true,
        coordinateSystem: VegaDeckGl.base.deck.COORDINATE_SYSTEM.IDENTITY,
        data: polygons,
        extruded: false,
        highlightColor,
        id: 'selections',
        onHover: (o, e) => {
            if (o.index === -1) {
                presenter.deckgl.interactiveState.onAxisSelection = false;
            }
            else {
                presenter.deckgl.interactiveState.onAxisSelection = true;
            }
        },
        onClick,
        getElevation: () => 0,
        getFillColor: () => [0, 0, 0, 0],
        pickable: true,
        stroked: false
    });
    return polygonLayer;
}
function axisSelectionPolygons(axis, vertical, axisSelectionType, column) {
    const polygons = [];
    const size = 50;
    const getSearch = axisSelectionType === 'exact' ?
        (a, c, i) => ({ expressions: [selectExactAxis(a, c, i)] })
        :
            selectBetweenAxis;
    const { domain, ticks } = axis;
    if (ticks.length > 0 && domain) {
        const dim = vertical ? 1 : 0;
        const between = Math.abs(ticks[0].sourcePosition[dim] - domain.sourcePosition[dim]) > 1;
        let divisions;
        if (between) {
            divisions = [];
            for (let i = 1; i < ticks.length; i++) {
                divisions.push((ticks[i].sourcePosition[dim] + ticks[i - 1].sourcePosition[dim]) / 2);
            }
        }
        else {
            divisions = ticks.slice(1, -1).map(tick => tick.sourcePosition[dim]);
        }
        const add = (p2, i) => {
            var coords = [[p1, q1], [p2, q1], [p2, q2], [p1, q2]];
            polygons.push({
                search: getSearch(axis, column, i),
                polygon: vertical ? coords.map(xy => xy.reverse()) : coords
            });
            p1 = p2;
        };
        let p1 = domain.sourcePosition[dim];
        const q1 = domain.sourcePosition[vertical ? 0 : 1];
        const q2 = q1 - size;
        divisions.forEach(add);
        add(domain.targetPosition[dim], ticks.length - (between ? 1 : 2));
    }
    return polygons;
}
function facetSelectionPolygons(facetRects, facetColumn) {
    const polygons = [];
    facetRects.forEach((facetRect, i) => {
        //take any 2 lines to get a box dimension
        const [x, y] = minMaxPoints(facetRect.lines.slice(2));
        const search = facetRect.facetTitle ?
            facetColumn.quantitative ?
                selectBetweenFacet(facetColumn, facetRect.facetTitle.text, i === 0, i === facetRects.length - 1)
                :
                    { expressions: [selectExact(facetColumn, facetRect.facetTitle.text)] }
            :
                { expressions: [selectNullOrEmpty(facetColumn)] };
        polygons.push({
            search,
            polygon: [[x.min, y.min], [x.max, y.min], [x.max, y.max], [x.min, y.max]]
        });
    });
    return polygons;
}
function minMaxPoints(lines) {
    const points = [];
    lines.forEach(line => {
        [line.sourcePosition, line.targetPosition].forEach(point => {
            points.push(point);
        });
    });
    return [0, 1].map(dim => {
        let minMax = { min: null, max: null };
        points.forEach(point => {
            if (minMax.max == null) {
                minMax.max = point[dim];
            }
            else {
                minMax.max = Math.max(minMax.max, point[dim]);
            }
            if (minMax.min == null) {
                minMax.min = point[dim];
            }
            else {
                minMax.min = Math.min(minMax.min, point[dim]);
            }
        });
        return minMax;
    });
}
