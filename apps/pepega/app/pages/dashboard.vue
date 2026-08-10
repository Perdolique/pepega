<template>
  <div :class="$style.component">
    <UiPageHeader
      title="Tools"
      description="Choose a Pepega tool."
    />

    <section aria-labelledby="released-tools-title">
      <h2
        id="released-tools-title"
        :class="$style.sectionTitle"
      >
        Available now
      </h2>

      <NuxtLink
        :class="$style.tool"
        to="/notifications"
      >
        <span>
          <strong>Online notifications</strong>
          <span>Send an alert when your Twitch stream goes live.</span>
        </span>
        <Icon
          name="tabler:arrow-right"
          aria-hidden="true"
        />
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
  import UiPageHeader from '~/components/ui/UiPageHeader.vue'
  import { useHead } from '#imports'

  useHead({ title: 'Tools — Pepega' })
</script>

<style module>
  .component {
    display: grid;
    gap: var(--space-xl);
  }

  .sectionTitle {
    margin-block-end: var(--space-sm);
    font-size: 1.25rem;
  }

  .tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    padding: var(--space-lg);
    border: var(--outline);
    border-radius: var(--radius-feature);
    background: var(--color-surface-featured);
    box-shadow: var(--shadow-feature);
    color: var(--color-ink);
    text-decoration: none;
    transform: rotate(-0.35deg);
    transition:
      box-shadow var(--motion-fast) var(--ease-product),
      transform var(--motion-fast) var(--ease-product);

    &:hover {
      box-shadow: 5px 5px 0 var(--color-shadow);
      transform: translate(-1px, -1px) rotate(-0.35deg);
    }

    &:active {
      box-shadow: none;
      transform: translate(4px, 4px) rotate(-0.35deg);
    }

    &:focus-visible {
      outline: var(--focus-outline);
      outline-offset: 4px;
    }
  }

  .tool > span,
  .tool strong {
    display: block;
  }

  .tool strong {
    font-family: var(--font-display);
    font-size: 1.125rem;
  }

  .tool span span {
    color: var(--color-ink-secondary);
  }

  @media (prefers-reduced-motion: reduce) {
    .tool {
      transition: none;
    }
  }
</style>
