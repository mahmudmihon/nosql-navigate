<template>
  <div class="w-6/12 p-4 bg-base rounded-lg m-auto">
    <h5 class="text-xl font-medium text-gray-900 dark:text-white">New Connection</h5>
    <div class="mt-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL</label>
        <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="mongodb://localhost:27017" v-model.trim="connectionUrl">
    </div>

    <div class="flex justify-end mt-3 gap-2">
      <button class="inline-flex bg-base text-[#ffffffde] rounded-lg py-[3px] px-6" @click="checkURL(ButtonActionType.ValidateAndShowMessage)" :disabled="testButtonLoading || connectButtonLoading">
        <svg v-if="testButtonLoading" class="animate-spin mt-1 -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Test
      </button>

      <button class="inline-flex bg-[#ffffffde] text-[#000000] rounded-lg py-[3px] px-6" @click="checkURL(ButtonActionType.ValidateAndRedirectToHomePage)" :disabled="testButtonLoading || connectButtonLoading">
        <svg v-if="connectButtonLoading" class="animate-spin mt-1 -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Connect
      </button>
    </div>

    <hr class="mt-8 mb-4 h-px bg-base border-0 dark:bg-gray-700">

    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Save Connection</label>
    <div class="mt-2">
        <input type="text" class="border-gray-300 text-[#ffffffde] text-sm rounded-lg w-full p-1 dark:bg-base dark:placeholder-gray-400" placeholder="Connection Name" required>
    </div>

    <div class="flex justify-end mt-3">
      <button class="bg-base text-[#ffffffde] rounded-lg py-[3px] px-6" type="button" @click.prevent="">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { invoke } from '@tauri-apps/api/tauri';
  import { useToast } from "primevue/usetoast";
  import { ButtonActionType } from "./models/ViewModels";
  import { useRouter, useRoute } from 'vue-router';

  const connectionUrl = ref('mongodb://localhost:27017');
  const toast = useToast();
  const router = useRouter();
  let testButtonLoading = ref(false);
  let connectButtonLoading = ref(false);

  const checkURL = (actionType: ButtonActionType) => {
    if (connectionUrl.value == null || connectionUrl.value === '') {
      toast.add({severity: 'error', summary: 'Connection URL is Empty.', life: 3000});

      return;
    }

    switch(actionType) {
      case ButtonActionType.ValidateAndShowMessage: {
        testButtonLoading.value = true;
        break;
      }

      case ButtonActionType.ValidateAndRedirectToHomePage: {
        connectButtonLoading.value = true;
        break;
      }

      default: {
        return;
      }
    }

    invoke('check_mongo_url', { url: connectionUrl.value }).then(value => {
      if(value) {
        switch(actionType) {
          case ButtonActionType.ValidateAndShowMessage: {
            toast.add({severity: 'success', summary: 'Connection successful.', life: 3000});
            testButtonLoading.value = false;
            break;
          }

          case ButtonActionType.ValidateAndRedirectToHomePage: {
            connectButtonLoading.value = false;
            router.push({path: '/dashboard'});
            break;
          }

          default: {
            return;
          }
        }        
      }
      else {
        toast.add({severity: 'error', summary: "Couldn't be connected.", life: 3000});

        testButtonLoading.value = false;
        connectButtonLoading.value = false;
      }      
    });
  }
</script>
