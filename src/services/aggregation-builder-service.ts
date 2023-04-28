import { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { clearObjectKeys, extractObjectKeys } from "../utilities/object-keys";
import { CollectionsAndDocumentsService } from "./collections-documents-service";
import { EJSONService } from "./ejson-service";
import { AggregationStages } from "../types/AggregationBuilder/aggregation-stages";

export class AggregationBuilderService {

  static aggregationStages = (): SelectMixedOption[] => {
    var stages = Object.values(AggregationStages);

    return stages.map(x => {
      return {label: x, value: x}
    });
  }

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
      case AggregationStages.AddFields: {
        return this.prepareaddFieldsStageOutput();
      }
      case AggregationStages.Bucket: {
        return this.prepareBucketStageOutput();
      }
      case AggregationStages.BucketAuto: {
        return this.prepareBucketAutoStageOutput();
      }
      case AggregationStages.CollStats: {
        return this.prepareCollStatsStageOutput();
      }
      case AggregationStages.Count: {
        return this.prepareCountStageOutput();
      }
      case AggregationStages.Densify: {
        return this.prepareDensifyStageOutput();
      }
      case AggregationStages.Documents: {
        return this.prepareDocumentsStageOutput();
      }
      case AggregationStages.Facet: {
        return this.prepareFacetStageOutput();
      }
      case AggregationStages.Fill: {
        return this.prepareFacetStageOutput();
      }
      case AggregationStages.GeoNear: {
        return this.prepareGeoNearStageOutput();
      }
      case AggregationStages.GraphLookup: {
        return this.prepareGraphLookupStageOutput();
      }
      case AggregationStages.Group: {
        return this.prepareFillStageOutput();
      }
      case AggregationStages.IndexStats: {
        return this.prepareIndexStatsStageOutput();
      }
      case AggregationStages.Limit: {
        return this.prepareLimitStageOutput();
      }
      case AggregationStages.Lookup: {
        return this.prepareLookupStageOutput(stageData);
      }
      case AggregationStages.Match: {
        return this.prepareMatchStageOutput();
      }
      case AggregationStages.Merge: {
        return this.prepareMergeStageOutput();
      }
      case AggregationStages.Out: {
        return this.prepareOutStageOutput();
      }
      case AggregationStages.PlanCacheStats: {
        return this.preparePlanCacheStatsStageOutput();
      }
      case AggregationStages.Project: {
        return this.prepareProjectStageOutput(stageData);
      }
      case AggregationStages.Redact: {
        return this.prepareRedactStageOutput();
      }
      case AggregationStages.ReplaceRoot: {
        return this.prepareReplaceRootStageOutput();
      }
      case AggregationStages.ReplaceWith: {
        return this.prepareReplaceWithStageOutput();
      }
      case AggregationStages.Sample: {
        return this.prepareSampleStageOutput();
      }
      case AggregationStages.Set: {
        return this.prepareSetStageOutput();
      }
      case AggregationStages.SetWindowFields: {
        return this.prepareSetWindowFieldsStageOutput();
      }
      case AggregationStages.ShardedDataDistribution: {
        return this.prepareShardedDataDistributionStageOutput();
      }
      case AggregationStages.Skip: {
        return this.prepareSkipStageOutput();
      }
      case AggregationStages.Sort: {
        return this.prepareSortStageOutput();
      }
      case AggregationStages.SortByCount: {
        return this.prepareSortByCountStageOutput();
      }
      case AggregationStages.UnionWith: {
        return this.prepareUnionWithStageOutput();
      }
      case AggregationStages.Unset: {
        return this.prepareUnsetStageOutput(stageData);
      }
      case AggregationStages.Unwind: {
        return this.prepareUnwindStageOutput(stageData);
      }
      default: {
        return {};
      }
    }
  }

  static prepareaddFieldsStageOutput = (): object => {
    return {[AggregationStages.AddFields]: {"newField": "expression"}};
  }

  static prepareBucketStageOutput = (): object => {
    return {[AggregationStages.Bucket]: {"groupBy": "expression", "boundaries": [], "default": "literal", "output": {"output": {}}}};
  }

  static prepareBucketAutoStageOutput = (): object => {
    return {[AggregationStages.BucketAuto]: {"groupBy": "expression", "boundaries": [], "default": "literal", "output": {"output": {}}, "granularity": ""}};
  }

  static prepareCollStatsStageOutput = (): object => {
    return {[AggregationStages.CollStats]: {"latencyStats": {"histograms": false}, "storageStats": {"scale": 1}, "count": {}, "queryExecStats": {}}};
  }

  static prepareCountStageOutput = (): object => {
    return {[AggregationStages.Count]: "outputField"};
  }

  static prepareDensifyStageOutput = (): object => {
    return {[AggregationStages.Densify]: {}};
  }

  static prepareDocumentsStageOutput = (): object => {
    return {[AggregationStages.Documents]: "expression"};
  }

  static prepareFacetStageOutput = (): object => {
    return {[AggregationStages.Facet]: {"outputField1": ["stage1, stage2"], "outputField2": ["stage1, stage2"]}};
  }

  static prepareFillStageOutput = (): object => {
    return {[AggregationStages.Fill]: {}};
  }

  static prepareGeoNearStageOutput = (): object => {
    return {[AggregationStages.GeoNear]: {"near": {}, "distanceField": "", "maxDistance": 0, "query": {}, "includeLocs": "", spherical: false}};
  }

  static prepareGraphLookupStageOutput = (): object => {
    return {[AggregationStages.GraphLookup]: {"from": "", "startWith": "", "connectFromField": "", "connectToField": "", "as": ""}};
  }

  static prepareGroupStageOutput = (): object => {
    return {[AggregationStages.Group]: {"_id": "expression", "field": {"accumulator": "expression"}}};
  }

  static prepareIndexStatsStageOutput = (): object => {
    return {[AggregationStages.IndexStats]: {}};
  }

  static prepareLimitStageOutput = (): object => {
    return {[AggregationStages.Limit]: 0};
  }

  static prepareLookupStageOutput = (stageData: { [key: string]: any }): object => {
    return {[AggregationStages.Lookup]: {"from": stageData.from, "localField": stageData.localField, "foreignField": stageData.foreignField, "as": stageData.as != '' ? stageData.as : stageData.from}};
  }

  static prepareProjectStageOutput = (stageData: { [key: string]: any }): object => {
    if(Object.keys(stageData).length > 0) {
      return {[AggregationStages.Project]: stageData};
    }
    else {
      return {[AggregationStages.Project]: {"field1": 1, "field2": 1}};
    }
  }

  static prepareMatchStageOutput = (): object => {
    return {[AggregationStages.Match]: {"field": "value"}};
  }

  static prepareMergeStageOutput = (): object => {
    return {[AggregationStages.Merge]: {"into": "", "on": "", "whenMatched": "", "whenNotMatched": ""}};
  }

  static prepareOutStageOutput = (): object => {
    return {[AggregationStages.Out]: {"db": "output-db", "coll": "output-collection"}};
  }

  static preparePlanCacheStatsStageOutput = (): object => {
    return {[AggregationStages.PlanCacheStats]: {}};
  }

  static prepareRedactStageOutput = (): object => {
    return {[AggregationStages.Redact]: {}};
  }

  static prepareReplaceRootStageOutput = (): object => {
    return {[AggregationStages.ReplaceRoot]: {"newRoot": {}}};
  }

  static prepareReplaceWithStageOutput = (): object => {
    return {[AggregationStages.ReplaceWith]: ""};
  }

  static prepareSampleStageOutput = (): object => {
    return {[AggregationStages.Sample]: { "size": 0 }};
  }

  static prepareSetStageOutput = (): object => {
    return {[AggregationStages.Set]: { "newField": "expression" }};
  }

  static prepareSetWindowFieldsStageOutput = (): object => {
    return {[AggregationStages.SetWindowFields]: {}};
  }

  static prepareShardedDataDistributionStageOutput = (): object => {
    return {[AggregationStages.ShardedDataDistribution]: {}};
  }

  static prepareSkipStageOutput = (): object => {
    return {[AggregationStages.Skip]: 0};
  }

  static prepareSortStageOutput = (): object => {
    return {[AggregationStages.Sort]: {"field1": 1, "field2": 1}};
  }

  static prepareSortByCountStageOutput = (): object => {
    return {[AggregationStages.SortByCount]: "expression"};
  }

  static prepareUnionWithStageOutput = (): object => {
    return {[AggregationStages.UnionWith]: {"coll": "collectionName", "pipeline": []}};
  }

  static prepareUnsetStageOutput = (stageData: { [key: string]: any }): object => {
    if(stageData.fields.length > 0) {
      return {[AggregationStages.Unset]: stageData.fields}
    }
    else {
      return {[AggregationStages.Unset]: "fieldName"}
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

    return {[AggregationStages.Unwind]: unwindObject};
  }
}
