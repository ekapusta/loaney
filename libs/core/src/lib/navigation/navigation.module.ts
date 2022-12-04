import { NgModule } from '@angular/core';

import { ExternalPathPipe } from './pipes/external-path.pipe';
import { PathPipe } from './pipes/path.pipe';

const pipes = [PathPipe, ExternalPathPipe];

/**
 * Service for navigation pipes
 * @publicApi
 */
@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class NavigationModule {}
