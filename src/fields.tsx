import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { ChangeEventHandler, JSX } from 'react';
import type React from 'react';
import type { DoboidFormData } from './data';
import type { DoboidErrorMap } from './errors';
import { AllocatedFileSpace, type DoboidFileSpace, EmptyFileSpace, isDoboidSpace } from './files';
import { capitalize, useRenderSignal } from './utils';
import { validateField } from './validators';

//
// string | number
//

interface DoboidInputField<in out TKey extends string, in out TValue> {
  attr: {
    id: TKey;
    name: TKey;
    value: TValue;
    onChange: ChangeEventHandler<HTMLInputElement>;
  };
  handleChange(value: TValue): void;
  errors: string[];
}

type DoboidInputFieldComponent<in out TKey extends string, in out TValue> = (props: {
  children: (field: DoboidInputField<TKey, TValue>) => JSX.Element;
}) => JSX.Element;

export function stringFieldComponentFactory<
  const TKey extends string,
  TData extends DoboidFormData,
>(
  key: TKey,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
  schema: StandardSchemaV1<TData>,
): DoboidInputFieldComponent<TKey, string> {
  return ({ children }) => {
    const { triggerRender } = useRenderSignal();

    return children({
      attr: {
        id: key,
        name: key,
        value: formStateRef.current[key],
        async onChange(e) {
          formStateRef.current[key] = String(e.target.value) as TData[TKey];
          formErrorRef.current[key] = await validateField(schema, formStateRef, key);

          triggerRender();
        },
      },
      async handleChange(value) {
        formStateRef.current[key] = value as TData[TKey];
        formErrorRef.current[key] = await validateField(schema, formStateRef, key);

        triggerRender();
      },
      errors: formErrorRef.current[key] ?? [],
    });
  };
}

export function numberFieldComponentFactory<
  const TKey extends string,
  TData extends DoboidFormData,
>(
  key: TKey,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
  schema: StandardSchemaV1<TData>,
): DoboidInputFieldComponent<TKey, number> {
  return ({ children }) => {
    const { triggerRender } = useRenderSignal();

    return children({
      attr: {
        id: key,
        name: key,
        value: formStateRef.current[key],
        async onChange(e) {
          formStateRef.current[key] = Number(e.target.value) as TData[TKey];
          formErrorRef.current[key] = await validateField(schema, formStateRef, key);

          triggerRender();
        },
      },
      async handleChange(value) {
        formStateRef.current[key] = value as TData[TKey];
        formErrorRef.current[key] = await validateField(schema, formStateRef, key);

        triggerRender();
      },
      errors: formErrorRef.current[key] ?? [],
    });
  };
}

//
// boolean
//

interface DoboidCheckboxField<in out TKey extends string, in out TValue> {
  attr: {
    id: TKey;
    name: TKey;
    checked: TValue;
    onChange: ChangeEventHandler<HTMLInputElement>;
  };
  handleChange(value: TValue): void;
  errors: string[];
}

type DoboidCheckboxFieldComponent<in out TKey extends string, in out TValue> = (props: {
  children: (field: DoboidCheckboxField<TKey, TValue>) => JSX.Element;
}) => JSX.Element;

export function booleanFieldComponentFactory<
  const TKey extends string,
  TData extends DoboidFormData,
>(
  key: TKey,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
  schema: StandardSchemaV1<TData>,
): DoboidCheckboxFieldComponent<TKey, boolean> {
  return ({ children }) => {
    const { triggerRender } = useRenderSignal();

    return children({
      attr: {
        id: key,
        name: key,
        checked: formStateRef.current[key],
        async onChange(e) {
          formStateRef.current[key] = e.target.checked as TData[TKey];
          formErrorRef.current[key] = await validateField(schema, formStateRef, key);

          triggerRender();
        },
      },
      async handleChange(value) {
        formStateRef.current[key] = value as TData[TKey];
        formErrorRef.current[key] = await validateField(schema, formStateRef, key);

        triggerRender();
      },
      errors: formErrorRef.current[key] ?? [],
    });
  };
}

//
// file
//

