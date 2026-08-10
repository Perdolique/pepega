<template>
  <UiDialog
    v-model="isOpen"
    title="Verify Telegram channel"
    :description="`Connect @${chatId} to Pepega in two steps.`"
  >
    <div :class="$style.component">
      <ol :class="$style.steps">
        <li>
          <span>1</span>
          <div>
            Add <strong>{{ runtimeConfig.public.telegramBotName }}</strong> to
            <a
              :href="chatUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{{ chatId }}
            </a>.
          </div>
        </li>
        <li>
          <span>2</span>
          <div>Send a code, then enter the six digits below.</div>
        </li>
      </ol>

      <UiButton
        variant="secondary"
        :disabled="isSendingCode"
        @click="sendCode"
      >
        {{ sendCodeLabel }}
      </UiButton>

      <UiField
        label="Verification code"
        for-id="verification-code"
        helper="Six digits from the Telegram message."
        :error="error"
      >
        <UiTextInput
          id="verification-code"
          v-model="code"
          inputmode="numeric"
          pattern="[0-9]{6}"
          maxlength="6"
          autocomplete="one-time-code"
          :disabled="isCodeInputDisabled"
          @input="normalizeCode"
        />
      </UiField>

      <UiButton
        :disabled="isVerifyDisabled"
        @click="verifyChannel"
      >
        {{ isVerifying ? 'Verifying…' : 'Verify channel' }}
      </UiButton>
    </div>
  </UiDialog>
</template>
<script setup lang="ts">
  import { getTelegramChannels } from '~/composables/queries/telegram/channels'
  import useToaster from '~/composables/use-toaster'
  import UiButton from '~/components/ui/UiButton.vue'
  import UiDialog from '~/components/ui/UiDialog.vue'
  import UiField from '~/components/ui/UiField.vue'
  import UiTextInput from '~/components/ui/UiTextInput.vue'
  import { useQuery } from '@pinia/colada'
  import { FetchError } from 'ofetch'
  import { computed, ref, watch } from 'vue'
  import { $fetch, useRuntimeConfig } from '#imports'

  interface Props {
    channelId: number;
    chatId: string;
  }

  const { channelId, chatId } = defineProps<Props>()
  const isOpen = defineModel<boolean>({ required: true })
  const code = ref('')
  const codeWasSent = ref(false)
  const isSendingCode = ref(false)
  const isVerifying = ref(false)
  const error = ref('')
  const runtimeConfig = useRuntimeConfig()
  const { refetch } = useQuery(getTelegramChannels)
  const { addToast } = useToaster()
  const chatUrl = computed(() => `https://t.me/${chatId}`)
  const sendCodeLabel = computed(() => {
    if (isSendingCode.value) {
      return 'Sending…'
    }

    return codeWasSent.value ? 'Send another code' : 'Send code'
  })
  const isCodeInputDisabled = computed(
    () => codeWasSent.value === false || isVerifying.value
  )
  const isVerifyDisabled = computed(
    () => codeWasSent.value === false
      || code.value.length !== 6
      || isVerifying.value
  )

  function getMessage(fetchError: unknown, fallback: string) {
    if (fetchError instanceof FetchError && typeof fetchError.data?.message === 'string') {
      return fetchError.data.message
    }

    return fallback
  }

  function normalizeCode(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) {
      return
    }

    const numericCode = event.target.value.replace(/\D/gu, '').slice(0, 6)

    code.value = numericCode
    event.target.value = numericCode
  }

  async function sendCode() {
    isSendingCode.value = true
    error.value = ''

    try {
      await $fetch(`/api/telegram/channel/${channelId}/send-code`, {
        method: 'POST'
      })

      codeWasSent.value = true
      addToast({
        title: 'Code sent',
        message: 'Check the Telegram channel for the six-digit code.',
        tone: 'success'
      })
    } catch (fetchError) {
      console.error('Failed to send Telegram verification code', fetchError)
      error.value = getMessage(
        fetchError,
        'The code could not be sent. Check the bot and try again.'
      )
    } finally {
      isSendingCode.value = false
    }
  }

  async function verifyChannel() {
    isVerifying.value = true
    error.value = ''

    try {
      await $fetch(`/api/telegram/channel/${channelId}/verify`, {
        method: 'POST',
        body: { code: code.value }
      })

      await refetch()
      addToast({
        title: 'Channel verified',
        message: `@${chatId} is ready for Telegram integrations.`,
        tone: 'success'
      })
      isOpen.value = false
    } catch (fetchError) {
      console.error('Failed to verify Telegram channel', fetchError)
      error.value = getMessage(
        fetchError,
        'That code was not accepted. Check it and try again.'
      )
    } finally {
      isVerifying.value = false
    }
  }

  watch(isOpen, (open) => {
    if (open) {
      code.value = ''
      codeWasSent.value = false
      error.value = ''
    }
  })
</script>
<style module>
  .component {
    display: grid;
    gap: var(--space-lg);
  }

  .component > button {
    justify-self: start;
  }

  .steps {
    display: grid;
    gap: var(--space-md);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .steps li {
    display: grid;
    grid-template-columns: 2rem 1fr;
    align-items: start;
    gap: var(--space-sm);
  }

  .steps li > span {
    inline-size: 2rem;
    block-size: 2rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--color-sun);
    color: var(--color-on-sun);
    font-family: var(--font-display);
    font-weight: 800;
  }
</style>
