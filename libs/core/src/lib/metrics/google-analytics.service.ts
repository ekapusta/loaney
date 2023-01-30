import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

declare global {
  interface Window {
    /**
     * GTag
     */
    readonly gtag?: (...params: unknown[]) => void;
  }
}

export interface GoogleAnalyticsConfig {
  /**
   * Counter
   */
  ids: string[];

  /**
   * Domains for reset referer
   */
  domains: string[];

  /**
   * Paths for reset referer
   */
  paths: string[];
}

/**
 * InjectionToken for yandex metrika config
 * @publicApi
 */
export const GA_CONFIG = new InjectionToken<Partial<GoogleAnalyticsConfig>>('GoogleAnalyticsConfig');

export interface GoogleAnalyticsEvent<T = unknown> {
  eventAction: string;
  eventCategory?: string;
  eventLabel?: string;
  eventValue?: T;
}

export interface GoogleAnalyticsNavigation {
  url: string;
  queryParams?: Record<string, unknown>;
  title: string;
  location?: string;
}

@Injectable()
export class GoogleAnalyticsService {
  readonly config: GoogleAnalyticsConfig;

  readonly gtag: (...params: unknown[]) => void;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(GA_CONFIG) config: Partial<GoogleAnalyticsConfig> | null
  ) {
    this.config = {
      ids: config?.ids ?? [],
      paths: config?.paths ?? [],
      domains: config?.domains ?? [],
    };

    if (typeof this.document.defaultView?.gtag !== 'undefined' && this.config.ids.length > 0) {
      this.gtag = this.document.defaultView.gtag;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.gtag = () => {};
    }
  }

  set(payload: Record<string, unknown>): void {
    this.gtag('set', payload);
  }

  send(action: string, options: Record<string, unknown> | string, data?: unknown): void {
    this.gtag('event', action, options, data);
  }

  event(payload: GoogleAnalyticsEvent, values?: Record<string, unknown>, data?: unknown): void {
    /* eslint-disable @typescript-eslint/naming-convention */
    this.send(
      payload.eventAction,
      {
        event_category: payload.eventCategory,
        event_label: payload.eventLabel,
        value: payload.eventValue,
        ...values,
      },
      data
    );
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  sendNavigation(payload: GoogleAnalyticsNavigation): void {
    // if (
    //   !this.config.domains.every((domain) => this.document.referrer.indexOf(domain) < 0) ||
    //   !this.config.paths.every((path) => this.document.location.pathname.indexOf(path) < 0)
    // ) {
    //   // eslint-disable-next-line @typescript-eslint/naming-convention
    //   this.set({ page_referrer: this.document.defaultView?.location.origin ?? '' });
    // }
    // this.set({ dimension3: this.platform, dimension4: this.appstore });
    //
    // const ids = this.isWebView ? this.gaIds.webView : this.gaIds.all;
    //
    // for (const key of ids) {
    //   /* eslint-disable @typescript-eslint/naming-convention */
    //   const googlePayload: Record<string, any> = {
    //     page_title: payload.title,
    //     page_path: payload.url,
    //     user_id: this.localSyncStorage.getItem(CurrentCustomerKeys.CustomerId) ?? null,
    //   };
    //
    //   gtag('config', key, googlePayload);
    //   /* eslint-enable @typescript-eslint/naming-convention */
    // }
  }
}
