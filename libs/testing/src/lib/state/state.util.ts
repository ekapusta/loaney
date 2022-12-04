/**
 * EntityState from `@ngrx/entity`
 *
 * @see https://ngrx.io/guide/entity/interfaces
 */
interface EntityState<V> {
  ids: string[] | number[];
  entities: { [id: string | number]: V };
}

/**
 * Entity Adapter from `@ngrx/entity`
 *
 * @see https://ngrx.io/guide/entity/adapter
 */
interface EntityAdapter<T> {
  setAll<S extends EntityState<T>>(entities: T[], state: S): S;
}

/**
 * Util for create configurable ngrx state
 * @publicApi
 *
 * @param initialState Initial state ngrx feature
 */
export function createGetState<T>(initialState: T): (data: Partial<T>) => T {
  return (data) => ({ ...initialState, ...data });
}

/**
 * Util for create configurable ngrx state with ngrx entity
 * @publicApi
 *
 * @param initialState Initial state ngrx feature
 * @param adapter Ngrx entity adapter
 */
export function createGetEntityState<T, R>(
  initialState: T & EntityState<R>,
  adapter: EntityAdapter<R>
): (data?: Partial<T>, entities?: R[]) => T {
  return (data = {}, entities = []) => adapter.setAll(entities, { ...initialState, ...data });
}
