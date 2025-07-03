import { ofetch } from 'ofetch'
import type { PaginatedResponse } from './models/general';
import type { EventSubscription, EventSubscriptionStatus, EventSubscriptionType } from './models/event-sub';

interface GetSubscriptionsStatusFilters {
  status?: EventSubscriptionStatus[];
  type?: never;
}

interface GetSubscriptionsTypeFilters {
  type?: EventSubscriptionType[];
  status?: never;
}

// You cannot specify both type and status in the same request.
type GetSubscriptionsFilters = GetSubscriptionsStatusFilters | GetSubscriptionsTypeFilters;

interface GetSubscriptionsParams {
  token: string;
  clientId: string;
  filters?: GetSubscriptionsFilters;
}

interface DeleteSubscriptionParams {
  token: string;
  clientId: string;
  id: string;
}

/**
 * Fetch the list of subscriptions from the Twitch API.
 *
 * [Twitch API Reference](https://dev.twitch.tv/docs/eventsub/manage-subscriptions/#getting-the-list-of-events-you-subscribe-to)
 */
export async function getSubscriptions({ token, clientId, filters = {} } : GetSubscriptionsParams) {
  return await ofetch<PaginatedResponse<EventSubscription>>('https://api.twitch.tv/helix/eventsub/subscriptions', {
    params: {
      ...filters
    },

    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientId,
    }
  })
}

export async function deleteSubscription({ token, clientId, id } : DeleteSubscriptionParams) {
  return await ofetch<unknown>('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'DELETE',

    params: {
      id
    },

    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientId,
    }
  })
}
