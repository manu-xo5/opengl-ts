export function getBounds(x: number, z: number, wW: number, wD: number) {
    return {
        minX: x - wW / 2,
        maxX: x + wW / 2,
        minZ: z - wD / 2,
        maxZ: z + wD / 2,
    };
}
