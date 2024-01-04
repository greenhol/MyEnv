import { World, SpaceCoord } from './world';

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

    public transitionToStateAt(t: number): void {        
        const amp = 3 * Math.sin(t * Math.PI / 180);
        this.dots.forEach((dot: SpaceCoord) => {
            dot.y = amp * Math.exp(-(dot.x * dot.x + dot.z * dot.z));
        });
        this.updateCameraAngleX(t * Math.PI / 180);
        this.updateCameraAngleY(0.6253 * t * Math.PI / 180);
        this.updateCameraAngleZ(1.234 * t * Math.PI / 180);
    }
}
