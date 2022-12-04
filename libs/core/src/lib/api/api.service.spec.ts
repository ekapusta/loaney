import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_CONFIG, ApiConfig, ApiService } from './api.service';

const ERROR_STUB = 'Unknown Error';

const HTTP_ERROR_STUB = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: ERROR_STUB });

describe('ApiService', () => {
  let httpTestingController: HttpTestingController;
  let service: ApiService;
  const PATH = '/fake/endpoint';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        {
          provide: API_CONFIG,
          useValue: {
            host: '',
          } as ApiConfig,
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('get() should return get response', () => {
    service.get(PATH).subscribe((data) => expect(data).toBeNull());
    const req = httpTestingController.expectOne(PATH);
    expect(req.request.method).toEqual('GET');

    req.flush(null);
  });

  it('get() should return get error', () => {
    service.get(PATH).subscribe({
      error: (data) => expect(data.error).toEqual(ERROR_STUB),
    });

    const req = httpTestingController.expectOne(PATH);
    req.flush(ERROR_STUB, HTTP_ERROR_STUB);
  });

  it('post() should return post response', () => {
    service.post(PATH).subscribe((data) => expect(data).toBeNull());
    const req = httpTestingController.expectOne(PATH);
    expect(req.request.method).toEqual('POST');

    req.flush(null);
  });

  it('post() should return post error', () => {
    service.post(PATH).subscribe({
      error: (data) => expect(data.error).toEqual(ERROR_STUB),
    });

    const req = httpTestingController.expectOne(PATH);
    req.flush(ERROR_STUB, HTTP_ERROR_STUB);
  });

  it('put() should return put response', () => {
    service.put(PATH, {}).subscribe((data) => expect(data).toBeNull());
    const req = httpTestingController.expectOne(PATH);
    expect(req.request.method).toEqual('PUT');

    req.flush(null);
  });

  it('put() should return put error', () => {
    service.put(PATH, {}).subscribe({
      error: (data) => expect(data.error).toEqual(ERROR_STUB),
    });

    const req = httpTestingController.expectOne(PATH);
    req.flush(ERROR_STUB, HTTP_ERROR_STUB);
  });

  it('patch() should return patch response', () => {
    service.patch(PATH, {}).subscribe((data) => expect(data).toBeNull());
    const req = httpTestingController.expectOne(PATH);
    expect(req.request.method).toEqual('PATCH');

    req.flush(null);
  });

  it('patch() should return patch error', () => {
    service.patch(PATH, {}).subscribe({
      error: (data) => expect(data.error).toEqual(ERROR_STUB),
    });

    const req = httpTestingController.expectOne(PATH);
    req.flush(ERROR_STUB, HTTP_ERROR_STUB);
  });

  it('delete() should return delete response', () => {
    service.delete(PATH).subscribe((data) => expect(data).toBeNull());
    const req = httpTestingController.expectOne(PATH);
    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  });

  it('delete() should return delete error', () => {
    service.patch(PATH, {}).subscribe({
      error: (data) => expect(data.error).toEqual(ERROR_STUB),
    });

    const req = httpTestingController.expectOne(PATH);
    req.flush(ERROR_STUB, HTTP_ERROR_STUB);
  });
});
