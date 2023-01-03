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