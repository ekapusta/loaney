import { NgModule } from '@angular/core';

// import { NavigationExternalPathPipe } from './pipes/navigation-external-path.pipe';
import { NavigationPathPipe } from './pipes/navigation-path.pipe';

const pipes = [NavigationPathPipe];

@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class NavigationModule {}
