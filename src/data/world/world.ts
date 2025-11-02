import { ModuleConfig } from './../../config/module-config';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Perspective, ONE_DEGREE, SpaceCoord, SpacePath, defaultPerspective } from '../types';
import { Camera } from '../../camera';

export interface WorldState {
    dots: SpaceCoord[];
    paths: SpacePath[];
}

export interface WorldConfig {
    cameraPerspective: Perspective;
}

export abstract class World {

    private _t = 0;

    private cameraSubscription: Subscription | null = null;

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
        this.cameraSubscription?.unsubscribe();
        this.cameraSubscription = camera.state$.subscribe({
            next: (cameraPerspective) => {
                this.config.data.cameraPerspective = cameraPerspective;
            }
        });
    }

    public resetConfig(): void {
        this.config.reset();
    }

    public onDestroy(): void {
        this.config.save();
        this.cameraSubscription?.unsubscribe();
    }

    private emit() {
        this._state$.next({
            dots: this.dots,
            paths: this.paths,
        });
    }
}
