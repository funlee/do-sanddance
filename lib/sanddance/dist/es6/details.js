// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as searchExpression from './searchExpression';
import { constants, controls, util } from './vega-deck.gl';
import { createElement, mount } from 'tsx-create-element';
import { cssPrefix } from './defaults';
import { isInternalFieldName } from './util';
var Action;
(function (Action) {
    Action[Action["deselect"] = 0] = "deselect";
    Action[Action["isolate"] = 1] = "isolate";
    Action[Action["exclude"] = 2] = "exclude";
    Action[Action["reset"] = 3] = "reset";
    Action[Action["next"] = 4] = "next";
    Action[Action["previous"] = 5] = "previous";
})(Action || (Action = {}));
export class Details {
    constructor(parentElement, language, animator, dataScope, colorMapHandler, hasColorMaps) {
        this.language = language;
        this.animator = animator;
        this.dataScope = dataScope;
        this.colorMapHandler = colorMapHandler;
        this.hasColorMaps = hasColorMaps;
        this.element = util.addDiv(parentElement, `${cssPrefix}unitControls`);
        this.clear();
    }
    finalize() {
        if (this.element)
            this.element.innerHTML = '';
        this.dataScope = null;
        this.element = null;
    }
    clear() {
        this.state = {
            userSelection: null,
            index: -1,
            remapColor: false
        };
        this.render();
    }
    clearSelection() {
        this.state.userSelection = null;
        this.state.index = -1;
        this.render();
    }
    populate(userSelection, index = 0) {
        this.state.userSelection = userSelection;
        this.state.index = index;
        this.render();
    }
    selectByNameValue(columnName, value) {
        const search = {
            name: columnName,
            operator: '==',
            value
        };
        this.clearSelection();
        this.animator.select(search);
        this.populate(this.dataScope.selection);
    }
    remapChanged(remap) {
        this.state.remapColor = remap;
        this.colorMapHandler(remap);
        this.render();
    }
    handleAction(action) {
        let p;
        const u = this.state.userSelection;
        switch (action) {
            case Action.deselect:
                this.clearSelection();
                p = this.animator.deselect();
                break;
            case Action.exclude:
                this.clearSelection();
                p = this.animator.filter(searchExpression.invert(u.search), u.excluded, u.included);
                this.state.remapColor = false;
                break;
            case Action.isolate:
                this.clearSelection();
                p = this.animator.filter(u.search, u.included, u.excluded);
                this.state.remapColor = false;
                break;
            case Action.reset:
                this.clear();
                p = this.animator.reset();
                break;
            default:
                switch (action) {
                    case Action.previous:
                        this.state.index--;
                        if (this.state.index < 0) {
                            this.state.index = this.state.userSelection.included.length - 1;
                        }
                        break;
                    case Action.next:
                        this.state.index++;
                        if (this.state.index >= this.state.userSelection.included.length) {
                            this.state.index = 0;
                        }
                        break;
                }
                this.render();
                p = this.animator.activate(this.state.userSelection.included[this.state.index]);
        }
        p.then(() => this.render());
    }
    render() {
        const hasRefinedData = !!this.dataScope.filteredData;
        const renderProps = {
            language: this.language,
            actionHandler: action => this.handleAction(action),
            selectionHandler: (columnName, value) => this.selectByNameValue(columnName, value),
            count: this.state.userSelection && this.state.userSelection.included.length,
            hasRefinedData,
            item: this.state.userSelection && this.state.userSelection.included[this.state.index],
            remapColorHandler: remap => this.remapChanged(remap),
            hasColorMaps: this.hasColorMaps() && hasRefinedData,
            remapColor: this.state.remapColor
        };
        mount(renderDetails(renderProps), this.element);
    }
}
const renderDetails = (props) => {
    const controlButtons = [
        createElement("button", { disabled: !props.item, onClick: e => props.actionHandler(Action.deselect) }, props.language.deselect),
        createElement("button", { disabled: !props.item, onClick: e => props.actionHandler(Action.isolate) }, props.language.isolate),
        createElement("button", { disabled: !props.item, onClick: e => props.actionHandler(Action.exclude) }, props.language.exclude)
    ];
    const colorMapping = (createElement("div", null,
        createElement("button", { disabled: props.remapColor, onClick: e => props.remapColorHandler(true) }, props.language.newColorMap),
        createElement("button", { disabled: !props.remapColor, onClick: e => props.remapColorHandler(false) }, props.language.oldColorMap)));
    const singleItem = props.count === 1;
    const scrollButtons = [
        createElement("button", { disabled: singleItem, onClick: e => props.actionHandler(Action.previous) }, props.language.previousDetail),
        createElement("button", { disabled: singleItem, onClick: e => props.actionHandler(Action.next) }, props.language.nextDetail),
        createElement("span", null,
            " ",
            props.language.selectionCount(props.count))
    ];
    const rows = [];
    for (let prop in props.item) {
        if (prop === constants.GL_ORDINAL) {
            continue;
        }
        if (isInternalFieldName(prop)) {
            continue;
        }
        rows.push({
            cells: [
                { content: prop }, { content: linkSelect(props.language, prop, props.item[prop], props.selectionHandler) }
            ]
        });
    }
    return (createElement("div", null,
        props.hasColorMaps && colorMapping,
        createElement("h4", null, props.language.headers.selection),
        createElement("div", { className: `${cssPrefix}selection` },
            controlButtons,
            createElement("button", { disabled: !props.hasRefinedData, onClick: e => props.actionHandler(Action.reset) }, "reset")),
        props.item && createElement("h4", null, props.language.headers.details),
        createElement("div", null,
            createElement("div", { className: `${cssPrefix}details-scroll` }, props.item && scrollButtons),
            createElement("div", { className: `${cssPrefix}details` }, props.item && createElement(controls.Table, { rows: rows })))));
};
function linkSelect(language, columnName, value, selectionHandler) {
    return (createElement("span", null,
        createElement("a", { href: "#", onClick: e => selectionHandler(columnName, value) }, value),
        isNaN(value) ? [' ', createElement("a", { className: "bing-search", href: `https://www.bing.com/search?q=${encodeURIComponent(value)}`, target: "_blank" }, language.bing)] : ''));
}
