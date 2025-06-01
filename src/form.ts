import type { StandardSchemaV1 } from '@standard-schema/spec';
import { type DoboidFormData, createFormDataInitialValues } from './data';
import { type DoboidErrorMap, type DoboidErrors, doboidErrorsFactory } from './errors';
import { type DoboidFields, doboidFieldsFactory } from './fields';
import { validateForm } from './validators';

export interface DoboidForm<in out TData extends DoboidFormData> {
  errors: DoboidErrors<TData>;
  Fields: DoboidFields<TData>;
  onSubmit(callback: (values: TData) => void): React.FormEventHandler<HTMLFormElement>;
  reset(): void;
}

export function doboidFormFactory<TData extends DoboidFormData>(
  defaultValues: TData,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
  validator: StandardSchemaV1<TData>,
  triggerRender: () => void,
): DoboidForm<TData> {
  return {
    Fields: doboidFieldsFactory(defaultValues, formStateRef, formErrorRef, validator),
    errors: doboidErrorsFactory(formErrorRef, triggerRender),
    //
    //
    //
    onSubmit(callback) {
      return async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!(await validateForm(validator, formStateRef, formErrorRef))) {
          triggerRender();

          return;
        }

        callback(formStateRef.current);
      };
    },
    reset() {
      formStateRef.current = createFormDataInitialValues(defaultValues);
      formErrorRef.current = {};

      triggerRender();
    },
  };
}
