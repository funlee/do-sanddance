import { base } from '../base';
export function createOrbitControllerClass(factoryOptions) {
    function wrapper(props) {
        class OrbitControllerInternal extends base.deck._OrbitController {
            constructor(props) {
                super(props);
                this.invertPan = true;
            }
            _onDoubleTap(event) {
                if (factoryOptions && factoryOptions.doubleClickHandler) {
                    factoryOptions.doubleClickHandler(event, this);
                }
                else {
                    super._onDoubleTap(event);
                }
            }
            _onPanRotate(event) {
                if (!this.dragRotate) {
                    return false;
                }
                return this._onPanRotateStandard(event);
            }
        }
        const instance = new OrbitControllerInternal(props);
        return instance;
    }
    return wrapper;
}
