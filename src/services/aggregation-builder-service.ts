import { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { clearObjectKeys, extractObjectKeys } from "../helpers/object-keys";
import { CollectionsAndDocumentsService } from "./collections-documents-service";
import { EJSONService } from "./ejson-service";

export class AggregationBuilderService {
  static pipelineStages: SelectMixedOption[] = [
    {
      label: "$addFields",
      value: "$addFields",
    },
    {
      label: "$bucket",
      value: "$bucket",
    },
    {
      label: "$bucketAuto",
      value: "$bucketAuto",
    },
    {
      label: "$changeStream",
      value: "$changeStream",
    },
    {
      label: "$collStats",
      value: "$collStats",
    },
    {
      label: "$count",
      value: "$count",
    },
    {
      label: "$currentOp",
      value: "$currentOp",
    },
    {
      label: "$densify",
      value: "$densify",
    },
    {
      label: "$documents",
      value: "$documents",
    },
    {
      label: "$facet",
      value: "$facet",
    },
    {
      label: "$fill",
      value: "$fill",
    },
    {
      label: "$geoNear",
      value: "$geoNear",
    },
    {
      label: "$graphLookup",
      value: "$graphLookup",
    },
    {
      label: "$group",
      value: "$group",
    },
    {
      label: "$indexStats",
      value: "$indexStats",
    },
    {
      label: "$limit",
      value: "$limit",
    },
    {
      label: "$lookup",
      value: "$lookup",
    },
    {
      label: "$match",
      value: "$match",
    },
    {
      label: "$merge",
      value: "$merge",
    },
    {
      label: "$out",
      value: "$out",
    },
    {
      label: "$planCacheStats",
      value: "$planCacheStats",
    },
    {
      label: "$project",
      value: "$project",
    },
    {
      label: "$redact",
      value: "$redact",
    },
    {
      label: "$replaceRoot",
      value: "$replaceRoot",
    },
    {
      label: "$replaceWith",
      value: "$replaceWith",
    },
    {
      label: "$sample",
      value: "$sample",
    },
    {
      label: "$search",
      value: "$search",
    },
    {
      label: "$searchMeta",
      value: "$searchMeta",
    },
    {
      label: "$set",
      value: "$set",
    },
    {
      label: "$setWindowFields",
      value: "$setWindowFields",
    },
    {
      label: "$shardedDataDistribution",
      value: "$shardedDataDistribution",
    },
    {
      label: "$skip",
      value: "$skip",
    },
    {
      label: "$sort",
      value: "$sort",
    },
    {
      label: "$sortByCount",
      value: "$sortByCount",
    },
    {
      label: "$unionWith",
      value: "$unionWith",
    },
    {
      label: "$unset",
      value: "$unset",
    },
    {
      label: "$unwind",
      value: "$unwind",
    }
  ];

  static getOtherCollectionNames = (dbName: string, collectionName: string): SelectMixedOption[] => {
    const collectionNames = CollectionsAndDocumentsService.getDbCollectionNames(dbName);

    return collectionNames.filter(x => x != collectionName).map(x => {
      return {label: x, value: x}
    });
  }

  static convertObjectKeysToSelectOptions = (keys: string[]): SelectMixedOption[] => {
    return keys.map(x => {
      return {label: x, value: x}
    });
  }

  static getForeignFields = async (dbName: string, collectionName: string): Promise<SelectMixedOption[]> => {

    if(collectionName != '') {
      const collectionDocuments = await CollectionsAndDocumentsService.getCollectionDocuments(dbName, collectionName, '{}', '{}', 1, 0);

      if(collectionDocuments.length > 0) {
        const parsedObject = EJSONService.BsonDocToObject(collectionDocuments[0]);

        const objectFields = extractObjectKeys(parsedObject);
        
        clearObjectKeys();

        return this.convertObjectKeysToSelectOptions(objectFields);
      }
    }

    return [];
  }

  static populateSelectedStageOutput = (stage: string): object => {
    switch(stage) {
      case "$count": {
        return this.prepareCountStageOutput();
      }
      case "$group": {
        return this.prepareGroupStageOutput();
      }
      case "$limit": {
        return this.prepareLimitStageOutput();
      }
      default: {
        return {};
      }
    }
  }

  static prepareCountStageOutput = (): object => {
    return {"$count": "output_field"};
  }

  static prepareGroupStageOutput = (): object => {
    return {"$group": {"_id": "expression", "field": {"accumulator": "expression"}}};
  }

  static prepareLimitStageOutput = (): object => {
    return {"$limit": 0};
  }
}
