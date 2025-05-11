import { useForm } from '@doboid/form';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <MyFunckyForm />
    </StrictMode>,
  );
}

const validators = z.object({
  email: z.string().max(2).email(),
  password: z.string().min(2),
});

function MyFunckyForm() {
  const dorm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dorm.handleSubmit((v) => {
          alert(JSON.stringify(v, null, 2));
          dorm.errors.set('root', 'wtf');
        });
      }}
    >
      <dorm.Fields.email
        children={(field) => (
          <div>
            <input
              type="text"
              id={field.id}
              name={field.name}
              value={field.value}
              onChange={field.handleChange}
            />
            <p style={{ color: 'red' }}>{dorm.errors.get(field.id)}</p>
          </div>
        )}
      />

      <dorm.Fields.password
        children={(field) => (
          <div>
            <input
              type="password"
              id={field.id}
              name={field.name}
              value={field.value}
              onChange={field.handleChange}
            />
            <p style={{ color: 'red' }}>{dorm.errors.get(field.id)}</p>
          </div>
        )}
      />

      <p style={{ color: 'red' }}>{dorm.errors.get('root')}</p>

      <button type="submit">submit</button>
    </form>
  );
}
