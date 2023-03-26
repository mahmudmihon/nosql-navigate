<template>
    <n-tabs
        v-model:value="valueRef"
        type="card"
        closable
        tab-style="min-width: 100px; color: white; background-color: #ffffff0a"
        @close="handleClose"
        trigger="click"
    >
        <n-tab-pane
            v-for="tab in tabList"
            :key="tab.id"
            :tab="tab.collectionName"
            :name="tab.id"
        >
            <DocumentOperations
                :key="tab.id"
                :db-name="tab.dbName"
                :collection-name="tab.collectionName"
                :tab-store-key="tab.id"
            />
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
    import { useCollectionTabsStore } from '../../stores/collection-tabs';
    import { CollectionTab } from '../../types/CollectionTabs/collection-tabs';
    import { NTabs, NTabPane } from 'naive-ui';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';   
    import { useTabDataStore } from '../../stores/tab-data';
    import DocumentOperations from '../DocumentOperations/DocumentOperations.vue';

    const tabsStore = useCollectionTabsStore();
    const tabsDataStore = useTabDataStore();
    const router = useRouter();

    let tabList: CollectionTab[] = tabsStore.tabList;

    const valueRef = ref<string>(tabList[0].id);

    tabsStore.$subscribe((mutation, state) => {
        tabList = state.tabList;
        let lastTab = [...tabList].pop();
        valueRef.value = lastTab?.id ?? "";
    });

    function handleClose (closedTab: string) {
        
        if(tabsDataStore.tabsData.some(x => x.storeKey == closedTab)) {
            tabsDataStore.removeData(closedTab);
        }

        const index = tabList.findIndex(tab => tab.id == closedTab);

        tabList.splice(index, 1);

        if(tabList.length == 0) {
            router.push({path: '/dashboard'});
        }
    }
</script>