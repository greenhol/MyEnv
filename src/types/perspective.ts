import { SpaceCoord } from "./space-coord";
import { ONE_DEGREE } from "./constants";

export interface Perspective {
    position: SpaceCoord;
    angleX: number;
    angleY: number;
    angleZ: number;
}

export function createDefaultPerspective(): Perspective {
    return {
        position: { x: 0, y: 0, z: -7.5 },
        angleX: 45 * ONE_DEGREE,
        angleY: 45 * ONE_DEGREE,
        angleZ: 0 * ONE_DEGREE,
    }
};

export function perspectiveToString(perspective: Perspective): string {
    const position = `X ${perspective.position.x.toFixed(1)}, Y ${perspective.position.y.toFixed(1)}, Z ${perspective.position.z.toFixed(1)}`;
    const angleX = (perspective.angleX * 180 / Math.PI).toFixed(0);
    const angleY = (perspective.angleY * 180 / Math.PI).toFixed(0);
    const angleZ = (perspective.angleZ * 180 / Math.PI).toFixed(0);
    return `Perspective: Position (${position}), Angle-X ${angleX}°, Angle-Y ${angleY}°, Angle-Z ${angleZ}°)`;
}
