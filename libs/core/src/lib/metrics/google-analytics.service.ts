import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { WebviewService } from '../webview/webview.service';

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

  idsWebview: string[];

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
  eventCategory: string;
  eventLabel: string;
  eventValue: T;
}

export interface GoogleAnalyticsNavigation {
  [key: string]: unknown;

  title: string;
  platform: string;
  appstore: string;
  customerId: string;
}

@Injectable()
export class GoogleAnalyticsService {
  readonly config: GoogleAnalyticsConfig;

  readonly gtag: (...params: unknown[]) => void;

  constructor(
    private readonly webviewService: WebviewService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(GA_CONFIG) config: Partial<GoogleAnalyticsConfig> | null
  ) {
    this.config = {
      ids: config?.ids ?? [],
      idsWebview: config?.idsWebview ?? [],
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

  sendEvent(action: string, payload?: Partial<GoogleAnalyticsEvent>, values?: Record<string, unknown>, data?: unknown): void {
    /* eslint-disable @typescript-eslint/naming-convention */
    this.gtag(
      'event',
      action,
      {
        event_category: payload?.eventCategory,
        event_label: payload?.eventLabel,
        value: payload?.eventValue,
        ...values,
      },
      data
    );
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  sendNavigation(url: string, options?: Partial<GoogleAnalyticsNavigation>): void {
    if (
      !this.config.domains.every((domain) => this.document.referrer.indexOf(domain) < 0) ||
      !this.config.paths.every((path) => this.document.location.pathname.indexOf(path) < 0)
    ) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      this.set({ page_referrer: this.document.defaultView?.location.origin ?? '' });
    }
    if (options?.platform && options?.appstore) {
      this.set({ dimension3: options.platform, dimension4: options.appstore });
    }

    const ids = this.webviewService.isWebview() ? this.config.idsWebview : this.config.ids;

    for (const key of ids) {
      /* eslint-disable @typescript-eslint/naming-convention */
      this.gtag('config', key, {
        page_title: options?.title,
        page_path: url,
        user_id: options?.customerId ?? null,
      });
      /* eslint-enable @typescript-eslint/naming-convention */
    }
  }
}
