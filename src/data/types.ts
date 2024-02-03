export interface SpaceCoord {
    x: number;
    y: number;
    z: number;
}

export interface SpacePath {
    coords: SpaceCoord[];
    close: boolean;
}
