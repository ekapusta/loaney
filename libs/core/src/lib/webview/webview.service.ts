import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';

/**
 * Webview key in localstorage
 * @publicApi
 */
export const WEBVIEW_KEY = 'WEBVIEW_KEY';

/**
 * Webview config interface
 * @publicApi
 */
export interface WebviewConfig {
  /**
   * Android user-agent custom string
   */
  readonly android: string;

  /**
   * Ios user-agent custom string
   */
  readonly ios: string;

  /**
   * Default value for detect
   */
  readonly defaultValue: boolean;
}

/**
 * InjectionToken for webview config
 * @publicApi
 */
export const WEBVIEW_CONFIG = new InjectionToken<Partial<WebviewConfig>>('WEBVIEW_CONFIG');

/**
 * Find custom string in user-agent
 * @publicApi
 *
 * @param window Window
 * @param value Custom string
 */
export function findCustomUserAgent(window: Window | null, value: string): boolean {
  const navigator = window?.navigator ?? null;

  return !!navigator && navigator.userAgent.indexOf(value) >= 0;
}

/**
 * Service for detect webview platform
 * @publicApi
 *
 * @usageNotes
 * ### Example
 *
 * For using service, you should save custom token in localstorage or customization Webview.
 */
@Injectable({
  providedIn: 'root',
})
export class WebviewService {
  /**
   * Is IOS webview
   */
  readonly isIos: boolean;

  /**
   * Is Android webview
   */
  readonly isAndroid: boolean;

  /**
   * Webview config
   */
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
      defaultValue: config?.defaultValue ?? false,
    };

    this.isAndroid = findCustomUserAgent(this.document.defaultView, this.config.android);
    this.isIos = findCustomUserAgent(this.document.defaultView, this.config.ios);
  }

  /**
   * Return current platform is webview
   */
  isWebview(): boolean {
    if (this.isIos || this.isAndroid) {
      return true;
    }

    /**
     * TODO: This is legacy way.
     */
    if (isPlatformBrowser(this.platformId) && this.document?.defaultView?.localStorage) {
      try {
        return this.document.defaultView.localStorage.getItem(WEBVIEW_KEY) !== null;
      } catch (error) {
        // Localstorage is not available
      }
    }

    return this.config.defaultValue;
  }
}
