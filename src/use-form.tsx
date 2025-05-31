import type { StandardSchemaV1 } from '@standard-schema/spec';
import { useRef, useState } from 'react';
import type { DoboidErrorMap } from './errors';
import {
  numberPrimitiveFieldComponentFactory,
  stringPrimitiveFieldComponentFactory,
} from './fields';
import { type DoboidFields, doboidFormFactory } from './form';
import { capitalize, useRenderSignal } from './utils';

interface DoboidFormConfiguration<in out TData> {
  defaultValues: TData;
  validators: StandardSchemaV1<TData>;
}

export function useForm<TData extends Record<string, any>>(config: DoboidFormConfiguration<TData>) {
  const renderSignal = useRenderSignal();

  const formStateRef = useRef({ ...config.defaultValues });
  const formErrorRef = useRef<DoboidErrorMap>({});

  const [doboidForm] = useState(() => {
    const Fields = {} as DoboidFields<TData>;

    for (const key in config.defaultValues) {
      const capitalizedKey = capitalize(key);

      switch (typeof config.defaultValues[key]) {
        case 'string': {
          Fields[capitalizedKey] = stringPrimitiveFieldComponentFactory<typeof key, TData>(
            key,
            formStateRef,
            formErrorRef,
            config.validators,
          ) as DoboidFields<TData>[Capitalize<Extract<keyof TData, string>>];

          break;
        }

        case 'number': {
          Fields[capitalizedKey] = numberPrimitiveFieldComponentFactory<typeof key, TData>(
            key,
            formStateRef,
            formErrorRef,
            config.validators,
          ) as DoboidFields<TData>[Capitalize<Extract<keyof TData, string>>];

          break;
        }

        default:
          // biome-ignore lint/suspicious/noConsole: dx++
          console.warn(
            'received an unsupported prop type',
            `[${key}]:${config.defaultValues[key]}`,
          );
          break;
      }
    }

    return doboidFormFactory(
      config.defaultValues,
      formStateRef,
      formErrorRef,
      Fields,
      config.validators,
      renderSignal,
    );
  });

  return doboidForm;
}
