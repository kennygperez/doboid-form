import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { PrimitiveFieldComponent } from './fields';
import { runValidator } from './validator';

export type DoboidFields<in out TData> = {
  [TKey in Extract<keyof TData, string> as Capitalize<TKey>]: TData[TKey] extends string
    ? PrimitiveFieldComponent<TKey, string>
    : TData[TKey] extends number
      ? PrimitiveFieldComponent<TKey, number>
      : never;
};

export interface DoboidForm<in out TData> {
  errors: DoboidErrors<TData>;
  Fields: DoboidFields<TData>;
  //
  onSubmit(callback: (values: TData) => void): React.FormEventHandler<HTMLFormElement>;
  reset(): void;
}

export interface DoboidErrors<in out TData, in TKeys = 'root' | Extract<keyof TData, string>> {
  get(key: TKeys): string[];
  set(key: TKeys, messages: string[]): void;
  clear(): void;
}

export type DoboidErrorMap = Record<string, string[]>;

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
    errors: {
      get(key) {
        return formErrorRef.current[key] ?? [];
      },
      set(key, messages) {
        formErrorRef.current = { ...formErrorRef.current, [key]: messages };

        renderSignal();
      },
      clear() {
        formErrorRef.current = {};

        renderSignal();
      },
    },
    onSubmit(callback) {
      return (e) => {
        e.preventDefault();
        e.stopPropagation();

        runValidator(validator, formStateRef, formErrorRef);

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
