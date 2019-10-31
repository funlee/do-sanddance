import { StatelessComponent } from 'tsx-create-element';
import { Legend } from './interfaces';
export interface LegendViewProps {
    legend: Legend;
    onClick: (e: Event, legend: Legend, clickedIndex: number) => void;
}
export declare const LegendView: StatelessComponent<LegendViewProps>;
