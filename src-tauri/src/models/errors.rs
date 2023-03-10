#[derive(Debug, thiserror::Error)]
pub enum CustomError {
    #[error("error")]
    ClientNotFound,
    #[error("error")]
    MongoError(#[from] mongodb::error::Error),
    #[error("error")]
    SerdeError(#[from] serde_json::Error),
    #[error("error")]
    BsonDocError(#[from] mongodb::bson::extjson::de::Error),
    #[error("error")]
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