#[derive(Debug, thiserror::Error)]
pub enum CustomError {
    #[error("Mongo client not found!")]
    ClientNotFound,
    #[error("Error occured in mongo!")]
    MongoError(#[from] mongodb::error::Error),
    #[error("Error occured in serde json!")]
    SerdeError(#[from] serde_json::Error),
    #[error("Error occured in bson deserialization!")]
    BsonDocError(#[from] mongodb::bson::extjson::de::Error),
    #[error("Error occured while IO operation!")]
    IOError(#[from] std::io::Error)    
}

impl serde::Serialize for CustomError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}