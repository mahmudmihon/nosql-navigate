import { ImportExportSummary } from './../types/OperationSummary/import-export-summary';
import { defineStore } from 'pinia';

interface OperationSummaryState {
    importExportSummary: ImportExportSummary[];
}

export const useOperationSummaryStore = defineStore('operation-summary', {
    state: (): OperationSummaryState => {
        return {
            importExportSummary: []
        }
    },
    actions: {
        upsertImportExportSummary(summary: ImportExportSummary) {
            const dataToUpdate = this.$state.importExportSummary.filter(x => x.id == summary.id && x.documentType == summary.documentType && x.operationType == summary.operationType)[0];
            
            if(dataToUpdate != null) {
                const existingDataIndex = this.$state.importExportSummary.indexOf(dataToUpdate);
    
                this.$state.importExportSummary.splice(existingDataIndex, 1, summary);          
            }
            else {
                this.$state.importExportSummary.push(summary);
            }  
        }
    }
})