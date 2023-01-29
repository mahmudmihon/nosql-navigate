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
    addNewCount(newCount: DocumentsCount) {
      this.$state.countsList.push(newCount);
    }
  }
})