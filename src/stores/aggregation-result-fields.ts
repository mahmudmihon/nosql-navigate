import { defineStore } from 'pinia';
import { AggregationResultFields } from '../types/AggregationBuilder/aggregation-result';

interface AggregationResultFieldsState {
    fieldsData: AggregationResultFields[];
}

export const useAggregationResultFieldsStore = defineStore('result-fields', {
    state: (): AggregationResultFieldsState => {
        return {
            fieldsData: []
        }
    },
    actions: {
        upsertFields(fieldsData: AggregationResultFields) {
            const fieldsToUpdate = this.$state.fieldsData.filter(x => x.storeId == fieldsData.storeId)[0];
            
            if(fieldsToUpdate != null) {
                const existingFieldsIndex = this.$state.fieldsData.indexOf(fieldsToUpdate);
    
                this.$state.fieldsData[existingFieldsIndex].fields = fieldsData.fields;
            }
            else {
                this.$state.fieldsData.push(fieldsData);
            }  
        }
    }
})
