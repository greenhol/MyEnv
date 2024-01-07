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

var sheet = window.document.styleSheets[0];
sheet.insertRule('.shape--invisible { visibility: hidden;}', sheet.cssRules.length);

const stage = new Stage('main');
const camera = new Camera();
const cameraControl = new CameraKeyboardConnector(camera);

const abort$ = new Subject<void>();
let subscription: Subscription;

const worldTitleArea = document.getElementById("worldTitle");
const cameraInfoArea = document.getElementById("cameraInfo");

function getWorldById(worldId: number): World {
    switch (worldId) {
        case 1: return new CartesianAxes();
        case 2: return new BellCurve();
        case 3: return new BouncingParticles();
        case 4: return new RandomPoints();
        default: {
            console.error("Unnown world id", worldId);
            return new CartesianAxes();
        }
    }
}

function runWorld(worldId: number) {
    const world = getWorldById(worldId)
    updateWorldTitle(world.name)
    const projector = new Projector(world, camera);
    stage.registerShapes(projector.shapes, new Set([ShapeType.CIRCLE, ShapeType.RECTANGLE]));

    subscription = interval(40)
        .pipe(takeUntil(abort$))
        .subscribe({
            next: () => {
                world.tick();
            },
            complete: () => {
                console.log('DONE');
                stage.unregisterShapes(projector.shapes.id);
            }
        });
}

function switchWorld(worldId: number) {
    console.log(`switching world to (${worldId})`);
    abort$.next();
    subscription.unsubscribe();
    timer(100).subscribe(() => {
        runWorld(worldId);
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
                case "1": switchWorld(1); break;
                case "2": switchWorld(2); break;
                case "3": switchWorld(3); break;
                case "4": switchWorld(4); break;
                default: console.log(`unhandled key ${event.key}`);
            }
        }
    },
    false,
);

camera.state$.subscribe({
    next: (text) => {
        if (cameraInfoArea != null) {
            cameraInfoArea.textContent = text;
        }
    }
});

runWorld(1);
