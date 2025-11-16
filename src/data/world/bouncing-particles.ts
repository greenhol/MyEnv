import { ModuleConfig } from '../../config/module-config';
import { ONE_DEGREE } from '../../types/constants';
import { createOrigin, SpaceCoord } from '../../types/space-coord';
import { Circle3d } from '../shape/circle';
import { Rectangle3d, RectangleStyle } from '../shape/rectangle';
import { World, WorldConfig } from './world';

interface Particle {
    position: SpaceCoord;
    velocity: SpaceCoord;
    staticX: boolean;
    staticY: boolean;
    staticZ: boolean;
    outOfBounds: boolean;
}

const rectangleStyleBottom: RectangleStyle = {
    strokeWidth: .5,
    stroke: '#00f',
    strokeOpacity: 1,
    fill: '#4af',
    fillOpacity: .2,
};

const rectangleStyleSides1: RectangleStyle = {
    strokeWidth: .5,
    stroke: '#999',
    strokeOpacity: 1,
    fill: '#6cf',
    fillOpacity: .2,
};

const rectangleStyleSides2: RectangleStyle = {
    strokeWidth: .5,
    stroke: '#999',
    strokeOpacity: 1,
    fill: 'none',
    fillOpacity: 0,
};

const BOX_WIDTH = 6;
const BOX_WIDTH_HALF = BOX_WIDTH / 2;
const BOX_HEIGHT = 4;
const BOX_HEIGHT_HALF = BOX_HEIGHT / 2;

export class BouncingParticles extends World {
    private static ACCELERATION = 0.0095;
    private particles: Particle[];

    constructor() {
        super();

        this.rectangles = [
            new Rectangle3d(createOrigin(), BOX_WIDTH, BOX_WIDTH, 90, 0, 0, rectangleStyleBottom),
            new Rectangle3d({ x: BOX_WIDTH_HALF, y: BOX_HEIGHT_HALF, z: 0 }, BOX_WIDTH, BOX_HEIGHT, 0, 90, 0, rectangleStyleSides1),
            new Rectangle3d({ x: 0, y: BOX_HEIGHT_HALF, z: BOX_WIDTH_HALF }, BOX_HEIGHT, BOX_WIDTH, 0, 0, 90, rectangleStyleSides1),
            new Rectangle3d({ x: -BOX_WIDTH_HALF, y: BOX_HEIGHT_HALF, z: 0 }, BOX_WIDTH, BOX_HEIGHT, 0, 90, 0, rectangleStyleSides2),
            new Rectangle3d({ x: 0, y: BOX_HEIGHT_HALF, z: -BOX_WIDTH_HALF }, BOX_HEIGHT, BOX_WIDTH, 0, 0, 90, rectangleStyleSides2),
        ];

        this.particles = [];
        for (let i = 0; i < 1500; i++) {
            let angle = 2 * Math.PI * Math.random();
            let horizontalVelocity = 0.1 * Math.random();
            this.particles.push({
                position: { x: 0, y: 0.01, z: 0 },
                velocity: {
                    x: horizontalVelocity * Math.sin(angle),
                    y: Math.random() * 0.35,
                    z: horizontalVelocity * Math.cos(angle),
                },
                staticX: false,
                staticY: false,
                staticZ: false,
                outOfBounds: false,
            });
        }
        this.updateCirclesFromParticles();
        this.init();
    };

    override config = new ModuleConfig<WorldConfig>(
        {
            cameraPerspective: {
                position: { x: 0, y: 2, z: -7.3 },
                angleX: 15 * ONE_DEGREE,
                angleY: 40 * ONE_DEGREE,
                angleZ: 0,
            },
        },
        "bouncingParticlesConfig",
    );

    public name: string = "Bouncing Particles";

    public transitionToStateAt(t: number): void {
        this.particles.forEach((particle: Particle) => {

            if (particle.staticX && particle.staticY && particle.staticZ) return;

            // Y -> Vertical (Gravity)
            if (particle.position.y <= 0 && particle.velocity.y < 0) { // Bpuncing on bottom (decreasing all velocities)
                particle.velocity.x *= 0.8;
                particle.velocity.y *= -0.8;
                particle.velocity.z *= 0.8;
            } else {
                particle.velocity.y -= BouncingParticles.ACCELERATION;
            }
            // X, Z Horizontal (Bounce in Box)
            if (!particle.outOfBounds) {
                if (Math.abs(particle.position.x) >= BOX_WIDTH_HALF - 0.1) {
                    if (particle.position.y > BOX_HEIGHT) {
                        particle.outOfBounds = true;
                    } else {
                        particle.velocity.x *= -1;
                    }
                }
                if (Math.abs(particle.position.z) >= BOX_WIDTH_HALF - 0.1) {
                    if (particle.position.y > BOX_HEIGHT) {
                        particle.outOfBounds = true;
                    } else {
                        particle.velocity.z *= -1;
                    }
                }
            }

            // Update Position
            if (Math.abs(particle.velocity.x) < 0.001) particle.staticX = true;
            if (Math.abs(particle.velocity.y) < 0.001 && Math.abs(particle.position.y) < 0.001) particle.staticY = true;
            if (Math.abs(particle.velocity.z) < 0.001) particle.staticZ = true;

            if (!particle.staticX) particle.position.x += particle.velocity.x;
            if (!particle.staticX) particle.position.y += particle.velocity.y;
            if (!particle.staticX) particle.position.z += particle.velocity.z;
        });
        this.updateCirclesFromParticles();
    }

    private updateCirclesFromParticles(): void {
        this.circles = this.particles.map((particle: Particle): Circle3d => { return new Circle3d(particle.position) });
    }
}