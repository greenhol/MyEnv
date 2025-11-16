import { SpaceCoord } from '../../types/space-coord';
import { idGenerator } from '../../utils/unique';
import { Shape, ShapeType } from './shape';

export interface Circle3dAttributes {
    position: SpaceCoord,
    radius: number,
    style: CircleStyle,
}

export interface CircleStyle {
    strokeWidth: number;
    stroke: string;
    strokeOpacity: number;
    fill: string;
    fillOpacity: number;
}

export interface CircleAttr {
    cx: number;
    cy: number;
    r: number;
}

const defaultStyle: CircleStyle = {
    strokeWidth: 0.5,
    stroke: '#aaa',
    strokeOpacity: 1,
    fill: '#ddd',
    fillOpacity: 1
};

export class Circle3d implements Circle3dAttributes {
    private _position: SpaceCoord;
    private _radius: number;
    private _style: CircleStyle;

    constructor(position: SpaceCoord, radius: number = 1, style: CircleStyle = defaultStyle) {
        this.position = position;
        this.radius = radius;
        this.style = style;
    }

    public get position() {
        return this._position;
    }

    public set position(position: SpaceCoord) {
        this._position = position;
    }

    public get radius() {
        return this._radius;
    }

    public set radius(radius: number) {
        this._radius = radius;
    }

    public get style() {
        return this._style;
    }

    public set style(style: CircleStyle) {
        this._style = style;
    }
}

export class Circle extends Shape {

    public id = idGenerator.newId(ShapeType.CIRCLE)
    public type = ShapeType.CIRCLE;

    public style: CircleStyle = defaultStyle;

    public attr: CircleAttr;

    constructor(x: number, y: number, r: number) {
        super();
        this.attr = {
            cx: x,
            cy: y,
            r: r,
        }
    }

    public setPosition(x: number, y: number, r: number) {
        this.attr.cx = x;
        this.attr.cy = y;
        this.attr.r = r;
    }
}
