export interface DbsNavigationViewModel {
    db_name: string,
    db_collections: string[]
}

export interface CollectionAddModel {
    dbName: string;
    collectionName: string;
}

export interface ComponentStateModel {
    searchQuery: string;
    deleteEntityName: string;
    dataLoading: boolean;
    showCollectionAddModal: boolean;
    showDeleteConfirmationModal: boolean;
    creatingCollection: boolean;
    deletingEntity: boolean;
    addNewDb: boolean;
    collectionAddModel: CollectionAddModel;
    dbsWithCollections: DbsNavigationViewModel[];
}