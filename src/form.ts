import type { StandardSchemaV1 } from '@standard-schema/spec';
import { type DoboidErrorMap, type DoboidErrors, doboidErrorsFactory } from './errors';
import type { DoboidFields } from './fields';
import { validateForm } from './validators';

export interface DoboidForm<in out TData> {
  errors: DoboidErrors<TData>;
  Fields: DoboidFields<TData>;
  //
  onSubmit(callback: (values: TData) => void): React.FormEventHandler<HTMLFormElement>;
  reset(): void;
}

//
//
//

export function doboidFormFactory<TData>(
  defaultValues: TData,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
  Fields: DoboidFields<TData>,
  validator: StandardSchemaV1,
  renderSignal: () => void,
): DoboidForm<TData> {
  return {
    Fields,
    //
    //
    //
    errors: doboidErrorsFactory<TData>(formErrorRef, renderSignal),
    //
    //
    //
    onSubmit(callback) {
      return async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!(await validateForm(validator, formStateRef, formErrorRef))) {
          renderSignal();

          return;
        }

        callback(formStateRef.current);
      };
    },
    reset() {
      formStateRef.current = { ...defaultValues };
      formErrorRef.current = {};

      renderSignal();
    },
  };
}
