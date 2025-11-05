import { Subscription } from "rxjs";

export class SerialSubscription {
    private _current: Subscription | null = null;

    set(subscription: Subscription): void {
        this._current?.unsubscribe();
        this._current = subscription;
    }

    unsubscribe(): void {
        this._current?.unsubscribe();
        this._current = null;
    }
};
