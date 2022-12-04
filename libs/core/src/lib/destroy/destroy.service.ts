import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service for unsubscribe in components.
 * @publicApi
 *
 * @usageNotes
 * Add service on constructor and providers on your component.
 *
 * ```
 * import { DestroyService } from '@loaney/core';
 *
 * @Component({
 *   providers: [DestroyService]
 * })
 * class YourComponent {
 *   constructor(private readonly destroy$: DestroyService) {
 *     const source = interval(1000);
 *     source.pipe(
 *       tap((index) => {
 *         console.log(index);
 *       }),
 *       takeUntil(this.destroy$)
 *     ).subscribe();
 *   }
 * }
 * ```
 */
@Injectable()
export class DestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
