import { AxisEnum } from '../../types/axis-enum';
import { ONE_DEGREE } from '../../types/constants';
import { IdentityMatrix3, Matrix3, RotaryMatrix3 } from '../../types/matrix/matrix-3';
import { addSpaceCoords, SpaceCoord } from '../../types/space-coord';
import { idGenerator } from '../../utils/unique';
import { Shape, ShapeType } from './shape';

export interface Rectangle3dAttributes {
    path: SpaceCoord[],
    style: RectangleStyle,
}

export interface RectangleStyle {
    strokeWidth: number;
    stroke: string;
    strokeOpacity: number;
    fill: string;
    fillOpacity: number;
}

export interface RectangleAttr {
    d: string;
}

const defaultStyle: RectangleStyle = {
    strokeWidth: 0.5,
    stroke: '#aaa',
    strokeOpacity: 1,
    fill: '#ddd',
    fillOpacity: 1
};

export class Rectangle3d implements Rectangle3dAttributes {
    private _position: SpaceCoord;
    private _width: number;
    private _height: number;
    private _rotateX: number;
    private _rotateY: number;
    private _rotateZ: number;
    private _path: SpaceCoord[];
    private _style: RectangleStyle;

    constructor(
        position: SpaceCoord,
        width: number,
        height: number,
        rotateX: number = 0,
        rotateY: number = 0,
        rotateZ: number = 0,
        style: RectangleStyle = defaultStyle,
    ) {
        this._position = position;
        this._width = width;
        this._height = height;
        this._rotateX = rotateX * ONE_DEGREE;
        this._rotateY = rotateY * ONE_DEGREE;
        this._rotateZ = rotateZ * ONE_DEGREE;
        this._style = style;

        this.evaluatePath();
    }

    public set position(position: SpaceCoord) {
        this._position = position;
        this.evaluatePath();
    }

    public set width(width: number) {
        this._width = width;
        this.evaluatePath();
    }

    public set height(height: number) {
        this._height = height;
        this.evaluatePath();
    }

    public set rotateX(rotateX: number) {
        this._rotateX = rotateX * ONE_DEGREE;
        this.evaluatePath();
    }

    public set rotateY(rotateY: number) {
        this._rotateY = rotateY * ONE_DEGREE;
        this.evaluatePath();
    }

    public set rotateZ(rotateZ: number) {
        this._rotateZ = rotateZ * ONE_DEGREE;
        this.evaluatePath();
    }

    public get path() {
        return this._path;
    }

    public set path(path: SpaceCoord[]) {
        this._path = path;
    }

    public get style() {
        return this._style;
    }

    public set style(style: RectangleStyle) {
        this._style = style;
    }

    private evaluatePath() {
        const rxMatrix = new RotaryMatrix3(AxisEnum.X, this._rotateX);
        const ryMatrix = new RotaryMatrix3(AxisEnum.Y, this._rotateY);
        const rzMatrix = new RotaryMatrix3(AxisEnum.Z, this._rotateZ);

        let transformationMatrix = new IdentityMatrix3();
        transformationMatrix = Matrix3.multiply(transformationMatrix, rzMatrix);
        transformationMatrix = Matrix3.multiply(transformationMatrix, ryMatrix);
        transformationMatrix = Matrix3.multiply(transformationMatrix, rxMatrix);

        const wh = this._width / 2;
        const hh = this._height / 2;
        const corners: SpaceCoord[] = [
            { x: -wh, y: hh, z: 0 },
            { x: wh, y: hh, z: 0 },
            { x: wh, y: -hh, z: 0 },
            { x: -wh, y: -hh, z: 0 },
        ];

        this.path = corners.map((coord: SpaceCoord): SpaceCoord => {
            return addSpaceCoords(transformationMatrix.vectorMultiply(coord), this._position);
        });
    }
}

export class Rectangle extends Shape {

    public id = idGenerator.newId(ShapeType.RECTANGLE)
    public type = ShapeType.RECTANGLE;

    public style: RectangleStyle = defaultStyle;

    public attr: RectangleAttr;

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