import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';

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
  ids: string | string[];

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
export const GA_CONFIG = new InjectionToken<GoogleAnalyticsConfig>('GoogleAnalyticsConfig');

export interface GoogleAnalyticsEvent<T = unknown> {
  eventAction: string;
  eventCategory?: string;
  eventLabel?: string;
  eventValue?: T;
}

@Injectable()
export class GoogleAnalyticsService {
  readonly ids: string[];

  readonly gtag: (...params: unknown[]) => void;

  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(GA_CONFIG) config: string[] | null
  ) {
    this.ids = gaIds ?? [];

    if (isPlatformBrowser(this.platformId) && typeof this.document.defaultView?.gtag !== 'undefined' && !!this.ids.length) {
      this.gtag = this.document.defaultView.gtag;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.gtag = () => {};
    }
  }

  setProps(payload: unknown): void {
    this.gtag('set', payload);
  }

  send(action: string, options: Record<string, unknown> | string, data?: unknown): void {
    this.gtag('event', action, options, data);
  }

  set(payload: Record<string, unknown>): void {
    this.gtag('set', payload);
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

  hit(url: string, options?: Record<string, unknown>): void {
    let clearReferrer = false;
    if (
      !this.config.domains.every((domain) => this.document.referrer.indexOf(domain) < 0) ||
      !this.config.paths.every((path) => this.document.location.pathname.indexOf(path) < 0)
    ) {
      clearReferrer = true;
    }

    const optionsAll: { referer?: string } = { ...options };
    if (clearReferrer) {
      optionsAll.referer = '';
    }
    this.counter(this.config.counter, 'hit', url, optionsAll);
  }

  sendNavigation(payload: GoogleAnalyticsNavigation): void {
    if (this.canSend()) {
      if (this.gaIds?.all?.length) {
        if (
          this.windowService.document.location.pathname.indexOf(`/${this.paths.registrationSocial}`) >= 0 ||
          this.windowService.document.location.pathname.indexOf(`/${this.paths.authLogin}`) >= 0 ||
          this.windowService.document.referrer.indexOf(this.configService.getConfig().apiUrl) >= 0
        ) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          gtag('set', { page_referrer: this.windowService.window.location.origin });
        }
        gtag('set', { dimension3: this.platform, dimension4: this.appstore });

        const ids = this.isWebView ? this.gaIds.webView : this.gaIds.all;

        for (const key of ids) {
          /* eslint-disable @typescript-eslint/naming-convention */
          const googlePayload: Record<string, any> = {
            page_title: payload.title,
            page_path: payload.url,
            user_id: this.localSyncStorage.getItem(CurrentCustomerKeys.CustomerId) ?? null,
          };

          gtag('config', key, googlePayload);
          /* eslint-enable @typescript-eslint/naming-convention */
        }
      }
    }
  }

  protected canSend(): boolean {
    return this.platformService.isBrowser && typeof gtag !== 'undefined' && this.hasAnalytics;
  }
}
