import { useCollectionDocumentsStore } from "../stores/collection-documents";
import { useCollectionTabsStore } from "../stores/collection-tabs";
import { useDatabaseCollectionsStore } from "../stores/db-collections";
import { useDocumentFieldsStore } from "../stores/document-fields";
import { useDocumentsCountStore } from "../stores/documents-count";
import { useCRUDEventsStore } from "../stores/crud-events";
import { useRefreshEventsStore } from "../stores/refresh-events";

export class StoreService {
    static resetStores = () => {
        const tabsStore = useCollectionTabsStore();
        const documentsStore = useCollectionDocumentsStore();
        const collectionsStore = useDatabaseCollectionsStore();
        const fieldsStore = useDocumentFieldsStore();
        const countsStore = useDocumentsCountStore();
        const refreshEventsStore = useRefreshEventsStore();
        const crudEventsStore = useCRUDEventsStore();

        collectionsStore.$reset();
        documentsStore.$reset();
        fieldsStore.$reset();
        countsStore.$reset();
        tabsStore.$reset();
        refreshEventsStore.$reset();
        crudEventsStore.$reset();
    }
}