use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DbWithCollections {
    pub db_name: String,
    pub db_collections: Vec<String>
}

impl DbWithCollections {
    pub fn new() -> DbWithCollections {
        DbWithCollections { db_name: String::new(), db_collections: Vec::new() }
    }
}

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct ImportExportSummary {
    pub id: String,
    pub db_name: String,
    pub collection_name: String,
    pub path: String,
    pub operation_type: String,
    pub operation_status: String,
    pub documents_count: u64,
    pub created_on: String
}

impl ImportExportSummary {
    pub fn new() -> ImportExportSummary {
        ImportExportSummary {
            id: String::new(),  
            db_name: String::new(), 
            collection_name: String::new(),
            path: String::new(),
            operation_type: String::new(),
            operation_status: String::new(),
            documents_count: 0,
            created_on: String::new()    
        }
    }
}