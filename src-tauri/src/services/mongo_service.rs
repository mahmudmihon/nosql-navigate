use chrono::Utc;
use mongodb::{options::FindOptions, options::UpdateModifications, Client};
use mongodb::bson::{doc, Document};
use serde_json::{Map, Value};
use uuid::Uuid;
use std::convert::TryFrom;
use futures::stream::{StreamExt};
use std::fs::{File, OpenOptions};
use std::io::{Write};
use std::path::PathBuf;

use crate::models::dtos::{DbWithCollections, ImportExportSummary, ErrorResult};
use crate::models::errors::CustomError;

use super::sql_lite_service;

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

pub async fn drop_database(db_name: &str) -> Result<String, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let result = client.database(db_name).drop(None).await;

                match result {
                    Ok(_r) => return Ok("ok".to_string()),
                    Err(e) => {
                        return Err(ErrorResult {message: e.kind.to_string() });
                    }
                }             
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
        }
    }
}

pub async fn create_collection(db_name: &str, collection_name: &str) -> Result<String, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                let result = db.create_collection(collection_name, None).await;

                match result {
                    Ok(_r) => return Ok("Collection created.".to_string()),
                    Err(e) => return Err(ErrorResult {message: e.kind.to_string() })
                }  
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
        }
    }
}

pub async fn drop_collection(db_name: &str, collection_name: &str) -> Result<String, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                let result = db.collection::<String>(collection_name).drop(None).await;

                match result {
                    Ok(_r) => return Ok("Collection deleted.".to_string()),
                    Err(e) => return Err(ErrorResult {message: e.kind.to_string() })
                }  
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
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

pub async fn get_dbs_stats() -> Result<Vec<Document>, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let mut dbs_stats: Vec<Document> = Vec::new();

                let dbs = client.list_database_names(None, None).await;

                match dbs {
                    Ok(db_names) => {
                        for db_name in db_names {
                            let stats = client.database(&db_name).run_command(doc! { "dbStats": 1, "scale": 1024*1024*1024 }, None).await;

                            match stats {
                                Ok(data) => {
                                    dbs_stats.push(data);
                                },
                                Err(_e) => {}
                            }
                        }
                    }
                    Err(_e) => {}
                }

                return Ok(dbs_stats);
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
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

                let cursor = db.collection(collection_name).find(filters_doc, options).await;

                let mut collection_docs: Vec<Document> = Vec::new();

                match cursor {
                    Ok(mut doc_cursor) => {
                        while let Some(doc) = doc_cursor.next().await {
                            collection_docs.push(doc?);
                        }
                    },
                    Err(_e) => {

                    }
                }

                return Ok(collection_docs);
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub async fn documents_aggregation(db_name: &str, collection_name: &str, aggregations: Vec<&str>, limit: i64) -> Result<Vec<Document>, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {
                let db = client.database(db_name);

                let mut pipelines: Vec<Document> = prepare_aggregation_stages(aggregations);

                let stage_limit = doc! { "$limit": limit };

                pipelines.push(stage_limit);

                let cursor = db.collection::<Document>(collection_name).aggregate(pipelines, None).await;

                match cursor {
                    Ok(mut list_cursor) => {
                        let mut collection_docs: Vec<Document> = Vec::new();

                        while let Some(doc) = list_cursor.next().await {
                            match doc {
                                Ok(document) => {
                                    collection_docs.push(document);
                                },
                                Err(_e) => {}
                            }                           
                        }

                        return Ok(collection_docs);
                    },
                    Err(e) => return Err(ErrorResult {message: e.kind.to_string() })
                }                
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
        }
    }
}

