import { skip, take } from 'rxjs';
import { Circle, Circle3dAttributes } from '../data/shape/circle';
import { Path, Path3dAttributes } from '../data/shape/path';
import { Rectangle, Rectangle3dAttributes } from '../data/shape/rectangle';
import { Shapes } from '../data/shape/shapes';
import { World, WorldState } from '../data/world/world';
import { AxisEnum } from '../types/axis-enum';
import { IdentityMatrix4, Matrix4, RotaryMatrix4, TranslateMatrix4 } from '../types/matrix/matrix-4';
import { SpaceCoord } from '../types/space-coord';
import { Camera } from './camera';

interface PlaneCoord {
    x: number;
    y: number;
}

interface PixelCoord {
    left: number;
    top: number;
}

interface ProjectedCircle extends Circle3dAttributes {
    pixel: PixelCoord;
    dist: number;
}

interface ProjectedPath extends Path3dAttributes {
    d: string;
    dist: number;
}

interface ProjectedRectangle extends Rectangle3dAttributes {
    d: string;
    dist: number;
}

interface ProjectedData {
    circles: ProjectedCircle[];
    paths: ProjectedPath[];
    rectangles: ProjectedRectangle[];
}

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

const STAGE_WIDTH_HALF = STAGE_WIDTH / 2;
const STAGE_HEIGHT_HALF = STAGE_HEIGHT / 2;;
const STAGE_RATIO_INVERTED = STAGE_HEIGHT / STAGE_WIDTH;
const STAGE_NEAR = 1;
const STAGE_FAR = 30;

export class Projector {

    private _world: World;
    private _camera: Camera;
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
        this._world = world;
        this._camera = camera;

        this._world.state$.pipe(take(1)).subscribe(state => {
            this.createShapes(this.createData(state));
        });
        this._world.state$.pipe(skip(1)).subscribe(state => {
            this.updateShapes(this.createData(state));
        });
    }

    public get shapes(): Shapes {
        return this._shapes;
    }

    private createData(worldState: WorldState): ProjectedData {

        const rxMatrix = new RotaryMatrix4(AxisEnum.X, this._camera.angleX);
        const ryMatrix = new RotaryMatrix4(AxisEnum.Y, this._camera.angleY);
        const rzMatrix = new RotaryMatrix4(AxisEnum.Z, this._camera.angleZ);
        const tMatrix = new TranslateMatrix4(this._camera.position);

        let transformationMatrix = new IdentityMatrix4();
        transformationMatrix = Matrix4.multiply(transformationMatrix, rzMatrix);
        transformationMatrix = Matrix4.multiply(transformationMatrix, ryMatrix);
        transformationMatrix = Matrix4.multiply(transformationMatrix, rxMatrix);
        transformationMatrix = Matrix4.multiply(transformationMatrix, tMatrix);
        transformationMatrix = transformationMatrix.inv!;

        // Circles
        let projectedCircles: ProjectedCircle[] = worldState.circles.map((circle: Circle3dAttributes): ProjectedCircle => {
            let v = transformationMatrix.vectorMultiply(circle.position);
            return {
                pixel: Projector.spaceToPixel(v),
                dist: Projector.distanceToCamera(v),
                position: {
                    x: circle.position.x,
                    y: circle.position.y,
                    z: circle.position.z,
                },
                radius: circle.radius,
                style: circle.style,
            }
        });

        projectedCircles.sort((a: ProjectedCircle, b: ProjectedCircle) => a.dist - b.dist);

        // Paths
        let projectedPaths: ProjectedPath[] = worldState.paths.map((path: Path3dAttributes): ProjectedPath => {
            let point = Projector.spaceToPixel(transformationMatrix.vectorMultiply(path.path[0]));
            let minDist = Projector.distanceToCamera(transformationMatrix.vectorMultiply(path.path[0]));
            let p = 'M' + point.left + ' ' + point.top + ' ';
            for (let i = 1; i < path.path.length; i++) {
                point = Projector.spaceToPixel(transformationMatrix.vectorMultiply(path.path[i]));
                let dist = Projector.distanceToCamera(transformationMatrix.vectorMultiply(path.path[i]));
                minDist = Math.min(minDist, dist);
                p += 'L' + point.left + ' ' + point.top + ' ';
            }
            return {
                path: path.path,
                close: path.close,
                d: path.close ? p + 'Z' : p,
                dist: minDist,
                style: path.style,
            };
        });

        // Rectangles
        let projectedRectangles: ProjectedRectangle[] = worldState.rectangles.map((rectangle: Rectangle3dAttributes): ProjectedRectangle => {
            let point = Projector.spaceToPixel(transformationMatrix.vectorMultiply(rectangle.path[0]));
            let minDist = Projector.distanceToCamera(transformationMatrix.vectorMultiply(rectangle.path[0]));
            let p = 'M' + point.left + ' ' + point.top + ' ';
            for (let i = 1; i < rectangle.path.length; i++) {
                point = Projector.spaceToPixel(transformationMatrix.vectorMultiply(rectangle.path[i]));
                let dist = Projector.distanceToCamera(transformationMatrix.vectorMultiply(rectangle.path[i]));
                minDist = Math.min(minDist, dist);
                p += 'L' + point.left + ' ' + point.top + ' ';
            }
            return {
                path: rectangle.path,
                d: p + 'Z',
                dist: minDist,
                style: rectangle.style,
            };
        });

        return {
            circles: projectedCircles,
            paths: projectedPaths,
            rectangles: projectedRectangles,
        };
    }

    private createShapes(data: ProjectedData) {
        this._shapes = new Shapes(
            'PRJ',
            {
                circles: data.circles.map((circle: ProjectedCircle): Circle => {
                    return new Circle(
                        circle.pixel.left,
                        circle.pixel.top,
                        this.getDistantDependentRadius(circle.radius, circle.dist),
                    )
                }),
                paths: data.paths.map((path: ProjectedPath): Path => {
                    return new Path(path.d)
                }),
                rectangles: data.rectangles.map((rectangle: ProjectedRectangle): Rectangle => {
                    return new Rectangle(rectangle.d);
                }),
            },
        );
    }

    private updateShapes(data: ProjectedData) {
        this._shapes.update((shapes) => {
            shapes.circles.forEach((circle, index) => {
                let projectedCircle = data.circles[index];
                circle.setPosition(
                    projectedCircle.pixel.left,
                    projectedCircle.pixel.top,
                    this.getDistantDependentRadius(projectedCircle.radius, projectedCircle.dist),
                );
                circle.style = projectedCircle.style;
                circle.visible = projectedCircle.dist > 0;
            });
            shapes.paths.forEach((path, index) => {
                let projectedPath = data.paths[index];
                path.setPath(projectedPath.d);
                path.style = projectedPath.style;
                path.visible = projectedPath.dist > 0;
            });
            shapes.rectangles.forEach((rectangle, index) => {
                let projectedRectangle = data.rectangles[index];
                rectangle.setPath(projectedRectangle.d);
                rectangle.style = projectedRectangle.style;
                rectangle.visible = projectedRectangle.dist > 0;
            });
        });
    }

    private getDistantDependentRadius(baseRadius: number, distance: number): number {
        return distance > 0 ? baseRadius * distance * 30 : 0;
    }
}
