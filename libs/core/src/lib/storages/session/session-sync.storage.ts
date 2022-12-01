import { Injectable } from '@angular/core';

import { MemoryStorage } from '../memory/memory.storage';
import { getStorage, SyncStorage } from '../storage';

/**
 * SessionSyncStorage is proxy service for sessionStorage
 * @publicApi
 *
 * @usageNotes
 * ### Example
 * Simple use:
 *
 * ```
 * import { Component } from '@angular/core';
 *
 * import { SessionSyncStorage } from '@loaney/core';
 *
 * @Component({})
 * export class YourComponent {
 *   constructor(private readonly sessionSyncStorage: SessionSyncStorage) {
 *     const name = this.sessionSyncStorage.getItem('name');
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SessionSyncStorage extends SyncStorage {
  constructor() {
    super(getStorage('sessionStorage') ?? new MemoryStorage());
  }
}
