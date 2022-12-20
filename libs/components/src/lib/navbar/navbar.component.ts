import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Navbar link interface.
 * @publicApi
 */
export interface NavbarLink {
  readonly label: string;
  readonly route: string;
  readonly icon?: string;
}

/**
 * Navbar component
 * @publicApi
 */
@Component({
  selector: 'loaney-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() links!: NavbarLink[];
}
