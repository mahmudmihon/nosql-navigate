import { defineStore } from 'pinia';
import { TabData } from '../types/TabData/tab-data';

interface TabDataState {
    tabsData: TabData[];
}

export const useTabDataStore = defineStore('tab-data', {
    state: (): TabDataState => {
        return {
            tabsData: []
        }
    },
    actions: {
        upsertData(tabData: TabData) {
            const dataToUpdate = this.$state.tabsData.filter(x => x.storeKey == tabData.storeKey)[0];
            
            if(dataToUpdate != null) {
                const existingDataIndex = this.$state.tabsData.indexOf(dataToUpdate);
    
                this.$state.tabsData.splice(existingDataIndex, 1, tabData);          
            }
            else {
                this.$state.tabsData.push(tabData);
            }  
        },
        removeData(storeKey: string){
            const dataToDelete = this.$state.tabsData.filter(x => x.storeKey == storeKey)[0];
            
            if(dataToDelete != null) {
                const existingDataIndex = this.$state.tabsData.indexOf(dataToDelete);
    
                this.$state.tabsData.splice(existingDataIndex, 1);          
            }
        }
    }
})
