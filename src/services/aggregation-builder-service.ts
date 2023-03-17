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

        const objectFields = extractObjectKeys(parsedObject).sort();
        
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
      case "$fill": {
        return this.prepareFacetStageOutput();
      }
      case "$geoNear": {
        return this.prepareGeoNearStageOutput();
      }
      case "$graphLookup": {
        return this.prepareGraphLookupStageOutput();
      }
      case "$group": {
        return this.prepareFillStageOutput();
      }
      case "$indexStats": {
        return this.prepareIndexStatsStageOutput();
      }
      case "$limit": {
        return this.prepareLimitStageOutput();
      }
      case "$lookup": {
        return this.prepareLookupStageOutput(stageData);
      }
      case "$match": {
        return this.prepareMatchStageOutput();
      }
      case "$merge": {
        return this.prepareMergeStageOutput();
      }
      case "$out": {
        return this.prepareOutStageOutput();
      }
      case "$planCacheStats": {
        return this.preparePlanCacheStatsStageOutput();
      }
      case "$project": {
        return this.prepareProjectStageOutput(stageData);
      }
      case "$redact": {
        return this.prepareRedactStageOutput();
      }
      case "$replaceRoot": {
        return this.prepareReplaceRootStageOutput();
      }
      case "$replaceWith": {
        return this.prepareReplaceWithStageOutput();
      }
      case "$sample": {
        return this.prepareSampleStageOutput();
      }
      case "$set": {
        return this.prepareSetStageOutput();
      }
      case "$setWindowFields": {
        return this.prepareSetWindowFieldsStageOutput();
      }
      case "$shardedDataDistribution": {
        return this.prepareShardedDataDistributionStageOutput();
      }
      case "$skip": {
        return this.prepareSkipStageOutput();
      }
      case "$sort": {
        return this.prepareSortStageOutput();
      }
      case "$sortByCount": {
        return this.prepareSortByCountStageOutput();
      }
      case "$unionWith": {
        return this.prepareUnionWithStageOutput();
      }
      case "$unset": {
        return this.prepareUnsetStageOutput(stageData);
      }  
      case "$unwind": {
        return this.prepareUnwindStageOutput(stageData);
      }     
      default: {
        return {};
      }
    }
  }

  static prepareaddFieldsStageOutput = (): object => {
    return {"$addFields": {"newField": "expression"}};
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
    return {"$count": "outputField"};
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

  static prepareFillStageOutput = (): object => {
    return {"$fill": {}};
  }

  static prepareGeoNearStageOutput = (): object => {
    return {"$geoNear": {"near": {}, "distanceField": "", "maxDistance": 0, "query": {}, "includeLocs": "", spherical: false}};
  }

  static prepareGraphLookupStageOutput = (): object => {
    return {"$graphLookup": {"from": "", "startWith": "", "connectFromField": "", "connectToField": "", "as": ""}};
  }

  static prepareGroupStageOutput = (): object => {
    return {"$group": {"_id": "expression", "field": {"accumulator": "expression"}}};
  }

  static prepareIndexStatsStageOutput = (): object => {
    return {"$indexStats": {}};
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

  static prepareMatchStageOutput = (): object => {
    return {"$match": {"field": "value"}};
  }

  static prepareMergeStageOutput = (): object => {
    return {"$merge": {"into": "", "on": "", "whenMatched": "", "whenNotMatched": ""}};
  }

  static prepareOutStageOutput = (): object => {
    return {"$out": {"db": "output-db", "coll": "output-collection"}};
  }

  static preparePlanCacheStatsStageOutput = (): object => {
    return {"$planCacheStats": {}};
  }

  static prepareRedactStageOutput = (): object => {
    return {"$redact": {}};
  }

  static prepareReplaceRootStageOutput = (): object => {
    return {"$replaceRoot": {"newRoot": {}}};
  }

  static prepareReplaceWithStageOutput = (): object => {
    return {"$replaceWith": ""};
  }

  static prepareSampleStageOutput = (): object => {
    return {"$sample": { "size": 0 }};
  }

  static prepareSetStageOutput = (): object => {
    return {"$set": { "newField": "expression" }};
  }

  static prepareSetWindowFieldsStageOutput = (): object => {
    return {"$setWindowFields": {}};
  }

  static prepareShardedDataDistributionStageOutput = (): object => {
    return {"$shardedDataDistribution": {}};
  }

  static prepareSkipStageOutput = (): object => {
    return {"$skip": 0};
  }

  static prepareSortStageOutput = (): object => {
    return {"$sort": {"field1": 1, "field2": 1}};
  }

  static prepareSortByCountStageOutput = (): object => {
    return {"$sortByCount": "expression"};
  }

  static prepareUnionWithStageOutput = (): object => {
    return {"$unionWith": {"coll": "collectionName", "pipeline": []}};
  }

  static prepareUnsetStageOutput = (stageData: { [key: string]: any }): object => {
    if(stageData.fields.length > 0) {
      return {"$unset": stageData.fields}
    }
    else {
      return {"$unset": "fieldName"}
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
}
