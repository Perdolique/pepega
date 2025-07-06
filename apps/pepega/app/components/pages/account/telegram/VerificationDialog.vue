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
        :disabled="isCodeSent"
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
  import { FetchError } from 'ofetch'
  import { getTelegramChannels } from '~/composables/queries/telegram/channels'
  import useToaster from '~/composables/use-toaster'
  import ModalDialog from '~/components/dialogs/ModalDialog.vue'
  import SimpleButton from '~/components/SimpleButton.vue'
  import TextInput from '~/components/TextInput.vue'

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
  const isVerificationSent = ref(false)
  const { refetch: refetchChannels } = useQuery(getTelegramChannels)
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

  async function onSendCodeClick() {
    isCodeSent.value = true

    try {
      await $fetch(`/api/telegram/channel/${channelId}/send-code`, {
        method: 'POST'
      })

      addToast({
        message: 'Verification code sent successfully! Please check your channel.',
        title: 'Code sent',
        duration: 5000
      })
    } catch (error) {
      let message = 'An error occurred while sending the code.'

      if (error instanceof FetchError) {
        message = error.data?.message ?? 'An error occurred while sending the code.'
      }

      addToast({
        message,
        title: 'Failed to send code',
        duration: 5000
      })
    }
  }

  async function onVerifyClick() {
    isVerificationSent.value = true

    try {
      await $fetch(`/api/telegram/channel/${channelId}/verify`, {
        method: 'POST',

        body: {
          code: code.value
        }
      })

      addToast({
        message: 'Channel verified successfully! 🎉',
        title: 'Verification complete',
        duration: 5000
      })

      // TODO: Refetch only relevant channel
      refetchChannels()

      isOpen.value = false
    } catch (error) {
      let message = 'Verification failed. Please check your code and try again.'

      if (error instanceof FetchError) {
        message = error.data?.message ?? 'Verification failed. Please check your code and try again.'
      }

      addToast({
        message,
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
