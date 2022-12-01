import { Inject, Injectable, Optional } from '@angular/core';

import { ASYNC_STORAGE_KEY, ASYNC_STORAGE_KEY_DEFAULT, AsyncStorage } from '../storage.interface';
import { LocalSyncStorage } from './local-sync.storage';

@Injectable({
  providedIn: 'root',
})
export class LocalAsyncStorage<S extends Record<string, unknown> = Record<string, unknown>> extends AsyncStorage<S> {
  constructor(storage: LocalSyncStorage, @Optional() @Inject(ASYNC_STORAGE_KEY) key: string | null) {
    super(storage, key ?? ASYNC_STORAGE_KEY_DEFAULT);
  }
}
