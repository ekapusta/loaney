import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NAVIGATION_PATHS, NavigationService } from './navigation.service';
import { NAVIGATION_PATHS_STUB, NavigationPaths } from './navigation.stub';

@Component({ template: '' })
class YourComponent {}

/**
 * TODO: Add tests
 */
describe('NavigationService', () => {
  let service: NavigationService<NavigationPaths>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: NAVIGATION_PATHS_STUB.about,
            component: YourComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: NAVIGATION_PATHS,
          useValue: NAVIGATION_PATHS_STUB,
        },
      ],
    }).compileComponents();

    service = TestBed.inject(NavigationService);
  });

  it('should return service path', () => {
    expect(service.getRoute(NAVIGATION_PATHS_STUB.about)).toEqual(['/', NAVIGATION_PATHS_STUB.about]);
  });

  it('should return paths', () => {
    expect(service.getPaths()).toEqual(NAVIGATION_PATHS_STUB);
  });

  it('should return createUrlTree', () => {
    expect(service.createUrlTree(NAVIGATION_PATHS_STUB.about).fragment).toBeNull();
  });

  it('should return navigateByUrl', async () => {
    const result = await service.navigateByUrl(NAVIGATION_PATHS_STUB.about);

    expect(result).toBeTruthy();
  });
});
