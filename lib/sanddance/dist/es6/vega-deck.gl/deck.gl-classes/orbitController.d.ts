import { base } from '../base';
export interface OrbitControllerClassOptions {
    doubleClickHandler?: (e: MouseEvent, orbitController: OrbitController_Class) => void;
}
export declare function createOrbitControllerClass(factoryOptions: OrbitControllerClassOptions): typeof OrbitController_Class;
export declare class OrbitController_Class extends base.deck._OrbitController {
}
