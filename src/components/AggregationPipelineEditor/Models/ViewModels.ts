import { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { StageQuery } from "../../../types/AggregationBuilder/stage-query";

export interface LookupModel {
    from: string;
    foreignField: string;
    localField: string;
    as: string;
}

export interface UnwindModel {
    field: string;
    preserveNullAndEmptyArrays: boolean;
    includeArrayIndex;
}

export interface ComponentStateModel {
  pipelineStage: string;
  stageQuery: string;
  dataExporting: boolean;
  showSummarySection: boolean;
  showEditorModal: boolean;
  showLookupSection: boolean;
  showProjectSection: boolean;
  showUnsetSection: boolean;
  showUnwindSection: boolean;
  unsetFields: string[];
  projectedFields: string[];
  stagesQuery: StageQuery[];
  foreignFields: SelectMixedOption[];
  localFields: SelectMixedOption[];
  lookUpModel: LookupModel;
  unwindModel: UnwindModel;
}