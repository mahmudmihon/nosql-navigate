import { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { AdvanceFiltering } from "../../../types/DocumentFilter&Pagination/advance-filtering";
import { SimpleFilter } from "../../../types/DocumentFilter&Pagination/simple-filter";

export interface ComponentStateModel {
    documentsCount: number;
    advanceFiltering: AdvanceFiltering;
    simpleFiltering: boolean;
    pageNumber: number;
    totalPage: number;
    searchInitiated: boolean;
    runningOperation: boolean;
    runningOperationText: string;
    documentFields: SelectMixedOption[];
    rawQuery: string;
    multipleFilters: SimpleFilter[];
}