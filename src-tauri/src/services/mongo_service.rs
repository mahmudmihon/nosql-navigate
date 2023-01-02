use mongodb::{Client};
use mongodb::bson::doc;

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

pub fn connection_check() -> () {

    //let connected = get_connected_client();

    unsafe {
        match &CONNECTED_CLIENT {
            Some(client) => {print!("{:?}", client)},
            None => {print!("client not found")}
        }

    }
}

// fn get_connected_client() -> Client {
//     unsafe {
//         match &CONNECTED_CLIENT {
//             Some(client) => return client,
//             None => {print!("client not found")}
//         }
//     }
// }