export type DoboidErrorMap = Record<string, string[]>;

export interface DoboidErrors<in out TData, in TKeys = 'root' | Extract<keyof TData, string>> {
  get(key: TKeys): string[];
  set(key: TKeys, messages: string[]): void;
  add(key: TKeys, message: string): void;
  clear(key?: TKeys): void;
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
    add(key, message) {
      formErrorRef.current[key].push(message);
    },
    clear(key) {
      if (key) {
        formErrorRef.current[key] = [];
      } else {
        formErrorRef.current = {};
      }

      renderSignal();
    },
    commit() {
      renderSignal();
    },
  };
}
