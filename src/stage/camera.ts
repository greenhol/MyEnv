import { BehaviorSubject } from 'rxjs';
import { createDefaultPerspective, Perspective } from '../types/perspective';

export class Camera {

    public state$ = new BehaviorSubject<Perspective>(createDefaultPerspective());

    public get position() {
        return this.state$.getValue().position;
    }

    public get angleX() {
        return this.state$.getValue().angleX;
    }

    public get angleY() {
        return this.state$.getValue().angleY;
    }

    public get angleZ() {
        return this.state$.getValue().angleZ;
    }

    public moveX(value: number) {
        const newState = structuredClone(this.state$.getValue())
        newState.position.x += value
        this.state$.next(newState);
    }

    public moveY(value: number) {
        const newState = structuredClone(this.state$.getValue())
        newState.position.y += value;
        this.state$.next(newState);
    }

    public moveZ(value: number) {
        const newState = structuredClone(this.state$.getValue())
        newState.position.z += value;
        this.state$.next(newState);
    }

    public rotateX(value: number) {
        const newState = structuredClone(this.state$.getValue())
        newState.angleX += value;
        this.state$.next(newState);
    }

    public rotateY(value: number) {
        const newState = structuredClone(this.state$.getValue())
        newState.angleY += value;
        this.state$.next(newState);
    }

    public rotateZ(value: number) {
        const newState = structuredClone(this.state$.getValue())
        newState.angleZ += value;
        this.state$.next(newState);
    }

    public mountCamera(perspective: Perspective) {
        const newState = structuredClone(perspective);
        this.state$.next(newState);
    }
}