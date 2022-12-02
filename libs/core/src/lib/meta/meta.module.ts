import { APP_INITIALIZER, NgModule } from '@angular/core';

import { MetaService } from './meta.service';

/**
 * Factory for metaService init
 * @publicApi
 */
export function metaServiceFactory(metaService: MetaService) {
  return () => metaService.update();
}

/**
 * Module for init metaService after start application
 * @publicApi
 */
@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: metaServiceFactory,
      deps: [MetaService],
      multi: true,
    },
  ],
})
export class MetaModule {}
