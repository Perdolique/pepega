---
applyTo: '**/*.vue'
---

Styling should be used with CSS modules:

```vue
<template>
  <div :class="$style.content">
    <h1 :class="$style.title">
      Woof!
    </h1>
  </div>
</template>

<style module>
  .content {
    /* ... */
  }

  .title {
    /* ... */
  }
</style>
```

If element or component has only one attribute or prop, it should be placed on the same line:

```vue
<template>
  <button type="button">
    Button
  </button>
</template>
```

If element or component has more than one attribute or prop, it should be placed on the next line:

```vue
<template>
  <button
    type="button"
    @click="handleClick"
  >
    Button
  </button>
</template>
```

If element or component has content, it should be placed on the next line:

```vue
<template>
  <button>
    Button
  </button>
</template>
```

For refs use useTemplateRef instead of ref:

```vue
<template>
  <Overlay ref="overlayRef" />
</template>

<script setup>
  const overlayRef = useTemplateRef('overlayRef')
</script>
```
