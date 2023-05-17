<template>
  <div class="w-6/12 p-4 bg-base rounded-lg m-auto">
    <h5 class="text-xl font-medium text-white">New Connection</h5>
    <div class="mt-5">
        <label class="block mb-2 text-sm font-medium text-white">URL</label>
        <input type="text" class="text-xs rounded-lg block w-full p-2 bg-base border-base placeholder-gray-400 text-white" placeholder="mongodb://localhost:27017" v-model.trim="componentState.connectionUrl">
    </div>

    <div class="flex justify-end mt-3 gap-2">
      <button class="inline-flex bg-base text-[#ffffffde] rounded-lg py-[3px] px-6" @click="checkURL(ButtonActionType.ValidateAndShowMessage)" :disabled="componentState.testButtonLoading || componentState.connectButtonLoading">
        <svg v-if="componentState.testButtonLoading" class="animate-spin mt-1 -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Test
      </button>

      <button class="inline-flex bg-[#ffffffde] text-[#000000] rounded-lg py-[3px] px-6" @click="checkURL(ButtonActionType.ValidateAndRedirectToHomePage)" :disabled="componentState.testButtonLoading || componentState.connectButtonLoading">
        <svg v-if="componentState.connectButtonLoading" class="animate-spin mt-1 -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Connect
      </button>
    </div>

    <hr class="mt-8 mb-4 h-px bg-base border-0 dark:bg-gray-700">

    <label class="block mb-2 text-sm font-medium text-white">Save Connection</label>
    <div class="mt-2">
        <input type="text" v-model.trim="componentState.connectionName" class="text-[#ffffffde] text-sm rounded-lg w-full p-1 bg-base placeholder-gray-400" placeholder="Connection Name">
    </div>

    <div class="flex justify-end mt-3">
      <button class="bg-base text-[#ffffffde] rounded-lg py-[3px] px-6" type="button" @click="saveConnection">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { ButtonActionType, ComponentStateModel } from "./Models/ViewModels";
  import { useRouter } from 'vue-router';
  import { useNotification } from 'naive-ui';
  import { CommonConsts } from '../../utilities/common-consts';
  import { SqlLiteService } from '../../services/data/sqlLite-service';
  import { useConnectionEventsStore } from '../../stores/connection-events';
  import { MongoDbService } from '../../services/data/mongo-service';
  import { ErrorResult } from '../../types/OperationSummary/error-result';
 
  const router = useRouter();
  const notification = useNotification();
  const connectionEventsStore = useConnectionEventsStore();

  const componentState: ComponentStateModel = reactive({
    connectionName: '',
    connectionUrl: CommonConsts.defaultConnectionURl,
    testButtonLoading: false,
    connectButtonLoading: false
  });

  const checkURL = async (actionType: ButtonActionType) => {
    if (componentState.connectionUrl == null || componentState.connectionUrl === '') {
      notification.error({title: 'Connection URL is empty.'});

      return;
    }

    switch(actionType) {
      case ButtonActionType.ValidateAndShowMessage: {
        componentState.testButtonLoading = true;
        break;
      }

      case ButtonActionType.ValidateAndRedirectToHomePage: {
        componentState.connectButtonLoading = true;
        break;
      }

      default: {
        return;
      }
    }

    const connected = await MongoDbService.checkUrl(componentState.connectionUrl);

    if(connected) {
      switch(actionType) {
        case ButtonActionType.ValidateAndShowMessage: {
          notification.success({title: 'Connected successfully.'});
          componentState.testButtonLoading = false;
          break;
        }

        case ButtonActionType.ValidateAndRedirectToHomePage: {
          componentState.connectButtonLoading = false;
          connectionEventsStore.updateConnectedUrl(componentState.connectionUrl);
          router.push({path: '/dashboard'});
          break;
        }

        default: {
          return;
        }
      }
    }
    else {
      notification.error({title: "Couldn't connect to the URL."});

      componentState.testButtonLoading = false;
      componentState.connectButtonLoading = false;
    }
  }

  const saveConnection = async () => {
    if(componentState.connectionName != '' && componentState.connectionUrl != '') {

      let result = await SqlLiteService.saveConnectionInfo(componentState.connectionName, componentState.connectionUrl);

      if(typeof result === "string") {
        connectionEventsStore.updateConnectionSavedEvent(true);

        componentState.connectionName = '';
      }
      else {
        result = result as ErrorResult;

        notification.error({title: result.message});
      }

      return;
    }

    notification.error({ title: 'Connection name or URL is empty.' });
  }

  connectionEventsStore.$subscribe((mutation, state) => {
    if(state.selectedConnection?.url != '') {
      componentState.connectionUrl = state.selectedConnection?.url;
    }
  });
</script>
