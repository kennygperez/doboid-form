import type { StandardSchemaV1 } from '@standard-schema/spec';
import { useRef, useState } from 'react';
import { type DoboidFormData, createFormDataInitialValues } from './data';
import type { DoboidErrorMap } from './errors';
import { doboidFormFactory } from './form';
import { useRenderSignal } from './utils';

interface DoboidFormConfiguration<in out TData extends DoboidFormData> {
  readonly defaultValues: TData;
  readonly validators: StandardSchemaV1<TData>;
}

export function useForm<TData extends DoboidFormData>(config: DoboidFormConfiguration<TData>) {
  const renderSignal = useRenderSignal();
  const formStateRef = useRef(createFormDataInitialValues(config.defaultValues));
  const formErrorRef = useRef<DoboidErrorMap>({});
  const [doboidForm] = useState(
    doboidFormFactory(
      config.defaultValues,
      formStateRef,
      formErrorRef,
      config.validators,
      renderSignal.triggerRender,
    ),
  );

  return doboidForm;
}
