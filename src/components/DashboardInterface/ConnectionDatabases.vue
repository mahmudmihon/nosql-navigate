<template>
  <div class="flex flex-col bg-base p-3 h-screen w-80">
    <GenericSkeletonVue v-if="dataLoading" />

    <p class="bg-base text-ellipsis text-sm rounded-lg pl-3 pt-3 pb-3">mongodb://localhost:27027</p>

    <div class="flex mt-3 align-middle justify-center gap-2">
      <span class="bg-base p-2.5 rounded-full" v-tooltip.bottom="'Add Database'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      </span>
      <span class="bg-base p-2.5 rounded-full" v-tooltip.bottom="'Export All Databases'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </span>
      <span class="bg-base p-2.5 rounded-full" v-tooltip.bottom="'Disconnect'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
        </svg>
      </span>
    </div>

    <div class="inline-flex flex-col justify-center relative text-white mt-6">
        <div class="relative">
            <input type="text" class="p-1 pl-8 rounded-lg border border-gray-200 bg-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:bg-base focus:border-transparent" placeholder="search..." />
            <svg class="w-4 h-4 absolute left-2.5 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { invoke } from '@tauri-apps/api';
  import GenericSkeletonVue from '../Common/GenericSkeleton.vue';

  let dataLoading = ref(true);

  invoke('get_dbs_with_collections').then(value => {
    if(value !== 'error') {
      dataLoading.value = false;
    }    
  });
</script>
