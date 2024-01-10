import { World } from './world';

export class Cube extends World {
    
    public constructor() {
        super();

        this.dots = [
            {x: -1, y: -1, z: -1},
            {x: -1, y: -1, z: 1},
            {x: -1, y: 1, z: -1},
            {x: -1, y: 1, z: 1},
            {x: 1, y: -1, z: -1},
            {x: 1, y: -1, z: 1},
            {x: 1, y: 1, z: -1},
            {x: 1, y: 1, z: 1},
        ];
        this.init();
    }

    public name: string = "Cube";

    override transitionToStateAt(t: number): void {        
        const amp = Math.cos(5 * t * Math.PI / 180);
        this.dots = [
            {x: -1 * amp, y: -1 * amp, z: -1 * amp},
            {x: -1 * amp, y: -1 * amp, z: 1 * amp},
            {x: -1 * amp, y: 1 * amp, z: -1 * amp},
            {x: -1 * amp, y: 1 * amp, z: 1 * amp},
            {x: 1 * amp, y: -1 * amp, z: -1 * amp},
            {x: 1 * amp, y: -1 * amp, z: 1 * amp},
            {x: 1 * amp, y: 1 * amp, z: -1 * amp},
            {x: 1 * amp, y: 1 * amp, z: 1 * amp},
        ];
    }
}
