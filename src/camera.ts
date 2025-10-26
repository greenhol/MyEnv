import { BehaviorSubject } from 'rxjs';
import { SpaceCoord } from './data/types';
import { ModuleConfig } from './config/module-config';

interface CameraPosition {
    position: SpaceCoord;
    angleX: number;
    angleY: number;
    angleZ: number;
}

export const ONE_DEGREE = Math.PI / 180;

const STATE = new ModuleConfig<CameraPosition>(
    {
        position: { x: 0, y: -2, z: -6 },
        angleX: 0 * ONE_DEGREE,
        angleY: 0 * ONE_DEGREE,
        angleZ: 0 * ONE_DEGREE,
    },
    "cameraConfig",
)

export class Camera {

    public state$ = new BehaviorSubject<string>(this.stateToString());

    public get position() {
        return STATE.data.position;
    }

    public get angleX() {
        return STATE.data.angleX;
    }

    public get angleY() {
        return STATE.data.angleY;
    }

    public get angleZ() {
        return STATE.data.angleZ;
    }

    public reset() {
        STATE.reset();
        this.updateString()
    }

    public moveX(value: number) {
        STATE.data.position.x += value;
        this.updateString()
    }

    public moveY(value: number) {
        STATE.data.position.y += value;
        this.updateString()
    }

    public moveZ(value: number) {
        STATE.data.position.z += value;
        this.updateString()
    }

    public rotateX(value: number) {
        STATE.data.angleX += value;
        this.updateString()
    }

    public rotateY(value: number) {
        STATE.data.angleY += value;
        this.updateString()
    }

    public rotateZ(value: number) {
        STATE.data.angleZ += value;
        this.updateString()
    }

    private updateString() {
        this.state$.next(this.stateToString());
    }

    private stateToString(): string {
        const position = `X ${STATE.data.position.x.toFixed(1)}, Y ${STATE.data.position.y.toFixed(1)}, Z ${STATE.data.position.z.toFixed(1)}`;
        const angleX = (STATE.data.angleX * 180 / Math.PI).toFixed(0);
        const angleY = (STATE.data.angleY * 180 / Math.PI).toFixed(0);
        const angleZ = (STATE.data.angleZ * 180 / Math.PI).toFixed(0);
        return `Camera: Position (${position}), Angle-X ${angleX}°, Angle-Y ${angleY}°, Angle-Z ${angleZ}°)`;
    }
}