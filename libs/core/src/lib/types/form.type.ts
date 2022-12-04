import { FormControl, FormGroup } from '@angular/forms';

/**
 * Interface for typed forms
 * @publicApi
 *
 * @usageNotes
 * ### Example
 * You can create a new typed FormGroup by interface.
 *
 * ```
 * interface Person {
 *   email: string;
 *   name: string;
 * }
 *
 * const form = new FormGroup<FormFor<Person>>({
 *   email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 *   name:  new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 * })
 * ```
 *
 * The method `form.getRawValue()` return Person object.
 */
export type FormFor<T> = {
  [P in keyof T]: T[P] extends 'object' ? FormGroup<FormFor<T[P]>> : FormControl<T[P]>;
};
