import { Inject, Injectable, Optional } from '@angular/core';

import { ASYNC_STORAGE_KEY, ASYNC_STORAGE_KEY_DEFAULT, AsyncStorage } from '../storage';
import { SessionSyncStorage } from './session-sync.storage';

/**
 * SessionAsyncStorage is async storage for sessionStorage.
 * @publicApi
 *
 * @usageNotes
 * ### Example
 * Simple use:
 *
 * ```
 * import { Component } from '@angular/core';
 *
 * import { SessionAsyncStorage } from '@loaney/core';
 *
 * @Component({})
 * export class YourComponent {
 *   constructor(private readonly sessionAsyncStorage: SessionAsyncStorage<{ id: number; name: string }>) {
 *     this.sessionAsyncStorage.getItem('name').subscribe((name) => console.log(name);
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SessionAsyncStorage<S extends Record<string, unknown> = Record<string, unknown>> extends AsyncStorage<S> {
  constructor(storage: SessionSyncStorage, @Optional() @Inject(ASYNC_STORAGE_KEY) key: string | null) {
    super(storage, key ?? ASYNC_STORAGE_KEY_DEFAULT);
  }
}
