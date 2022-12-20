import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NavbarLink } from '@loaney/components';

@Component({
  selector: 'loaney-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly links: NavbarLink[] = [
    {
      route: 'about',
      label: 'About',
    },
    {
      route: '',
      label: 'Posts',
    },
  ];
}
