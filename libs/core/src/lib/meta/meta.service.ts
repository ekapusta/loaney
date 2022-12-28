import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { META_CONFIG, META_CONFIG_DEFAULT, META_CONFIG_OG, META_CONFIG_OG_DEFAULT, MetaConfig, MetaConfigOg } from './meta';

/**
 * Service for setting meta tags.
 * @publicApi
 *
 * @usageNotes
 * ### Example
 * Service will be change meta tags after NavigationEnd. You should add information in your route on data:
 *
 * ```
 * import { RouterModule, Routes } from '@angular/router';
 *
 * const routes: Routes = [
 *   {
 *     path: '',
 *     component: YourComponent,
 *     data: {
 *       meta: {
 *         title: 'Title for page',
 *         description: 'Description for page',
 *         keywords: 'your,keys',
 *       },
 *     },
 *   },
 * ];
 *
 * @NgModule({
 *   imports: [RouterModule.forChild(routes)],
 *   exports: [RouterModule],
 * })
 * export class YourPageRoutingModule {}
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private readonly metaConfig: MetaConfig;
  private readonly metaConfigOg: MetaConfigOg;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(LOCALE_ID) private readonly localeId: string,
    @Optional() @Inject(META_CONFIG) metaConfig: Partial<MetaConfig> | null,
    @Optional() @Inject(META_CONFIG_OG) metaConfigOg: Partial<MetaConfigOg> | null
  ) {
    this.metaConfig = { ...META_CONFIG_DEFAULT, ...metaConfig };
    this.metaConfigOg = { ...META_CONFIG_OG_DEFAULT, ...metaConfigOg };

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let route = this.activatedRoute.snapshot;

      while (route.firstChild) {
        route = route.firstChild;
      }

      this.update({
        url: this.router.url,
        ...route.data['meta'],
      });
    });
  }

  /**
   * Update meta tags.
   */
  update(metaConfig?: Partial<MetaConfig>, metaConfigOg?: Partial<MetaConfigOg>): void {
    const config: MetaConfig = { ...this.metaConfig, ...metaConfig };
    const configOg: MetaConfigOg = { ...this.metaConfigOg, ...metaConfigOg };
    this.setCanonicalUrl(config.url);
    this.titleService.setTitle(config.title);
    this.setMetaProperty('description', config.description);
    this.setMetaProperty('keywords', config.keywords ?? '');
    this.setMetaProperty('og:title', configOg.title ?? config.title);
    this.setMetaProperty('og:description', configOg.description ?? config.description);
    this.setMetaProperty('og:type', configOg.type);
    this.setMetaProperty('og:locale', configOg.locale ?? this.localeId);
    this.setMetaProperty('og:site_name', configOg.siteName);
    this.setMetaProperty('og:image', this.getCanonicalURL(configOg.image));
    this.setMetaProperty('og:image:type', configOg.imageType);
    this.setMetaProperty('og:image:width', configOg.imageWidth);
    this.setMetaProperty('og:image:height', configOg.imageHeight);
  }

  /**
   * Set canonical url
   * @param url Url
   * @private
   */
  private setCanonicalUrl(url?: string): void {
    const link = (this.document.getElementById('canonical') ?? this.document.createElement('link')) as HTMLLinkElement;
    link.setAttribute('rel', 'canonical');
    link.setAttribute('id', 'canonical');
    link.setAttribute('href', this.getCanonicalURL(url));
    if (!this.document.getElementById('canonical')) {
      this.document.head.appendChild(link);
    }
  }

  /**
   * Return canonical url
   * @param url Url
   * @private
   */
  private getCanonicalURL(url?: string): string {
    const appHost = this.metaConfig.hostname ?? this.document.defaultView?.location.origin ?? '';

    return `${appHost}${url ?? this.router.url}`;
  }

  /**
   * Set meta tag
   * @param name Name meta
   * @param content Context for tag
   * @private
   */
  private setMetaProperty(name: string, content: string): void {
    const id = `meta-${name}`;
    const has = !!this.document.getElementById(id);

    const meta: MetaDefinition = { id, name, content };

    if (has) {
      this.meta.updateTag(meta);
    } else {
      this.meta.addTag(meta);
    }
  }
}
