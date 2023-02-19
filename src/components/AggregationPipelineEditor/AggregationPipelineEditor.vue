<template>
    <div class="flex flex-col flex-nowrap mt-3">
        <div class="flex flex-row">
            <div class="w-12">
                <div class="flex flex-col">
                    <span class="hover:cursor-pointer">
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V10.8125V8.625M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 12L8 14L10 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 12L16 14L14 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>

                    <span class="mt-5 hover:cursor-pointer">
                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 7.5C2 6.71403 2.16486 5.96657 2.46189 5.29031L5.01041 7.83883C5.79146 8.61988 7.05779 8.61988 7.83884 7.83883C8.61989 7.05779 8.61989 5.79146 7.83884 5.01041L5.29032 2.46189C5.96658 2.16486 6.71404 2 7.5 2C10.5376 2 13 4.46243 13 7.5C13 8.28596 12.8351 9.03342 12.5381 9.70968L21.435 18.6066C22.2161 19.3877 22.2161 20.654 21.435 21.435V21.435C20.654 22.2161 19.3877 22.2161 18.6066 21.435L9.70968 12.5381C9.03342 12.8351 8.28597 13 7.5 13C4.46243 13 2 10.5376 2 7.5Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            </div>

            <div class="w-full">
                <div v-if="rawQuery" class="flex flex-col gap-2 h-64 overflow-y-auto">
                    <div class="w-full overflow-y-auto">
                        <vue-jsoneditor
                            mode="text"
                            v-model:text="rawQuery"
                            :mainMenuBar="false"
                            :navigationBar="false"
                            :statusBar="false"
                            :darkTheme="true"
                            :height="900"
                        />
                    </div>
                </div>
            </div>

            <div class="flex justify-center w-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-blue-400 ml-1 hover:cursor-pointer" @click="">
                    <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
                    <path fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { NSwitch } from 'naive-ui';
    import VueJsoneditor from 'vue3-ts-jsoneditor';

    const props = defineProps<{
        dbName: string
        collectionName: string
        documentsCount: number
    }>();

    let rawQuery = ref<boolean>(true);
</script>