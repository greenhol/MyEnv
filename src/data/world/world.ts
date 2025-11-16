import { BehaviorSubject, Observable } from 'rxjs';
import { Camera } from '../../stage/camera';
import { createDefaultPerspective, Perspective } from '../../types/perspective';
import { SerialSubscription } from '../../utils/serial-subscription';
import { Circle3d } from '../shape/circle';
import { Path3d } from '../shape/path';
import { Rectangle3d } from '../shape/rectangle';
import { ModuleConfig } from './../../config/module-config';

export interface WorldState {
    circles: Circle3d[];
    paths: Path3d[];
    rectangles: Rectangle3d[];
}

export interface WorldConfig {
    cameraPerspective: Perspective;
}

export abstract class World {

    private _t = 0;

    private _cameraSubscription = new SerialSubscription();

    protected circles: Circle3d[] = [];
    protected paths: Path3d[] = [];
    protected rectangles: Rectangle3d[] = [];

    private _state$ = new BehaviorSubject<WorldState>({
        circles: this.circles,
        paths: this.paths,
        rectangles: this.rectangles,
    });
    public state$: Observable<WorldState> = this._state$;

    public config = new ModuleConfig<WorldConfig>({ cameraPerspective: createDefaultPerspective() });

    public abstract name: string;

    abstract transitionToStateAt(t: number): void;

    public init() {
        this.emit();
    }

    public tick() {
        this._t++;
        this.transitionToStateAt(this._t);
        this.emit();
    }

    public mountCamera(camera: Camera) {
        camera.mountCamera(this.config.data.cameraPerspective);
        this._cameraSubscription.set(
            camera.state$.subscribe({
                next: (cameraPerspective) => {
                    this.config.data.cameraPerspective = cameraPerspective;
                }
            })
        );
    }

    public resetConfig(): void {
        this.config.reset();
    }

    public onDestroy(): void {
        this.config.save();
        this._cameraSubscription.unsubscribe();
    }

    private emit() {
        this._state$.next({
            circles: this.circles,
            paths: this.paths,
            rectangles: this.rectangles,
        });
    }
}
