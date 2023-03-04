import { defineStore } from 'pinia';
import { AggregationResult } from '../types/AggregationBuilder/aggregation-result';

interface AggregationResultState {
    aggregationResult: AggregationResult[];
}

export const useAggregationResultStore = defineStore('aggregation-result', {
    state: (): AggregationResultState => {
        return {
            aggregationResult: []
        }
    },
    actions: {
        upsertResult(aggregationResult: AggregationResult) {
            const dataToUpdate = this.$state.aggregationResult.filter(x => x.storeId == aggregationResult.storeId)[0];
            
            if(dataToUpdate != null) {
                const existingDataIndex = this.$state.aggregationResult.indexOf(dataToUpdate);
    
                this.$state.aggregationResult[existingDataIndex] = {...aggregationResult};
            }
            else {
                this.$state.aggregationResult.push(aggregationResult);
            }  
        }
    }
})
