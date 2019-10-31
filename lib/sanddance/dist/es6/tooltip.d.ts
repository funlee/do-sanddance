import { TooltipOptions } from './types';
interface Props {
    cssPrefix: string;
    options: TooltipOptions;
    item: object;
    position?: {
        clientX: number;
        clientY: number;
    };
}
export declare class Tooltip {
    private element;
    private child;
    constructor(props: Props);
    finalize(): void;
}
export {};
