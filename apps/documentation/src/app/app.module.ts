import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot([])],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
