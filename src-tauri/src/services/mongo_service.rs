use mongodb::{options::FindOptions, Client};
use mongodb::bson::{doc, Document};
use mongodb_cursor_pagination::{CursorDirections, FindResult, PaginatedCursor};
use crate::models::dtos::DbWithCollections;
use crate::models::errors::CustomError;

static mut CONNECTED_CLIENT: Option<Client> = None;

pub async fn validate_url(url: &str) -> bool {

    let client = Client::with_uri_str(url).await;

    if client.is_err() {
        return false;
    };

    match client {
        Ok(m_client) => {
            let ping_result = m_client.database("admin").run_command(doc! {"ping": 1}, None).await;

            match ping_result {
                Ok(_r) => {
                    unsafe {
                        CONNECTED_CLIENT = Some(m_client);
                    }

                    return true;
                },
                Err(_e) => return false
            }
        },
        Err(_f) => return false,
    };
}

pub async fn get_dbs_with_collections() -> Result<Vec<DbWithCollections>, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let mut dbs_with_their_collections: Vec<DbWithCollections> = Vec::new();

                for db_name in client.list_database_names(None, None).await? {
                    let mut db_data: DbWithCollections = DbWithCollections::new();
                    db_data.db_name = db_name;

                    for collection_name in client.database(&db_data.db_name).list_collection_names(None).await? {
                        db_data.db_collections.push(collection_name);
                    }

                    dbs_with_their_collections.push(db_data);
                }

                return Ok(dbs_with_their_collections);
            },
            None => { return Err(CustomError::ClientNotFound) }
        }
    }
}

pub async fn get_dbs_stats() -> Result<Vec<Document>, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let mut dbs_stats: Vec<Document> = Vec::new();

                for db_name in client.list_database_names(None, None).await? {
                    let stats = client.database(&db_name).run_command(doc! { "dbStats": 1, "scale": 1024*1024*1024 }, None).await?;

                    dbs_stats.push(stats);
                }

                return Ok(dbs_stats);
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub fn test_pagination(db_name: &str, collection_name: &str) -> () {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);
                let mut options = create_options(2, 0);

                let mut find_results: FindResult<Document> = PaginatedCursor::new(Some(options), None, None)
                    .find(&db.collection(collection_name), None)
                    .expect("Unable to find data");

                println!("First page: {:?}", find_results);
            },
            None => { }
        }
    }
}