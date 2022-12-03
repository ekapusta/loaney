import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { NavigationExtras, Router, UrlCreationOptions, UrlTree } from '@angular/router';

/**
 * Injection token for Navigation paths
 * @publicApi
 */
export const NAVIGATION_PATHS = new InjectionToken<Record<string, string>>('NAVIGATION_PATHS');

/**
 * Service for navigation in application
 * @publicApi
 *
 * @usageNotes
 * ### Example
 * **To use, you should provide NAVIGATION_PATHS in your AppModule**.
 *
 * ```
 * import { NgModule } from '@angular/core';
 * import { NAVIGATION_PATHS } from '@loaney/core';
 *
 * @NgModule({
 *   providers: [
 *     {
 *       provide: NAVIGATION_PATHS,
 *       useValue: {
 *         home: '',
 *         about: 'about',
 *         docs: 'company/docs'
 *       },
 *     },
 *     ...
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * **Using paths in component**:
 *
 * ```
 * @Component({})
 * class YourComponent implements OnInit {
 *   paths!: YourNavigationPaths;
 *
 *   constructor(private readonly navigationService: NavigationService<YourNavigationPaths>) {}
 *
 *   ngOnInit(): void {
 *     this.paths = this.navigationService.getPath();
 *   }
 * }
 * ```
 *
 * **For use paths on template use pipe - path**:
 *
 * ```
 * <a uiKitLink [routerLink]="paths.docs | path">Link</a>
 * ```
 *
 * **Use navigateByUrl for navigate in component**:
 *
 * ```
 * @Component({})
 * class YourComponent implements OnInit {
 *   paths!: YourNavigationPaths;
 *
 *   constructor(private readonly navigationService: NavigationService<YourNavigationPaths>) {}
 *
 *   ngOnInit(): void {
 *     this.paths = this.navigationService.getPath();
 *   }
 *
 *   onNavigate(): void {
 *     void this.navigationService.navigateByUrl(this.paths.docs);
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService<T extends object = object> {
  /**
   * Navigation paths
   * @private
   */
  private readonly paths: T;

  constructor(private readonly router: Router, @Optional() @Inject(NAVIGATION_PATHS) paths: T | null) {
    if (paths === null) {
      console.warn('PATHS not provided.');
      this.paths = {} as T;
    } else {
      this.paths = paths;
    }
  }

  /**
   * Return all paths
   */
  getPaths(): T {
    return this.paths;
  }

  /**
   * Decorate createUrlTree method from Angular router
   *
   * @param path Navigation path
   * @param navigationExtras Navigation extras for router
   */
  createUrlTree<K extends keyof T>(path: K | string, navigationExtras?: UrlCreationOptions): UrlTree {
    return this.router.createUrlTree(this.getRoute(path), navigationExtras);
  }

  /**
   * Return commands for router.navigate().
   *
   * @param path Navigation path
   * @param params Navigation path params
   */
  getRoute<K extends keyof T>(path: K | string, params: Record<string, string | number> = {}): (string | number)[] {
    const segments = path
      .toString()
      .split('/')
      .filter((value) => value?.length);
    const routeWithParams: (string | number)[] = ['/'];

    for (const segment of segments) {
      if (segment.charAt(0) === ':') {
        const paramName = segment.slice(1);
        if (params && params[paramName]) {
          routeWithParams.push(params[paramName]);
        } else {
          routeWithParams.push(paramName);
        }
      } else {
        routeWithParams.push(segment);
      }
    }

    return routeWithParams;
  }

  /**
   * Decorate navigation method from Angular router
   *
   * @param path Navigation commands
   * @param extras Navigation extras for router
   */
  navigate(path: (string | number)[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(path, extras);
  }

  /**
   * Return url with params
   *
   * @param path Navigation path
   * @param params Navigation path params
   * @param extras Navigation extras for router
   */
  navigateByUrl<K extends keyof T>(
    path: K | string,
    params?: Record<string, string | number>,
    extras?: NavigationExtras
  ): Promise<boolean> {
    return this.navigate(this.getRoute(path, params), extras);
  }
}
