import { EJSON } from "bson";

export class EJSONService {
    static BsonDocToObject = (bsonData: Object) => {
        return JSON.parse(JSON.stringify(EJSON.parse(EJSON.stringify(bsonData))));
    }
}