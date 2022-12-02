import { APP_INITIALIZER, NgModule } from '@angular/core';

import { MetaService } from './meta.service';

export function metaServiceFactory(metaService: MetaService) {
  return () => metaService.update();
}

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
