import { defineStore } from 'pinia';

interface RefreshEventsState {
    refreshDbSummary: boolean;
    refreshOperationSummary: boolean;
}

export const useRefreshEventsStore = defineStore('refresh-events', {
  state: (): RefreshEventsState => {
    return {
        refreshDbSummary: false,
        refreshOperationSummary: false
    }
  },
  actions: {
    updateRefreshDbSummary(value: boolean) {
      this.$state.refreshDbSummary = value;
    },
    updateRefreshOperationSummary(value: boolean) {
      this.$state.refreshOperationSummary = value;
    }
  }
})