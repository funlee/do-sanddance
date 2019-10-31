// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as React from 'react';
import { Component } from 'react';
import { deepCompare } from './util';
import { findDOMNode } from 'react-dom';
import { VegaDeckGl, Viewer } from '@msrvida/sanddance';
function addNullable(insight, signalValues) {
    const withNulls = Object.assign({ view: null, filter: null }, insight, { signalValues });
    return withNulls;
}
export class SandDanceReact extends Component {
    areLayoutPropsSame() {
        const currentInsight = this.viewer.getInsight();
        const a = addNullable(currentInsight, Object.assign({}, this.viewer.insight.signalValues, currentInsight.signalValues));
        const b = addNullable(this.props.insight, Object.assign({}, a.signalValues, this.props.insight.signalValues));
        const compare = deepCompare(a, b);
        return compare && (this.props.data === this.lastData);
    }
    needsLayout() {
        return this.props.insight && this.props.data && !this.areLayoutPropsSame();
    }
    layout() {
        this.lastData = this.props.data;
        this.viewer.render(this.props.insight, this.props.data, this.props.renderOptions).then(renderResult => {
            //TODO: show errors if any
            //console.log('viewer render');
            this.props.onView && this.props.onView(renderResult);
        }).catch(() => {
            //console.log('viewer error');
        });
    }
    view() {
        const needsLayout = this.needsLayout();
        if (needsLayout) {
            this.layout();
        }
    }
    componentDidMount() {
        const element = findDOMNode(this.viewerDiv);
        this.viewer = new Viewer(element, this.props.viewerOptions);
        if (this.props.onMount) {
            if (this.props.onMount(this.viewer.presenter.getElement(VegaDeckGl.PresenterElement.gl))) {
                this.view();
            }
        }
        else {
            this.view();
        }
    }
    componentDidUpdate() {
        this.viewer.options = VegaDeckGl.util.deepMerge(this.viewer.options, this.props.viewerOptions);
        this.view();
    }
    componentWillUnmount() {
        this.viewer.finalize();
    }
    render() {
        return (React.createElement("div", { className: "sanddance-ReactViewer", ref: div => (this.viewerDiv = div) }));
    }
}
