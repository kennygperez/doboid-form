import { useState } from 'react';

export function useRenderSignal() {
  const [_, setNumber] = useState(Math.random());

  return {
    triggerRender() {
      setNumber(Math.random());
    },
  };
}

export function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}
