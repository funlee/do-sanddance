// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { DataNames, SignalNames } from './specs/constants';
export function adjustActualFacetSignals(fc, VegaDeckGl) {
    if (fc) {
        let reRender = false;
        const innerState = VegaDeckGl.getState();
        const actualCellCount = VegaDeckGl.data(DataNames.FacetCellTitles).length;
        const actualRows = Math.ceil(actualCellCount / fc.columns);
        const signalRows = VegaDeckGl.signal(SignalNames.FacetRows);
        if (actualRows !== signalRows) {
            //VegaDeckGl.signal(FacetRowsSignal, actualRows);
            innerState.signals[SignalNames.FacetRows] = actualRows;
            reRender = true;
        }
        if (actualRows === 1 && actualCellCount < fc.columns) {
            //VegaDeckGl.signal(FacetColumnsSignal, actualCellCount);
            innerState.signals[SignalNames.FacetColumns] = actualCellCount;
            reRender = true;
        }
        if (reRender) {
            //TODO: notify consumer?
            //VegaDeckGl.setState(innerState);
        }
    }
}
