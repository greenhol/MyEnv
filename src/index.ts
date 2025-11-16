import { Subject, interval, takeUntil, timer } from 'rxjs';
import { Camera } from './camera';
import { CameraKeyboardConnector } from './cameraKeyboardConnector';
import { ModuleConfig } from './config/module-config';
import { ShapeType } from './data/shape/shape';
import { perspectiveToString } from './data/types';
import { BellCurve } from './data/world/bell-curve';
import { BouncingParticles } from './data/world/bouncing-particles';
import { CartesianAxes } from './data/world/cartesian-axes';
import { Chart3DLifeTable } from './data/world/chart3DLifeTable';
import { DoublePendulumLive } from './data/world/double-pendulum-live';
import { Grid } from './data/world/grid';
import { HilbertCurve } from './data/world/hilbert-curve';
import { Playground } from './data/world/playground';
import { RandomPoints } from './data/world/random-points';
import { World } from './data/world/world';
import { Projector } from './projector';
import { Stage } from './stage';
import { longPressHandler } from './utils/long-press-handler';
import { SerialSubscription } from './utils/serial-subscription';

export const APP_VERSION = (window as any).APP_VERSION;
console.log(`MyEnv 3D SVG - Version:${APP_VERSION}`);

interface MainConfig {
    currentWorldId: number,
    worldTick: number,
}

const MAIN_CONFIG = new ModuleConfig<MainConfig>(
    {
        currentWorldId: 1,
        worldTick: 40,
    },
    "mainConfig",
)

var sheet = window.document.styleSheets[0];
sheet.insertRule('.shape--invisible { visibility: hidden;}', sheet.cssRules.length);

const stage = new Stage('main');
const camera = new Camera();
const cameraControl = new CameraKeyboardConnector(camera);
let world: World | null = null;

const abortWorldTick$ = new Subject<void>();
const newWorldSubscription = new SerialSubscription();

const worldTitleArea = document.getElementById("worldTitle");
const cameraInfoArea = document.getElementById("cameraInfo");

function createWorldById(worldId: number): World {
    switch (worldId) {
        case 1: return new CartesianAxes();
        case 2: return new Playground();
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

function init() {
    appendVirtualKeyboard();
    runWorld();
}

function appendVirtualKeyboard() {
    fetch('virtual-keyboard.html')
        .then(response => response.text())
        .then(html => {
            const virtualKeyboardContainer = document.getElementById('virtual-keyboard-container');
            if (virtualKeyboardContainer != null) {
                virtualKeyboardContainer.innerHTML = html;
            } else {
                console.error("virtual-keyboard-container not found to append virtual keyboard html")
            }
        })
        .then(_ => {
            Array.from(document.getElementsByClassName('virtual-key'))
                .forEach(element => longPressHandler(element, handleKeyPress));
        });
}

function runWorld() {
    world?.onDestroy();
    world = createWorldById(MAIN_CONFIG.data.currentWorldId);
    world.mountCamera(camera);
    updateWorldTitle(world.name);
    const projector = new Projector(world, camera);
    stage.registerShapes(projector.shapes, new Set([ShapeType.RECTANGLE, ShapeType.PATH, ShapeType.CIRCLE]));
    interval(MAIN_CONFIG.data.worldTick)
        .pipe(takeUntil(abortWorldTick$))
        .subscribe({
            next: () => {
                world?.tick();
            },
            complete: () => {
                console.log('Old world completed - unregistering shapes');
                stage.unregisterShapes(projector.shapes.id);
            }
        });
}

function switchWorld(worldId: number) {
    console.log(`switching world to (${worldId})`);
    MAIN_CONFIG.data.currentWorldId = worldId;
    abortWorldTick$.next();
    newWorldSubscription.set(
        timer(100).subscribe(() => { runWorld() })
    );
}

function updateWorldTitle(name: string) {
    if (worldTitleArea != null) {
        worldTitleArea.textContent = `World: ${name}`;
    }
}

document.addEventListener(
    "keydown",
    (event) => {
        handleKeyPress(event.key);
    },
    false,
);

function handleKeyPress(keyValue: string) {
    if (!cameraControl.onNextEvent(keyValue)) {
        switch (keyValue) {
            case "": console.log(`invalid key`);
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
            default: console.log(`unhandled key ${keyValue}`);
        }
    }
}

camera.state$.subscribe({
    next: (cameraPerspective) => {
        const displayableText = perspectiveToString(cameraPerspective)
        if (cameraInfoArea != null) {
            cameraInfoArea.textContent = displayableText;
        }
    }
});

init();
