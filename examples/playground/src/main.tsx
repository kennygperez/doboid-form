import { useForm } from '@doboid/form';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

const root = document.getElementById('root');

if (!root) {
  throw new Error('');
}

createRoot(root).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);

function Playground() {
  const { Fields, ...dorm } = useForm({
    defaultValues: {
      str: '',
      num: 0,
      bool: false,
    },
    validators: z.object({
      str: z.string().email().max(11),
      num: z.number().max(3),
      bool: z.boolean(),
    }),
  });

  return (
    <form onSubmit={dorm.onSubmit((values) => console.log('success', values))}>
      <Fields.Str
        children={(f) => (
          <div>
            <input {...f.attr} type="text" />
            {f.errors.map((e) => (
              <div key={e}>{e}</div>
            ))}
          </div>
        )}
      />

      <Fields.Num
        children={(f) => (
          <div>
            <input {...f.attr} type="number" />
            {f.errors.map((e) => (
              <div key={e}>{e}</div>
            ))}
          </div>
        )}
      />

      <Fields.Bool
        children={(f) => (
          <div>
            <input type="checkbox" onChange={f.attr.onChange} checked={f.attr.value} />
            {f.errors.map((e) => (
              <div key={e}>{e}</div>
            ))}
          </div>
        )}
      />

      <button type="submit">submit</button>
      <button type="button" onClick={dorm.reset}>
        reset
      </button>
    </form>
  );
}
