import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { useForm } from '@doboid/form';
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
  email: z.string().email(),
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
        dorm.handleSubmit(console.log);
      }}
    >
      <dorm.Field.email
        children={(field) => (
          <div>
            <input
              type="text"
              id={field.id}
              name={field.name}
              value={field.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.issues?.length > 0 && <>{JSON.stringify(field.issues)}</>}
          </div>
        )}
      />

      <dorm.Field.password
        children={(field) => (
          <div>
            <input
              type="password"
              id={field.id}
              name={field.name}
              value={field.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.issues?.length > 0 && <>{JSON.stringify(field.issues)}</>}
          </div>
        )}
      />

      <button type="submit">submit</button>
    </form>
  );
}
