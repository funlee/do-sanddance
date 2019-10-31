export var DataLayoutChange;
(function (DataLayoutChange) {
    DataLayoutChange[DataLayoutChange["same"] = 0] = "same";
    DataLayoutChange[DataLayoutChange["reset"] = 1] = "reset";
    DataLayoutChange[DataLayoutChange["refine"] = 2] = "refine";
})(DataLayoutChange || (DataLayoutChange = {}));
export class Animator {
    constructor(dataScope, props) {
        this.dataScope = dataScope;
        this.props = props;
    }
    select(search) {
        return new Promise((resolve, reject) => {
            this.dataScope.select(search);
            this.props.onDataChanged(DataLayoutChange.same);
            resolve();
        });
    }
    deselect() {
        return new Promise((resolve, reject) => {
            this.dataScope.deselect();
            this.props.onDataChanged(DataLayoutChange.same);
            resolve();
        });
    }
    filter(search, keepData, collapseData) {
        this.dataScope.collapse(true, collapseData);
        return new Promise((resolve, reject) => {
            this.props.onAnimateDataChange(DataLayoutChange.refine, 'before refine', 'refine').then(() => {
                this.dataScope.deselect();
                this.dataScope.filteredData = keepData;
                this.props.onDataChanged(DataLayoutChange.refine, search);
                resolve();
            }).catch(reject);
        });
    }
    reset() {
        return new Promise((resolve, reject) => {
            this.dataScope.deselect();
            this.dataScope.filteredData = null;
            this.props.onAnimateDataChange(DataLayoutChange.reset, 'before reset', 'reset').then(() => {
                this.dataScope.collapse(false);
                this.props.onDataChanged(DataLayoutChange.reset);
                resolve();
            }).catch(reject);
        });
    }
    activate(datum) {
        return new Promise((resolve, reject) => {
            this.dataScope.activate(datum);
            this.props.onDataChanged(DataLayoutChange.same);
            resolve();
        });
    }
    deactivate() {
        return new Promise((resolve, reject) => {
            this.dataScope.deactivate();
            this.props.onDataChanged(DataLayoutChange.same);
            resolve();
        });
    }
}
