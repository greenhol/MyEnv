import { Stage } from './stage';
import { ShapeType } from './data/shape/shape';
import { CartesianAxes } from './data/world/cartesian-axes';
import { Projector } from './projector';
import { interval, take, timer } from 'rxjs';
import { BellCurve } from './data/world/bell-curve';
import { BouncingParticles } from './data/world/bouncing-particles';
import { World } from './data/world/world';

var sheet = window.document.styleSheets[0];
sheet.insertRule('.shape--invisible { visibility: hidden;}', sheet.cssRules.length);

const stage = new Stage('main');
let worldCnt = 99;

runWorld(nextWorld());

function nextWorld(): World {
    worldCnt++;
    if (worldCnt > 2) {
        worldCnt = 0;
    }
    switch (worldCnt) {
        case 0: return new CartesianAxes();
        case 1: return new BellCurve();
        default: return new BouncingParticles();
    }
}

function runWorld(world: World) {
    const projector = new Projector(world);
    stage.registerShapes(projector.shapes, new Set([ShapeType.CIRCLE, ShapeType.RECTANGLE]));

    interval(40)
        .pipe(
            take(300)
        )
        .subscribe({
            next: () => {
                world.tick();
            },
            complete: () => {
                console.log(`DONE (${worldCnt})`);
                stage.unregisterShapes(projector.shapes.id);
                timer(1000).subscribe(() => {
                    runWorld(nextWorld());   
                });
            }
        });
}
