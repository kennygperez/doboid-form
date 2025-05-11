import type { StandardSchemaV1 } from '@standard-schema/spec';
import { useRef, useState } from 'react';
import React from 'react';
import type { DoboidFields, DoboidForm, DoboidFormConfiguration } from './core';

export function useForm<
  TSchema extends StandardSchemaV1,
  TData extends StandardSchemaV1.InferInput<TSchema>,
>(config: DoboidFormConfiguration<TSchema, TData>) {
  const renderSignal = useRenderSignal();
  const formErrorRef = useRef<Record<string, string>>({});
  const formStateRef = useRef(config.defaultValues);
  const [doboidForm] = useState<DoboidForm<TData>>(() => {
    const Fields = {} as DoboidFields<TData>;

    for (const key in config.defaultValues) {
      Fields[key] = ({ children }) => {
        const [data, setData] = useState(formStateRef.current[key]);

        return children({
          id: key,
          name: key,
          value: data,
          async handleChange(e) {
            formStateRef.current[key] = e.target.value as TData[Extract<keyof TData, string>];

            let result = config.validators['~standard'].validate(formStateRef.current);

            if (result instanceof Promise) result = await result;

            if (result.issues) {
              const issues = result.issues.filter((i) => i.path?.join('') === key);

              if (issues.length > 0) {
                formErrorRef.current[key] = issues[0].message;
              }
            } else {
              formStateRef.current = result.value as TData;
            }

            setData(formStateRef.current[key]);
          },
        });
      };
    }

    return {
      Fields,
      errors: {
        get(key) {
          return formErrorRef.current[key];
        },
        set(key, message) {
          formErrorRef.current = { ...formErrorRef.current, [key]: message };

          renderSignal();
        },
        clear() {
          formErrorRef.current = {};

          renderSignal();
        },
      },
      handleSubmit(callback) {
        callback(formStateRef.current);
      },
      reset() {
        formStateRef.current = config.defaultValues;

        renderSignal();
      },
    };
  });

  return doboidForm;
}

function useRenderSignal() {
  const [_, setNumber] = useState(Math.random());

  return () => setNumber(Math.random());
}
