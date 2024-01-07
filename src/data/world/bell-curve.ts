import { SpaceCoord } from '../types';
import { World } from './world';

export class BellCurve extends World {
    private static SIZE = 15;
    private static DIST = 0.15;

    constructor() {
        super();

        for (let i = -BellCurve.SIZE; i < BellCurve.SIZE; i++) {
            for (let j = -BellCurve.SIZE; j < BellCurve.SIZE; j++) {
                this.dots.push({ x: BellCurve.DIST * i, y: 0, z: BellCurve.DIST * j });
            }
        }
        this.init();
    }

    public name: string = "Bell Curve";

    public transitionToStateAt(t: number): void {        
        const amp = 3 * Math.sin(t * Math.PI / 180);
        this.dots.forEach((dot: SpaceCoord) => {
            dot.y = amp * Math.exp(-(dot.x * dot.x + dot.z * dot.z));
        });
    }
}
