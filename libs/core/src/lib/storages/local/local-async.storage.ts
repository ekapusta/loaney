import { Inject, Injectable, Optional } from '@angular/core';

import { ASYNC_STORAGE_KEY, ASYNC_STORAGE_KEY_DEFAULT, AsyncStorage } from '../storage';
import { LocalSyncStorage } from './local-sync.storage';

/**
 * LocalAsyncStorage is async storage for sessionStorage.
 * @publicApi
 *
 * @usageNotes
 * ### Example
 * Simple use:
 *
 * ```
 * import { Component } from '@angular/core';
 *
 * import { LocalAsyncStorage } from '@loaney/core';
 *
 * @Component({})
 * export class YourComponent {
 *   constructor(private readonly localAsyncStorage: LocalAsyncStorage<{ id: number; name: string }>) {
 *     this.localAsyncStorage.getItem('name').subscribe((name) => console.log(name);
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class LocalAsyncStorage<S extends Record<string, unknown> = Record<string, unknown>> extends AsyncStorage<S> {
  constructor(storage: LocalSyncStorage, @Optional() @Inject(ASYNC_STORAGE_KEY) key: string | null) {
    super(storage, key ?? ASYNC_STORAGE_KEY_DEFAULT);
  }
}
