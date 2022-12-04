/**
 * Interface for nullable objects
 * @publicApi
 *
 * @usageNotes
 * ### Example
 * You can make all properties object is nullable.
 *
 * ```
 * interface Person {
 *   id: number;
 * }
 *
 * // This is equal to interface { id: number | null }
 * type PersonNullable = Nullable<Person>;
 * ```
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
