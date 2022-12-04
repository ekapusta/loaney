import { instance, mock, when } from 'ts-mockito';

import { ApiService } from '../../api/api.service';
import { NavigationService } from '../navigation.service';
import { NAVIGATION_PATHS_STUB } from '../navigation.stub';
import { ExternalPathPipe } from './external-path.pipe';

describe('NavigationExternalPathPipe', () => {
  let pipe: ExternalPathPipe;
  let apiServiceMock: ApiService;
  let navigationServiceMock: NavigationService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    navigationServiceMock = mock(NavigationService);

    when(navigationServiceMock.getRoute).thenReturn((path, params) => ['/', path]);
    when(apiServiceMock.makeUrl).thenReturn((path) => path);

    pipe = new ExternalPathPipe(instance(navigationServiceMock), instance(apiServiceMock));
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return external path', () => {
    expect(pipe.transform(NAVIGATION_PATHS_STUB.about)).toBe('/about');
  });
});
