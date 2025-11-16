import { ModuleConfig } from '../../config/module-config';
import { ONE_DEGREE } from '../../types/constants';
import { createOrigin } from '../../types/space-coord';
import { Path3d } from '../shape/path';
import { World, WorldConfig } from './world';

export class HilbertCurve extends World {

    private hilbert: Hilbert3D;
    private cnt: number = 0;
    private maxCnt: number = 4096 - 1;

    private minZ = -3;
    private maxZ = -15;

    public constructor() {
        super();

        this.hilbert = new Hilbert3D(1, AnchorAxisOrder.XYZ);
        this.paths = [new Path3d([createOrigin()])];
        this.init();
    }

    override config = new ModuleConfig<WorldConfig>(
        {
            cameraPerspective: {
                position: { x: -1, y: 4.7, z: -5 },
                angleX: 25 * ONE_DEGREE,
                angleY: 50 * ONE_DEGREE,
                angleZ: 0,
            },
        },
        "hilbertCurveConfig",
    );

    public name: string = "Hilbert Curve";

    public transitionToStateAt(t: number): void {
        if (this.cnt > this.maxCnt) return;

        // let cntInc: number = 1 + Math.round(this.cnt / 100);
        let cntInc: number = 1;

        const scale = 0.5;
        let point: HilbertPoint;
        for (let i = 0; i < cntInc; i++) {
            point = this.hilbert.xyz(this.cnt++);
            this.paths[0].path.push({
                x: point.x * scale,
                y: point.y * scale,
                z: point.z * scale
            });
            if (this.cnt > this.maxCnt) return;
        }
    }
}

enum AnchorAxisOrder {
    XYZ = "XYZ",
    XZY = "XZY",
    YXZ = "YXZ",
    YZX = "YZX",
    ZXY = "ZXY",
    ZYX = "ZYX",
}

// The following classes are an Adaptation from the library hilbert-js by Ryan Williams
// https://github.com/ryan-williams/hilbert-js
class HilbertPoint {
    public x: number;
    public y: number;
    public z: number;
    public n: number;
    public arr: number[];

    constructor(a: number[] | null, x: number, y: number, z: number) {
        if (a) {
            x = a[0];
            y = a[1];
            z = a[2];
        }
        this.x = Math.round(x) || 0;
        this.y = Math.round(y) || 0;
        this.z = Math.round(z) || 0;
        this.arr = [this.x, this.y, this.z];
        this.n = 4 * this.z + 2 * this.y + this.x;
    }

    public floor(): HilbertPoint {
        return new HilbertPoint([this.x, this.y, this.z].map(Math.floor), 0, 0, 0);
    }

    public mult(n: number): HilbertPoint {
        return new HilbertPoint(null, this.x * n, this.y * n, this.z * n);
    }

    public add(n: number | any): HilbertPoint {
        if (typeof n === 'number') return new HilbertPoint(null, this.x + n, this.y + n, this.z + n);
        return new HilbertPoint(null, this.x + n.x, this.y + n.y, this.z + n.z);
    }

    public mod(n: number): HilbertPoint {
        return new HilbertPoint(null, this.x % n, this.y % n, this.z % n);
    }

    public rotate(regs: HilbertPoint, n: number): HilbertPoint {
        if (regs.n == 0) {
            return new HilbertPoint(null, this.z, this.x, this.y);
        } else if (regs.n == 1 || regs.n == 3) {
            return new HilbertPoint(null, this.y, this.z, this.x);
        } else if (regs.n == 2 || regs.n == 6) {
            return new HilbertPoint(null, n - this.x, n - this.y, this.z);
        } else if (regs.n == 5 || regs.n == 7) {
            return new HilbertPoint(null, this.y, n - this.z, n - this.x);
        } else {  // regs.n == 4
            return new HilbertPoint(null, n - this.z, this.x, n - this.y);
        }
    }

    public unrotate(regs: HilbertPoint, n: number): HilbertPoint {
        if (regs.n == 0) {
            return new HilbertPoint(null, this.y, this.z, this.x);
        } else if (regs.n == 1 || regs.n == 3) {
            return new HilbertPoint(null, this.z, this.x, this.y);
        } else if (regs.n == 2 || regs.n == 6) {
            return new HilbertPoint(null, n - this.x, n - this.y, this.z);
        } else if (regs.n == 5 || regs.n == 7) {
            return new HilbertPoint(null, n - this.z, this.x, n - this.y);
        } else {  // regs.n == 4
            return new HilbertPoint(null, this.y, n - this.z, n - this.x);
        }
    }

    public rotateLeft(n: number): HilbertPoint {
        if (n % 3 == 0) return this;
        if (n % 3 == 1) return new HilbertPoint(null, this.y, this.z, this.x);
        return new HilbertPoint(null, this.z, this.x, this.y);
    }

    public rotateRight(n: number): HilbertPoint {
        if (n % 3 == 0) return this;
        if (n % 3 == 1) return new HilbertPoint(null, this.z, this.x, this.y);
        return new HilbertPoint(null, this.y, this.z, this.x);
    }

