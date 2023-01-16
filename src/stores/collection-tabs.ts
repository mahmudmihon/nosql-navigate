import { defineStore } from 'pinia';
import { CollectionTab } from '../types/CollectionTabs/collection-tabs';


interface CollectionTabsState {
    tabList: CollectionTab[]
}

export const useCollectionTabsStore = defineStore('collection-tabs', {
    state: (): CollectionTabsState => {
        return {
            tabList: []
        }
    },
    actions: {
        addNewTab(newTab: CollectionTab) {
            this.$state.tabList.forEach(tab => tab.isActive = false);
            this.$state.tabList.push(newTab);
        }
    }
})
