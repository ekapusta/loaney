import { APP_INITIALIZER, NgModule } from '@angular/core';

import { MetaService } from './meta.service';

/**
 * Module for init metaService after start application
 * @publicApi
 */
@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (metaService: MetaService) => {
        return () => metaService.update();
      },
      deps: [MetaService],
      multi: true,
    },
  ],
})
export class MetaModule {}
