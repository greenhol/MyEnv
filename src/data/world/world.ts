import { BehaviorSubject, Observable } from 'rxjs';
import { SpaceCoord, SpacePath } from '../types';

export interface WorldState {
    dots: SpaceCoord[];
    paths: SpacePath[];
}

export enum SpaceElementTypeEnum {
    DOT,
}

export abstract class World {

    private _t = 0;

    protected dots: SpaceCoord[] = [];
    protected paths: SpacePath[] = [];

    private _state$ = new BehaviorSubject<WorldState>({
        dots: this.dots,
        paths: this.paths,
    });
    public state$: Observable<WorldState> = this._state$;

    public abstract name: string;

    public abstract transitionToStateAt(t: number): void;

    public init() {
        this.emit();
    }

    public tick() {
        this._t++;
        this.transitionToStateAt(this._t);
        this.emit();
    }

    public drawOrder: SpaceElementTypeEnum[] = [
        SpaceElementTypeEnum.DOT,
    ];

    private emit() {
        this._state$.next({
            dots: this.dots,
            paths: this.paths,
        });
    }
}
