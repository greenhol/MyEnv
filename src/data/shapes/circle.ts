import { idGenerator } from './../../utils/unique';
import { Shape, ShapeType } from './shape';

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

export class Circle extends Shape {

    public id = idGenerator.newId(ShapeType.CIRCLE)
    public type = ShapeType.CIRCLE;

    public style: CircleStyle = {
        strokeWidth: 0.5,
        stroke: '#aaa',
        strokeOpacity: 1,
        fill: '#ddd',
        fillOpacity: 0.25
    }

    public attr: CircleAttr;
    
    constructor(x: number, y: number, r: number) {
        super();
        this.attr = {
            cx: x,
            cy: y,
            r: r
        }
    }

    // public setStyle(style: CircleStyle): Circle {
    //     this.style = style;
    //     return this;
    // }

    public setPosition(x: number, y: number, r: number) {
        this.attr.cx = x;
        this.attr.cy = y;
        this.attr.r = r;
    }

    public move(x: number, y: number, r: number) {
        this.attr.cx += x;
        this.attr.cy += y;
        this.attr.r += r;
        if (this.attr.r < 5) this.attr.r = 5;
    }
}