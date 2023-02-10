import { defineStore } from 'pinia';

interface ImportExportEventsState {
    documentsImported: boolean;
}

export const useImportExportEventsStore = defineStore('import-export-events', {
  state: (): ImportExportEventsState => {
    return {
      documentsImported: false
    }
  },
  actions: {
    updateDocumentsImported(value: boolean) {
      this.$state.documentsImported = value;
    }
  }
})