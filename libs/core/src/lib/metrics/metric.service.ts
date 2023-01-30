import { Injectable } from '@angular/core';

import { GoogleAnalyticsEvent, GoogleAnalyticsNavigation, GoogleAnalyticsService } from './google-analytics.service';
import { YandexMetrikaService } from './yandex-metrika.service';

export interface MetricOptions {
  readonly ya: Record<string, unknown>;
  readonly ga: GoogleAnalyticsEvent;
}

export interface MetricNavigation {
  readonly ya: Record<string, unknown>;
  readonly ga: GoogleAnalyticsNavigation;
}

@Injectable({
  providedIn: 'root',
})
export class MetricService {
  constructor(private readonly ym: YandexMetrikaService, private readonly ga: GoogleAnalyticsService) {}

  navigation(url: string, options?: Partial<MetricNavigation>): void {
    this.ym.hit(url, options?.ya);
    this.ga.sendNavigation(url, options?.ga);
  }

  send(action: string, options?: Partial<MetricOptions>): void {
    this.ym.reachGoal(action, options?.ya);
    this.ga.sendEvent(action, options?.ga);
  }
}
