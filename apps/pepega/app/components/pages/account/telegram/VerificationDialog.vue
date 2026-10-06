<template>
  <ModalDialog
    v-model="isOpen"
    title="Verify Telegram Channel"
  >
    <div :class="$style.component">
      <div>
        1. To verify your channel, please add the bot <strong>{{ runtimeConfig.public.telegramBotName }}</strong> to your channel <a :href="chatUrl" target="_blank" rel="noopener noreferrer">@{{ chatId }}</a>.
      </div>

      <div>
        2. After adding the bot, click the button below to send a verification code to the bot.
      </div>

      <SimpleButton
        :disabled="isSendCodeDisabled"
        @click="onSendCodeClick"
      >
        Send code
      </SimpleButton>

      <div :class="$style.verificationControls">
        <TextInput
          :model-value="code"
          :disabled="isVerificationDisabled"
          @input="onCodeUpdate"
          ref="codeInput"
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="000000"
          name="verificationCode"
        />

        <SimpleButton
          :disabled="isVerifyButtonDisabled"
          @click="onVerifyClick"
        >
          Verify
        </SimpleButton>
      </div>
    </div>
  </ModalDialog>
</template>

<script lang="ts" setup>
  import { createLogger } from '@pepega/utils/logger'
  import { captureQueryUser, isCurrentQueryUser } from '~/utils/query-client'
  import { getTelegramVerificationFeedback } from '~/utils/telegram-verification-feedback'
  import { useUserStore } from '~/stores/user'
  import { telegramQueryKeys } from '~/composables/keys/telegram'
  import useToaster from '~/composables/use-toaster'
  import ModalDialog from '~/components/dialogs/ModalDialog.vue'
  import SimpleButton from '~/components/SimpleButton.vue'
  import TextInput from '~/components/TextInput.vue'
  import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
  import { useQueryClient } from '@tanstack/vue-query'
  import { $fetch, useRuntimeConfig } from '#imports'

  interface Props {
    channelId: number;
    chatId: string;
  }

  const { channelId, chatId } = defineProps<Props>();
  const code = ref('')
  const chatUrl = computed(() => `https://t.me/${chatId}`)
  const { addToast } = useToaster()
  const codeInput = useTemplateRef('codeInput')
  const isCodeSent = ref(false)
  const isSendingCode = ref(false)
  const isVerificationSent = ref(false)
  const logger = createLogger('PEPEGA')
  const queryClient = useQueryClient()
  const userStore = useUserStore()
  const runtimeConfig = useRuntimeConfig()

  const isOpen = defineModel<boolean>({
    required: true
  })

  const isVerificationDisabled = computed(
    () => isCodeSent.value === false || isVerificationSent.value
  )

  const isVerifyButtonDisabled = computed(
    () => isVerificationDisabled.value || code.value.length === 0
  )
  const isSendCodeDisabled = computed(() => isCodeSent.value || isSendingCode.value)

  async function onSendCodeClick() {
    const userContext = captureQueryUser(queryClient, userStore.userId)

    isSendingCode.value = true

    try {
      await $fetch(`/api/telegram/channel/${channelId}/send-code`, {
        method: 'POST'
      })
      const isCurrentSession = isCurrentQueryUser(queryClient, userContext, userStore.userId)

      if (!isCurrentSession) {
        return
      }

      isCodeSent.value = true

      addToast({
        message: 'Verification code sent successfully! Please check your channel.',
        title: 'Code sent',
        duration: 5000
      })
    } catch (error) {
      logger.error('Failed to send Telegram verification code', error)
      const isCurrentSession = isCurrentQueryUser(queryClient, userContext, userStore.userId)

      if (!isCurrentSession) {
        return
      }

      const feedback = getTelegramVerificationFeedback(error, 'send-code')

      addToast({
        message: feedback.message,
        title: 'Failed to send code',
        duration: 5000
      })
    } finally {
      isSendingCode.value = false
    }
  }

  async function onVerifyClick() {
    const userContext = captureQueryUser(queryClient, userStore.userId)

    isVerificationSent.value = true

    try {
      await $fetch(`/api/telegram/channel/${channelId}/verify`, {
        method: 'POST',

        body: {
          code: code.value
        }
      })
      const isCurrentSession = isCurrentQueryUser(queryClient, userContext, userStore.userId)

      if (!isCurrentSession) {
        return
      }

      addToast({
        message: 'Channel verified successfully! 🎉',
        title: 'Verification complete',
        duration: 5000
      })

      const queryKey = telegramQueryKeys.channels()

      void queryClient.invalidateQueries({ queryKey })

      isOpen.value = false
    } catch (error) {
      logger.error('Failed to verify Telegram channel', error)
      const isCurrentSession = isCurrentQueryUser(queryClient, userContext, userStore.userId)

      if (!isCurrentSession) {
        return
      }

      const feedback = getTelegramVerificationFeedback(error, 'verify')

      if (feedback.needsNewCode) {
        isCodeSent.value = false
      }

      addToast({
        message: feedback.message,
        title: 'Verification failed',
        duration: 5000
      })
    } finally {
      isVerificationSent.value = false
      code.value = ''
    }
  }

  function onCodeUpdate(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const value = event.target.value.replace(/\D/ug, '')

      event.target.value = value

      code.value = value
    }
  }

  watch(isCodeSent, (isSent) => {
    if (isSent) {
      nextTick(() => {
        codeInput.value?.focus()
      })
    }
  })

  // Reset dialog state when opened
  watch(isOpen, (isOpen) => {
    if (isOpen) {
      isCodeSent.value = false
      isVerificationSent.value = false
      code.value = ''
    }
  })
</script>

<style module>
  .component {
    display: grid;
    row-gap: var(--spacing-16);
  }

  .verificationControls {
    display: flex;
    gap: var(--spacing-8);
    align-items: center;
  }
</style>
