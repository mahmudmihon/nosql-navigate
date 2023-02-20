import { SelectMixedOption } from "naive-ui/es/select/src/interface";

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
}
