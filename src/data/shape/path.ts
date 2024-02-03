import { idGenerator } from '../../utils/unique';
import { Shape, ShapeType } from './shape';

export interface PathStyle {
    strokeWidth: number;
    stroke: string;
    strokeOpacity: number;
    fill: string;
    fillOpacity: number;
}

export interface PathAttr {
    d: string;
    dist: number;
}

export class Path extends Shape {

    public id = idGenerator.newId(ShapeType.PATH)
    public type = ShapeType.PATH;

    public style: PathStyle = {
        strokeWidth: 1.5,
        stroke: '#aaa',
        strokeOpacity: 1,
        fill: 'none',
        fillOpacity: 1
    }

    public attr: PathAttr;
    
    constructor(d: string, dist: number) {
        super();
        this.attr = {
            d: d,
            dist: dist,
        }
    }

    public setPath(d: string, dist: number) {
        this.attr.d = d;
        this.attr.dist = dist;
    }
}