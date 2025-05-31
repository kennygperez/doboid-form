import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { DoboidErrorMap } from './errors';

export async function runValidator<TData>(
  schema: StandardSchemaV1,
  formStateRef: React.RefObject<TData>,
  formErrorRef: React.RefObject<DoboidErrorMap>,
  key?: string,
): Promise<boolean> {
  let result = schema['~standard'].validate(formStateRef.current);

  if (result instanceof Promise) {
    result = await result;
  }

  if (result.issues) {
    if (key) {
      const issues = result.issues.filter((i) => i.path?.join('') === key);

      formErrorRef.current[key] = issues.map((i) => i.message);
    } else {
      const newMap = {} as DoboidErrorMap;

      for (const i of result.issues) {
        const key = i.path?.join('.') ?? 'root';

        if (!newMap[key]) {
          newMap[key] = [];
        }

        newMap[key].push(i.message);
      }

      formErrorRef.current = newMap;
    }

    return false;
  }

  formStateRef.current = result.value as TData;

  if (key) {
    formErrorRef.current[key] = [];
  }

  return true;
}
