import { FactoryProvider, Type } from '@angular/core';
import { instance } from 'ts-mockito';

/**
 * Simple function for mock services ts-mockito
 * @publicApi
 *
 * @param token Angular token (injection token, injection service)
 * @param mockClass Mock class
 *
 * @usageNotes
 * Using `providerOf` for providers simple component.
 *
 * ```
 * import { CommonModule } from '@angular/common';
 * import { ComponentFixture, TestBed } from '@angular/core/providers';
 * import { mock } from 'ts-mockito';
 *
 * import { providerOf } from './provider-of.util';
 * import { SimpleComponent } from './simple.component';
 * import { SimpleService } from './simple.service';
 *
 * describe('SimpleComponent', () => {
 *   let component: SimpleComponent;
 *   let fixture: ComponentFixture<SimpleComponent>;
 *   let simpleServiceMock: SimpleService;
 *
 *   beforeEach(async () => {
 *     simpleServiceMock = mock(SimpleService);
 *
 *     await TestBed.configureTestingModule({
 *       imports: [CommonModule],
 *       declarations: [SimpleComponent],
 *       providers: [providerOf(SimpleService, simpleServiceMock)],
 *     }).compileComponents();
 *   });
 *
 *   beforeEach(() => {
 *     fixture = TestBed.createComponent(SimpleComponent);
 *     component = fixture.componentInstance;
 *   });
 *
 *   it('should create', () => {
 *     fixture.detectChanges();
 *
 *     expect(component).toBeTruthy();
 *   });
 * });
 * ```
 */
export function providerOf<T>(
  token:
    | Type<T>
    // eslint-disable-next-line @typescript-eslint/ban-types
    | (Function & {
        prototype: T;
      }),
  mockClass: T
): FactoryProvider {
  return {
    provide: token,
    useFactory: (): T => instance(mockClass),
  };
}
