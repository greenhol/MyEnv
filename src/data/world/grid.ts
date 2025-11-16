import { ModuleConfig } from '../../config/module-config';
import { ONE_DEGREE } from '../../types/constants';
import { Circle3d } from '../shape/circle';
import { World, WorldConfig } from './world';

export class Grid extends World {
    private static SIZE = 1;
    private static DIST = 0.2;

    public constructor() {
        super();

        for (let i = -Grid.SIZE; i <= Grid.SIZE; i += Grid.DIST) {
            for (let j = -Grid.SIZE; j <= Grid.SIZE; j += Grid.DIST) {
                for (let k = -Grid.SIZE; k <= Grid.SIZE; k += Grid.DIST) {
                    this.circles.push(new Circle3d({ x: i, y: j, z: k }));
                }
            }
        }
        this.init();
    }

    override config = new ModuleConfig<WorldConfig>(
        {
            cameraPerspective: {
                position: { x: 0, y: 0, z: -3 },
                angleX: 30 * ONE_DEGREE,
                angleY: 60 * ONE_DEGREE,
                angleZ: 0,
            },
        },
        "gridConfig",
    );

    public name: string = "Grid";

    public transitionToStateAt(t: number): void {
        // Do Nothing
    }
}
