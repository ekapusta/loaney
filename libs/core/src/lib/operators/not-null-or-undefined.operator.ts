import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Function for check value is not null or undefined
 * @param input Input value
 */
export function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

/**
 * Operator for filter value
 */
export function isNotNullOrUndefined<T>() {
  return (source$: Observable<null | undefined | T>): Observable<T> => source$.pipe(filter(inputIsNotNullOrUndefined));
}
