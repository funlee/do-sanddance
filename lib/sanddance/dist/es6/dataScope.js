// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as VegaDeckGl from './vega-deck.gl';
import { FieldNames } from './specs/constants';
import { Exec } from './searchExpression/exec';
import { getColumnsFromData } from './specs/inference';
export class DataScope {
    setData(data, columns) {
        const differentData = this.data !== data;
        if (differentData) {
            if (this.data) {
                //clean up things we added to old data
                this.deselect();
            }
            this.data = data;
            this.columns = columns;
            this.filteredData = null;
        }
        return differentData;
    }
    getColumns(columnTypes) {
        if (!this.columns) {
            this.columns = getColumnsFromData(this.data, columnTypes);
        }
        return this.columns;
    }
    currentData() {
        return this.filteredData || this.data;
    }
    select(search) {
        this.deselect();
        if (search) {
            this.selection = this.createUserSelection(search, true);
            if (this.selection.included.length) {
                this.activate(this.selection.included[0]);
            }
        }
    }
    createUserSelection(search, assign) {
        const exec = new Exec(search, this.getColumns());
        const s = {
            search,
            included: [],
            excluded: []
        };
        this.currentData().forEach(datum => {
            if (exec.run(datum)) {
                if (assign) {
                    datum[FieldNames.Selected] = true;
                }
                s.included.push(datum);
            }
            else {
                s.excluded.push(datum);
            }
        });
        return s;
    }
    deselect() {
        this.deactivate();
        this.data.forEach(datum => {
            delete datum[FieldNames.Selected];
        });
        this.selection = null;
    }
    hasSelectedData() {
        return !!this.selection;
    }
    collapse(collapsed, data = this.data) {
        data.forEach(datum => {
            datum[FieldNames.Collapsed] = collapsed;
        });
        this.isCollapsed = collapsed;
    }
    activate(datum) {
        this.deactivate();
        datum[FieldNames.Active] = true;
        this.active = datum;
    }
    deactivate() {
        if (this.active) {
            delete this.active[FieldNames.Active];
        }
        this.active = null;
    }
    ordinalIndexWithinSelection(ordinal) {
        if (this.selection) {
            for (let i = 0; i < this.selection.included.length; i++) {
                let datum = this.selection.included[i];
                if (datum[VegaDeckGl.constants.GL_ORDINAL] === ordinal) {
                    return { datum, index: i };
                }
            }
        }
        return { datum: null, index: -1 };
    }
    finalize() {
        this.data = null;
        this.filteredData = null;
        if (this.selection) {
            this.selection.excluded = null;
            this.selection.included = null;
            this.selection = null;
        }
    }
}
