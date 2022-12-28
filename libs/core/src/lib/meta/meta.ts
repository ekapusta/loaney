import { InjectionToken } from '@angular/core';

/**
 * Config meta tags.
 * @publicApi
 */
export interface MetaConfig {
  /**
   * Page title
   */
  readonly title: string;

  /**
   * Page description
   */
  readonly description: string;

  /**
   * Page keywords
   */
  readonly keywords?: string;

  /**
   * Page canonical url
   */
  readonly url?: string;

  /**
   * hostname for canonical
   */
  readonly hostname?: string;
}

/**
 * Config for OG scheme tags.
 * @publicApi
 */
export interface MetaConfigOg {
  /**
   * OG Title
   */
  readonly title?: string;

  /**
   * OG Description
   */
  readonly description?: string;

  /**
   * OG type
   */
  readonly type: string;

  /**
   * OG locale
   */
  readonly locale?: string;

  /**
   * OG site name, brand
   */
  readonly siteName: string;

  /**
   * OG image
   */
  readonly image: string;

  /**
   * OG image type
   */
  readonly imageType: string;

  /**
   * OG image width
   */
  readonly imageWidth: string;

  /**
   * OG image height
   */
  readonly imageHeight: string;
}

/**
 * InjectionToken for meta config.
 * @publicApi
 */
export const META_CONFIG = new InjectionToken<Partial<MetaConfig>>('MetaConfig');

/**
 * InjectionToken for meta config og.
 * @publicApi
 */
export const META_CONFIG_OG = new InjectionToken<Partial<MetaConfigOg>>('MetaConfigOg');

/**
 * Default meta config.
 * @publicApi
 */
export const META_CONFIG_DEFAULT: MetaConfig = {
  title: 'Loaney',
  description: 'Loaney site',
  keywords: '',
};

/**
 * Default meta config og.
 * @publicApi
 */
export const META_CONFIG_OG_DEFAULT: MetaConfigOg = {
  siteName: 'loaney',
  type: 'website',
  image: '/assets/images/site.jpg',
  imageType: 'image/jpeg',
  imageWidth: '1200',
  imageHeight: '600',
};
