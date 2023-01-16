import { defineStore } from 'pinia';
import { DocumentFields } from '../types/DocumentFields/document-fields';

interface DocumentFieldsState {
  fieldsList: DocumentFields[];
}

export const useDocumentFieldsStore = defineStore('document-fields', {
  state: (): DocumentFieldsState => {
    return {
      fieldsList: []
    }
  },
  actions: {
    addNewFields(newFields: DocumentFields) {
      this.$state.fieldsList.push(newFields);
    }
  }
})
