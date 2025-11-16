import { AxisEnum } from "../axis-enum";
import { SpaceCoord } from "../space-coord";

export class Matrix3 {

    public static SIZE = 3;

    public static multiply(A: Matrix3, B: Matrix3): Matrix3 {
        // A*B=C
        let C = new Matrix3();
        for (let i = 0; i < Matrix3.SIZE; i++) {
            for (let j = 0; j < Matrix3.SIZE; j++) {
                for (let k = 0; k < Matrix3.SIZE; k++) {
                    C.m[i][j] += A.m[i][k] * B.m[k][j];
                }
            }
        }
        return C;
    }

    public m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    public scalarMultiply(a: number) {
        for (let i = 0; i < Matrix3.SIZE; i++) {
            for (let j = 0; j < Matrix3.SIZE; j++) {
                this.m[i][j] *= a;
            }
        }
    }

    public vectorMultiply(p: SpaceCoord): SpaceCoord {
        let a = [p.x, p.y, p.z, 1];
        let b = [];
        let value: number;

        for (let i = 0; i < Matrix3.SIZE; i++) {
            value = 0;
            for (let j = 0; j < Matrix3.SIZE; j++) {
                value += this.m[i][j] * a[j];
            }
            b.push(value);
        }

        return {
            x: b[0],
            y: b[1],
            z: b[2]
        }
    }

    public log() {
        let output = '';
        for (let i = 0; i < Matrix3.SIZE; i++) {
            for (let j = 0; j < Matrix3.SIZE; j++) {
                output += this.m[i][j].toFixed(5) + ' ';
            }
            output += '\n';
        }
        console.log(output);
    }
}

export class IdentityMatrix3 extends Matrix3 {

    constructor() {
        super();
        for (let i = 0; i < Matrix3.SIZE; i++) {
            this.m[i][i] = 1;
        }
    }
}

export class RotaryMatrix3 extends IdentityMatrix3 {

    private axis: AxisEnum;

    constructor(axis: AxisEnum, angle: number) {
        super();
        this.axis = axis;
        this.angle = angle;
    }

    public set angle(a: number) {
        const cosa = Math.cos(a);
        const sina = Math.sin(a);

        switch (this.axis) {
            case AxisEnum.X:
                this.m[1][1] = cosa;
                this.m[1][2] = -sina;
                this.m[2][1] = sina;
                this.m[2][2] = cosa;
                break;
            case AxisEnum.Y:
                this.m[0][0] = cosa;
                this.m[0][2] = sina;
                this.m[2][0] = -sina;
                this.m[2][2] = cosa;
                break;
            case AxisEnum.Z:
                this.m[0][0] = cosa;
                this.m[0][1] = -sina;
                this.m[1][0] = sina;
                this.m[1][1] = cosa;
                break;
        }
    }
}
