import { instance, mock, when } from 'ts-mockito';

import { NavigationService } from '../navigation.service';
import { NAVIGATION_PATHS_STUB } from '../navigation.stub';
import { NavigationPathPipe } from './navigation-path.pipe';

describe('NavigationPathPipe', () => {
  let pipe: NavigationPathPipe;
  let navigationServiceMock: NavigationService;

  beforeEach(() => {
    navigationServiceMock = mock(NavigationService);
    // when(navigationServiceMock.getPaths()).thenReturn(NAVIGATION_PATHS_STUB);
    when(navigationServiceMock.getRoute).thenReturn((arg) => ['/', ...arg.split('/')]);

    pipe = new NavigationPathPipe(instance(navigationServiceMock));
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return path', () => {
    expect(pipe.transform(NAVIGATION_PATHS_STUB.home)).toEqual('/');
    expect(pipe.transform(NAVIGATION_PATHS_STUB.about)).toEqual('/about');
    expect(pipe.transform(NAVIGATION_PATHS_STUB.docs)).toEqual('/company/docs');
  });
});