interface DoboidFileField<in out TKey extends string> {
  attr: {
    id: TKey;
    name: TKey;
    onChange: ChangeEventHandler<HTMLInputElement>;
  };
  fileSpace: DoboidFileSpace;
  errors: string[];
}

type DoboidFileFieldComponent<in out TKey extends string> = (props: {
  children: (field: DoboidFileField<TKey>) => JSX.Element;
}) => JSX.Element;

export function fileFieldComponent<const TKey extends string, TData extends DoboidFormData>(
  key: TKey,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
  schema: StandardSchemaV1<TData>,
): DoboidFileFieldComponent<TKey> {
  return ({ children }) => {
    const { triggerRender } = useRenderSignal();

    return children({
      attr: {
        id: key,
        name: key,
        onChange(e) {
          const file = e.target.files?.[0];

          if (!file) {
            formStateRef.current[key] = new EmptyFileSpace() as TData[TKey];
            formErrorRef.current[key] = ['File upload failed'];

            triggerRender();

            return;
          }

          const reader = new FileReader();

          reader.addEventListener(
            'load',
            async () => {
              const { result } = reader;

              if (!result) {
                formStateRef.current[key] = new EmptyFileSpace() as TData[TKey];
                formErrorRef.current[key] = ['File failed to load'];
              } else {
                formStateRef.current[key] = new AllocatedFileSpace(result, file) as TData[TKey];
                formErrorRef.current[key] = await validateField(schema, formStateRef, key);

                if (formErrorRef.current[key].length > 0) {
                  formStateRef.current[key] = new EmptyFileSpace() as TData[TKey];
                  e.target.value = '';
                }
              }

              triggerRender();
            },
            false,
          );

          reader.readAsDataURL(file);
        },
      },
      fileSpace: formStateRef.current[key],
      errors: formErrorRef.current[key] ?? [],
    });
  };
}

//
//
//

export type DoboidFields<in out TData extends DoboidFormData> = {
  [TKey in Extract<keyof TData, string> as Capitalize<TKey>]: TData[TKey] extends string
    ? DoboidInputFieldComponent<TKey, string>
    : TData[TKey] extends number
      ? DoboidInputFieldComponent<TKey, number>
      : TData[TKey] extends boolean
        ? DoboidCheckboxFieldComponent<TKey, boolean>
        : TData[TKey] extends DoboidFileSpace
          ? DoboidFileFieldComponent<TKey>
          : never;
};

export function doboidFieldsFactory<TData extends DoboidFormData>(
  defaultValues: TData,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
  validators: StandardSchemaV1<TData>,
) {
  const fields = {} as DoboidFields<TData>;

  for (const key in defaultValues) {
    const capitalizedKey = capitalize(key);

    switch (typeof defaultValues[key]) {
      case 'string': {
        fields[capitalizedKey] = stringFieldComponentFactory<typeof key, TData>(
          key,
          formStateRef,
          formErrorRef,
          validators,
        ) as DoboidFields<TData>[Capitalize<Extract<keyof TData, string>>];

        break;
      }

      case 'number': {
        fields[capitalizedKey] = numberFieldComponentFactory<typeof key, TData>(
          key,
          formStateRef,
          formErrorRef,
          validators,
        ) as DoboidFields<TData>[Capitalize<Extract<keyof TData, string>>];

        break;
      }

      case 'boolean': {
        fields[capitalizedKey] = booleanFieldComponentFactory<typeof key, TData>(
          key,
          formStateRef,
          formErrorRef,
          validators,
        ) as DoboidFields<TData>[Capitalize<Extract<keyof TData, string>>];

        break;
      }

      case 'object': {
        if (isDoboidSpace(defaultValues[key])) {
          fields[capitalizedKey] = fileFieldComponent<typeof key, TData>(
            key,
            formStateRef,
            formErrorRef,
            validators,
          ) as DoboidFields<TData>[Capitalize<Extract<keyof TData, string>>];
        }

        break;
      }

      default:
        // biome-ignore lint/suspicious/noConsole: dx++
        console.warn('received an unsupported prop type', `[${key}]:`, defaultValues[key]);
        break;
    }
  }

  return fields;
}
