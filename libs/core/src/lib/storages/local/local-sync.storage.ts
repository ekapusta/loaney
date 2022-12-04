import { Injectable } from '@angular/core';

import { MemoryStorage } from '../memory/memory.storage';
import { getStorage, SyncStorage } from '../storage';

/**
 * LocalSyncStorage is proxy service for localStorage
 * @publicApi
 *
 * ### Example
 * Simple use:
 *
 * ```
 * import { Component } from '@angular/core';
 *
 * import { LocalSyncStorage } from '@loaney/core';
 *
 * @Component({})
 * export class YourComponent {
 *   constructor(private readonly localSyncStorage: LocalSyncStorage) {
 *     const name = this.localSyncStorage.getItem('name');
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class LocalSyncStorage extends SyncStorage {
  constructor() {
    super(getStorage('localStorage') ?? new MemoryStorage());
  }
}
