import { DOCUMENT } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { META_CONFIG, META_CONFIG_DEFAULT, META_CONFIG_OG, META_CONFIG_OG_DEFAULT } from './meta';
import { MetaService } from './meta.service';

describe('MetaService', () => {
  let getProp: <T = HTMLMetaElement>(prop: string) => T | null;
  let service: MetaService;
  let routerMock: Router;
  let activatedRouteMock: ActivatedRoute;
  let document: Document;

  beforeEach(async () => {
    routerMock = mock(Router);
    activatedRouteMock = mock(ActivatedRoute);

    when(routerMock.url).thenReturn('/');
    when(routerMock.events).thenReturn(EMPTY);
    when(activatedRouteMock.snapshot).thenReturn({ snapshot: { firstChild: null, data: { meta: META_CONFIG_DEFAULT } } } as never);

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: Router,
          useFactory: () => instance(routerMock),
        },
        {
          provide: ActivatedRoute,
          useFactory: () => instance(activatedRouteMock),
        },
        {
          provide: LOCALE_ID,
          useValue: 'ru-RU',
        },
        {
          provide: META_CONFIG,
          useValue: META_CONFIG_DEFAULT,
        },
        {
          provide: META_CONFIG_OG,
          useValue: META_CONFIG_OG_DEFAULT,
        },
      ],
    }).compileComponents();

    service = TestBed.inject(MetaService);
    document = TestBed.inject(DOCUMENT);

    getProp = <T = HTMLMetaElement>(prop: string) => document.getElementById(prop) as T | null;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should set meta', () => {
    service.update();

    expect(document.title).toBe(META_CONFIG_DEFAULT.title);
    expect(getProp<HTMLLinkElement>('canonical')?.href).toBe('http://localhost/');
    expect(getProp('meta-description')?.content).toBe(META_CONFIG_DEFAULT.description);
    expect(getProp('meta-keywords')?.content).toBe(META_CONFIG_DEFAULT.keywords);
    // expect(getProp('meta-og:title')?.content).toBe(META_CONFIG_OG_DEFAULT.title);
    // expect(getProp('meta-og:description')?.content).toBe(META_CONFIG_OG_DEFAULT.description);
    expect(getProp('meta-og:type')?.content).toBe(META_CONFIG_OG_DEFAULT.type);
    expect(getProp('meta-og:locale')?.content).toBe('ru-RU');
    expect(getProp('meta-og:site_name')?.content).toBe(META_CONFIG_OG_DEFAULT.siteName);
    expect(getProp('meta-og:image')?.content).toBe(`http://localhost${META_CONFIG_OG_DEFAULT.image}`);
    expect(getProp('meta-og:image:type')?.content).toBe(META_CONFIG_OG_DEFAULT.imageType);
    expect(getProp('meta-og:image:width')?.content).toBe(META_CONFIG_OG_DEFAULT.imageWidth);
    expect(getProp('meta-og:image:height')?.content).toBe(META_CONFIG_OG_DEFAULT.imageHeight);
  });
});
