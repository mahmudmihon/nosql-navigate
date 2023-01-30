import { defineStore } from 'pinia';
import { DocumentsCount } from '../types/DocumentsCount/documents-count';

interface DocumentsCountState {
  countsList: DocumentsCount[];
}

export const useDocumentsCountStore = defineStore('documents-count', {
  state: (): DocumentsCountState => {
    return {
        countsList: []
    }
  },
  actions: {
    upsertCount(count: DocumentsCount) {
      const existingData = this.$state.countsList.filter(x => x.documentsOf == count.documentsOf)[0];

      if(existingData != null) {
        existingData.documentsCount = count.documentsCount;
        this.$state.countsList = [...this.$state.countsList, existingData];
      }
      else {
        this.$state.countsList.push(count);
      }
    }
  }
})