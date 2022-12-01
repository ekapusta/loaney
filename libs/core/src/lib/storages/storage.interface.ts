import { Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Storage key for async storages
 */
export const ASYNC_STORAGE_KEY = new InjectionToken<string>('ASYNC_STORAGE_KEY');

/**
 * Storage key default
 */
export const ASYNC_STORAGE_KEY_DEFAULT = 'loaney';

/**
 * SyncStorage for Local storage and Session storage
 */
@Injectable()
export class SyncStorage implements Storage {
  constructor(public readonly storage: Storage) {}

  get length(): number {
    return this.storage.length ?? 0;
  }

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key) ?? null;
  }

  key(index: number): string | null {
    return this.storage.key(index) ?? null;
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

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
 */
@Injectable()
export class AsyncStorage<S> {
  readonly state$: BehaviorSubject<Partial<S>>;

  readonly storage: Storage;
  readonly key: string;

  constructor(storage: Storage, key: string) {
    this.storage = storage;
    this.key = key;
    this.state$ = new BehaviorSubject<Partial<S>>(this.getLocalState());
  }

  get state(): Partial<S> {
    return this.state$.getValue();
  }

  get length(): number {
    return Object.keys(this.state).length;
  }

  clear(): void {
    this.setState({});
  }

  getItem<K extends keyof S>(key: K): Observable<S[K] | null> {
    return this.state$.pipe(map((state) => state[key] ?? null));
  }

  getItems<K extends keyof S>(keys: K[]): Observable<Pick<{ [P in keyof S]: S[P] | null }, K>> {
    return this.state$.pipe(
      map((state) => keys.reduce((acc, key) => ({ ...acc, [key]: state[key] ?? null }), {} as Pick<{ [P in keyof S]: S[P] | null }, K>))
    );
  }

  removeItem<K extends keyof S>(key: K): void {
    const state = { ...this.state };
    delete state[key];

    this.setState(state);
  }

  removeItems<K extends keyof S>(keys: K[]): void {
    const state = { ...this.state };

    for (const key of keys) {
      delete state[key];
    }

    this.setState(state);
  }

  setItem<K extends keyof S>(key: string, value: S[K]): void {
    this.setState({ ...this.state$.getValue(), [key]: value });
  }

  setItems(state: Partial<S>): void {
    this.setState({ ...this.state$.getValue(), ...state });
  }

  private setState(state: Partial<S>): void {
    this.state$.next(state);
    this.setLocalState(state);
  }

  private setLocalState(state: Record<string, unknown>): void {
    try {
      this.storage.setItem(this.key, JSON.stringify(state));
    } catch (error) {
      console.error(error);
    }
  }

  private getLocalState(): S {
    const state = this.storage.getItem(this.key);

    return state ? JSON.parse(state) : {};
  }
}
