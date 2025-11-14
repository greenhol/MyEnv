export enum ShapeType {
    CIRCLE = 'CIRCLE',
    RECTANGLE = 'RECTANGLE',
    PATH = 'PATH',
}

export abstract class Shape {
    public abstract id: string;
    public abstract type: ShapeType;

    private _visibility = true;

    public get isVisible(): boolean {
        return this._visibility;
    }

    public set visible(visible: boolean) {
        this._visibility = visible;
    }
}
