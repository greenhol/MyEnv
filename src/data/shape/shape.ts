export enum ShapeType {
    CIRCLE = 'circle',
    RECTANGLE = 'rect',
}

export abstract class Shape {
    public abstract id: string;
    public abstract type: ShapeType;
    
    private _visibility = true;

    public get isVisible(): boolean {
        return this._visibility;
    }

    public setVisible(visible: boolean) {
        this._visibility = visible;
    }

    public show() {
        this._visibility = true;
    }

    public hide() {
        this._visibility = false;
    }
}
