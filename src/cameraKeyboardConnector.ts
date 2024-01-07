import { Camera } from './camera';

enum ValidKeys {
    Escape = 'Escape',
    W = 'w',
    A = 'a',
    S = 's',
    D = 'd',
    R = 'r',
    F = 'f',
    Up = 'ArrowUp',
    Left = 'ArrowLeft',
    Down = 'ArrowDown',
    Right = 'ArrowRight',
    Comma = ',',
    Dot = '.',
}

const ONE_DEGREE = Math.PI / 180;

export class CameraKeyboardConnector {

    private camera: Camera;

    constructor(camera: Camera) {
        this.camera = camera;
    }

    public onNextEvent(event: string): boolean {
        switch (event) {
            case ValidKeys.Escape: { this.camera.reset() } return true;
            case ValidKeys.W: { this.camera.moveZ(0.1) } return true;
            case ValidKeys.A: { this.camera.moveX(-0.1) } return true;
            case ValidKeys.S: { this.camera.moveZ(-0.1) } return true;
            case ValidKeys.D: { this.camera.moveX(0.1) } return true;
            case ValidKeys.R: { this.camera.moveY(0.1) } return true;
            case ValidKeys.F: { this.camera.moveY(-0.1) } return true;
            case ValidKeys.Up: { this.camera.rotateX(ONE_DEGREE) } return true;
            case ValidKeys.Left: { this.camera.rotateY(ONE_DEGREE) } return true;
            case ValidKeys.Down: { this.camera.rotateX(-ONE_DEGREE) } return true;
            case ValidKeys.Right: { this.camera.rotateY(-ONE_DEGREE) } return true;
            case ValidKeys.Comma: { this.camera.rotateZ(-ONE_DEGREE) } return true;
            case ValidKeys.Dot: { this.camera.rotateZ(ONE_DEGREE) } return true;
            default: return false;
        }
    }
}