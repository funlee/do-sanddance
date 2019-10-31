import { Component } from 'react';
import { types, Viewer } from '@msrvida/sanddance';
export interface Props {
    viewerOptions?: Partial<types.ViewerOptions>;
    insight: types.Insight;
    data: object[];
    renderOptions?: types.RenderOptions;
    onView?: (renderResult: types.RenderResult) => void;
    onMount?: (element: HTMLElement) => boolean | void;
}
export interface State {
}
export declare class SandDanceReact extends Component<Props, State> {
    viewer: Viewer;
    private viewerDiv;
    private lastData;
    private areLayoutPropsSame;
    private needsLayout;
    private layout;
    private view;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
