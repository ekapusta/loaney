import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * Service that returns a reference to the window contained in the document.
 * @publicApi
 */
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  /**
   * Reference to the document contained in the window.
   * @publicApi
   */
  document: Document;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document;
  }

  /**
   * The window object
   * @publicApi
   */
  get window(): Window {
    const window = this.document.defaultView;

    if (window === null) {
      throw new Error('Default view is not defined!');
    }

    return window;
  }
}
