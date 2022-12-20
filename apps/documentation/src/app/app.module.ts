import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NavbarModule } from '@loaney/components';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, NavbarModule, RouterModule.forRoot([])],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
