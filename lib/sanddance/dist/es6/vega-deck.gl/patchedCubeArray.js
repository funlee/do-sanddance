export function patchCubeArray(allocatedSize, empty, cubes) {
    const patched = new Array(allocatedSize);
    patched.fill(empty);
    cubes.forEach(cube => patched[cube.ordinal] = cube);
    return patched;
}
