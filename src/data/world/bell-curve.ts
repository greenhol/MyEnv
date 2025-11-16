import { ModuleConfig } from '../../config/module-config';
import { Circle3d } from '../shape/circle';
import { ONE_DEGREE } from '../../types/constants';
import { World, WorldConfig } from './world';

export class BellCurve extends World {
    private static SIZE = 15;
    private static DIST = 0.15;

    constructor() {
        super();

        for (let i = -BellCurve.SIZE; i < BellCurve.SIZE; i++) {
            for (let j = -BellCurve.SIZE; j < BellCurve.SIZE; j++) {
                this.circles.push(new Circle3d({ x: BellCurve.DIST * i, y: 0, z: BellCurve.DIST * j }));
            }
        }
        this.init();
    }

    override config = new ModuleConfig<WorldConfig>(
        {
            cameraPerspective: {
                position: { x: 0, y: .5, z: -3.6 },
                angleX: 20 * ONE_DEGREE,
                angleY: 0 * ONE_DEGREE,
                angleZ: 0 * ONE_DEGREE,
            },
        },
        "bellCurveConfig",
    );

    public name: string = "Bell Curve";

    public transitionToStateAt(t: number): void {
        const amp = 3 * Math.sin(t * Math.PI / 180);
        this.circles.forEach((circle: Circle3d) => {
            circle.position.y = amp * Math.exp(-(circle.position.x * circle.position.x + circle.position.z * circle.position.z));
        });
    }
}
