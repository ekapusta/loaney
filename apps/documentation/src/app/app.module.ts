import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { NavbarModule, SidebarModule } from '@loaney/components';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot([]), NavbarModule, SidebarModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
