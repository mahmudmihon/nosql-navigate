import { defineStore } from 'pinia';

interface RefreshEventsState {
    refreshDbSummary: boolean;
}

export const useRefreshEventsStore = defineStore('refresh-events', {
  state: (): RefreshEventsState => {
    return {
        refreshDbSummary: false
    }
  },
  actions: {
    updateRefreshDbSummary(value: boolean) {
      this.$state.refreshDbSummary = value;
    }
  }
})