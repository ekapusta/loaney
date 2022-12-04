import { HttpErrorResponse } from '@angular/common/http';

/**
 * Stub for error
 * @publicApi
 */
export const ERROR_STUB = 'Unknown Error';

/**
 * Stub for HttpErrorResponse
 * @publicApi
 */
export const HTTP_ERROR_STUB = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: ERROR_STUB });
