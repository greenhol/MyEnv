import { fromEvent, merge, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

export function longPressHandler(
    element: Element,
    callback: (keyValue: string) => void
): void {
    const key = element as HTMLElement;
    const keyValue = key.dataset.key || '';

    const press$ = merge(
        fromEvent(element, 'mousedown'),
        fromEvent(element, 'touchstart')
    );

    const release$ = merge(
        fromEvent(element, 'mouseup'),
        fromEvent(element, 'touchend'),
        fromEvent(element, 'mouseleave')
    );

    const initialDelay = 300; // ms
    const repeatInterval = 50; // ms

    fromEvent(element, 'touchstart').subscribe((e) => e.preventDefault());

    press$.pipe(
        switchMap(() => {
            callback(keyValue);
            return timer(initialDelay, repeatInterval).pipe(
                takeUntil(release$)
            );
        })
    ).subscribe(() => {
        callback(keyValue);
    });
}
