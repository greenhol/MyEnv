import { BehaviorSubject, Observable } from 'rxjs';

export interface CameraPosition {
    position: SpaceCoord;
    angleX: number;
    angleY: number;
    angleZ: number;
}

export interface SpaceCoord {
    x: number;
    y: number;
    z: number;
}

export interface WorldState {
    camera: CameraPosition;
    dots: SpaceCoord[];
}

export enum SpaceElementTypeEnum {
    DOT,
}

export abstract class World {

    private _cameraPosition: CameraPosition = {
        position: { x: 0, y: 0, z: -5 },
        angleX: 0,
        angleY: 0,
        angleZ: 0
    };
    private _dots: SpaceCoord[] = [];

    private _state$ = new BehaviorSubject<WorldState>({
        camera: this._cameraPosition,
        dots: this._dots,
    });
    public state$: Observable<WorldState> = this._state$;

    public drawOrder: SpaceElementTypeEnum[] = [
        SpaceElementTypeEnum.DOT,
    ];

    public updateCameraPositionX(value: number) {
        this._cameraPosition.position.x = value;
    }

    public updateCameraPositionY(value: number) {
        this._cameraPosition.position.x = value;
    }

    public updateCameraPositionZ(value: number) {
        this._cameraPosition.position.x = value;
    }

    public updateCameraAngleX(value: number) {
        this._cameraPosition.angleX = value;
    }

    public updateCameraAngleY(value: number) {
        this._cameraPosition.angleY = value;
    }

    public updateCameraAngleZ(value: number) {
        this._cameraPosition.angleZ = value;
    }

    public updateDots(dots: SpaceCoord[]) {
        this._dots = dots;
    }

    public emit() {
        this._state$.next({
            camera: this._cameraPosition,
            dots: this._dots,
        });
    }
}
