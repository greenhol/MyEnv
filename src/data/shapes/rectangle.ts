import { idGenerator } from './../../utils/unique';
import { Shape, ShapeType } from './shape';

export interface RectangleStyle {
    strokeWidth: number;
    stroke: string;
    strokeOpacity: number;
    fill: string;
    fillOpacity: number;
}

export interface RectangleAttr {
    x: number;
    y: number;
    w: number;
    h: number;
}

export class Rectangle extends Shape {

    public id = idGenerator.newId(ShapeType.RECTANGLE)
    public type = ShapeType.RECTANGLE;

    public style: RectangleStyle = {
        strokeWidth: 1,
        stroke: '#f00',
        strokeOpacity: 1,
        fill: '#ddd',
        fillOpacity: 0.5
    }

    public attr: RectangleAttr;
    
    constructor(x: number, y: number, w: number, h: number) {
        super();
        this.attr = {
            x: x,
            y: y,
            w: w,
            h: h,
        }
    }

    public setPosition(x: number, y: number) {
        this.attr.x = x;
        this.attr.y = y;
    }

    public move(x: number, y: number) {
        this.attr.x += x;
        this.attr.y += y;
    }
}