import {
  DoboidFileSpace,
  EmptyFileSpace,
  isDoboidSpace,
  isSpaceAllocated,
  useForm,
} from '@doboid/form';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod/v4';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found, check HTML!');
}

createRoot(root).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const schema = z.object({
  str: z.email().max(11),
  num: z.number().max(3),
  bool: z.boolean(),
  img: z.instanceof(DoboidFileSpace).refine((space) => {
    if (isSpaceAllocated(space)) {
      return ACCEPTED_IMAGE_TYPES.includes(space.meta.type);
    }

    return isDoboidSpace(space);
  }, 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
  //
  nvr1: z.object({}),
  nvr2: z.undefined(),
  nvr3: z.null(),
  nvr4: z.symbol(),
});

function Playground() {
  const { Fields, ...dorm } = useForm({
    defaultValues: {
      str: '',
      num: 0,
      bool: false,
      img: new EmptyFileSpace(),
      //
      nvr1: {},
      nvr2: undefined,
      nvr3: null,
      nvr4: Symbol('not supported'),
    },
    validators: schema,
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
            <input {...f.attr} type="checkbox" />
            {f.errors.map((e) => (
              <div key={e}>{e}</div>
            ))}
          </div>
        )}
      />

      <Fields.Img
        children={(f) => (
          <div>
            <input {...f.attr} type="file" />
            {f.errors.map((e) => (
              <div key={e}>{e}</div>
            ))}
            <button type="button" onClick={() => console.log(f.fileSpace)}>
              debug
            </button>
            {isSpaceAllocated(f.fileSpace) ? (
              <img src={f.fileSpace.src} alt="demo" style={{ width: '32px', height: '32px' }} />
            ) : (
              ''
            )}
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
