export type DoboidErrorMap = { [key: string]: string[] | undefined };

export interface DoboidErrors<in out TData, in TKeys = 'root' | Extract<keyof TData, string>> {
  get(key: TKeys): string[];
  set(key: TKeys, messages: string[]): void;
  clear(key?: TKeys): void;
  //
  //
  //
  begin(): void;
  add(key: TKeys, message: string): void;
  commit(): void;
}

export function doboidErrorsFactory<TData>(
  formErrorRef: React.RefObject<DoboidErrorMap>,
  renderSignal: () => void,
): DoboidErrors<TData> {
  return {
    get(key) {
      return formErrorRef.current[key] ?? [];
    },
    set(key, messages) {
      formErrorRef.current = { ...formErrorRef.current, [key]: messages };

      renderSignal();
    },
    clear(key) {
      if (key) {
        formErrorRef.current[key] = [];
      } else {
        formErrorRef.current = {};
      }

      renderSignal();
    },
    //
    //
    //
    begin() {
      formErrorRef.current = {};
    },
    add(key, message) {
      if (!Array.isArray(formErrorRef.current[key])) {
        formErrorRef.current[key] = [];
      }

      formErrorRef.current[key].push(message);
    },
    commit() {
      renderSignal();
    },
  };
}
