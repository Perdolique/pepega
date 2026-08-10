<template>
  <div :class="$style.component">
    <UiPageHeader
      title="Admin"
      description="Twitch EventSub subscriptions."
    >
      <template #action>
        <UiButton
          variant="secondary"
          :disabled="store.isFetching"
          @click="store.fetchSubscriptions"
        >
          {{ store.isFetching ? 'Refreshing…' : 'Refresh' }}
        </UiButton>
      </template>
    </UiPageHeader>

    <p
      v-if="store.hasFetched === false"
      :class="$style.state"
    >
      Subscriptions have not been fetched yet.
    </p>
    <p
      v-else-if="store.isFetching"
      :class="$style.state"
      role="status"
    >
      Loading subscriptions…
    </p>
    <p
      v-else-if="store.fetchError"
      :class="$style.error"
      role="alert"
    >
      Subscriptions could not be fetched. Try Refresh again.
    </p>
    <p
      v-else-if="subscriptionList.length === 0"
      :class="$style.state"
    >
      Twitch returned no subscriptions.
    </p>

    <template v-else>
      <div :class="$style.wideTable">
        <table>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Broadcaster</th>
              <th scope="col">Twitch</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="subscription in subscriptionList"
              :key="subscription.id"
            >
              <td><code>{{ subscription.type }}</code></td>
              <td>
                <strong>{{ subscription.streamerName ?? 'Unknown streamer' }}</strong>
                <span :class="$style.metadata">{{ subscription.broadcasterId }}</span>
              </td>
              <td>
                <a
                  v-if="subscription.streamerLogin"
                  :href="`https://twitch.tv/${subscription.streamerLogin}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{{ subscription.streamerLogin }}
                </a>
                <span v-else>Unavailable</span>
              </td>
              <td>
                <UiButton
                  variant="danger"
                  :disabled="deletingSubscriptionId === subscription.id"
                  @click="confirmDelete(subscription)"
                >
                  Delete
                </UiButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ul :class="$style.compactList">
        <li
          v-for="subscription in subscriptionList"
          :key="subscription.id"
        >
          <div><span>Type</span><code>{{ subscription.type }}</code></div>
          <div><span>Broadcaster</span><strong>{{ subscription.streamerName ?? 'Unknown streamer' }}</strong></div>
          <div><span>ID</span><span>{{ subscription.broadcasterId }}</span></div>
          <UiButton
            variant="danger"
            :disabled="deletingSubscriptionId === subscription.id"
            @click="confirmDelete(subscription)"
          >
            Delete
          </UiButton>
        </li>
      </ul>
    </template>

    <p
      v-if="deleteError"
      :class="$style.error"
      role="alert"
    >
      {{ deleteError }}
    </p>

    <UiConfirmDialog
      v-model="isDeleteOpen"
      title="Delete Twitch subscription?"
      confirm-label="Delete subscription"
      @confirm="deleteSubscription"
    >
      This removes the selected EventSub subscription from Twitch.
    </UiConfirmDialog>
  </div>
</template>

<script setup lang="ts">
  import type { SubscriptionModel } from '#shared/models/twitch'
  import UiButton from '~/components/ui/UiButton.vue'
  import UiConfirmDialog from '~/components/ui/UiConfirmDialog.vue'
  import UiPageHeader from '~/components/ui/UiPageHeader.vue'
  import { useTwitchSubscriptionsStore } from '~/stores/twitch-subscriptions'
  import { computed, ref } from 'vue'
  import { useHead } from '#imports'

  const store = useTwitchSubscriptionsStore()
  const isDeleteOpen = ref(false)
  const deletionTarget = ref<SubscriptionModel | null>(null)
  const deletingSubscriptionId = ref<string | null>(null)
  const deleteError = ref('')
  const subscriptionList = computed(() => [...store.subscriptions.values()])

  function confirmDelete(subscription: SubscriptionModel) {
    deletionTarget.value = subscription
    deleteError.value = ''
    isDeleteOpen.value = true
  }

  async function deleteSubscription() {
    if (deletionTarget.value === null) {
      return
    }

    const subscriptionId = deletionTarget.value.id

    deletingSubscriptionId.value = subscriptionId
    deleteError.value = ''

    const success = await store.deleteSubscription(subscriptionId)

    if (success === false) {
      deleteError.value = 'The subscription could not be deleted. Try again.'
    } else {
      deletionTarget.value = null
    }

    deletingSubscriptionId.value = null
  }

  useHead({ title: 'Admin — Pepega' })
</script>

<style module>
  .component {
    display: grid;
    gap: var(--space-xl);
  }

  .state {
    color: var(--color-ink-secondary);
  }

  .error {
    color: var(--color-danger);
    font-weight: 700;
  }

  .wideTable {
    display: none;
    overflow-x: auto;
  }

  .wideTable table {
    inline-size: 100%;
    border-collapse: collapse;
    text-align: start;
  }

  .wideTable th,
  .wideTable td {
    padding: var(--space-sm) var(--space-md);
    border-block-end: 1px solid color-mix(in srgb, var(--color-ink) 16%, transparent);
    text-align: start;
  }

  .wideTable th {
    color: var(--color-ink-muted);
    font-size: var(--text-body-sm);
  }

  .wideTable strong,
  .metadata {
    display: block;
  }

  .metadata {
    color: var(--color-ink-muted);
    font-size: var(--text-metadata);
  }

  .compactList {
    display: grid;
    gap: var(--space-lg);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .compactList > li {
    display: grid;
    gap: var(--space-xs);
    padding-block-end: var(--space-lg);
    border-block-end: 1px solid color-mix(in srgb, var(--color-ink) 16%, transparent);
  }

  .compactList > li > div {
    display: grid;
    grid-template-columns: 7rem minmax(0, 1fr);
    gap: var(--space-sm);
  }

  .compactList > li > div > span:first-child {
    color: var(--color-ink-muted);
    font-size: var(--text-body-sm);
    font-weight: 700;
  }

  .compactList button {
    justify-self: start;
    margin-block-start: var(--space-sm);
  }

  @media (min-width: 48rem) {
    .wideTable {
      display: block;
    }

    .compactList {
      display: none;
    }
  }
</style>