pub async fn export_aggregation_result(db_name: &str, collection_name: &str, aggregations: Vec<&str>, path: &str, db_path: &PathBuf) -> Result<u64, CustomError> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let mut file = OpenOptions::new()
                                                .write(true)
                                                .create(true)
                                                .append(true)
                                                .open(path)?;

                let db = client.database(db_name);

                // let summary_for = "export";

                // let mut export_summary = insert_summary(summary_for, db_name, collection_name, path, db_path);

                let pipelines: Vec<Document> = prepare_aggregation_stages(aggregations);

                let mut cursor = db.collection::<Document>(collection_name).aggregate(pipelines, None).await?;

                let mut count: u64 = 0;

                writeln!(file, "[")?;

                while let Some(doc) = cursor.next().await {
                    let doc_to_string = serde_json::to_string_pretty(&doc?)?;

                    if count == 0 {
                        writeln!(file, "{}", doc_to_string)?;
                    }
                    else {
                        writeln!(file, ",")?;

                        writeln!(file, "{}", doc_to_string)?;
                    }

                    count += 1;
                }

                writeln!(file, "]")?;

                // export_summary.documents_count = count;
                // export_summary.operation_status = String::from("completed");

                // update_summary(export_summary, db_path);

                return Ok(count);
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

pub async fn export_collection(db_name: &str, collection_name: &str, path: &str, db_path: &PathBuf) -> Result<u64, CustomError> {
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

                let mut count: u64 = 0;

                // let summary_for = "export";

                // let mut export_summary = insert_summary(summary_for, db_name, collection_name, path, db_path);

                writeln!(file, "[")?;

                while let Some(doc) = cursor.next().await {

                    let doc_to_string = serde_json::to_string_pretty(&doc?)?;

                    if count == 0 {
                        writeln!(file, "{}", doc_to_string)?;
                    }
                    else {
                        writeln!(file, ",")?;

                        writeln!(file, "{}", doc_to_string)?;
                    }
                    
                    count += 1;
                }

                writeln!(file, "]")?;

                // export_summary.documents_count = count;
                // export_summary.operation_status = String::from("completed");

                // update_summary(export_summary, db_path);

                return Ok(count);
            },
            None => { return Err(CustomError::ClientNotFound); }
        }
    }
}

pub async fn import_collection(db_name: &str, collection_name: &str, path: &str, db_path: &PathBuf) -> Result<u64, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let file_to_import = File::open(&path);

                match file_to_import {
                    Ok(file) => {
                        // let summary_for = "import";

                        // let mut import_summary = insert_summary(summary_for, db_name, collection_name, path, db_path);

                        let documents: Result<Vec<Document>, serde_json::Error> = serde_json::from_reader(file);

                        match documents {
                            Ok(docs) => {
                                let documents_count = u64::try_from(docs.len()).unwrap();

                                if !docs.is_empty() && docs.len() > 0 {
                                    let db = client.database(db_name);

                                    let insert_result = db.collection::<Document>(collection_name).insert_many(docs, None).await;

                                    match insert_result {
                                        Ok(_r) => {}
                                        Err(_e) => return Err(ErrorResult {message: "Error occured while inserting the documents!".to_string() })
                                    }
                                }

                                // import_summary.documents_count = documents_count;
                                // import_summary.operation_status = String::from("completed");

                                // update_summary(import_summary, db_path);

                                return Ok(documents_count);                              
                            },
                            Err(e) => return Err(ErrorResult {message: e.to_string() })
                        }                       
                    },
                    Err(_e) => return Err(ErrorResult {message: "Error occured while opening the file!".to_string() })
                }                 
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
        }
    }
}

pub async fn insert_document(db_name: &str, collection_name: &str, document: &str) -> Result<String, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let db = client.database(db_name);

                let doc_mapping: Result<Map<String, Value>, serde_json::Error> = serde_json::from_str(document);

                match doc_mapping {
                    Ok(mapped_doc) => {
                        let doc_to_insert = Document::try_from(mapped_doc);

                        match doc_to_insert {
                            Ok(bson_doc) => {
                                let result = db.collection::<Document>(collection_name).insert_one(bson_doc, None).await;

                                match result {
                                    Ok(_r) => return Ok("Document inserted.".to_string()),
                                    Err(e) => return Err(ErrorResult {message: e.kind.to_string() })
                                }  
                            },
                            Err(_e) => return Err(ErrorResult {message: "Error occured while converting into BSON document!".to_string() })
                        }
                    },
                    Err(_e) => return Err(ErrorResult {message: "Error occured while converting into JSON!".to_string() })
                }                
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
        }
    }
}

