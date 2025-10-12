import { SpaceCoord } from '../types';
import { World } from './world';

const M1 = 1.0; // Mass of pendulum 1
const M2 = 1.0; // Mass of pendulum 2
const L1 = 1.0; // Length of pendulum 1
const L2 = 1.0; // Length of pendulum 2
const AG = 9.81; // Acceleration due to gravity

export class DoublePendulum extends World {

  data1: { t: number, y: number[] }[] = []
  data2: { t: number, y: number[] }[] = []
  data3: { t: number, y: number[] }[] = []

  constructor() {
    super()

    const startTheta11 = Math.PI / 8;
    const startTheta12 = Math.PI / 8;
    const startSpeed11 = 0;
    const startSpeed12 = 0;

    const startTheta21 = Math.PI / 4;
    const startTheta22 = Math.PI / 4;
    const startSpeed21 = 0;
    const startSpeed22 = 0;

    const startTheta31 = Math.PI / 2;
    const startTheta32 = Math.PI / 2;
    const startSpeed31 = 0;
    const startSpeed32 = 0;

    const startConditions1 = [startTheta11, startTheta12, startSpeed11, startSpeed12];
    const startConditions2 = [startTheta21, startTheta22, startSpeed21, startSpeed22];
    const startConditions3 = [startTheta31, startTheta32, startSpeed31, startSpeed32];
    const t0 = 0;
    const tf = 30;
    const dt = 0.01;

    // Solve the ODE using RK4
    this.data1 = this.rk4(this.doublePendulumODE, startConditions1, t0, dt, tf);
    this.data2 = this.rk4(this.doublePendulumODE, startConditions2, t0, dt, tf);
    this.data3 = this.rk4(this.doublePendulumODE, startConditions3, t0, dt, tf);

    // Print the results
    // console.log('Time\tTheta1\tTheta2\tOmega1\tOmega2');
    // this.data1.forEach((step) => {
    //   let xyPos = this.toCartesian(step.y[0], step.y[1]);
    //   console.log(
    //     `${step.t.toFixed(2)}    ${step.y[0].toFixed(4)}                ${step.y[1].toFixed(4)}`
    //   );
    //   console.log(
    //     `${step.t.toFixed(2)}    A=${xyPos[0].toFixed(4)},${xyPos[1].toFixed(4)}      B=${xyPos[2].toFixed(4)},${xyPos[3].toFixed(4)}`);
    // });

    const coords1 = this.toCartesian(startTheta11, startTheta12);
    const coords2 = this.toCartesian(startTheta21, startTheta22);
    const coords3 = this.toCartesian(startTheta31, startTheta32);
    this.updateCoords(coords1[0], coords1[1], coords1[2], coords1[3], coords2[0], coords2[1], coords2[2], coords2[3], coords3[0], coords3[1], coords3[2], coords3[3]);
    this.init();
  }

  public name: string = "Double Pendulum";

  public transitionToStateAt(t: number): void {
    const time = t * 2;
    if (time > 0 && time <= this.data1.length) {
      const current1 = this.data1[time].y;
      const current2 = this.data2[time].y;
      const current3 = this.data3[time].y;
      const coords1 = this.toCartesian(current1[0], current1[1]);
      const coords2 = this.toCartesian(current2[0], current2[1]);
      const coords3 = this.toCartesian(current3[0], current3[1]);
      this.updateCoords(coords1[0], coords1[1], coords1[2], coords1[3], coords2[0], coords2[1], coords2[2], coords2[3], coords3[0], coords3[1], coords3[2], coords3[3]);
    }
  }

  private updateCoords(x11: number, y11: number, x12: number, y12: number, x21: number, y21: number, x22: number, y22: number, x31: number, y31: number, x32: number, y32: number) {
    const coord11: SpaceCoord = { x: 0, y: 0, z: 1 };
    const coord12: SpaceCoord = { x: x11, y: y11, z: 1 };
    const coord13: SpaceCoord = { x: x12, y: y12, z: 1 };
    const coord21: SpaceCoord = { x: 0, y: 0, z: 0 };
    const coord22: SpaceCoord = { x: x21, y: y21, z: 0 };
    const coord23: SpaceCoord = { x: x22, y: y22, z: 0 };
    const coord31: SpaceCoord = { x: 0, y: 0, z: -1 };
    const coord32: SpaceCoord = { x: x31, y: y31, z: -1 };
    const coord33: SpaceCoord = { x: x32, y: y32, z: -1 };

    this.paths = [{ coords: [coord11, coord12, coord13], close: false }, { coords: [coord21, coord22, coord23], close: false }, { coords: [coord31, coord32, coord33], close: false }];
    this.dots = [coord11, coord12, coord13, coord21, coord22, coord23, coord31, coord32, coord33];
  }

  private toCartesian(theta1: number, theta2: number): [number, number, number, number] {
    const x1 = L1 * Math.sin(theta1);
    const y1 = -L1 * Math.cos(theta1);
    const x2 = x1 + L2 * Math.sin(theta2);
    const y2 = y1 - L2 * Math.cos(theta2);

    return [x1, y1, x2, y2];
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
      (M2 * L1 * omega1 ** 2 * sinDeltaTheta * cosDeltaTheta +
        M2 * AG * Math.sin(theta2) * cosDeltaTheta +
        M2 * L2 * omega2 ** 2 * sinDeltaTheta -
        (M1 + M2) * AG * Math.sin(theta1)) /
      (L1 * ((M1 + M2) - M2 * cosDeltaTheta ** 2));

    const dOmega2dt =
      (-M2 * L2 * omega2 ** 2 * sinDeltaTheta * cosDeltaTheta +
        (M1 + M2) * (AG * Math.sin(theta1) * cosDeltaTheta - L1 * omega1 ** 2 * sinDeltaTheta) -
        (M1 + M2) * AG * Math.sin(theta2)) /
      (L2 * ((M1 + M2) - M2 * cosDeltaTheta ** 2));

    return [omega1, omega2, dOmega1dt, dOmega2dt];
  }

  private rk4(
    f: (t: number, y: number[]) => number[],
    y0: number[],
    t0: number,
    dt: number,
    tf: number,
  ): { t: number; y: number[] }[] {
    const result: { t: number; y: number[] }[] = [];
    let t = t0;
    let y = [...y0];

    while (t <= tf) {
      result.push({ t, y: [...y] });

      const k1 = f(t, y);
      const k2 = f(t + dt / 2, y.map((yi, i) => yi + (dt / 2) * k1[i]));
      const k3 = f(t + dt / 2, y.map((yi, i) => yi + (dt / 2) * k2[i]));
      const k4 = f(t + dt, y.map((yi, i) => yi + dt * k3[i]));

      y = y.map((yi, i) => yi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
      t += dt;
    }

    return result;
  }
}
