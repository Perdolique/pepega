import { FetchError } from 'ofetch'

interface SubscribeWebhookParams {
  broadcasterUserId: string;
  callbackUrl: string;
  secret: string;
  appAccessToken: string;
  clientId: string;
}

interface SubscribeWebhookRequestBody {
  type: 'stream.online';
  version: '1';

  condition: {
    broadcaster_user_id: string;
  };

  transport: {
    method: 'webhook';
    callback: string;
    secret: string;
  };
}

type RegistrationStatus = 'webhook_callback_verification_pending';

interface SubscribeWebhookResponseData {
  cost: number;
  created_at: string;
  id: string;
  status: RegistrationStatus;
  type: 'stream.online';
  version: '1';

  condition: {
    broadcaster_user_id: string;
  };

  transport: {
    callback: string;
    method: 'webhook';
  };
}

interface SubscribeWebhookResponse {
  data: SubscribeWebhookResponseData[];
  total: number;
  total_cost: number;
  max_total_cost: number;
}

/**
 * Subscribe to the `stream.online` event.
 *
 * * [Creating subscriptions reference](https://dev.twitch.tv/docs/api/reference/#create-eventsub-subscription)
 * * [`stream.online` subscription type](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#streamonline)
 */
export async function subscribeWebhook(params: SubscribeWebhookParams) {
  const { broadcasterUserId, callbackUrl, secret } = params

  try {
    const response = await $fetch<SubscribeWebhookResponse>('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${params.appAccessToken}`,
        'Client-ID': params.clientId
      },

      body: {
        type: 'stream.online',
        version: '1',

        condition: {
          broadcaster_user_id: broadcasterUserId
        },

        transport: {
          method: 'webhook',
          callback: callbackUrl,
          secret
        }
      } satisfies SubscribeWebhookRequestBody
    })

    return { data: response }
  } catch (error) {
    console.error('Failed to create EventSub subscription', error)

    if (error instanceof FetchError) {
      return { error }
    }

    // TODO: Handle error
    throw new Error('Failed to create EventSub subscription')
  }
}
