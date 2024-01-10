import { World } from './world';

export class Grid extends World {
    private static SIZE = 1;
    private static DIST = 0.2;
    
    public constructor() {
        super();

        for (let i = -Grid.SIZE; i <= Grid.SIZE; i+=Grid.DIST) {
            for (let j = -Grid.SIZE; j <= Grid.SIZE; j+=Grid.DIST) {
                for (let k = -Grid.SIZE; k <= Grid.SIZE; k+=Grid.DIST) {
                    this.dots.push({x: i, y: j, z: k});
                }
            }
        }
        this.init();
    }

    public name: string = "Grid";

    public transitionToStateAt(t: number): void {
        // Do Nothing
    }
}
