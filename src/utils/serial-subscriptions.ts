import { Subscription } from "rxjs";
import { SerialSubscription } from "./serial-subscription";

export class SerialSubscriptions {
    private _current = new Map<string, SerialSubscription>();

    set(id: string, subscription: Subscription): void {
        if (this._current.has(id)) {
            let serialSubscription = this._current.get(id);
            serialSubscription?.set(subscription);
        } else {
            this._current.set(id, new SerialSubscription(subscription))
        }
    }

    unsubscribe(id: string): void {
        if (this._current.has(id)) {
            let serialSubscription = this._current.get(id);
            serialSubscription?.unsubscribe();
            this._current.delete(id);
        } else {
            console.error(-`No subscription for ${id} found.`);
        }
    }
};
