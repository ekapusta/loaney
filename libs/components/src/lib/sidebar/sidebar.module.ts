import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { NavigationModule } from '@loaney/core';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatSidenavModule, NavigationModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {}
