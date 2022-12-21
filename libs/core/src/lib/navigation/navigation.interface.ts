/**
 * Navigation link interface.
 * @publicApi
 */
export interface NavigationLink {
  [key: string]: unknown;

  readonly label: string;
  readonly route: string;
  readonly icon?: string;

  readonly exact?: boolean;
}
