import { ModuleConfig } from '../../config/module-config';
import { ONE_DEGREE } from '../../types/constants';
import { Perspective } from '../../types/perspective';
import { SpaceCoord } from '../../types/space-coord';
import { Path3d } from '../shape/path';
import { Circle3d, CircleStyle } from './../shape/circle';
import { World, WorldConfig } from './world';

interface DoublePendulumConfig extends WorldConfig {
    cameraPerspective: Perspective;
    m1: number; // Mass of pendulum 1
    m2: number; // Mass of pendulum 2
    l1: number; // Length of pendulum 1
    l2: number; // Length of pendulum 2
    friction: number; // friction of the system
};

const GRAVITY_ACC = 9.81; // Acceleration due to gravity

interface PendulumState {
    theta1: number;
    theta2: number;
    omega1: number;
    omega2: number;
}

export class DoublePendulumLive extends World {

    private _zDistance = 5;
    private _current: PendulumState[] = [];
    private _origins: SpaceCoord[] = [];

    private circleStyle: CircleStyle = {
        strokeWidth: 3,
        stroke: '#f80',
        strokeOpacity: 1,
        fill: '#fff',
        fillOpacity: 0,
    };

    constructor() {
        super()

        for (let x = -17; x < 18; x += 4) {
            for (let y = -9; y < 10; y += 4) {
                for (let z = 1; z < 2; z++) {
                    this._origins.push(
                        { x: x, y: y, z: z * this._zDistance }
                    )
                    this._current.push({
                        theta1: x / Math.PI / 2,
                        theta2: y / Math.PI / 2,
                        omega1: (z - 1) * 1,
                        omega2: -(z - 1) * 1,
                    });
                }
            }
        }

        this.updateWithCurrent();

        this.init();
    }

    override config = new ModuleConfig<DoublePendulumConfig>(
        {
            cameraPerspective: {
                position: { x: 0, y: -2, z: -6 },
                angleX: 0 * ONE_DEGREE,
                angleY: 0 * ONE_DEGREE,
                angleZ: 0 * ONE_DEGREE,
            },
            m1: 1,
            m2: 1,
            l1: 1,
            l2: 1,
            friction: 1,
        },
        "doublePendulumConfig",
    );

    public name: string = "Double Pendulum Live";

    public transitionToStateAt(t: number): void {
        const dt = 0.025;
        const time = dt * t;

        this._current = this._current.map((state: PendulumState): PendulumState => {
            const nextStep = this.rk4Step(this.doublePendulumODE, time, this.pendulumStateAsArray(state), dt, this.config.data);
            nextStep[2] *= this.config.data.friction;
            nextStep[3] *= this.config.data.friction;
            return this.pendulumStateFromArray(nextStep);
        });
        this.updateWithCurrent();
    }

    private updateWithCurrent() {
        const newCoords = this._current.map((state: PendulumState, index: number): SpaceCoord[] => {
            const coords = this.toCartesian(state.theta1, state.theta2);
            const coord1: SpaceCoord = { x: this._origins[index].x, y: this._origins[index].y, z: this._origins[index].z };
            const coord2: SpaceCoord = { x: this._origins[index].x + coords[0], y: this._origins[index].y + coords[1], z: this._origins[index].z };
            const coord3: SpaceCoord = { x: this._origins[index].x + coords[2], y: this._origins[index].y + coords[3], z: this._origins[index].z };
            return [coord1, coord2, coord3];
        });
        const newPaths = newCoords.map((spaceCoords: SpaceCoord[]): Path3d => { return new Path3d(spaceCoords) });

        this.paths = newPaths;
        this.circles = newCoords.flat().map((coord: SpaceCoord): Circle3d => {
            return new Circle3d(coord, 2, this.circleStyle);
        });
    }

    private toCartesian(theta1: number, theta2: number): [number, number, number, number] {
        const x1 = this.config.data.l1 * Math.sin(theta1);
        const y1 = -this.config.data.l1 * Math.cos(theta1);
        const x2 = x1 + this.config.data.l2 * Math.sin(theta2);
        const y2 = y1 - this.config.data.l2 * Math.cos(theta2);

        return [x1, y1, x2, y2];
    }

    private pendulumStateAsArray(state: PendulumState): number[] {
        return [state.theta1, state.theta2, state.omega1, state.omega2];
    }

    private pendulumStateFromArray(array: number[]): PendulumState {
        return { theta1: array[0], theta2: array[1], omega1: array[2], omega2: array[3] };
    }

    private doublePendulumODE(t: number, y: number[], c: DoublePendulumConfig): number[] {
        const theta1 = y[0];
        const theta2 = y[1];
        const omega1 = y[2];
        const omega2 = y[3];

        // Intermediate terms
        const deltaTheta = theta2 - theta1;
        const sinDeltaTheta = Math.sin(deltaTheta);
        const cosDeltaTheta = Math.cos(deltaTheta);

        const dOmega1dt =
            (c.m2 * c.l1 * omega1 ** 2 * sinDeltaTheta * cosDeltaTheta +
                c.m2 * GRAVITY_ACC * Math.sin(theta2) * cosDeltaTheta +
                c.m2 * c.l2 * omega2 ** 2 * sinDeltaTheta -
                (c.m1 + c.m2) * GRAVITY_ACC * Math.sin(theta1)) /
            (c.l1 * ((c.m1 + c.m2) - c.m2 * cosDeltaTheta ** 2));

        const dOmega2dt =
            (-c.m2 * c.l2 * omega2 ** 2 * sinDeltaTheta * cosDeltaTheta +
                (c.m1 + c.m2) * (GRAVITY_ACC * Math.sin(theta1) * cosDeltaTheta - c.l1 * omega1 ** 2 * sinDeltaTheta) -
                (c.m1 + c.m2) * GRAVITY_ACC * Math.sin(theta2)) /
            (c.l2 * ((c.m1 + c.m2) - c.m2 * cosDeltaTheta ** 2));

        return [omega1, omega2, dOmega1dt, dOmega2dt];
    }

    private rk4Step(
        f: (t: number, y: number[], c: DoublePendulumConfig) => number[],
        t: number,
        y: number[],
        dt: number,
        c: DoublePendulumConfig,
    ): number[] {
        const k1 = f(t, y, c);
        const k2 = f(t + dt / 2, y.map((yi, i) => yi + (dt / 2) * k1[i]), c);
        const k3 = f(t + dt / 2, y.map((yi, i) => yi + (dt / 2) * k2[i]), c);
        const k4 = f(t + dt, y.map((yi, i) => yi + dt * k3[i]), c);

        return y.map((yi, i) => yi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));;
    }
}
