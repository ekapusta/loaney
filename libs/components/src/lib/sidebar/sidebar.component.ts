import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NavigationLink } from '@loaney/core';

@Component({
  selector: 'loaney-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() links!: NavigationLink[];
}
