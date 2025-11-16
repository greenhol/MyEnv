export interface SpaceCoord {
    x: number;
    y: number;
    z: number;
}

export function createOrigin(): SpaceCoord {
    return { x: 0, y: 0, z: 0 };
}

export function addSpaceCoords(a: SpaceCoord, b: SpaceCoord): SpaceCoord {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z,
    }
}
