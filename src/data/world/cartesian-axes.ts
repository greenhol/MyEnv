import { SpaceCoord, World } from './world';

export class CartesianAxes extends World {
    private static SIZE = 5;
    private static DIST = 0.15;

    constructor() {
        super();

        this.updateCameraAngleX(Math.PI * 6 / 5 - Math.PI);
        this.updateCameraAngleY(Math.PI * 5 / 4 - Math.PI);

        let dots: SpaceCoord[] = []
        dots.push({ x: 0, y: 0, z: 0 });
        for (let i = CartesianAxes.DIST; i <= CartesianAxes.SIZE; i += CartesianAxes.DIST) {
            dots.push({ x: -i, y: 0, z: 0 });
            dots.push({ x: i, y: 0, z: 0 });
            dots.push({ x: 0, y: -i, z: 0 });
            dots.push({ x: 0, y: i, z: 0 });
            dots.push({ x: 0, y: 0, z: -i });
            dots.push({ x: 0, y: 0, z: i });
        }
        this.updateDots(dots);
        this.emit();
    }
}
