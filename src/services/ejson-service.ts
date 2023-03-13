import { EJSON } from "bson";
import HadronDocument from 'hadron-document';

export class EJSONService {
    // static BsonDocToObject = (bsonData: Object) => {
    //     return JSON.parse(JSON.stringify(EJSON.parse(EJSON.stringify(bsonData))));
    // }

    static BsonDocToObject = (bsonData: any) => {
        return JSON.parse(new HadronDocument(bsonData).toEJSON());
    }
}