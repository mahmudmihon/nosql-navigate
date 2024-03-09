import { CollectionDocuments } from "../../../types/CollectionDocuments/collection-documents";

export interface ComponentStateModel {
    fullPageLoading: boolean;
    searchedDataLoading: boolean;
    showSearchedData: boolean;
    showDocInsertModal: boolean;
    docToInsert: string;
    searchedData: object[];
    collectionDocuments: CollectionDocuments[];
}