import { World } from './world';

export class CartesianAxes extends World {
    private static SIZE = 5;
    private static DIST = 0.15;

    private angleX = Math.PI * 6 / 5 - Math.PI;
    private angleY = Math.PI * 5 / 4 - Math.PI;

    constructor() {
        super();

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

    public name: string = "Cartesian Axes";

    public transitionToStateAt(t: number): void {
        // No Nothing
    }
}
