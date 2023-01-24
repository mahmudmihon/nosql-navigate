use mongodb::{options::FindOptions, Client};
use mongodb::bson::{doc, Document};
use serde_json::{Map, Value};
use std::convert::TryFrom;
use crate::models::dtos::DbWithCollections;
use crate::models::errors::CustomError;
use futures::stream::{StreamExt};

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

pub async fn get_collection_documents(db_name: &str, collection_name: &str, filters: &str, limit: i64, skip: u64) -> Result<Vec<Document>, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                let options = create_options(limit, skip);

                let filters_mapping: Map<String, Value> = serde_json::from_str(filters)?;
                
                let filters_doc = Document::try_from(filters_mapping)?;

                let mut cursor = db.collection(collection_name).find(filters_doc, options).await?;

                let mut collection_docs: Vec<Document> = Vec::new();

                while let Some(doc) = cursor.next().await {
                    collection_docs.push(doc?);
                }

                return Ok(collection_docs);
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub async fn get_collection_documents_by_filter(db_name: &str, collection_name: &str, filters: &str) -> Result<Vec<Document>, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                let value: Map<String, Value> = serde_json::from_str(filters)?;
                let document = Document::try_from(value)?;

                let mut cursor = db.collection(collection_name).find(document, None).await?;

                let mut collection_docs: Vec<Document> = Vec::new();

                while let Some(doc) = cursor.next().await {
                    collection_docs.push(doc?);
                }

                return Ok(collection_docs);
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

fn create_options(limit: i64, skip: u64) -> FindOptions {
    FindOptions::builder()
        .limit(limit)
        .skip(skip)
        .build()
}