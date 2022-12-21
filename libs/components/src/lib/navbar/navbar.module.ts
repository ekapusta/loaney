import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

import { NavigationModule } from '@loaney/core';

import { NavbarComponent } from './navbar.component';

/**
 * Navbar module
 * @publicApi
 */
@NgModule({
  imports: [CommonModule, RouterModule, MatTabsModule, NavigationModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
