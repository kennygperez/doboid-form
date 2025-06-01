import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { DoboidFormData } from './data';
import type { DoboidErrorMap } from './errors';

export async function validateField<TData extends DoboidFormData>(
  schema: StandardSchemaV1<TData>,
  formStateRef: React.RefObject<TData>,
  key: string,
): Promise<string[]> {
  let result = schema['~standard'].validate(formStateRef.current);

  if (result instanceof Promise) {
    result = await result;
  }

  if (result.issues) {
    const issues = result.issues.filter((i) => i.path?.join('.') === key);

    return issues.map((i) => i.message);
  }

  formStateRef.current = result.value;

  return [];
}

export async function validateForm<TData extends DoboidFormData>(
  schema: StandardSchemaV1<TData>,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
): Promise<boolean> {
  let result = schema['~standard'].validate(formStateRef.current);

  if (result instanceof Promise) {
    result = await result;
  }

  if (result.issues) {
    const newMap = {} as DoboidErrorMap;

    for (const i of result.issues) {
      const key = i.path?.join('.') ?? 'root';

      if (!newMap[key]) {
        newMap[key] = [];
      }

      newMap[key].push(i.message);
    }

    formErrorRef.current = newMap;

    return false;
  }

  formStateRef.current = result.value;
  formErrorRef.current = {};

  return true;
}
