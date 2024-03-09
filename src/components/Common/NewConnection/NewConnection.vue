<template>
    <div class="w-6/12 p-4 bg-base rounded-lg m-auto">
        <div class="mt-5">
            <label class="block mb-2 text-sm font-medium text-white">Connection Type</label>
            <n-select
              size="small"
              v-model:value="componentState.selectedDB"
              filterable
              clearable
              :options="ConnectionService.dbList()"
              :render-option="NaiveUiService.renderOption"
              :placeholder="'Select DB'"
              @update:value="handleDBSelect"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';
    import { NSelect, SelectOption } from 'naive-ui';
    import { ConnectionService } from '../../../services/Common/connection-service';
    import { NaiveUiService } from '../../../services/Common/naive-ui-service';
    import { ComponentStateModel } from './Models/ViewModels';
  

    const componentState: ComponentStateModel = reactive({
        selectedDB: '',
        showMongoConnectionInterface: false,
        showDynamoConnectionInterface: false
    });
 
    const handleDBSelect = (value: string, option: SelectOption) => {
      console.log(componentState.selectedDB);
    }
</script>
