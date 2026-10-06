import type { QueryKey } from '@tanstack/vue-query'
import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

interface QueryFeedbackOptions {
  error: Ref<Error | null>;
  isFetching: Ref<boolean>;
  queryKey: MaybeRefOrGetter<QueryKey>;
}

// Keep the recovery action visible while a failed query is retried.
export function useQueryFeedback({ error, isFetching, queryKey }: QueryFeedbackOptions) {
  const hasError = ref(error.value !== null)

  watch([error, isFetching], ([currentError, fetching]) => {
    if (currentError !== null) {
      hasError.value = true
    } else if (!fetching) {
      hasError.value = false
    }
  })

  watch(() => toValue(queryKey), () => {
    hasError.value = false
  })

  return { hasError }
}
