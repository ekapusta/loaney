import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Function for check value is not null or undefined
 * @publicApi
 *
 * @param input Input value
 */
export function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

/**
 * Operator for filter value
 * @publicApi
 *
 * @usageNotes
 * ### Example
 *
 * You can use the operator in pipe:
 *
 * ```
 * const source = from([1, 2, null, 3, 4, 5]);
 *
 * const example = source.pipe(isNotNullOrUndefined());
 *
 * // output: 1, 2, 3, 4, 5
 * const subscribe = example.subscribe(val => console.log(val));
 * ```
 */
export function isNotNullOrUndefined<T>() {
  return (source$: Observable<null | undefined | T>): Observable<T> => source$.pipe(filter(inputIsNotNullOrUndefined));
}
