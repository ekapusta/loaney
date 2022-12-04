import { Pipe, PipeTransform } from '@angular/core';

import { ApiService } from '../../api/api.service';
import { NavigationService } from '../navigation.service';

@Pipe({
  name: 'externalPath',
})
export class ExternalPathPipe implements PipeTransform {
  constructor(private readonly navigationService: NavigationService, private readonly apiService: ApiService) {}

  transform(path: string, params?: Record<string, string | number>): string {
    return this.apiService.makeUrl(this.navigationService.getRoute(path, params).join('/').slice(1));
  }
}
