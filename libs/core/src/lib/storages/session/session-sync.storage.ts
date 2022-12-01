import { Injectable } from '@angular/core';

import { MemoryStorage } from '../memory/memory.storage';
import { SyncStorage } from '../storage.interface';
import { getStorage } from '../storage.util';

@Injectable({
  providedIn: 'root',
})
export class SessionSyncStorage extends SyncStorage {
  constructor() {
    super(getStorage('sessionStorage') ?? new MemoryStorage());
  }
}
