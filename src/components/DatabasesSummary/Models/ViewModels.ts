import { DbStats } from "../../../types/DbCollections/db-stats";

export interface ComponentStateModel {
    dbStatsData: DbStats[];
    dataLoading: boolean;
}