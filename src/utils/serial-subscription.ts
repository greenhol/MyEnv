import { Subscription } from "rxjs";

export class SerialSubscription {
    private _current: Subscription | null = null;

    constructor(subscription?: Subscription) {
        if (subscription != null) {
            this._current = subscription;
        }
    }

    set(subscription: Subscription): void {
        this._current?.unsubscribe();
        this._current = subscription;
    }

    unsubscribe(): void {
        this._current?.unsubscribe();
        this._current = null;
    }
};
