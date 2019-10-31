import { notNice, selectBetween, selectExact, selectNone, selectNullOrEmpty } from './expression';
import { Other } from './specs/constants';
function legendRange(colorBinType, column, legend, clickedIndex) {
    if (column.quantitative) {
        return selectQuantitative(colorBinType, column, legend, clickedIndex);
    }
    else {
        return selectCategorical(column, legend, clickedIndex);
    }
}
function selectCategorical(column, legend, clickedIndex) {
    const value = legend.rows[clickedIndex].value;
    if (value === Other) {
        const values = [];
        for (let i in legend.rows) {
            if (+i !== clickedIndex) {
                values.push(legend.rows[i].value);
            }
        }
        return selectNone(column, values);
    }
    else {
        //select equal
        return { expressions: [selectExact(column, legend.rows[clickedIndex].value)] };
    }
}
function selectQuantitative(colorBinType, column, legend, clickedIndex) {
    const keys = Object.keys(legend.rows).map(key => +key).sort((a, b) => +a - +b);
    let lowValue;
    let lowOperator;
    let highValue;
    let highOperator;
    const rowText = legend.rows[clickedIndex].label;
    switch (colorBinType) {
        case 'continuous': {
            lowValue = rowText;
            if (clickedIndex < keys.length - 1) {
                highValue = legend.rows[clickedIndex + 1].value;
            }
            break;
        }
        default: {
            if (rowText.indexOf('null') > 0) {
                const ex = {
                    expressions: [selectNullOrEmpty(column)]
                };
                return ex;
            }
            const dash = rowText.indexOf('–'); //this is not the common dash character!
            if (dash > 0) {
                //bug in Vega for quantize?
                //lowOperator = '>';
                //highOperator = '<=';
                lowValue = rowText.substr(0, dash);
                highValue = rowText.substr(dash + 1);
            }
            else {
                if (rowText.indexOf('<') >= 0) {
                    highValue = rowText.substring(2);
                }
                else {
                    if (rowText.indexOf('≥') >= 0) {
                        lowValue = rowText.substring(2);
                    }
                }
            }
        }
    }
    if (lowValue)
        lowValue = notNice(lowValue);
    if (highValue)
        highValue = notNice(highValue);
    return selectBetween(column, lowValue, highValue, lowOperator, highOperator);
}
export function finalizeLegend(colorBinType, colorColumn, legend, language) {
    const rowTexts = [];
    for (let i in legend.rows) {
        let row = legend.rows[i];
        row.search = legendRange(colorBinType, colorColumn, legend, +i);
        if (row.value === Other) {
            row.label = language.legendOther;
        }
        else if (rowTexts.indexOf(row.value) >= 0) {
            delete legend.rows[i];
        }
        else {
            rowTexts.push(row.value);
        }
    }
}
