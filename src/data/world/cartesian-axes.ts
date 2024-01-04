import { SpaceCoord, World } from './world';

export class CartesianAxes extends World {
    private static SIZE = 5;
    private static DIST = 0.15;

    private angleX = Math.PI * 6 / 5 - Math.PI;
    private angleY = Math.PI * 5 / 4 - Math.PI;

    constructor() {
        super();

        this.updateCameraAngleX(this.angleX);
        this.updateCameraAngleY(this.angleY);

        this.dots.push({ x: 0, y: 0, z: 0 });
        for (let i = CartesianAxes.DIST; i <= CartesianAxes.SIZE; i += CartesianAxes.DIST) {
            this.dots.push({ x: -i, y: 0, z: 0 });
            this.dots.push({ x: i, y: 0, z: 0 });
            this.dots.push({ x: 0, y: -i, z: 0 });
            this.dots.push({ x: 0, y: i, z: 0 });
            this.dots.push({ x: 0, y: 0, z: -i });
            this.dots.push({ x: 0, y: 0, z: i });
        }
        this.init();
    }

    public transitionToStateAt(t: number): void {
        this.updateCameraAngleY(this.angleY + t/15);
        this.updateCameraAngleZ(t/25);
    }
}
