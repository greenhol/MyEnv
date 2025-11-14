import { Circle3d } from '../shape/circle';
import { createOrigin, SpaceCoord } from '../types';
import { World } from './world';

enum DirectionEnum {
    'UP',
    'DOWN',
    'LEFT',
    'RIGHT',
    'FORWARD',
    'BACKWARD'
}

export class RandomPoints extends World {
    private static AREA = 20;
    private static DIST = 0.15;

    constructor() {
        super()

        this.circles.push(new Circle3d(createOrigin()));
        let circlePosition: SpaceCoord = structuredClone(this.circles[0].position);
        let lastCirclePosition: SpaceCoord = structuredClone(this.circles[0].position);
        let direction: DirectionEnum;

        for (let i = 0; i < 1500; i++) {
            direction = Math.floor(Math.random() * 6);
            circlePosition = structuredClone(lastCirclePosition);
            switch (direction) {
                case DirectionEnum.UP:
                    circlePosition.y += RandomPoints.DIST;
                    break;
                case DirectionEnum.DOWN:
                    circlePosition.y -= RandomPoints.DIST;
                    break;
                case DirectionEnum.LEFT:
                    circlePosition.x += RandomPoints.DIST;
                    break;
                case DirectionEnum.RIGHT:
                    circlePosition.x -= RandomPoints.DIST;
                    break;
                case DirectionEnum.FORWARD:
                    circlePosition.z -= RandomPoints.DIST;
                    break;
                case DirectionEnum.BACKWARD:
                    circlePosition.z += RandomPoints.DIST;
                    break;
                default:
                    console.log('NOK', direction);
            }
            if (Math.abs(circlePosition.x) > RandomPoints.AREA || Math.abs(circlePosition.y) > RandomPoints.AREA || Math.abs(circlePosition.z) > RandomPoints.AREA) {
                continue;
            }
            lastCirclePosition = structuredClone(circlePosition);
            this.circles.push(new Circle3d(structuredClone(lastCirclePosition)));
        }
    }

    public name: string = "Random Points";

    public transitionToStateAt(t: number): void {
        // No Nothing
    }
}
