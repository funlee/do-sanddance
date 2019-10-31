// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { base } from '../base';
function wrapper(props) {
    class LinearInterpolatorInternal extends base.deck.LinearInterpolator {
        constructor(transitionProps) {
            super(transitionProps);
        }
        interpolateProps(viewStateStartProps, viewStateEndProps, t) {
            if (this.layerStartProps && this.layerEndProps) {
                this.layerInterpolatedProps = super.interpolateProps(this.layerStartProps, this.layerEndProps, t);
            }
            return super.interpolateProps(viewStateStartProps, viewStateEndProps, t);
        }
    }
    const instance = new LinearInterpolatorInternal(props);
    return instance;
}
export const LinearInterpolator = wrapper;
