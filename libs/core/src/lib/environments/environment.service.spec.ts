import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;
  const ENVIRONMENTS_STUB: Record<string, unknown> = { id: 1 };

  beforeEach(() => {
    service = new EnvironmentService(ENVIRONMENTS_STUB);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return environments', () => {
    expect(service.get()).toEqual(ENVIRONMENTS_STUB);
  });
});
