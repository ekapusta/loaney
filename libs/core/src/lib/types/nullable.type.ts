/**
 * Interface for nullable objects
 * @publicApi
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
