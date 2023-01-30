import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';

export const WEBVIEW_KEY = 'WEBVIEW_KEY';

export interface WebviewConfig {
  android: string;
  ios: string;
}

export const WEBVIEW_CONFIG = new InjectionToken<Partial<WebviewConfig>>('WEBVIEW_CONFIG');

export function findCustomUserAgent(window: Window | null, value: string): boolean {
  const navigator = window?.navigator ?? null;

  return !!navigator && navigator.userAgent.indexOf(value) >= 0;
}

@Injectable({
  providedIn: 'root',
})
export class WebviewService {
  readonly isIos: boolean;
  readonly isAndroid: boolean;
  readonly config: WebviewConfig;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Optional() @Inject(WEBVIEW_CONFIG) config: Partial<WebviewConfig> | null
  ) {
    this.config = {
      android: config?.android ?? 'WebViewAndroid',
      ios: config?.ios ?? 'WebViewIOS',
    };

    this.isAndroid = findCustomUserAgent(this.document.defaultView, this.config.android);
    this.isIos = findCustomUserAgent(this.document.defaultView, this.config.ios);
  }

  /**
   * Webview is hide a part functionality web application, so default value is true
   */
  isWebview(): boolean {
    if (this.isIos || this.isAndroid) {
      return true;
    }

    if (isPlatformBrowser(this.platformId) && this.document?.defaultView?.localStorage) {
      try {
        return this.document.defaultView.localStorage.getItem(WEBVIEW_KEY) !== null;
      } catch (error) {
        // Localstorage is not available
      }
    }

    return true;
  }
}