pub async fn update_document(db_name: &str, collection_name: &str, filter: &str, document: &str) -> Result<String, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let db = client.database(db_name);

                let filter_mapping: Result<Map<String, Value>, serde_json::Error> = serde_json::from_str(filter);

                match filter_mapping {
                    Ok(mapped_filter) => {
                        let document_update_filter = Document::try_from(mapped_filter);

                        match document_update_filter {
                            Ok(filter) => {
                                let doc_mapping: Result<Map<String, Value>, serde_json::Error> = serde_json::from_str(document);

                                match doc_mapping {
                                    Ok(mapped_doc) => {
                                        let document_to_update = Document::try_from(mapped_doc);

                                        match document_to_update {
                                            Ok(bson_doc) => {
                                                let update_modifications = UpdateModifications::Document(bson_doc);

                                                let update_result = db.collection::<Document>(collection_name).update_one(filter, update_modifications, None).await;

                                                match update_result {
                                                    Ok(update_result) => {
                                                        if update_result.modified_count > 0 {
                                                            return Ok("Document updated.".to_string());
                                                        }
                                                        else {
                                                            return Ok("No document found to update!".to_string());
                                                        } 
                                                    },
                                                    Err(e) => return Err(ErrorResult {message: e.kind.to_string() })
                                                }                                                  
                                            },
                                            Err(_e) => return Err(ErrorResult {message: "Error occured while converting into BSON document!".to_string() })
                                        }
                                    },
                                    Err(_e) => return Err(ErrorResult {message: "Error occured while converting document into JSON!".to_string() })
                                }
                            },
                            Err(_e) => return Err(ErrorResult {message: "Error occured while converting into BSON document!".to_string() })
                        }
                    },
                    Err(_e) => return Err(ErrorResult {message: "Error occured while converting document filter into JSON!".to_string() })
                }                           
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
        }
    }
}

pub async fn delete_document(db_name: &str, collection_name: &str, filter: &str) -> Result<String, ErrorResult> {
    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {

                let db = client.database(db_name);

                let filter_mapping: Result<Map<String, Value>, serde_json::Error> = serde_json::from_str(filter);

                match filter_mapping {
                    Ok(filter) => {
                        let document_delete_filter = Document::try_from(filter);

                        match document_delete_filter {
                            Ok(bson_doc) => {
                                let result = db.collection::<Document>(collection_name).find_one_and_delete(bson_doc, None).await;

                                match result {
                                    Ok(_r) => return Ok("Document deleted.".to_string()),
                                    Err(e) => return Err(ErrorResult {message: e.kind.to_string() })
                                }
                            },
                            Err(_e) => return Err(ErrorResult {message: "Error occured while converting into BSON document!".to_string() })
                        }
                    },
                    Err(_e) => return Err(ErrorResult {message: "Error occured while converting document filter into JSON!".to_string() })
                }
            },
            None => { return Err(ErrorResult {message: "Client not found.".to_string() }) }
        }
    }
}

pub fn drop_client() {
    unsafe {
        CONNECTED_CLIENT = None;
    }
}

fn prepare_aggregation_stages(aggregations: Vec<&str>) -> Vec<Document> {
    let mut pipelines: Vec<Document> = Vec::new();

    for pipeline in aggregations {
        let pipeline_mapping: Map<String, Value> = serde_json::from_str(pipeline).unwrap();

        let pipeline_doc = Document::try_from(pipeline_mapping).unwrap();

        pipelines.push(pipeline_doc);
    }

    return pipelines;
}

fn create_options(sort: Document, limit: i64, skip: u64) -> FindOptions {
    FindOptions::builder()
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .build()
}

fn insert_summary(summary_for: &str, db_name: &str, collection_name: &str, path: &str, db_path: &PathBuf) -> ImportExportSummary {
    let mut summary: ImportExportSummary = ImportExportSummary::new();

    summary.id = Uuid::new_v4().to_string();
    summary.db_name = db_name.to_string();
    summary.collection_name = collection_name.to_string();
    summary.path = path.to_string();
    summary.operation_type = summary_for.to_string();
    summary.operation_status = String::from("running");
    summary.documents_count = 0;
    summary.created_on = Utc::now().to_string();

    sql_lite_service::insert_import_export_summary(&summary, db_path);

    return summary;
}

fn update_summary(summary: ImportExportSummary, db_path: &PathBuf) {
    sql_lite_service::update_import_export_summary(&summary, db_path);
}