import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NavigationLink } from '@loaney/core';

@Component({
  selector: 'loaney-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly links: NavigationLink[] = [
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
