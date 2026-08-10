import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub'
import { type WebhookModel, type WebhookStatus } from '~~/shared/models/webhooks'
import { isNotNull } from '~~/shared/utils/types'
import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { $fetch } from 'ofetch'
import { createLogger } from '@pepega/utils/logger'
import { useFetch } from '#imports'

interface Webhook {
  id: number;
  status: string;
  type: string;
  createdAt: string;
}

interface WebhookCreationError {
  error: true;
}

const logger = createLogger('PEPEGA')

function transformWebhookType(type: string) : EventSubscriptionType | null {
  switch (type) {
    case 'stream.online': {
      return type
    }

    default: {
      return null
    }
  }
}

function transformWebhookStatus(status: string) : WebhookStatus | null {
  switch (status) {
    case 'not_active':
    case 'active':
    case 'pending':
    case 'failed':
    case 'revoked': {
      return status
    }

    default: {
      return null
    }
  }
}

function transformWebhook(data: Webhook) : WebhookModel | null {
  const type = transformWebhookType(data.type)

  if (type === null) {
    return null
  }

  const status = transformWebhookStatus(data.status)

  if (status === null) {
    return null
  }

  return {
    status,
    type,
    id: data.id,
    createdAt: data.createdAt
  }
}

function transformWebhooks(data: Webhook[]) : WebhookModel[] {
  return data
    .map(transformWebhook)
    .filter(isNotNull)
}

export const useWebhooksStore = defineStore('webhooks', () => {
  const webhooks = ref(new Map<number, WebhookModel>())

  function removeWebhooks(ids: number[]) {
    for (const id of ids) {
      webhooks.value.delete(id)
    }
  }

  async function fetchWebhook(webhookId: number) {
    try {
      const result = await $fetch<Webhook>(`/api/webhooks/${webhookId}`)
      const webhook = transformWebhook(result)

      if (webhook !== null) {
        webhooks.value.set(webhook.id, webhook)

        return webhook
      }
    } catch (error) {
      logger.error('Failed to fetch webhook', error)
    }

    return
  }

  function replaceWebhooks(newWebhooks: WebhookModel[]) {
    webhooks.value.clear()

    for (const webhook of newWebhooks) {
      webhooks.value.set(webhook.id, webhook)
    }
  }

  async function fetchWebhooks() {
    try {
      const response = await $fetch<Webhook[]>('/api/webhooks')
      const data = transformWebhooks(response)

      replaceWebhooks(data)
      return true
    } catch (error) {
      logger.error('Failed to fetch webhooks', error)
      return false
    }
  }

  async function fetchInitialWebhooks() {
    const { data } = await useFetch('/api/webhooks', {
      transform: transformWebhooks
    })

    if (data.value !== undefined) {
      replaceWebhooks(data.value)
    }
  }

  async function createWebhook(type: EventSubscriptionType) {
    try {
      const result = await $fetch<Webhook>('/api/webhooks', {
        method: 'POST',

        body: {
          type
        }
      })

      const webhook = transformWebhook(result)

      if (webhook !== null) {
        webhooks.value.set(webhook.id, webhook)
        return webhook
      }
    } catch (error) {
      logger.error('Failed to create webhook', error)
    }

    return { error: true } satisfies WebhookCreationError
  }

  async function deleteWebhook(webhookId: number) {
    try {
      const webhook = webhooks.value.get(webhookId)

      if (webhook === undefined) {
        throw new Error(`Webhook not found for id: ${webhookId}`)
      }

      await $fetch(`/api/webhooks/${webhookId}`, {
        method: 'DELETE'
      })

      removeWebhooks([webhookId])
      return true
    } catch (error) {
      logger.error('Failed to delete webhook', error)
      return false
    }
  }

  async function registerWebhook(webhook: WebhookModel) {
    const webhookId = webhook.id

    try {
      const result = await $fetch<{ webhookId: number; status: WebhookStatus }>(
        `/api/webhooks/${webhookId}/register`,
        {
          method: 'POST'
        }
      )

      const updatedWebhook = webhooks.value.get(result.webhookId)

      if (updatedWebhook !== undefined) {
        updatedWebhook.status = result.status
      }
      return true
    } catch (error) {
      logger.error('Failed to register webhook', error)
      return false
    }
  }

  return {
    createWebhook,
    deleteWebhook,
    fetchInitialWebhooks,
    fetchWebhook,
    fetchWebhooks,
    registerWebhook,
    removeWebhooks,
    webhooks
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useWebhooksStore, import.meta.hot)
  )
}
