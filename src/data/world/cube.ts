import { Circle3d } from '../shape/circle';
import { World } from './world';

export class Cube extends World {

    public constructor() {
        super();

        this.circles = [
            new Circle3d({ x: -1, y: -1, z: -1 }),
            new Circle3d({ x: -1, y: -1, z: 1 }),
            new Circle3d({ x: -1, y: 1, z: -1 }),
            new Circle3d({ x: -1, y: 1, z: 1 }),
            new Circle3d({ x: 1, y: -1, z: -1 }),
            new Circle3d({ x: 1, y: -1, z: 1 }),
            new Circle3d({ x: 1, y: 1, z: -1 }),
            new Circle3d({ x: 1, y: 1, z: 1 }),
        ];
        this.init();
    }

    public name: string = "Cube";

    override transitionToStateAt(t: number): void {
        const amp = Math.cos(5 * t * Math.PI / 180);
        this.circles[0].position = { x: -1 * amp, y: -1 * amp, z: -1 * amp };
        this.circles[1].position = { x: -1 * amp, y: -1 * amp, z: 1 * amp };
        this.circles[2].position = { x: -1 * amp, y: 1 * amp, z: -1 * amp };
        this.circles[3].position = { x: -1 * amp, y: 1 * amp, z: 1 * amp };
        this.circles[4].position = { x: 1 * amp, y: -1 * amp, z: -1 * amp };
        this.circles[5].position = { x: 1 * amp, y: -1 * amp, z: 1 * amp };
        this.circles[6].position = { x: 1 * amp, y: 1 * amp, z: -1 * amp };
        this.circles[7].position = { x: 1 * amp, y: 1 * amp, z: 1 * amp };
    }
}
