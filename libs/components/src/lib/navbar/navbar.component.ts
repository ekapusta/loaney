import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NavigationLink } from '@loaney/core';

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
  @Input() links!: NavigationLink[];
}
