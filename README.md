# What is @doboid/form?

doboid form is a TINY, zero dependencies\*, TYPE-SAFE form state management library for react.

## Example

```tsx
function SimpleForm() {
  const { Fields, ...dorm } = useForm({
    defaultValues: {
      str: '',
      num: 0,
    },
    validators: z.object({
      str: z.string().email().max(11),
      num: z.number().max(3),
    }),
  });

  return (
    <form onSubmit={dorm.onSubmit((values) => console.log('success', values))}>
      <Fields.Str
        children={(field) => (
          <div>
            <input {...field.attr} type="text" />
            {field.errors.map((e) => (<div key={e}>{e}</div>))}
          </div>
        )}
      />

      <Fields.Num
        children={(field) => (
          <div>
            <input {...field.attr} type="number" />
            {field.errors.map((e) => (<div key={e}>{e}</div>))}
          </div>
        )}
      />

      <button type="submit">submit</button>
      <button type="button" onClick={dorm.reset}>reset</button>
    </form>
  );
}
```