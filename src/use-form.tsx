import type { StandardSchemaV1 } from '@standard-schema/spec';
import { useRef, useState } from 'react';
import React from 'react';
import type { DoboidForm, DoboidFormConfiguration } from './core';

export function useForm<
  TSchema extends StandardSchemaV1,
  TData extends StandardSchemaV1.InferInput<TSchema>,
>(config: DoboidFormConfiguration<TSchema, TData>) {
  const formStateRef = useRef(config.defaultValues);
  const [doboidForm] = useState<DoboidForm<TData>>(() => {
    const Field = {} as DoboidForm<TData>['Field'];

    for (const key in config.defaultValues) {
      Field[key] = ({ children }) => {
        const [data, setData] = useState(formStateRef.current[key]);
        const [issues, setIssues] = useState<readonly StandardSchemaV1.Issue[]>([]);

        return (
          <div>
            {children({
              id: key,
              name: key,
              value: data,
              issues,
              async handleChange(rawInput) {
                formStateRef.current[key] = rawInput;

                let result = await config.validators['~standard'].validate(formStateRef.current);

                if (result instanceof Promise) result = await result;

                const issues = result.issues ?? [];

                setIssues(issues.filter((i) => i.path?.join('') === key));

                setData(rawInput);
              },
            })}
          </div>
        );
      };
    }

    return {
      Field,
      handleSubmit(callback) {
        callback(formStateRef.current);
      },
      reset() {
        formStateRef.current = config.defaultValues;
      },
    };
  });

  return doboidForm;
}
