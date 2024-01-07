import { BehaviorSubject } from 'rxjs';
import { SpaceCoord } from './data/types';

interface CameraPosition {
    position: SpaceCoord;
    angleX: number;
    angleY: number;
    angleZ: number;
}

export class Camera {

    private static defaultPosition(): CameraPosition {
        return {
            position: { x: 0, y: 0, z: -5 },
            angleX: 0,
            angleY: 0,
            angleZ: 0
        };
    }

    private state: CameraPosition = Camera.defaultPosition();

    public state$ = new BehaviorSubject<string>(this.stateToString());

    public get position() {
        return this.state.position;
    }

    public get angleX() {
        return this.state.angleX;
    }

    public get angleY() {
        return this.state.angleY;
    }

    public get angleZ() {
        return this.state.angleZ;
    }

    public reset() {
        this.state = Camera.defaultPosition();
        this.updateString()
    }

    public moveX(value: number) {
        this.state.position.x += value;
        this.updateString()
    }

    public moveY(value: number) {
        this.state.position.y += value;
        this.updateString()
    }

    public moveZ(value: number) {
        this.state.position.z += value;
        this.updateString()
    }

    public rotateX(value: number) {
        this.state.angleX += value;
        this.updateString()
    }

    public rotateY(value: number) {
        this.state.angleY += value;
        this.updateString()
    }

    public rotateZ(value: number) {
        this.state.angleZ += value;
        this.updateString()
    }

    private updateString() {
        this.state$.next(this.stateToString());
    }

    private stateToString(): string {
        const position = `X ${this.state.position.x.toFixed(1)}, Y ${this.state.position.y.toFixed(1)}, Z ${this.state.position.z.toFixed(1)}`;
        const angleX = (this.state.angleX * 180 / Math.PI).toFixed(0);
        const angleY = (this.state.angleY * 180 / Math.PI).toFixed(0);
        const angleZ = (this.state.angleZ * 180 / Math.PI).toFixed(0);
        return `Camera: Position (${position}), Angle-X ${angleX}°, Angle-Y ${angleY}°, Angle-Z ${angleZ}°)`;
    }
}