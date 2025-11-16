import { SpaceCoord } from '../../types/space-coord';
import { idGenerator } from '../../utils/unique';
import { Shape, ShapeType } from './shape';

export interface Path3dAttributes {
    path: SpaceCoord[],
    close: boolean,
    style: PathStyle,
}

export interface PathStyle {
    strokeWidth: number;
    stroke: string;
    strokeOpacity: number;
}

export interface PathAttr {
    d: string;
}

const defaultStyle = {
    strokeWidth: 1.5,
    stroke: '#aaa',
    strokeOpacity: 1,
};

export class Path3d implements Path3dAttributes {
    private _path: SpaceCoord[];
    private _close: boolean;
    private _style: PathStyle;

    constructor(path: SpaceCoord[], close: boolean = false, style: PathStyle = defaultStyle) {
        this.path = path;
        this.close = close;
        this.style = style;
    }

    public get path() {
        return this._path;
    }

    public set path(path: SpaceCoord[]) {
        this._path = path;
    }

    public get close() {
        return this._close;
    }

    public set close(close: boolean) {
        this._close = close;
    }

    public get style() {
        return this._style;
    }

    public set style(style: PathStyle) {
        this._style = style;
    }
}

export class Path extends Shape {

    public id = idGenerator.newId(ShapeType.PATH)
    public type = ShapeType.PATH;

    public style: PathStyle = defaultStyle;

    public attr: PathAttr;

    constructor(d: string) {
        super();
        this.attr = {
            d: d,
        }
    }

    public setPath(d: string) {
        this.attr.d = d;
    }
}
