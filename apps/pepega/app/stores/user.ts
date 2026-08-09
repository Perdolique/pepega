import { computed, ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { $fetch } from 'ofetch';
import { useFetch } from '#imports';
import type { UserModel } from '~~/shared/models/user';

export const useUserStore = defineStore('user', () => {
  const hasData = ref(false);
  const userId = ref<string | null>(null);
  const isAdmin = ref(false);
  const isStreamer = ref(false);
  const isAuthenticated = computed(() => userId.value !== null);

  function updateUser(user: UserModel) {
    userId.value = user.id;
    isAdmin.value = user.isAdmin;
    isStreamer.value = user.isStreamer;
  }

  async function fetchUser() {
    const { data } = await useFetch('/api/user');

    if (data.value?.id !== undefined) {
      updateUser(data.value);
    }

    hasData.value = true;
  }

  async function logout() {
    await $fetch('/api/user/logout', {
      method: 'POST',
    });

    updateUser({
      id: null,
      isAdmin: false,
      isStreamer: false,
    });
  }

  async function setStreamer(newValue: boolean) {
    try {
      const response = await $fetch<UserModel>(`/api/user/${userId.value}/streamer`, {
        method: 'PATCH',

        body: {
          isStreamer: newValue,
        },
      });

      updateUser(response);
    } catch {
      // TODO: Handle error
    }
  }

  return {
    fetchUser,
    hasData,
    isAdmin,
    isAuthenticated,
    isStreamer,
    logout,
    setStreamer,
    updateUser,
    userId,
  };
});

const userHot = import.meta.hot;

if (userHot) {
  userHot.accept(acceptHMRUpdate(useUserStore, userHot));
}
