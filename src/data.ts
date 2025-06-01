// biome-ignore lint/suspicious/noExplicitAny: It could literally be anything
export type DoboidFormData = Record<string, any>;

export function createFormDataInitialValues<TData extends DoboidFormData>(
  defaultValues: TData,
): TData {
  return JSON.parse(JSON.stringify(defaultValues)); // deep clone
}
