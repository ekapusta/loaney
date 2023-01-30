import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CarouselNavsComponent } from './carousel-navs.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CarouselNavsComponent],
  exports: [CarouselNavsComponent],
})
export class CarouselNavsModule {}
