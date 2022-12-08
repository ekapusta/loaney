import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, OnDestroy, Optional } from '@angular/core';
import { indexedDB as fakeIndexedDB } from 'fake-indexeddb';
import { first, Observable, ReplaySubject } from 'rxjs';

/**
 * LocalDB Record.
 * @publicApi
 */
export interface LocalDBRecord {
  [key: string]: unknown;

  id: string | number;
}

/**
 * LocalDB config
 * @publicApi
 */
export interface LocalDBConfig {
  /**
   * Name database
   */
  readonly dbname: string;

  /**
   * Name ID for record
   */
  readonly keyPath: string;

  /**
   * Database version
   */
  readonly version: number;

  /**
   * Function for migration database
   */
  readonly onupgradeneeded: ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => void) | null;

  /**
   * Using store names on database
   */
  readonly storeNames: string[];
}

/**
 * LocalDB default config
 * @publicApi
 */
export const LOCAL_DB_CONFIG_DEFAULT: LocalDBConfig = {
  dbname: 'loaney',
  version: 1,
  keyPath: 'id',
  onupgradeneeded: null,
  storeNames: [],
};

/**
 * Injection token for LocalDB config
 * @publicApi
 */
export const LOCAL_DB_CONFIG = new InjectionToken<Partial<LocalDBConfig>>('LOCAL_DB_CONFIG');

/**
 * Local Database service for cross-platform storages. On web IndexedDB, for nativescript SQLite.
 * @publicApi
 */
@Injectable({
  providedIn: 'root',
})
export class LocalDBService implements OnDestroy {
  /**
   * Config for LocalDB
   * @private
   */
  private readonly config: LocalDBConfig;

  /**
   * Subject with instance IDBDatabase
   * @private
   */
  private readonly database$ = new ReplaySubject<IDBDatabase>(1);

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(LOCAL_DB_CONFIG) config: Partial<LocalDBConfig> | null
  ) {
    if (config === null) {
      throw new Error('LocalDBConfig is not defined!');
    }

    this.config = { ...LOCAL_DB_CONFIG_DEFAULT, ...config };

    const onError = (error: unknown): void => {
      console.error(error);
      this.database$.complete();
    };

    // For support Angular Universal using fakeIndexedDB
    const indexedDB = this.document.defaultView?.indexedDB ?? fakeIndexedDB;

    const openRequest = indexedDB.open(this.config.dbname, this.config.version);

    openRequest.onerror = () => onError(openRequest.error);
    openRequest.onsuccess = () => this.database$.next(openRequest.result);

    const onupgradeneeded = () => {
      try {
        const database = openRequest.result;
        const allStores = Array.from(database.objectStoreNames);
        const stores = this.config.storeNames.filter((name) => !allStores.includes(name));

        for (const store of stores) {
          database.createObjectStore(store, { keyPath: 'id' });
        }
      } catch (error) {
        onError(error);
      }
    };
    openRequest.onupgradeneeded = this.config.onupgradeneeded ?? onupgradeneeded;
  }

  /**
   * Close connection after destroy service
   */
  ngOnDestroy(): void {
    this.database$.complete();
  }

  /**
   * Return all records
   *
   * @param storeName Store name
   */
  getAll<T = LocalDBRecord>(storeName: string): Observable<T[]> {
    return new Observable((observer) => {
      const onError = (error: unknown) => {
        console.error(error, { storeName, operation: 'getAll' });
        observer.complete();
      };
      this.getDatabase().subscribe((database) => {
        try {
          const transaction = database.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const getRequest: IDBRequest<T[]> = store.getAll();

          getRequest.onerror = () => onError(getRequest.error);
          getRequest.onsuccess = () => {
            observer.next(getRequest.result ?? []);
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }

  /**
   * Return record by id
   *
   * @param storeName Store name
   * @param key Record id
   */
  get<T = LocalDBRecord>(storeName: string, key: string | number): Observable<T | null> {
    return new Observable((observer) => {
      const onError = (error: unknown) => {
        console.error(error, { storeName, operation: 'get' });
        observer.complete();
      };
      this.getDatabase().subscribe((database) => {
        try {
          const transaction = database.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const getRequest: IDBRequest<T> = store.get(key);

          getRequest.onerror = () => onError(getRequest.error);
          getRequest.onsuccess = () => {
            observer.next(getRequest.result ?? null);
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }

  /**
   * Add record
   *
   * @param storeName Store name
   * @param record Record
   */
  put<T = LocalDBRecord>(storeName: string, record: T): Observable<void> {
    return new Observable((observer) => {
      const onError = (error: unknown) => {
        console.error(error, { storeName, operation: 'put' });
        observer.complete();
      };
      this.getDatabase().subscribe((database) => {
        try {
          const transaction = database.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const putRequest = store.put(record);
          putRequest.onerror = () => onError(putRequest.error);
          putRequest.onsuccess = () => {
            observer.next();
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }

  /**
   * Add collection records
   *
   * @param storeName Store name
   * @param records Records
   */
  putAll<T = LocalDBRecord>(storeName: string, records: T[]): Observable<void> {
    return new Observable((observer) => {
      const onError = (error: unknown) => {
        console.error(error, { storeName, operation: 'putAll' });
        observer.complete();
      };
      this.getDatabase().subscribe((database) => {
        try {
          const transaction = database.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          for (const record of records) {
            store.put(record);
          }

          transaction.onerror = (error) => onError(error);
          transaction.oncomplete = () => {
            observer.next();
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }

  /**
   * Remove record by id
   *
   * @param storeName Store name
   * @param key Record id
   */
  remove(storeName: string, key: string | number): Observable<void> {
    return new Observable((observer) => {
      const onError = (error: unknown) => {
        console.error(error, { storeName, operation: 'remove' });
        observer.complete();
      };
      this.getDatabase().subscribe((database) => {
        try {
          const transaction = database.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const putRequest = store.delete(key);
          putRequest.onerror = () => onError(putRequest.error);
          putRequest.onsuccess = () => {
            observer.next();
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }

  /**
   * Remove all records from store
   * @param storeName Store name
   */
  clear(storeName: string): Observable<void> {
    return new Observable((observer) => {
      this.getDatabase().subscribe((database) => {
        try {
          database.transaction([storeName], 'readwrite').objectStore(storeName).clear();
        } catch (error) {
          console.error(error, { storeName, operation: 'clear' });
        }
        observer.next();
        observer.complete();
      });
    });
  }

  /**
   * Return last IDBDatabase
   * @private
   */
  private getDatabase(): Observable<IDBDatabase> {
    return this.database$.pipe(first());
  }
}
