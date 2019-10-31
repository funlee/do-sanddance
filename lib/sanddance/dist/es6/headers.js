import { PresenterElement } from './vega-deck.gl';
export function ensureHeaders(presenter, headers) {
    const vegaControls = presenter.getElement(PresenterElement.vegaControls);
    conditionalHeader(!!vegaControls.querySelectorAll('.vega-bindings > *').length, vegaControls, headers.chart);
    const legend = presenter.getElement(PresenterElement.legend);
    conditionalHeader(!!legend.children.length, legend, headers.legend);
}
function conditionalHeader(condition, element, header) {
    var existing = existingHeader(element, header);
    if (condition && !existing) {
        addHeader(element, header);
    }
    if (!condition && existing) {
        existing.remove();
    }
}
function addHeader(element, header) {
    const h = document.createElement('h4');
    h.innerHTML = header;
    element.insertAdjacentElement('beforebegin', h);
}
function existingHeader(element, header) {
    const { previousElementSibling } = element;
    if (previousElementSibling && previousElementSibling.innerHTML === header) {
        return previousElementSibling;
    }
}
