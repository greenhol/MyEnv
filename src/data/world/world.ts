import { ModuleConfig } from './../../config/module-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { Perspective, ONE_DEGREE, SpaceCoord, SpacePath, defaultPerspective } from '../types';
import { Camera } from '../../camera';
import { SerialSubscription } from '../../utils/serial-subscription';

export interface WorldState {
    dots: SpaceCoord[];
    paths: SpacePath[];
}

export interface WorldConfig {
    cameraPerspective: Perspective;
}

export abstract class World {

    private _t = 0;

    private _cameraSubscription = new SerialSubscription();

    protected dots: SpaceCoord[] = [];
    protected paths: SpacePath[] = [];

    private _state$ = new BehaviorSubject<WorldState>({
        dots: this.dots,
        paths: this.paths,
    });
    public state$: Observable<WorldState> = this._state$;

    public config = new ModuleConfig<WorldConfig>({ cameraPerspective: defaultPerspective });

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
            dots: this.dots,
            paths: this.paths,
        });
    }
}
