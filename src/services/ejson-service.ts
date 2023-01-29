import { EJSON } from "bson";

export class EJSONService {
    static BsonDocToObject = (bsonData: Object) => {
        return EJSON.parse(JSON.stringify(bsonData));
    }
}