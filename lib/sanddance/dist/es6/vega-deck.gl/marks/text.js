import { base } from '../base';
import { colorFromString } from '../color';
const markStager = (options, stage, scene, x, y, groupType) => {
    //scale Deck.Gl text to Vega size
    const fontScale = 6;
    //Deck.gl centers text on Y. TODO: is this correct on x axis?
    const offsetYCenter = 16;
    //change direction of y from SVG to GL
    const ty = -1;
    base.vega.sceneVisit(scene, function (item) {
        if (!item.text)
            return;
        const size = item.fontSize * fontScale;
        const textItem = {
            color: colorFromString(item.fill),
            text: item.text.toString(),
            position: [x + item.x - options.offsetX, ty * (y + item.y + offsetYCenter - options.offsetY), 0],
            size,
            angle: convertAngle(item.angle),
            textAnchor: convertAlignment(item.align),
            alignmentBaseline: convertBaseline(item.baseline)
        };
        if (item.mark.role === 'axis-label') {
            const tickText = textItem;
            tickText.value = item.datum.value;
            options.currAxis.tickText.push(tickText);
        }
        else if (item.mark.role === 'axis-title') {
            options.currAxis.title = textItem;
        }
        else if (options.currFacetRect && !options.currFacetRect.facetTitle) {
            options.currFacetRect.facetTitle = textItem;
        }
        else {
            stage.textData.push(textItem);
        }
    });
};
function convertAngle(vegaTextAngle) {
    return 360 - vegaTextAngle;
}
function convertAlignment(textAlign) {
    switch (textAlign) {
        case 'center': return 'middle';
        case 'left': return 'start';
        case 'right': return 'end';
    }
}
function convertBaseline(baseline) {
    switch (baseline) {
        case 'middle': return 'center';
    }
    return baseline;
}
export default markStager;
