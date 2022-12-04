import { WindowService } from './window.service';

describe('WindowService', () => {
  it('should return document', () => {
    const DOCUMENT_STUB = {} as Document;
    const service = new WindowService(DOCUMENT_STUB);

    expect(service.document).toEqual(DOCUMENT_STUB);
  });

  it('should return window', () => {
    const WINDOW_STUB = {} as Window;
    const service = new WindowService({ defaultView: WINDOW_STUB } as Document);

    expect(service.window).toEqual(WINDOW_STUB);
  });

  it('should return error', () => {
    const service = new WindowService({ defaultView: null } as Document);

    expect(() => service.window).toThrowError('Default view is not defined!');
  });
});
