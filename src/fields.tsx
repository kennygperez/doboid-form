import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { ChangeEventHandler, JSX } from 'react';
import type React from 'react';
import { useRenderSignal } from './utils';
import { runValidator } from './validator';

export interface DoboidField<in out TKey extends string, in out TValue> {
  attr: {
    id: TKey;
    name: TKey;
    value: TValue;
    onChange: ChangeEventHandler<HTMLInputElement>;
  };
  errors: string[];
}

//
//
//

export type PrimitiveFieldComponent<TKey extends string, TValue> = (props: {
  children: (field: DoboidField<TKey, TValue>) => JSX.Element;
}) => JSX.Element;

//
//
//

export function stringPrimitiveFieldComponentFactory<
  const TKey extends string,
  TData extends Record<string, any>,
>(
  key: TKey,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<any>,
  schema: StandardSchemaV1,
): PrimitiveFieldComponent<TKey, string> {
  return ({ children }) => {
    const renderSignal = useRenderSignal();

    return children({
      attr: {
        id: key,
        name: key,
        value: formStateRef.current[key],
        async onChange(e) {
          formStateRef.current[key] = String(e.target.value) as TData[typeof key];

          await runValidator(schema, formStateRef, formErrorRef, key);

          renderSignal();
        },
      },
      errors: formErrorRef.current[key] ?? [],
    });
  };
}

export function numberPrimitiveFieldComponentFactory<
  const TKey extends string,
  TData extends Record<string, any>,
>(
  key: TKey,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<any>,
  schema: StandardSchemaV1,
): PrimitiveFieldComponent<TKey, number> {
  return ({ children }) => {
    const renderSignal = useRenderSignal();

    return children({
      attr: {
        id: key,
        name: key,
        value: formStateRef.current[key],
        async onChange(e) {
          formStateRef.current[key] = Number(e.target.value) as TData[typeof key];

          await runValidator(schema, formStateRef, formErrorRef, key);

          renderSignal();
        },
      },
      errors: formErrorRef.current[key] ?? [],
    });
  };
}
