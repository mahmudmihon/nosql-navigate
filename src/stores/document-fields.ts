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
    upsertDocumentFields(fields: DocumentFields) {
      var existingFields = this.$state.fieldsList.filter(x => x.documentOf == fields.documentOf)[0];

      if(existingFields != null) {
        const existingFieldsIndex = this.$state.fieldsList.indexOf(existingFields);

        this.$state.fieldsList[existingFieldsIndex].documentFields = fields.documentFields;
      }
      else {
        this.$state.fieldsList.push(fields);
      }     
    }
  }
})
