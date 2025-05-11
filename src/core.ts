import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { FunctionComponent, JSX } from 'react';

export interface DoboidFormConfiguration<
  in out TSchema extends StandardSchemaV1,
  in out TData extends StandardSchemaV1.InferInput<TSchema>,
> {
  validators: TSchema;
  defaultValues: TData;
}

export interface DoboidForm<in out TData> {
  Field: {
    [P in Extract<keyof TData, string>]: PrimitiveFieldComponent<P, TData[P]>;
  };
  handleSubmit(callback: (values: TData) => void): void;
  reset(): void;
}

export type PrimitiveFieldComponent<TKey, TData> = FunctionComponent<{
  children: (field: PrimitiveField<TKey, TData>) => JSX.Element;
}>;

export interface PrimitiveField<in out TKey, in out TData> {
  id: TKey;
  name: TKey;
  value: TData;
  issues: readonly StandardSchemaV1.Issue[];
  handleChange(rawInput: any): void;
}
