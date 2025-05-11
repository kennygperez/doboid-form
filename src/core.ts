import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { ChangeEventHandler, FunctionComponent, JSX } from 'react';

export interface DoboidFormConfiguration<
  in out TSchema extends StandardSchemaV1,
  in out TData extends StandardSchemaV1.InferInput<TSchema>,
> {
  validators: TSchema;
  defaultValues: TData;
}

//
//
//

export interface DoboidErrors<in out TData, in TKeys = 'root' | Extract<keyof TData, string>> {
  get(key: TKeys): string;
  set(key: TKeys, message: string): void;
  clear(): void;
}

export type DoboidFields<in out TData> = {
  [P in Extract<keyof TData, string>]: PrimitiveFieldComponent<P, TData[P]>;
};

export interface DoboidForm<in out TData> {
  errors: DoboidErrors<TData>;
  Fields: DoboidFields<TData>;
  //
  handleSubmit(callback: (values: TData) => void): void;
  reset(): void;
}

//
//
//

export type PrimitiveFieldComponent<TKey, TData> = FunctionComponent<{
  children: (field: PrimitiveField<TKey, TData>) => JSX.Element;
}>;

export interface PrimitiveField<in out TKey, in out TData> {
  id: TKey;
  name: TKey;
  value: TData;
  handleChange: ChangeEventHandler<HTMLInputElement>;
}
