import { TestBed } from '@angular/core/testing';

import { LOCAL_DB_CONFIG, LOCAL_DB_CONFIG_DEFAULT, LocalDBService } from './localdb.service';

describe('LocalDBService', () => {
  let service: LocalDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalDBService,
        {
          provide: LOCAL_DB_CONFIG,
          useValue: LOCAL_DB_CONFIG_DEFAULT,
        },
      ],
    });
    service = TestBed.inject(LocalDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
