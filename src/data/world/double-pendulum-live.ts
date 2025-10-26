import { ModuleConfig } from '../../config/module-config';
import { SpaceCoord, SpacePath } from './../types';
import { World } from './world';

interface DoublePendulumConfig {
  M1: number; // Mass of pendulum 1
  M2: number; // Mass of pendulum 2
  L1: number; // Length of pendulum 1
  L2: number; // Length of pendulum 2
  friction: number; // friction of the system
}

const CONFIG = new ModuleConfig<DoublePendulumConfig>(
  {
    M1: 1,
    M2: 1,
    L1: 1,
    L2: 1,
    friction: 1,
  },
  "doublePendulumConfig",
)

const GRAVITY_ACC = 9.81; // Acceleration due to gravity

interface PendulumState {
  theta1: number;
  theta2: number;
  omega1: number;
  omega2: number;
}

export class DoublePendulumLive extends World {

  zDistance = 5;
  current: PendulumState[] = [];
  origins: SpaceCoord[] = [];

  constructor() {
    super()

    for (let x = -17; x < 18; x += 4) {
      for (let y = -9; y < 10; y += 4) {
        for (let z = 1; z < 2; z++) {
          this.origins.push(
            { x: x, y: y, z: z * this.zDistance }
          )
          this.current.push({
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

  public name: string = "Double Pendulum Live";

  public transitionToStateAt(t: number): void {
    const dt = 0.025;
    const time = dt * t;

    this.current = this.current.map((state: PendulumState): PendulumState => {
      const nextStep = this.rk4Step(this.doublePendulumODE, time, this.pendulumStateAsArray(state), dt);
      nextStep[2] *= CONFIG.data.friction;
      nextStep[3] *= CONFIG.data.friction;
      return this.pendulumStateFromArray(nextStep);
    });
    this.updateWithCurrent();
  }

  private updateWithCurrent() {
    const newCoords = this.current.map((state: PendulumState, index: number): SpaceCoord[] => {
      const coords = this.toCartesian(state.theta1, state.theta2);
      const coord1: SpaceCoord = { x: this.origins[index].x, y: this.origins[index].y, z: this.origins[index].z };
      const coord2: SpaceCoord = { x: this.origins[index].x + coords[0], y: this.origins[index].y + coords[1], z: this.origins[index].z };
      const coord3: SpaceCoord = { x: this.origins[index].x + coords[2], y: this.origins[index].y + coords[3], z: this.origins[index].z };
      return [coord1, coord2, coord3];
    });
    const newPaths = newCoords.map((spaceCoords: SpaceCoord[]): SpacePath => { return { coords: spaceCoords, close: false } });

    this.paths = newPaths;
    this.dots = newCoords.flat();
  }

  private toCartesian(theta1: number, theta2: number): [number, number, number, number] {
    const x1 = CONFIG.data.L1 * Math.sin(theta1);
    const y1 = -CONFIG.data.L1 * Math.cos(theta1);
    const x2 = x1 + CONFIG.data.L2 * Math.sin(theta2);
    const y2 = y1 - CONFIG.data.L2 * Math.cos(theta2);

    return [x1, y1, x2, y2];
  }

  private pendulumStateAsArray(state: PendulumState): number[] {
    return [state.theta1, state.theta2, state.omega1, state.omega2];
  }

  private pendulumStateFromArray(array: number[]): PendulumState {
    return { theta1: array[0], theta2: array[1], omega1: array[2], omega2: array[3] };
  }

  private doublePendulumODE(t: number, y: number[]): number[] {
    const theta1 = y[0];
    const theta2 = y[1];
    const omega1 = y[2];
    const omega2 = y[3];

    // Intermediate terms
    const deltaTheta = theta2 - theta1;
    const sinDeltaTheta = Math.sin(deltaTheta);
    const cosDeltaTheta = Math.cos(deltaTheta);

    const dOmega1dt =
      (CONFIG.data.M2 * CONFIG.data.L1 * omega1 ** 2 * sinDeltaTheta * cosDeltaTheta +
        CONFIG.data.M2 * GRAVITY_ACC * Math.sin(theta2) * cosDeltaTheta +
        CONFIG.data.M2 * CONFIG.data.L2 * omega2 ** 2 * sinDeltaTheta -
        (CONFIG.data.M1 + CONFIG.data.M2) * GRAVITY_ACC * Math.sin(theta1)) /
      (CONFIG.data.L1 * ((CONFIG.data.M1 + CONFIG.data.M2) - CONFIG.data.M2 * cosDeltaTheta ** 2));

    const dOmega2dt =
      (-CONFIG.data.M2 * CONFIG.data.L2 * omega2 ** 2 * sinDeltaTheta * cosDeltaTheta +
        (CONFIG.data.M1 + CONFIG.data.M2) * (GRAVITY_ACC * Math.sin(theta1) * cosDeltaTheta - CONFIG.data.L1 * omega1 ** 2 * sinDeltaTheta) -
        (CONFIG.data.M1 + CONFIG.data.M2) * GRAVITY_ACC * Math.sin(theta2)) /
      (CONFIG.data.L2 * ((CONFIG.data.M1 + CONFIG.data.M2) - CONFIG.data.M2 * cosDeltaTheta ** 2));

    return [omega1, omega2, dOmega1dt, dOmega2dt];
  }

  private rk4Step(
    f: (t: number, y: number[]) => number[],
    t: number,
    y: number[],
    dt: number,
  ): number[] {
    const k1 = f(t, y);
    const k2 = f(t + dt / 2, y.map((yi, i) => yi + (dt / 2) * k1[i]));
    const k3 = f(t + dt / 2, y.map((yi, i) => yi + (dt / 2) * k2[i]));
    const k4 = f(t + dt, y.map((yi, i) => yi + dt * k3[i]));

    return y.map((yi, i) => yi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));;
  }
}
