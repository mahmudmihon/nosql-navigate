use mongodb::{options::FindOptions, options::UpdateModifications, Client};
use mongodb::bson::{doc, Document};
use serde_json::{Map, Value};
use std::convert::TryFrom;
use futures::stream::{StreamExt};
use std::fs::{File, OpenOptions};
use std::io::{Write};
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

pub async fn create_collection(db_name: &str, collection_name: &str) -> Result<String, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                db.create_collection(collection_name, None).await?;

                return Ok("ok".to_string());
            },
            None => { return Err(CustomError::ClientNotFound) }
        }
    }
}

pub async fn drop_collection(db_name: &str, collection_name: &str) -> Result<String, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                db.collection::<String>(collection_name).drop(None).await?;

                return Ok("ok".to_string());
            },
            None => { return Err(CustomError::ClientNotFound) }
        }
    }
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

pub async fn get_collection_documents(db_name: &str, collection_name: &str, filters: &str, sort: &str, limit: i64, skip: u64) -> Result<Vec<Document>, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                let sort_mapping: Map<String, Value> = serde_json::from_str(sort)?;

                let sort_doc = Document::try_from(sort_mapping)?;

                let options = create_options(sort_doc, limit, skip);

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

pub async fn documents_aggregation(db_name: &str, collection_name: &str, aggregations: Vec<&str>) -> Result<Vec<Document>, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                let mut pipelines: Vec<Document> = Vec::new();

                for pipeline in aggregations {
                    let pipeline_mapping: Map<String, Value> = serde_json::from_str(pipeline)?;

                    let pipeline_doc = Document::try_from(pipeline_mapping)?;

                    pipelines.push(pipeline_doc);
                }

                let stage_limit = doc! { "$limit": 10 };

                pipelines.push(stage_limit);

                let mut cursor = db.collection::<Document>(collection_name).aggregate(pipelines, None).await?;

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

pub async fn get_collection_documents_count(db_name: &str, collection_name: &str, filters: &str) -> Result<u64, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let db = client.database(db_name);

                let filters_mapping: Map<String, Value> = serde_json::from_str(filters)?;

                let filters_doc = Document::try_from(filters_mapping)?;

                let documents_count = db.collection::<String>(collection_name).count_documents(filters_doc, None).await?;

                return Ok(documents_count);
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub async fn export_collection(db_name: &str, collection_name: &str, path: &str) -> Result<String, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let mut file = OpenOptions::new()
                                                .write(true)
                                                .create(true)
                                                .append(true)
                                                .open(path)?;

                let db = client.database(db_name);

                let mut cursor = db.collection::<Document>(collection_name).find(None, None).await?;

                writeln!(file, "[")?;

                while let Some(doc) = cursor.next().await {
                    let doc_to_string = serde_json::to_string_pretty(&doc?)?;
                    writeln!(file, "{},", doc_to_string)?;
                }

                writeln!(file, "]")?;

                return Ok("ok".to_string());
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub async fn import_collection(db_name: &str, collection_name: &str, path: &str) -> Result<String, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let file_to_import = File::open(&path)?;

                let documents:Vec<Document> = serde_json::from_reader(file_to_import).unwrap();

                if !documents.is_empty() && documents.len() > 0 {
                    let db = client.database(db_name);

                    db.collection::<Document>(collection_name).insert_many(documents, None).await?;
                }

                return Ok("ok".to_string());
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub async fn insert_document(db_name: &str, collection_name: &str, document: &str) -> Result<String, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let db = client.database(db_name);

                let doc_mapping: Map<String, Value> = serde_json::from_str(document)?;

                let doc_to_insert = Document::try_from(doc_mapping)?;

                db.collection::<Document>(collection_name).insert_one(doc_to_insert, None).await?;

                return Ok("ok".to_string());
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub async fn update_document(db_name: &str, collection_name: &str, filter: &str, document: &str) -> Result<String, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let db = client.database(db_name);

                let filter_mapping: Map<String, Value> = serde_json::from_str(filter)?;

                let document_update_filter = Document::try_from(filter_mapping)?;

                let document_mapping: Map<String, Value> = serde_json::from_str(document)?;

                let document_to_update = Document::try_from(document_mapping)?;

                let update_modifications = UpdateModifications::Document(document_to_update);

                db.collection::<Document>(collection_name).update_one(document_update_filter, update_modifications, None).await;

                return Ok("ok".to_string());
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub async fn delete_document(db_name: &str, collection_name: &str, filter: &str) -> Result<String, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let db = client.database(db_name);

                let filter_mapping: Map<String, Value> = serde_json::from_str(filter)?;

                let document_delete_filter = Document::try_from(filter_mapping)?;

                db.collection::<Document>(collection_name).find_one_and_delete(document_delete_filter, None).await?;

                return Ok("ok".to_string());
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub fn drop_client() {
    unsafe {
        CONNECTED_CLIENT = None;
    }
}

fn create_options(sort: Document, limit: i64, skip: u64) -> FindOptions {
    FindOptions::builder()
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .build()
}