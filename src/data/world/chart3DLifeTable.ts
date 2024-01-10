import { World } from './world';
import { DATA } from './chart3DLifeTable.data';

export class Chart3DLifeTable extends World {
    private static DIST = 0.1;
    private data: number[][] = DATA;

    public constructor() {
        super();

        const HALF_SIZE_X = this.data.length * Chart3DLifeTable.DIST / 2;
        const HALF_SIZE_Z = this.data[0].length * Chart3DLifeTable.DIST / 2;

        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                this.dots.push({ x: -HALF_SIZE_X + Chart3DLifeTable.DIST * i, y: 0.1 * this.data[i][j], z: -HALF_SIZE_Z + Chart3DLifeTable.DIST * j });
            }
        }
        this.init();
    }

    public name: string = "Life expectancy table";

    public transitionToStateAt(t: number): void {
        // Do Nothing
    }

}
