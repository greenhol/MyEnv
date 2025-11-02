import { Stage } from './stage';
import { ShapeType } from './data/shape/shape';
import { CartesianAxes } from './data/world/cartesian-axes';
import { Projector } from './projector';
import { Subject, Subscription, interval, take, takeUntil, timer } from 'rxjs';
import { BellCurve } from './data/world/bell-curve';
import { BouncingParticles } from './data/world/bouncing-particles';
import { World } from './data/world/world';
import { RandomPoints } from './data/world/random-points';
import { Camera } from './camera';
import { CameraKeyboardConnector } from './cameraKeyboardConnector';
import { Chart3DLifeTable } from './data/world/chart3DLifeTable';
import { Cube } from './data/world/cube';
import { Grid } from './data/world/grid';
import { HilbertCurve } from './data/world/hilbert-curve';
import { DoublePendulumLive } from './data/world/double-pendulum-live';
import { ModuleConfig } from './config/module-config';
import { perspectiveToString } from './data/types';

interface MainConfig {
    currentWorldId: number,
}

const MAIN_CONFIG = new ModuleConfig<MainConfig>(
    { currentWorldId: 1 },
    "mainConfig",
)

var sheet = window.document.styleSheets[0];
sheet.insertRule('.shape--invisible { visibility: hidden;}', sheet.cssRules.length);

const stage = new Stage('main');
const camera = new Camera();
const cameraControl = new CameraKeyboardConnector(camera);
let world: World | null = null;

const abort$ = new Subject<void>();
let subscription: Subscription;

const worldTitleArea = document.getElementById("worldTitle");
const cameraInfoArea = document.getElementById("cameraInfo");

function createWorldById(worldId: number): World {
    switch (worldId) {
        case 1: return new CartesianAxes();
        case 2: return new Cube();
        case 3: return new Grid();
        case 4: return new BellCurve();
        case 5: return new BouncingParticles();
        case 6: return new RandomPoints();
        case 7: return new HilbertCurve();
        case 8: return new Chart3DLifeTable();
        case 9: return new DoublePendulumLive();
        default: {
            console.error("Unnown world id", worldId);
            return new CartesianAxes();
        }
    }
}

function runWorld() {
    world?.onDestroy();
    world = createWorldById(MAIN_CONFIG.data.currentWorldId);
    world.mountCamera(camera);
    updateWorldTitle(world.name);
    const projector = new Projector(world, camera);
    stage.registerShapes(projector.shapes, new Set([ShapeType.PATH, ShapeType.CIRCLE]));

    subscription = interval(40)
        .pipe(takeUntil(abort$))
        .subscribe({
            next: () => {
                world?.tick();
            },
            complete: () => {
                console.log('DONE');
                stage.unregisterShapes(projector.shapes.id);
            }
        });
}

function switchWorld(worldId: number) {
    console.log(`switching world to (${worldId})`);
    MAIN_CONFIG.data.currentWorldId = worldId;
    abort$.next();
    subscription.unsubscribe();
    timer(100).subscribe(() => {
        runWorld();
    });
}

function updateWorldTitle(name: string) {
    if (worldTitleArea != null) {
        worldTitleArea.textContent = `World: ${name}`;
    }
}

document.addEventListener(
    "keydown",
    (event) => {
        if (cameraControl.onNextEvent(event.key)) {
            // All good - camera handled key
        } else {
            switch (event.key) {
                case 'Escape': {
                    world?.resetConfig();
                    world?.mountCamera(camera);
                    break;
                }
                case "1": switchWorld(1); break;
                case "2": switchWorld(2); break;
                case "3": switchWorld(3); break;
                case "4": switchWorld(4); break;
                case "5": switchWorld(5); break;
                case "6": switchWorld(6); break;
                case "7": switchWorld(7); break;
                case "8": switchWorld(8); break;
                case "9": switchWorld(9); break;
                default: console.log(`unhandled key ${event.key}`);
            }
        }
    },
    false,
);

camera.state$.subscribe({
    next: (cameraPerspective) => {
        const displayableText = perspectiveToString(cameraPerspective)
        if (cameraInfoArea != null) {
            cameraInfoArea.textContent = displayableText;
        }
    }
});

runWorld();
