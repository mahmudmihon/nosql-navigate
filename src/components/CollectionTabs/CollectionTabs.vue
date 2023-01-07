<template>
    <n-tabs
        type="card"
        closable
        tab-style="min-width: 100px; color: white; background-color: #ffffff0a; border: none"
        @close="handleClose"
    >
        <n-tab-pane
        v-for="tab in tabList"
        :key="tab.id"
        :tab="tab.collectionName"
        :name="tab.id"
        >
            {{ tab.collectionName }}
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
    import { useCollectionTabsStore } from '../../stores/collection-tabs';
    import { CollectionTab } from '../../types/collection-tabs/CollectionTab';
    import { NTabs, NTabPane } from 'naive-ui';
    import { useRouter } from 'vue-router';

    const tabsStore = useCollectionTabsStore();
    const router = useRouter();

    let tabList: CollectionTab[] = tabsStore.tabList;

    tabsStore.$subscribe((mutation, state) => {
        tabList = state.tabList;
    });
    
    function handleClose (closedTab: string) {
        const index = tabList.findIndex(tab => tab.id == closedTab);
        tabList.splice(index, 1);

        if(tabList.length == 0) {
            router.push({path: '/dashboard'});
        }
    }
</script>