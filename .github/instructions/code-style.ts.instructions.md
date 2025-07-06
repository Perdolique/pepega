---
applyTo: '**/*.ts'
---

# General guidelines

- Follow standard TypeScript conventions and best practices.
- Never use barrel files.
- Always use camelCase in namings.
- Do not use semicolons at the end of lines. Except for interfaces - they should always end with a semicolon.
- Use single quotes for strings.
- Always insert an empty line before return statements if they are not the last statement in a block.
- Always use template literals instead of string concatenation.
- After block with variables, always insert an empty line.

# Specific code style guidelines for TypeScript files.

Objects should be on the same line if only one property is present:

```ts
const woof = { bark: 'pooque' }
```

If an object has more than one property, it should be placed on the next line:

```ts
const woof = {
  bark,
  pooque: 'srenque'
}
```

But if object is part of a function call, it always should be on the new line, even if it has only one property:

```ts
getWoofs({
  bark: 'pooque'
})
```

## Variables grouping

Group single-line variables together. Separate multi-line variables with empty lines.

```ts
const woof = 'pooque'
const srenque = 'srenque'
```

```ts
const woof = 'pooque'

const srenque = {
  bark: 'srenque',
  pooque: 'srenque'
}
```

## Function and method calls grouping

Group single-line function or method calls together without empty lines.
Add an empty line before multi-line function or method calls.

```ts
woof()
bark()
pooque()

srenque({
  bark: 'pooque',
  woof: 'srenque'
})
```

## Do not use abbreviations or shortenings

Shortenings are not allowed in constants, variables, functions, classes, etc. Examples:

- `const getUser` instead of `const getUsr`
- `function checkSum()` instead of `function chkSum()`
- `const userName` instead of `const usrNm`


## Simplify complex expressions

Avoid complex expressions that are hard to read and understand. Use intermediate variables to break down the logic into smaller, more manageable pieces.

Examples:

```ts
const clampedValue = Math.min(Math.max(Math.floor((value - min) / step), 0), max)
```

should be written as:

```ts
const stepValue = (value - min) / step
const flooredValue = Math.floor(stepValue)
const clampedValue = Math.max(flooredValue, 0)

return Math.min(clampedValue, max)
```

Simple objects can be passed as parameters to function calls directly. This example is allowed:

```ts
getWoofs({
  bark: 'pooque',
  pooque: 'srenque'
})
```

## Never use deep types

Avoid using deep types in interfaces. Instead, create separate interfaces for nested objects. This improves readability and maintainability of the code.

```ts
type User = {
  id: number;
  address: {
    street: string;
  };
};
```

should be written as:

```ts
interface Address {
  street: string;
}

interface User {
  id: number;
  address: Address;
}
```
