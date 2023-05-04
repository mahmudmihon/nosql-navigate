import { defineStore } from 'pinia';

interface CRUDEventsState {
    documentsImported: boolean;
    updateDocumentList: boolean;
}

export const useCRUDEventsStore = defineStore('crud-events', {
  state: (): CRUDEventsState => {
    return {
      documentsImported: false,
      updateDocumentList: false
    }
  },
  actions: {
    updateDocumentsImported(value: boolean) {
      this.$state.documentsImported = value;
    },
    updateDocumentList(value: boolean) {
      this.$state.updateDocumentList = value;
    }
  }
})