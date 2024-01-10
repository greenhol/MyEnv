import { Camera } from './camera';
import { skip, take } from 'rxjs';
import { AxisEnum, IdentityMatrix, Matrix, RotaryMatrix, TranslateMatrix } from './data/matrix/matrix';
import { World, WorldState } from './data/world/world';
import { Shapes } from './data/shape/shapes';
import { Circle } from './data/shape/circle';
import { SpaceCoord, SpacePath } from './data/types';
import { Path } from './data/shape/path';

interface PlaneCoord {
    x: number;
    y: number;
}

interface PixelCoord {
    left: number;
    top: number;
}

interface StagePoint extends SpaceCoord {
    pixel: PixelCoord;
    dist: number;
}

interface StagePath extends SpacePath {
    d: string;
    dist: number;
}

interface ProjectedData {
    dots: StagePoint[];
    paths: StagePath[];
}

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

const STAGE_WIDTH_HALF = STAGE_WIDTH / 2;
const STAGE_HEIGHT_HALF = STAGE_HEIGHT / 2;;
const STAGE_RATIO_INVERTED = STAGE_HEIGHT / STAGE_WIDTH;
const STAGE_NEAR = 1;
const STAGE_FAR = 30;

export class Projector {

    private world: World;
    private camera: Camera
    private _shapes: Shapes;

    private static spaceToPlane(coord: SpaceCoord): PlaneCoord {
        if (coord.z < STAGE_NEAR) {
            return {
                x: 0,
                y: 0
            }
        }

        const lambda = 1 / coord.z;
        return {
            x: lambda * coord.x,
            y: lambda * coord.y
        }
    }

    private static distanceToCamera(coord: SpaceCoord): number {
        if (coord.z < STAGE_NEAR) {
            return -1;
        }
        return (STAGE_NEAR * (STAGE_FAR - coord.z)) / (coord.z * (STAGE_FAR - STAGE_NEAR));
    }

    private static planeToPixel(coord: PlaneCoord): PixelCoord {
        return {
            left: STAGE_WIDTH_HALF * coord.x * STAGE_RATIO_INVERTED + STAGE_WIDTH_HALF,
            top: -STAGE_HEIGHT_HALF * coord.y + STAGE_HEIGHT_HALF
        }
    }

    private static spaceToPixel(coord: SpaceCoord): PixelCoord {
        return Projector.planeToPixel(Projector.spaceToPlane(coord));
    }

    constructor(world: World, camera: Camera) {
        this.world = world;
        this.camera = camera;

        this.world.state$.pipe(take(1)).subscribe(state => {
            this.createShapes(this.createData(state));
        });
        this.world.state$.pipe(skip(1)).subscribe(state => {
            this.updateShapes(this.createData(state));
        });
    }

    public get shapes(): Shapes {
        return this._shapes;
    }

    private createData(worldState: WorldState): ProjectedData {

        const rxMatrix = new RotaryMatrix(AxisEnum.X, this.camera.angleX);
        const ryMatrix = new RotaryMatrix(AxisEnum.Y, this.camera.angleY);
        const rzMatrix = new RotaryMatrix(AxisEnum.Z, this.camera.angleZ);
        const tMatrix = new TranslateMatrix(this.camera.position);

        let myMatrix = new IdentityMatrix();
        myMatrix = Matrix.multiply(myMatrix, rzMatrix);
        myMatrix = Matrix.multiply(myMatrix, ryMatrix);
        myMatrix = Matrix.multiply(myMatrix, rxMatrix);
        myMatrix = Matrix.multiply(myMatrix, tMatrix);
        myMatrix = myMatrix.inv!;

        // Dots
        let projectedDots: StagePoint[] = worldState.dots.map((coord: SpaceCoord): StagePoint => {
            let v = myMatrix.vectorMultiply(coord);
            return {
                pixel: Projector.spaceToPixel(v),
                dist: Projector.distanceToCamera(v),
                x: coord.x,
                y: coord.y,
                z: coord.z,
            }
        });

        projectedDots.sort((a: StagePoint, b: StagePoint) => a.dist - b.dist);

        let projectedPaths: StagePath[] = worldState.paths.map((spacePath: SpacePath): StagePath => {
            let point = Projector.spaceToPixel(myMatrix.vectorMultiply(spacePath.coords[0]));
            let minDist = Projector.distanceToCamera(myMatrix.vectorMultiply(spacePath.coords[0]));
            let p = 'M' + point.left + ' ' + point.top + ' ';
            for (let i = 1; i < spacePath.coords.length; i++) {
                point = Projector.spaceToPixel(myMatrix.vectorMultiply(spacePath.coords[i]));
                let dist = Projector.distanceToCamera(myMatrix.vectorMultiply(spacePath.coords[i]));
                minDist = Math.min(minDist, dist);
                p += 'L' + point.left + ' ' + point.top + ' ';
            }
            return {
                coords: spacePath.coords,
                d: p + 'Z',
                dist: minDist,
            };
        });

        return {
            dots: projectedDots,
            paths: projectedPaths,
        };
    }

    private createShapes(data: ProjectedData) {
        this._shapes = new Shapes(
            'projected',
            {
                circles: data.dots.map((dot: StagePoint): Circle => {
                    return new Circle(
                        dot.pixel.left,
                        dot.pixel.top,
                        this.getRadiusFromDist(dot.dist),
                        dot.dist,
                    )
                }),
                paths: data.paths.map((path: StagePath): Path => {
                    return new Path(
                        path.d,
                        path.dist,
                    )
                })
            },
        );
    }

    private updateShapes(data: ProjectedData) {
        this._shapes.update((shapes) => {
            shapes.circles.forEach((circle, index) => {
                let projectedDot = data.dots[index];
                circle.setPosition(
                    projectedDot.pixel.left,
                    projectedDot.pixel.top,
                    this.getRadiusFromDist(projectedDot.dist),
                    projectedDot.dist,
                );
                circle.setVisible(projectedDot.dist > 0);
            });
            shapes.paths.forEach((path, index) => {
                let projectedPath = data.paths[index];
                path.setPath(
                    projectedPath.d,
                    projectedPath.dist,
                )
                path.setVisible(projectedPath.dist > 0);
            });
        });
    }

    private getRadiusFromDist(dist: number): number {
        return dist > 0 ? dist * 30 : 0;
    }
}
