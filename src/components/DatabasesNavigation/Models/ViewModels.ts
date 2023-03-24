export interface DbsNavigationViewModel {
    db_name: string,
    db_collections: string[]
}

export interface ComponentDataModel {
    dbsWithCollections: DbsNavigationViewModel[];
}