import { ModuleConfig } from '../../config/module-config';
import { createDefaultPerspective } from '../../types/perspective';
import { createOrigin } from '../../types/space-coord';
import { Circle3d, CircleStyle } from '../shape/circle';
import { World, WorldConfig } from './world';

export class CartesianAxes extends World {
    private static SIZE = 5;
    private static DIST = 0.15;

    private angleX = Math.PI * 6 / 5 - Math.PI;
    private angleY = Math.PI * 5 / 4 - Math.PI;

    private styleBlack: CircleStyle = {
        strokeWidth: 3,
        stroke: '#000',
        strokeOpacity: .75,
        fill: '#fff',
        fillOpacity: 1,
    };

    private styleRed: CircleStyle = {
        strokeWidth: 0.5,
        stroke: '#f00',
        strokeOpacity: 0,
        fill: '#f00',
        fillOpacity: .5,
    };

    private styleGreen: CircleStyle = {
        strokeWidth: 0.5,
        stroke: '#0f0',
        strokeOpacity: 0,
        fill: '#0f0',
        fillOpacity: .5,
    };

    private styleBlue: CircleStyle = {
        strokeWidth: 0.5,
        stroke: '#00f',
        strokeOpacity: 0,
        fill: '#00f',
        fillOpacity: .5,
    };

    constructor() {
        super();

        this.createCircles(0);
        this.init();
    }

    override config = new ModuleConfig<WorldConfig>(
        { cameraPerspective: createDefaultPerspective() },
        "cartesianAxesConfig",
    );

    public name: string = "Cartesian Axes";

    public transitionToStateAt(t: number): void {
        let colorConfig = Math.floor(t / 50) % 3;
        this.createCircles(colorConfig);
    }

    private createCircles(colorConfig: number) {
        let style1 = this.styleRed;
        let style2 = this.styleGreen;
        let style3 = this.styleBlue;

        switch (colorConfig) {
            case 1: {
                style1 = this.styleGreen;
                style2 = this.styleBlue;
                style3 = this.styleRed;
            }
                break;
            case 2: {
                style1 = this.styleBlue;
                style2 = this.styleRed;
                style3 = this.styleGreen;
            }
                break;
        }

        this.circles = [new Circle3d(createOrigin(), 2, this.styleBlack)];
        for (let i = CartesianAxes.DIST; i <= CartesianAxes.SIZE; i += CartesianAxes.DIST) {
            this.circles.push(new Circle3d({ x: -i, y: 0, z: 0 }, 1, style1));
            this.circles.push(new Circle3d({ x: i, y: 0, z: 0 }, 1, style1));
            this.circles.push(new Circle3d({ x: 0, y: -i, z: 0 }, 1, style2));
            this.circles.push(new Circle3d({ x: 0, y: i, z: 0 }, 1, style2));
            this.circles.push(new Circle3d({ x: 0, y: 0, z: -i }, 1, style3));
            this.circles.push(new Circle3d({ x: 0, y: 0, z: i }, 1, style3));
        }
    }
}
