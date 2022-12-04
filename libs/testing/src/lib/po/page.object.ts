import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * PageObject for Angular components.
 * @publicApi
 *
 * @usageNotes
 * You can create `PageObject` for simplify tests.
 *
 * For example, create `PageObject` for `SimpleComponent`.
 *
 * Template for component `simple.component.html`:
 *
 * ```
 * <h1 automation-id="title">Simple title</h1>
 * ```
 *
 * Logic for component `simple.component.ts`:
 *
 * ```
 * @Component({
 *   selector: 'loaney-simple',
 *   templateUrl: './simple.component.html',
 *   styleUrls: ['./simple.component.scss'],
 *   changeDetection: ChangeDetectionStrategy.OnPush,
 * })
 * export class SimpleComponent {}
 *
 * ```
 *
 * PageObject for SimpleComponent:
 *
 * ```
 * import { PageObject } from '@ekapusta/core/providers';
 *
 * export class AadhaarPageComponentPo extends PageObject {
 *   get title() {
 *     return this.getByAutomationId('title');
 *   }
 * }
 * ```
 *
 * Using on tests:
 *
 * ```
 * import { ComponentFixture, TestBed } from '@angular/core/providers';
 *
 * import { SimpleComponent } from './simple.component';
 * import { AadhaarPageComponentPo } from './simple.component.po';
 *
 * describe('SimpleComponent', () => {
 *   let pageObject: SimpleComponentPo;
 *   let fixture: ComponentFixture<SimpleComponent>;
 *
 *   beforeEach(async () => {
 *     await TestBed.configureTestingModule({
 *       declarations: [SimpleComponent],
 *     }).compileComponents();
 *
 *     fixture = TestBed.createComponent(AadhaarPageComponent);
 *     pageObject = new AadhaarPageComponentPo(fixture);
 *   });
 *
 *   it('should create', () => {
 *     fixture.detectChanges();
 *
 *     expect(fixture.componentInstance).toBeTruthy();
 *   });
 *
 *   it('should show', () => {
 *     fixture.detectChanges();
 *
 *     expect(pageObject.title).toBe('Simple title');
 *   });
 * });
 * ```
 */
export class PageObject<T = unknown> {
  /**
   * Component fixture or wrapper component fixture.
   *
   * @protected
   */
  protected readonly fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  /**
   * Method for find debug element by automationId
   *
   * @param automationId Automation id attribute on HTML
   * @protected
   */
  protected getByAutomationId(automationId: string): DebugElement | null {
    return this.fixture.debugElement.query(By.css(`[automation-id="${automationId}"]`)) ?? null;
  }

  /**
   * Method for find all debug elements by automationId
   *
   * @param automationId Automation id attribute on HTML
   * @protected
   */
  protected getAllByAutomationId(automationId: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css(`[automation-id="${automationId}"]`));
  }

  /**
   * Method that finds debug element by automationId and return textContent
   *
   * @param element Debug element or automation id
   * @protected
   */
  protected text(element: DebugElement | string): string | null {
    const el = element instanceof DebugElement ? element : this.getByAutomationId(element);

    if (!el) {
      return null;
    }

    return el.nativeElement.textContent.trim();
  }

  /**
   * Method for call js event
   *
   * @param element Debug element or automation id
   * @param eventName Event name (click or custom angular output, like as opened, clicked, viewed)
   * @param payload Event payload
   * @protected
   */
  protected triggerEventHandler(element: DebugElement | string | null, eventName: string, payload: unknown | null = null): void {
    if (element !== null) {
      const el = element instanceof DebugElement ? element : this.getByAutomationId(element);

      el?.triggerEventHandler(eventName, payload);
    } else {
      console.warn('Element on triggerEventHandler is NULL');
    }
  }
}
