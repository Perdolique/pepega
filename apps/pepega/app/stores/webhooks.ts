import type { EventSubSubscriptionType } from '~~/shared/models/twitch'
import { type WebhookModel, type WebhookStatus } from '~~/shared/models/webhooks'
import { isNotNull } from '~~/shared/utils/types'

interface Webhook {
  id: number;
  status: string;
  type: string;
  createdAt: string;
}

function transformWebhookType(status: string) : EventSubSubscriptionType | null {
  switch (status) {
    case 'stream.online': {
      return status
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

  async function fetchWebhooks() {
    const { data } = await useFetch('/api/webhooks', {
      transform: transformWebhooks
    })

    if (data.value !== undefined) {
      for (const webhook of data.value) {
        webhooks.value.set(webhook.id, webhook)
      }
    }
  }

  async function createWebhook(type: EventSubSubscriptionType) {
    try {
      const result = await $fetch('/api/webhooks', {
        method: 'POST',

        body: {
          type
        }
      })

      const webhook = transformWebhook(result)

      if (webhook !== null) {
        webhooks.value.set(webhook.id, webhook)
      }
    } catch (error) {
      // TODO: Handle error properly
      console.error('Failed to create webhook', error)
    }
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

      webhooks.value.delete(webhookId)
    } catch (error) {
      // TODO: Handle error properly
      console.error('Failed to delete webhook', error)
    }
  }

  async function registerWebhook(webhook: WebhookModel) {
    const webhookId = webhook.id

    try {
      const result = await $fetch(`/api/webhooks/${webhookId}/register`, {
        method: 'POST'
      })

      const updatedWebhook = webhooks.value.get(result.webhookId)

      if (updatedWebhook !== undefined) {
        updatedWebhook.status = result.status
      }
    } catch (error) {
      // TODO: Handle error properly
      console.error('Failed to register webhook', error)
    }
  }

  return {
    createWebhook,
    deleteWebhook,
    fetchWebhooks,
    registerWebhook,
    webhooks
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useWebhooksStore, import.meta.hot)
  )
}
