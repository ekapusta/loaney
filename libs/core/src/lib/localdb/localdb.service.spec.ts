import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { LOCAL_DB_CONFIG, LOCAL_DB_CONFIG_DEFAULT, LocalDBConfig, LocalDBRecord, LocalDBService } from './localdb.service';

describe('LocalDBService', () => {
  let service: LocalDBService;
  const LOCAL_DB_RECORD_STUB: LocalDBRecord = {
    id: 'long-uuid',
    name: 'Last',
  };
  const STORE_NAME_STUB = 'posts';
  const LOCAL_DB_CONFIG_STUB: LocalDBConfig = {
    ...LOCAL_DB_CONFIG_DEFAULT,
    storeNames: [STORE_NAME_STUB],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalDBService,
        {
          provide: LOCAL_DB_CONFIG,
          useValue: LOCAL_DB_CONFIG_STUB,
        },
      ],
    });
    service = TestBed.inject(LocalDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should put and get record', async () => {
    await firstValueFrom(service.put(STORE_NAME_STUB, LOCAL_DB_RECORD_STUB));

    const result = await firstValueFrom(service.get(STORE_NAME_STUB, LOCAL_DB_RECORD_STUB.id));
    expect(result).toEqual(LOCAL_DB_RECORD_STUB);
  });

  it('should put and get all records', async () => {
    await firstValueFrom(service.putAll(STORE_NAME_STUB, [LOCAL_DB_RECORD_STUB]));

    const result = await firstValueFrom(service.getAll(STORE_NAME_STUB));
    expect(result.length).toEqual(1);
  });

  it('should clear store', async () => {
    await firstValueFrom(service.putAll(STORE_NAME_STUB, [LOCAL_DB_RECORD_STUB]));
    await firstValueFrom(service.clear(STORE_NAME_STUB));

    const result = await firstValueFrom(service.getAll(STORE_NAME_STUB));
    expect(result.length).toEqual(0);
  });

  it('should remove record', async () => {
    await firstValueFrom(service.put(STORE_NAME_STUB, LOCAL_DB_RECORD_STUB));
    await firstValueFrom(service.remove(STORE_NAME_STUB, LOCAL_DB_RECORD_STUB.id));

    const result = await firstValueFrom(service.get(STORE_NAME_STUB, LOCAL_DB_RECORD_STUB.id));
    expect(result).toBeNull();
  });
});
