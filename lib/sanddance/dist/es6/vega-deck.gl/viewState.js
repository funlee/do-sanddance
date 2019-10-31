export const viewStateProps = ['distance', 'fov', 'lookAt', 'rotationOrbit', 'rotationX', 'zoom'];
export function targetViewState(height, width, view) {
    const distance = 10;
    const fov = 60;
    const lookAt = [width / 2, -height / 2, 0];
    //add a 4th dimension to make transitions work
    lookAt.push(1);
    if (view === '2d') {
        return {
            distance,
            fov,
            lookAt,
            rotationOrbit: 0,
            rotationX: 0,
            zoom: 10 / height
        };
    }
    else {
        return {
            distance,
            fov,
            lookAt,
            rotationOrbit: -25,
            rotationX: 60,
            zoom: 9 / height
        };
    }
}
