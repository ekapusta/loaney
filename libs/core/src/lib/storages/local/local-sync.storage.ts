import { Injectable } from '@angular/core';

import { MemoryStorage } from '../memory/memory.storage';
import { SyncStorage } from '../storage.interface';
import { getStorage } from '../storage.util';

@Injectable({
  providedIn: 'root',
})
export class LocalSyncStorage extends SyncStorage {
  constructor() {
    super(getStorage('localStorage') ?? new MemoryStorage());
  }
}
