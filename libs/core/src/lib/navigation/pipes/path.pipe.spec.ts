import { instance, mock, when } from 'ts-mockito';

import { NavigationService } from '../navigation.service';
import { NAVIGATION_PATHS_STUB } from '../navigation.stub';
import { PathPipe } from './path.pipe';

describe('NavigationPathPipe', () => {
  let pipe: PathPipe;
  let navigationServiceMock: NavigationService;

  beforeEach(() => {
    navigationServiceMock = mock(NavigationService);
    when(navigationServiceMock.getRoute).thenReturn((arg) => ['/', ...arg.split('/')]);

    pipe = new PathPipe(instance(navigationServiceMock));
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
