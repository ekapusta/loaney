import { InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Storage key for async storages
 * @publicApi
 */
export const ASYNC_STORAGE_KEY = new InjectionToken<string>('ASYNC_STORAGE_KEY');

/**
 * Storage key default
 * @publicApi
 */
export const ASYNC_STORAGE_KEY_DEFAULT = 'loaney';

/**
 * SyncStorage for Local storage and Session storage
 * @publicApi
 *
 * @usageNotes
 * ### Example
 * Simple use SyncStorage for proxy LocalStorage:
 *
 * ```
 * import { Injectable } from '@angular/core';
 *
 * import { SyncStorage } from './storage.interface';
 *
 * @Injectable()
 * export class LocalSyncStorage extends SyncStorage {
 *   constructor() {
 *     super(getStorage('localStorage'));
 *   }
 * }
 * ```
 */
export abstract class SyncStorage implements Storage {
  /**
   * Storage for working with data.
   * It's maybe LocalStorage, SessionStorage or MemoryStorage (save data on memory).
   */
  readonly storage: Storage;

  protected constructor(storage: Storage) {
    this.storage = storage;
  }

  /**
   * Returns the number of key/value pairs.
   */
  get length(): number {
    return this.storage.length ?? 0;
  }

  /**
   * @inheritDoc
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * @inheritDoc
   */
  getItem(key: string): string | null {
    return this.storage.getItem(key) ?? null;
  }

  /**
   * @inheritDoc
   */
  key(index: number): string | null {
    return this.storage.key(index) ?? null;
  }

  /**
   * @inheritDoc
   */
  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * @inheritDoc
   */
  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  }
}

/**
 * AsyncStorage for Local storage and Session storage
 * @publicApi
 * ```
 */
export abstract class AsyncStorage<S> {
  /**
   * Current state
   */
  readonly state$: BehaviorSubject<Partial<S>>;

  /**
   * Storage for working with data
   */
  readonly storage: Storage;

  key: string;

  protected constructor(storage: Storage, key: string) {
    this.storage = storage;
    this.key = key;
    this.state$ = new BehaviorSubject<Partial<S>>(this.getLocalState());
  }

  /**
   * Returns current state value.
   */
  get state(): Partial<S> {
    return this.state$.getValue();
  }

  /**
   * Returns the number of key/value pairs.
   */
  get length(): number {
    return Object.keys(this.state).length;
  }

  /**
   * Removes all key/value pairs, if there are any.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  clear(): void {
    this.setState({});
  }

  /**
   * Returns the current value associated with the given key, or null if the given key does not exist.
   *
   * @param key Key
   */
  getItem<K extends keyof S>(key: K): Observable<S[K] | null> {
    return this.state$.pipe(map((state) => state[key] ?? null));
  }

  /**
   * Returns the current values associated with the given keys.
   *
   * @param keys Array keys
   */
  getItems<K extends keyof S>(keys: K[]): Observable<Pick<{ [P in keyof S]: S[P] | null }, K>> {
    return this.state$.pipe(
      map((state) => keys.reduce((acc, key) => ({ ...acc, [key]: state[key] ?? null }), {} as Pick<{ [P in keyof S]: S[P] | null }, K>))
    );
  }

  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   *
   * @param key Key
   */
  removeItem<K extends keyof S>(key: K): void {
    const state = { ...this.state };
    delete state[key];

    this.setState(state);
  }

  /**
   * Removes the key/value pair with the given keys, if a key/value pair with the given key exists.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   *
   * @param keys Keys
   */
  removeItems<K extends keyof S>(keys: K[]): void {
    const state = { ...this.state };

    for (const key of keys) {
      delete state[key];
    }

    this.setState(state);
  }

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g.,
   * the user has disabled storage for the site, or if the quota has been exceeded.)
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   *
   * @param key Key
   * @param value Saving value
   */
  setItem<K extends keyof S>(key: string, value: S[K]): void {
    this.setState({ ...this.state$.getValue(), [key]: value });
  }

  /**
   * Sets the values of the pairs identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g.,
   * the user has disabled storage for the site, or if the quota has been exceeded.)
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   *
   * @param state Collection values
   */
  setItems(state: Partial<S>): void {
    this.setState({ ...this.state$.getValue(), ...state });
  }

  /**
   * Set current state on memory and storage
   *
   * @param state New state value
   * @private
   */
  private setState(state: Partial<S>): void {
    this.state$.next(state);
    this.setLocalState(state);
  }

  /**
   * Save current state on storage
   * @param state New state value
   * @private
   */
  private setLocalState(state: Record<string, unknown>): void {
    try {
      this.storage.setItem(this.key, JSON.stringify(state));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Return current state from storage
   * @private
   */
  private getLocalState(): S {
    const state = this.storage.getItem(this.key);

    return state ? JSON.parse(state) : {};
  }
}

/**
 * If storage is available, storage is returned
 * @publicApi
 *
 * @param type Storage name like as localStorage, sessionStorage
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 *
 * @usageNotes
 * ### Example
 * For get a storage:
 *
 * ```
 * const storage = getStorage('localStorage');
 * ```
 */
export function getStorage(type: 'localStorage' | 'sessionStorage'): Storage | null {
  let storage;

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return storage;
  } catch (error) {
    const can =
      error instanceof DOMException &&
      // everything except Firefox
      (error.code === 22 ||
        // Firefox
        error.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        error.name === 'QuotaExceededError' ||
        // Firefox
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      !!storage &&
      storage?.length !== 0;

    return can && storage ? storage : null;
  }
}
