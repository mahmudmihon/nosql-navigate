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

  static populateSelectedStageOutput = (stage: string, stageData: { [key: string]: any }): object => {
    switch(stage) {
      case "$addFields": {
        return this.prepareaddFieldsStageOutput();
      }
      case "$bucket": {
        return this.prepareBucketStageOutput();
      }
      case "$bucketAuto": {
        return this.prepareBucketAutoStageOutput();
      }
      case "$collStats": {
        return this.prepareCollStatsStageOutput();
      }
      case "$count": {
        return this.prepareCountStageOutput();
      }
      case "$densify": {
        return this.prepareDensifyStageOutput();
      }
      case "$documents": {
        return this.prepareDocumentsStageOutput();
      }
      case "$facet": {
        return this.prepareFacetStageOutput();
      }
      case "$group": {
        return this.prepareGroupStageOutput();
      }
      case "$limit": {
        return this.prepareLimitStageOutput();
      }
      case "$lookup": {
        return this.prepareLookupStageOutput(stageData);
      }
      case "$project": {
        return this.prepareProjectStageOutput(stageData);
      }
      case "$unwind": {
        return this.prepareUnwindStageOutput(stageData);
      }
      case "$match": {
        return this.prepareMatchStageOutput();
      }
      case "$sort": {
        return this.prepareSortStageOutput();
      }
      default: {
        return {};
      }
    }
  }

  static prepareaddFieldsStageOutput = (): object => {
    return {"$addFields": {"new_field": "expression"}};
  }

  static prepareBucketStageOutput = (): object => {
    return {"$bucket": {"groupBy": "expression", "boundaries": [], "default": "literal", "output": {"output": {}}}};
  }

  static prepareBucketAutoStageOutput = (): object => {
    return {"$bucketAuto": {"groupBy": "expression", "boundaries": [], "default": "literal", "output": {"output": {}}, "granularity": ""}};
  }

  static prepareCollStatsStageOutput = (): object => {
    return {"$collStats": {"latencyStats": {"histograms": false}, "storageStats": {"scale": 1}, "count": {}, "queryExecStats": {}}};
  }

  static prepareCountStageOutput = (): object => {
    return {"$count": "output_field"};
  }

  static prepareDensifyStageOutput = (): object => {
    return {"$densify": {}};
  }

  static prepareDocumentsStageOutput = (): object => {
    return {"$documents": "expression"};
  }

  static prepareFacetStageOutput = (): object => {
    return {"$facet": {"outputField1": ["stage1, stage2"], "outputField2": ["stage1, stage2"]}};
  }

  static prepareGroupStageOutput = (): object => {
    return {"$group": {"_id": "expression", "field": {"accumulator": "expression"}}};
  }

  static prepareLimitStageOutput = (): object => {
    return {"$limit": 0};
  }

  static prepareLookupStageOutput = (stageData: { [key: string]: any }): object => {
    return {"$lookup": {"from": stageData.from, "localField": stageData.localField, "foreignField": stageData.foreignField, "as": stageData.as != '' ? stageData.as : stageData.from}};
  }

  static prepareProjectStageOutput = (stageData: { [key: string]: any }): object => {
    if(Object.keys(stageData).length > 0) {
      return {"$project": stageData};
    }
    else {
      return {"$project": {"field1": 1, "field2": 1}};
    }
  }

  static prepareUnwindStageOutput = (stageData: { [key: string]: any }): object => {
    let unwindObject: { [key: string]: any } = {};

    unwindObject.path = stageData.field;

    if(stageData.preserveNullAndEmptyArrays) {
      unwindObject.preserveNullAndEmptyArrays = true;
    }

    if(stageData.includeArrayIndex) {
      unwindObject.includeArrayIndex = true;
    }

    return {"$unwind": unwindObject};
  }

  static prepareMatchStageOutput = (): object => {
    return {"$match": {"field": "value"}};
  }

  static prepareSortStageOutput = (): object => {
    return {"$sort": {"field1": 1, "field2": 1}};
  }
}