    public shuffle(template: AnchorAxisOrder): HilbertPoint {
        if (!template) return this;
        return new HilbertPoint(
            null,
            this.extractFromAnchorAxisOrder(template, 0),
            this.extractFromAnchorAxisOrder(template, 1),
            this.extractFromAnchorAxisOrder(template, 2),
        );
    }

    public pp(): string {
        return [this.x, this.y, this.z].join(',');
    }

    public manhattanDistance(other: HilbertPoint): number {
        return Math.abs(other.x - this.x) + Math.abs(other.y - this.y) + Math.abs(other.z - this.z);
    }

    private extractFromAnchorAxisOrder(template: AnchorAxisOrder, index: number): number {
        switch (template[index]) {
            case 'X': { return this.x; }
            case 'Y': { return this.y; }
            case 'Z': { return this.z; }
        }
        throw new Error(`Invalid template and/or index: template=${template}, index=${index}`);
    }
}

class Hilbert3D {
    private size: number;
    private log2size: number;
    private log2parity: number;
    private anchorAxisOrder: AnchorAxisOrder | null;
    private reverseAnchorAxisOrder: AnchorAxisOrder;
    private horseshoe2d: number[] = [0, 1, 3, 2, 7, 6, 4, 5];

    constructor(size: number, anchorAxisOrder: AnchorAxisOrder) {
        this.size = size;
        this.anchorAxisOrder = anchorAxisOrder;

        if (this.anchorAxisOrder == AnchorAxisOrder.XYZ) {
            this.anchorAxisOrder = null;
        }
        if (this.anchorAxisOrder) {
            // this.reverseAnchorAxisOrder = { xzy: 'xzy', yxz: 'yxz', yzx: 'zxy', zxy: 'yzx', zyx: 'zyx' }[this.anchorAxisOrder];
            switch (this.anchorAxisOrder) {
                case AnchorAxisOrder.XZY: {
                    this.reverseAnchorAxisOrder = AnchorAxisOrder.XZY;
                    break;
                }
                case AnchorAxisOrder.YXZ: {
                    this.reverseAnchorAxisOrder = AnchorAxisOrder.YXZ;
                    break;
                }
                case AnchorAxisOrder.YZX: {
                    this.reverseAnchorAxisOrder = AnchorAxisOrder.ZXY; // !
                    break;
                }
                case AnchorAxisOrder.ZXY: {
                    this.reverseAnchorAxisOrder = AnchorAxisOrder.YZX; // !
                    break;
                }
                case AnchorAxisOrder.ZYX: {
                    this.reverseAnchorAxisOrder = AnchorAxisOrder.ZYX;
                    break;
                }
            }
        }

        if (this.size) {
            this.log2size = 0;
            let pow2 = 1;
            for (; pow2 < this.size; pow2 *= 2, this.log2size++) { }
            if (pow2 != this.size) {
                throw new Error("Invalid size: " + this.size + ". Must be a power of 2.");
            }
            this.log2parity = (this.log2size % 3);
        }
    }

    public d2xyz(d: number): HilbertPoint {
        d = Math.floor(d);
        let p: HilbertPoint = new HilbertPoint(null, 0, 0, 0);
        let s: number = 1;
        let iter: number = 2;
        let size: number = this.size || 0;
        let xBit: number;
        let yBit: number;
        let zBit: number;

        while (d > 0 || s < size) {
            xBit = d & 1;
            yBit = (d / 2) & 1;
            zBit = (d / 4) & 1;

            let regs = new HilbertPoint(null, xBit ^ yBit, yBit ^ zBit, zBit);
            p = p.rotate(regs, s - 1).add(regs.mult(s));

            d = Math.floor(d / 8);
            s *= 2;
            iter++;
        }

        if (this.size) {
            p = p.rotateLeft(iter - this.log2parity + 1);
        } else {
            p = p.rotateLeft(iter);
        }

        return p.shuffle(this.reverseAnchorAxisOrder);
    };

    public xyz = this.d2xyz;

    public xyz2d(x: number, y: number, z: number): number {

        let p: HilbertPoint = new HilbertPoint(null, x, y, z).floor();
        let s: number = 1;
        let level: number = 0;
        const max: number = Math.max.apply(Math, p.arr);

        for (; 2 * s <= max; s *= 2) {
            level = (level + 1) % 3;
        }

        if (this.anchorAxisOrder != null) {
            p = p.shuffle(this.anchorAxisOrder);
        }
        if (this.size) {
            p = p.rotateRight(level - this.log2parity + 1);
        } else {
            p = p.rotateRight(level);
        }

        let d = 0;
        while (s > 0) {
            var regs = new HilbertPoint(null, p.x & s && 1, p.y & s && 1, p.z & s && 1);

            d *= 8;
            d += this.horseshoe2d[regs.n];

            level = (level + 2) % 3;
            p = p.mod(s);
            p = p.unrotate(regs, s - 1);
            s = Math.floor(s / 2);
        }

        return d;
    }

    public d = this.xyz2d;
}
