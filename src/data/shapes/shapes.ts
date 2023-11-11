import { idGenerator } from '../../utils/unique';
import { Observable, ReplaySubject } from 'rxjs';
import { Circle } from './circle';
import { Rectangle } from './rectangle';

export interface Collection {
    circles: Array<Circle>;
    rectangles: Array<Rectangle>;
}

export class Shapes {

    id: string;

    private _collection: Collection;
    private _collection$ = new ReplaySubject<Collection>(1);
    collection$: Observable<Collection> = this._collection$;

    constructor(name: string, collection: Collection) {
        this.id = idGenerator.newId(name);
        this._collection = collection;
        this.emitList();
    }

    update(callback: (data: Collection) => void) {
        callback(this._collection);
        this.emitList();
    }

    private emitList() {
        this._collection$.next(this._collection);
    }
}