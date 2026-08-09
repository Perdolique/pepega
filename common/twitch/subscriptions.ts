import { ofetch } from 'ofetch';
import type { PaginatedResponse } from './models/general';
import type {
  EventSubscription,
  EventSubscriptionStatus,
  EventSubscriptionType,
} from './models/event-sub';

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
async function getSubscriptions({ token, clientId, filters = {} }: GetSubscriptionsParams) {
  return ofetch<PaginatedResponse<EventSubscription>>(
    'https://api.twitch.tv/helix/eventsub/subscriptions',
    {
      query: {
        ...filters,
      },

      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': clientId,
      },
    },
  );
}

async function deleteSubscription({ token, clientId, id }: DeleteSubscriptionParams) {
  return ofetch<unknown>('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'DELETE',

    query: {
      id,
    },

    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientId,
    },
  });
}

export { getSubscriptions, deleteSubscription };
