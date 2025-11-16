import { ModuleConfig } from '../../config/module-config';
import { createDefaultPerspective } from '../../types/perspective';
import { createOrigin } from '../../types/space-coord';
import { Path3d, PathStyle } from '../shape/path';
import { Rectangle3d, RectangleStyle } from '../shape/rectangle';
import { World, WorldConfig } from './world';

const rectangleStyle: RectangleStyle = {
    strokeWidth: 0.5,
    stroke: '#00f',
    strokeOpacity: 1,
    fill: '#4af',
    fillOpacity: .2,
};

export class Playground extends World {

    public constructor() {
        super();

        this.paths = [
            new Path3d([
                { x: -1, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
            ], false, this.pathStyle('#f00')),
            new Path3d([
                { x: 0, y: -1, z: 0 },
                { x: 0, y: 1, z: 0 },
            ], false, this.pathStyle('#0f0')),
            new Path3d([
                { x: 0, y: 0, z: -1 },
                { x: 0, y: 0, z: 1 },
            ], false, this.pathStyle('#00f')),
        ];

        this.rectangles = [new Rectangle3d(createOrigin(), 3, 3, 90, 0, 0, rectangleStyle)];

        this.init();
    }

    override config = new ModuleConfig<WorldConfig>(
        { cameraPerspective: createDefaultPerspective() },
        "playgroundConfig",
    );

    public name: string = "Playground";

    override transitionToStateAt(t: number): void {
        // TODO
    }

    private pathStyle(color: string): PathStyle {
        return {
            strokeWidth: 3,
            stroke: color,
            strokeOpacity: .5,
        };
    }
}
